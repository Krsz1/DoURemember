import path from "path";
import fs from "fs";
import { db, bucket } from "../utils/firebaseConfig.js";
import { uploadBufferToCloudinary, cloudinaryConfigured } from "../utils/cloudinaryConfig.js";
import { v4 as uuidv4 } from "uuid";

// upload file buffer to Firebase Storage and make it public
async function uploadBufferToBucket(buffer, originalName, mimetype) {
  const ext = path.extname(originalName) || "";
  const filename = `media/${uuidv4()}${ext}`;
  const file = bucket.file(filename);
  await file.save(buffer, {
    metadata: {
      contentType: mimetype,
    },
  });
  // Make public and return public URL
  try {
    await file.makePublic();
  } catch (e) {
    // ignore if not permitted; URL may still be accessible via signed URLs
    console.warn("Could not make file public:", e.message);
  }
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
  return { filename, publicUrl };
}

// Fallback: if Storage upload fails (e.g. bucket missing), write file to local uploads/ and return local url
async function uploadBufferWithFallback(buffer, originalName, mimetype) {
  // Try Cloudinary first (if configured), then Firebase Storage, then local disk
  if (cloudinaryConfigured) {
    try {
      const res = await uploadBufferToCloudinary(buffer, originalName, mimetype);
      return { filename: `cloudinary/${res.providerId}`, publicUrl: res.publicUrl, provider: 'cloudinary' };
    } catch (err) {
      console.warn('Cloudinary upload failed, trying next provider:', err.message || err);
    }
  }

  try {
    const gcsRes = await uploadBufferToBucket(buffer, originalName, mimetype);
    return { filename: gcsRes.filename, publicUrl: gcsRes.publicUrl, provider: 'gcs' };
  } catch (err) {
    console.warn('Storage upload failed, falling back to local disk:', err.message || err);
    // ensure uploads dir exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const ext = path.extname(originalName) || '';
    const basename = `${uuidv4()}${ext}`;
    const localPath = path.join(uploadsDir, basename);
    fs.writeFileSync(localPath, buffer);
    const publicUrl = `/uploads/${basename}`;
    return { filename: `local/${basename}`, publicUrl, provider: 'local' };
  }
}

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // metadata from body
    const { description, patientId, tags } = req.body;

    const parsedTags = tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [];

  // upload to storage (with fallback to local disk)
  const { filename, publicUrl, provider } = await uploadBufferWithFallback(req.file.buffer, req.file.originalname, req.file.mimetype);

    const metadata = {
      id: uuidv4(),
      storagePath: filename,
      storageProvider: provider || null,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: publicUrl,
      description,
      tags: parsedTags,
      patientId,
      uploadedBy: req.user?.id || null,
      createdAt: new Date().toISOString(),
      edits: [],
    };

    // save metadata to Firestore
    await db.collection("media").add(metadata);

    return res.status(201).json({ message: "Upload successful", media: metadata });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error uploading file" });
  }
};

export const listPatientMedia = async (req, res) => {
  try {
    const { patientId } = req.params;
    // This endpoint is public by design for this simple implementation.
    // Optional query parameter `viewerId` can be provided for audit logging (who viewed the media).
    const viewerId = req.query.viewerId || null;
    const snap = await db.collection("media").where("patientId", "==", patientId).get();
    const items = [];
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }));

    // Try to fetch reports from report-service if configured
    let reports = [];
    try {
      const base = (process.env.REPORT_SERVICE_URL || "").replace(/\/$/, "");
      if (base) {
        const url = `${base}/api/reports/patient/${patientId}`;
        // forward authorization header if present
        const headers = {};
        if (req.headers.authorization) headers["authorization"] = req.headers.authorization;
        const fetchFn = globalThis.fetch || fetch;
        const r = await fetchFn(url, { method: "GET", headers });
        if (r.ok) {
          const json = await r.json();
          reports = json.reports || json || [];
        } else {
          console.warn("Report service returned non-OK", r.status);
        }
      }
    } catch (err) {
      console.warn("Could not fetch reports:", err.message || err);
    }

    // Create audit record for this access by calling audit-service if configured.
    try {
      const auditBase = (process.env.AUDIT_SERVICE_URL || "").replace(/\/$/, "");
      const auditPayload = {
        id: uuidv4(),
        userId: viewerId,
        action: "view_patient_media",
        patientId,
        service: "media-service",
        mediaCount: items.length,
        createdAt: new Date().toISOString(),
      };

      if (auditBase) {
        const auditUrl = `${auditBase}/api/audits`;
        const fetchFn = globalThis.fetch || fetch;
        try {
          const r = await fetchFn(auditUrl, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(auditPayload),
          });
          if (!r.ok) {
            console.warn("Audit service responded with non-OK", r.status);
          }
        } catch (err) {
          console.warn("Could not call audit service:", err.message || err);
          // fallback to local Firestore write
          await db.collection("audits").add(auditPayload);
        }
      } else {
        // No audit service configured, write directly to Firestore
        await db.collection("audits").add(auditPayload);
      }
    } catch (e) {
      console.warn("Failed to record audit:", e.message || e);
    }

    return res.json({ media: items, reports });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error listing media" });
  }
};

export const editDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const docRef = db.collection("media").doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return res.status(404).json({ error: "Media not found" });

    const data = snapshot.data();
    const previous = { description: data.description, editedAt: new Date().toISOString(), editedBy: req.user?.id || null };

    await docRef.update({
      description,
      edits: [...(data.edits || []), previous],
    });

    return res.json({ message: "Description updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error updating description" });
  }
};

export const createPracticeSet = async (req, res) => {
  try {
    const { name, gameType, imageIds, patientId } = req.body;

    // validate that imageIds exist for this patient
    const existPromises = imageIds.map((imgId) => db.collection("media").doc(imgId).get());
    const docs = await Promise.all(existPromises);
    const missing = docs.map((d, i) => ({ ok: d.exists, id: imageIds[i] })).filter((x) => !x.ok);
    if (missing.length) return res.status(400).json({ error: "Some images not found", missing });

    const payload = {
      id: uuidv4(),
      name,
      gameType,
      imageIds,
      patientId,
      createdBy: req.user?.id || null,
      createdAt: new Date().toISOString(),
    };

    await db.collection("practiceSets").add(payload);
    return res.status(201).json({ message: "Practice set created", set: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating practice set" });
  }
};

export const listPracticeSets = async (req, res) => {
  try {
    const { patientId } = req.params;
    const snap = await db.collection("practiceSets").where("patientId", "==", patientId).get();
    const out = [];
    snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
    return res.json({ sets: out });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error listing practice sets" });
  }
};

import { db } from "../utils/firebaseConfig.js";
import fs from "fs";
import path from "path";

const LOCAL_AUDITS_FILE = path.join(process.cwd(), "audit_local_store.json");

async function writeLocalAudit(payload) {
  const arr = [];
  try {
    if (fs.existsSync(LOCAL_AUDITS_FILE)) {
      const raw = fs.readFileSync(LOCAL_AUDITS_FILE, "utf8");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) arr.push(...parsed);
        } catch (e) {
          // ignore parse errors and overwrite
        }
      }
    }
  } catch (e) {
    // ignore read errors
  }
  arr.push(payload);
  try {
    fs.writeFileSync(LOCAL_AUDITS_FILE, JSON.stringify(arr, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to write local audit file:", e.message || e);
  }
}

export const createAudit = async (req, res) => {
  try {
    const payload = req.body || {};
    if (db) {
      try {
        await db.collection("audits").add(payload);
        return res.status(201).json({ message: "Audit recorded" });
      } catch (e) {
        console.error("Failed to write audit to Firestore, falling back to local file:", e.message || e);
        // attempt local write and return success if that succeeds
        try {
          await writeLocalAudit(payload);
          return res.status(201).json({ message: "Audit recorded locally (firestore write failed)" });
        } catch (ee) {
          console.error("Local audit write also failed:", ee.message || ee);
          return res.status(500).json({ error: "Error recording audit" });
        }
      }
    }

    // Firestore not available: fallback to local file storage
    try {
      await writeLocalAudit(payload);
      return res.status(201).json({ message: "Audit recorded locally (firestore unavailable)" });
    } catch (e) {
      console.error("Failed to write local audit:", e.message || e);
      return res.status(500).json({ error: "Error recording audit" });
    }
  } catch (err) {
    console.error("Error recording audit:", err);
    try {
      // final fallback: attempt to write locally
      await writeLocalAudit(req.body || {});
      return res.status(201).json({ message: "Audit recorded locally (exception path)" });
    } catch (e) {
      console.error("Secondary local write failed:", e.message || e);
      return res.status(500).json({ error: "Error recording audit" });
    }
  }
};

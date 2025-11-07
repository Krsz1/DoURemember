import express from "express";
import multer from "multer";
import path from "path";
import { uploadPhoto, listPatientMedia, editDescription, createPracticeSet, listPracticeSets } from "../controllers/mediaController.js";
import { uploadSchema, createSetSchema, editDescriptionSchema } from "../schemas/mediaSchemas.js";

const router = express.Router();

// multer setup - store file in memory so we can upload to Firebase Storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const mimetype = allowed.test(file.mimetype);
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && ext) return cb(null, true);
    cb(new Error("Invalid file type. Only JPG and PNG are allowed."));
  }
});

// Simple wrapper to use Joi schemas. We add a tiny inline validator to avoid circular imports.
const joiMiddleware = (schema) => (req, res, next) => {
  const data = { ...req.body };
  // Normalize tags: accept array, JSON string, or comma-separated string
  if (data.tags && typeof data.tags === "string") {
    try {
      const parsed = JSON.parse(data.tags);
      data.tags = parsed;
    } catch (e) {
      // not valid JSON, try comma-separated
      data.tags = data.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }

  const { error } = schema.validate(data);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

// Routes (public for now - no authentication required)
// Upload photo (public for development)
router.post("/upload", upload.single("photo"), joiMiddleware(uploadSchema), uploadPhoto);

// List patient's media (public - no tokens). Optional query param viewerId can be provided for audit logging.
router.get("/patient/:patientId", listPatientMedia);

// Edit description (public for development) - keeps history
router.put("/:id/description", joiMiddleware(editDescriptionSchema), editDescription);

// Create practice set (public for development)
router.post("/sets", joiMiddleware(createSetSchema), createPracticeSet);

// List practice sets
router.get("/sets/:patientId", listPracticeSets);

export default router;

const express = require("express");
const multer = require("multer");
const verifyFirebaseToken = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  getAllPhotos,
  getPhotoById,
  updatePhotoDescription,
  deletePhoto
} = require("../controllers/mediaController");

const router = express.Router();
const upload = multer(); // guarda archivos en memoria (buffer)

// ------ Subir una foto con descripción y fecha de subida --------- POST /api/media/upload-photo
router.post(
  "/upload-photo",
  verifyFirebaseToken,
  upload.single("photo"),
  uploadPhoto
);

// -------- Obtener todas las fotos del usuario ---------- GET /api/media/my-photos
router.get("/my-photos", verifyFirebaseToken, getAllPhotos);

// -------- Obtener una foto por ID -------- GET /api/media/photo/:id
router.get("/photo/:id", verifyFirebaseToken, getPhotoById);

// --------- Modificar la descripción de una foto ----------- PUT /api/media/photo/:id/description
router.put("/photo/:id/description", verifyFirebaseToken, updatePhotoDescription);

// ---------- Eliminar una foto --------- DELETE /api/media/photo/:id
router.delete("/photo/:id", verifyFirebaseToken, deletePhoto);

module.exports = router;

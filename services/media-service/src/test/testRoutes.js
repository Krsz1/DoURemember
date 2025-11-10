const express = require("express");
const multer = require("multer");
const testMiddleware = require("./testMiddleware");
const {
  uploadPhoto,
  getUserPhotos,
  getPhotoById,
  updatePhotoDescription,
  deletePhoto
} = require("./testController");

const router = express.Router();
const upload = multer(); // almacenar en memoria (buffer)

// Endpoints de prueba
router.post("/upload", testMiddleware, upload.single("photo"), uploadPhoto);
router.get("/", testMiddleware, getUserPhotos);
router.get("/:id", testMiddleware, getPhotoById);
router.put("/:id", testMiddleware, updatePhotoDescription);
router.delete("/:id", testMiddleware, deletePhoto);

module.exports = router;

// src/test/testController.js
const Media = require("../models/media");

// Subir foto con descripción
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se recibió archivo" });

    const newPhoto = new Media({
    userId: req.user.uid,
    filename: req.file.originalname,
    description: req.body.description || "", // ← ahora funciona
    uploadDate: new Date(),
    data: req.file.buffer,
    contentType: req.file.mimetype,
    });


    await newPhoto.save();
    res.status(201).json({ message: "📸 Foto subida con éxito", photoId: newPhoto._id });
  } catch (error) {
    console.error("❌ Error subiendo foto:", error);
    res.status(500).json({ error: "Error interno al subir la foto" });
  }
};

// Listar fotos del usuario (sin datos binarios)
exports.getUserPhotos = async (req, res) => {
  try {
    const photos = await Media.find({ userId: req.user.uid }).select("-data");
    res.json({ photos });
  } catch (error) {
    console.error("❌ Error obteniendo fotos:", error);
    res.status(500).json({ error: "Error interno al obtener fotos" });
  }
};

// Ver foto por ID
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Media.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Foto no encontrada" });

    res.set("Content-Type", photo.contentType);
    res.send(photo.data);
  } catch (error) {
    console.error("❌ Error obteniendo foto:", error);
    res.status(500).json({ error: "Error interno al obtener la foto" });
  }
};

// Actualizar descripción
exports.updatePhotoDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const photo = await Media.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { description },
      { new: true }
    );
    if (!photo) return res.status(404).json({ error: "Foto no encontrada o no autorizada" });

    res.json({ message: "Descripción actualizada", photo });
  } catch (error) {
    console.error("❌ Error actualizando descripción:", error);
    res.status(500).json({ error: "Error interno al actualizar descripción" });
  }
};

// Eliminar foto
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Media.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!photo) return res.status(404).json({ error: "Foto no encontrada o no autorizada" });

    res.json({ message: "Foto eliminada" });
  } catch (error) {
    console.error("❌ Error eliminando foto:", error);
    res.status(500).json({ error: "Error interno al eliminar foto" });
  }
};

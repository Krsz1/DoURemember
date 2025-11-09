const express = require("express");
const router = express.Router();
const Reporte = require("../models/report");
const admin = require("firebase-admin");

// -------- Inicializar Firebase Admin ----------------
admin.initializeApp({
  credential: admin.credential.cert(require("../../../../firebase.json"))
});

// ------------------ POST /reports/upload(crear un reporte con pdf) -------------------------
router.post("/upload", async (req, res) => {
  try {
    const { nombre, descripcion, usuarioId, pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ message: "No se envió PDF en Base64" });
    }

    // Validar que el usuario exista en Firebase
    const userRecord = await admin.auth().getUser(usuarioId).catch(() => null);
    if (!userRecord) {
      return res.status(404).json({ message: "Usuario no encontrado en Firebase" });
    }

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    const reporte = new Reporte({
      nombre,
      descripcion,
      usuarioId,
      pdf: pdfBuffer
    });

    await reporte.save();
    res.status(201).json({ message: "Reporte guardado en Mongo", id: reporte._id });
  } catch (error) {
    console.error("ERROR POST /upload:", error);
    res.status(500).json({ message: "Error al guardar el reporte", error: error.message });
  }
});
// ---------------------------------------------------------------------------------------------

// --------------- GET /reports/:id (obtener un reporte con su id) -----------------------------

router.get("/:id", async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) return res.status(404).json({ message: "Reporte no encontrado" });

    res.json(reporte);
  } catch (error) {
    console.error("ERROR GET /:id:", error);
    res.status(500).json({ message: "Error al obtener el reporte", error: error.message });
  }
});
// -----------------------------------------------------------------------------------------------

// ------- GET /reports/user/:uid (obtener todos los reportes de un usuario con su id) -----------
router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const userRecord = await admin.auth().getUser(uid).catch(() => null);
    if (!userRecord) return res.status(404).json({ message: "Usuario no encontrado en Firebase" });

    const reportes = await Reporte.find({ usuarioId: uid }).select("-pdf"); // Solo metadatos
    if (!reportes.length) return res.status(404).json({ message: "No se encontraron reportes" });

    res.json({
      usuario: {
        uid: userRecord.uid,
        email: userRecord.email,
        nombre: userRecord.displayName || null
      },
      reportes
    });
  } catch (error) {
    console.error("ERROR GET /user/:uid:", error);
    res.status(500).json({ message: "Error al obtener los reportes", error: error.message });
  }
});
// ---------------------------------------------------------------------------------------------

// ---------------- PUT /reports/:id (modificar reporte existente, con su id) ------------------
router.put("/:id", async (req, res) => {
  try {
    const { nombre, descripcion, usuarioId, pdfBase64 } = req.body;

    const updateData = { nombre, descripcion, usuarioId };

    if (pdfBase64) {
      updateData.pdf = Buffer.from(pdfBase64, "base64");
    }

    const reporte = await Reporte.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!reporte) return res.status(404).json({ message: "Reporte no encontrado" });

    res.json({ message: "Reporte actualizado", reporte });
  } catch (error) {
    console.error("ERROR PUT /:id:", error);
    res.status(500).json({ message: "Error al actualizar el reporte", error: error.message });
  }
});
// ----------------------------------------------------------------------------------------------

// --------------------- DELETE /reports/:id (eliminar reporte con su id) -----------------------
router.delete("/:id", async (req, res) => {
  try {
    const reporte = await Reporte.findByIdAndDelete(req.params.id);
    if (!reporte) return res.status(404).json({ message: "Reporte no encontrado" });

    res.json({ message: "Reporte eliminado correctamente" });
  } catch (error) {
    console.error("ERROR DELETE /:id:", error);
    res.status(500).json({ message: "Error al eliminar el reporte", error: error.message });
  }
});
// -----------------------------------------------------------------------------------------------

// --------- GET /reports/:id/pdf (obtener PDF de un reporte, con id del reporte) ----------------
router.get("/:id/pdf", async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) return res.status(404).json({ message: "Reporte no encontrado" });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${reporte.nombre}.pdf"`
    });
    res.send(reporte.pdf);
  } catch (error) {
    console.error("ERROR GET /:id/pdf:", error);
    res.status(500).json({ message: "Error al obtener el PDF", error: error.message });
  }
});

module.exports = router;

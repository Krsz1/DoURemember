const mongoose = require("mongoose");

const reporteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  usuarioId: { type: String },
  pdf: { type: Buffer, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reporte", reporteSchema);

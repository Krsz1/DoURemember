const PDFDocument = require('pdfkit');
const { GridFSBucket, ObjectId } = require('mongodb');
const Report = require('../models/report');
const { mongoose } = require('../utils/db');

// ----------------- POST /reports/create (crear un reporte y generar PDF en GridFS) -----------------
exports.createReport = async (req, res) => {
  try {
    const { patientId, type = 'detailed', metrics = {}, period } = req.body;

    // Crear documento del reporte en MongoDB
    const report = await Report.create({ patientId, type, metrics, period });

    // Crear PDF en memoria con PDFKit
    const pdfDoc = new PDFDocument();
    const chunks = [];
    pdfDoc.on('data', chunk => chunks.push(chunk)); // Almacenar los "chunks" mientras se genera el PDF

    // Cuando se termina de generar el PDF
    pdfDoc.on('end', async () => {
      const pdfBuffer = Buffer.concat(chunks); // Unir los chunks en un solo buffer

      // Crear un GridFSBucket para almacenar el PDF en MongoDB
      const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'pdfs' });

      // Abrir stream de subida para el PDF
      const uploadStream = bucket.openUploadStream(`${report._id}.pdf`, {
        contentType: 'application/pdf',
      });

      uploadStream.end(pdfBuffer); // Escribir el PDF en el stream

      // Cuando termina la subida al GridFS
      uploadStream.on('finish', async (file) => {
        report.pdfId = file._id; // Guardar el id del archivo en el reporte
        report.status = 'ready'; // Marcar reporte como listo
        await report.save(); // Guardar cambios en MongoDB
        res.json({ id: report._id, status: report.status, pdfId: file._id });
      });
    });

    // ----------------- Contenido del PDF -----------------
    pdfDoc.fontSize(18).text('Reporte Cognitivo - DoYouRemember', { align: 'center' });
    pdfDoc.text(`Paciente: ${patientId}`);
    pdfDoc.text(`Tipo: ${type}`);
    pdfDoc.text(`Periodo: ${period?.from || '-'} a ${period?.to || '-'}`);
    pdfDoc.moveDown();
    Object.entries(metrics).forEach(([k, v]) => pdfDoc.text(`${k}: ${v}`));
    pdfDoc.end(); // Finalizar PDF

  } catch (err) {
    console.error("ERROR POST /reports/create:", err);
    res.status(500).json({ error: err.message });
  }
};
// --------------------------------------------------------------------------------------------------

// ----------------- GET /reports/:id (obtener un reporte con su id) -----------------
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id); // Buscar reporte por ID
    if (!report) return res.status(404).json({ error: 'No encontrado' });

    res.json(report); // Devolver datos del reporte (metadatos y pdfId)
  } catch (err) {
    console.error("ERROR GET /reports/:id:", err);
    res.status(500).json({ error: err.message });
  }
};
// --------------------------------------------------------------------------------------------------

// ----------------- GET /reports/:id/download (descargar PDF de un reporte) -----------------
exports.downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id); // Buscar reporte por ID
    if (!report || !report.pdfId) return res.status(404).json({ error: 'No encontrado' });

    // Crear GridFSBucket para leer el PDF
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'pdfs' });

    // Configurar cabeceras para que el navegador interprete el archivo como PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="reporte-${report._id}.pdf"`);

    // Abrir stream de descarga desde GridFS y enviarlo al cliente
    bucket.openDownloadStream(new ObjectId(report.pdfId)).pipe(res);

  } catch (err) {
    console.error("ERROR GET /reports/:id/download:", err);
    res.status(500).json({ error: err.message });
  }
};
// --------------------------------------------------------------------------------------------------

import PDFDocument from "pdfkit";

export function generatePDF({ patientId, type, metrics, period }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(18).text("Reporte Cognitivo - DoYouRemember", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Paciente: ${patientId}`);
    doc.text(`Tipo: ${type}`);
    doc.text(`Periodo: ${period?.from || "-"} a ${period?.to || "-"}`);
    doc.moveDown();

    doc.text("Métricas:");
    Object.entries(metrics || {}).forEach(([k, v]) => doc.text(`- ${k}: ${v}`));

    doc.end();
  });
}

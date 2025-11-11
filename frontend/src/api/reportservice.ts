// src/api/reportservice.ts
import { createAxiosInstance } from "./axios";

const reportApi = createAxiosInstance(import.meta.env.VITE_REPORT_API_URL);

// Tipos de datos
export interface ReportData {
  nombre: string;
  descripcion: string;
  usuarioId: string;
  pdfBase64?: string;
}

// ✅ Crear un reporte con PDF en Base64
export const uploadReport = async (data: ReportData) => {
  const res = await reportApi.post("/reports/upload", data);
  return res.data;
};

// ✅ Obtener reporte por ID
export const getReportById = async (id: string) => {
  const res = await reportApi.get(`/reports/getReport/${id}`);
  return res.data;
};

// ✅ Obtener todos los reportes de un usuario
export const getReportsByUser = async (uid: string) => {
  const res = await reportApi.get(`/reports/getUserReports/${uid}`);
  return res.data;
};

// ✅ Actualizar un reporte existente
export const updateReport = async (id: string, data: ReportData) => {
  const res = await reportApi.put(`/reports/modifyReport/${id}`, data);
  return res.data;
};

// ✅ Eliminar un reporte
export const deleteReport = async (id: string) => {
  const res = await reportApi.delete(`/reports/deleteReport/${id}`);
  return res.data;
};

// ✅ Descargar PDF del reporte
export const downloadReportPdf = async (id: string) => {
  const res = await reportApi.get(`/reports/getReport/${id}/pdf`, {
    responseType: "blob", // 👈 Importante para descargar archivos
  });
  return res.data;
};

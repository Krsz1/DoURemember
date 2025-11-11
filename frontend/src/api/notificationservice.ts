// src/api/notificationservice.ts
import { createAxiosInstance } from "./axios";

const notificationApi = createAxiosInstance(import.meta.env.VITE_NOTIFICATION_API_URL);

// Datos para crear una notificación
export interface NotificationData {
  uidPaciente: string;
  frecuencia?: string; // "diario", "semanal", "mensual"
}

// Crear una notificación real en el backend
export const createNotification = async (data: NotificationData) => {
  const res = await notificationApi.post("/api/notifications/create", data);
  return res.data;
};

// Enviar una notificación de prueba (para verificar el correo)
export const sendTestNotification = async (uidPaciente: string) => {
  const res = await notificationApi.post("/api/notifications/send-test", { uidPaciente });
  return res.data;
};

// Guardar horarios personalizados para recordatorios
export interface ScheduleData {
  uidPaciente: string;
  dias: string[];     // ["Lunes", "Miércoles", "Viernes"]
  horarios: string[]; // ["09:00", "18:00"]
}

export const saveSchedule = async (data: ScheduleData) => {
  const res = await notificationApi.post("/api/notifications/schedule", data);
  return res.data;
};

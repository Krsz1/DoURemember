import cron from "node-cron";
import { sendNotification } from "./notificationService.js";
import { db } from "../utils/firebaseConfig.js";

// Ejecuta notificaciones automáticamente según configuración
export const startScheduler = async () => {
  console.log("🕒 Planificador de notificaciones activo...");

  // Ejecutar cada minuto (solo ejemplo)
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const horaActual = now.toTimeString().slice(0, 5); // "HH:MM"
    const diaActual = now.toLocaleString("es-ES", { weekday: "long" });

    const schedulesSnap = await db.collection("horarios").get();
    schedulesSnap.forEach(async (doc) => {
      const data = doc.data();
      if (data.dias.includes(diaActual) && data.horarios.includes(horaActual)) {
        await sendNotification(
          data.uidPaciente,
          "¡Hora de ejercitar tu memoria con tus fotos favoritas!"
        );
      }
    });
  });
};

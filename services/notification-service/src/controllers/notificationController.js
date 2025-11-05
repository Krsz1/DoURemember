import { db } from "../utils/firebaseConfig.js";
import { sendNotification } from "../services/notificationService.js";

/**
 * 📩 Crear una notificación personalizada o programada
 * HU 6.1 y 6.2 — Permite definir frecuencia y mensaje base
 */
export const createNotification = async (req, res) => {
  try {
    const { uidPaciente, mensaje, frecuencia } = req.body;

    if (!uidPaciente || !mensaje || !frecuencia) {
      return res.status(400).json({
        error: "Debe proporcionar uidPaciente, mensaje y frecuencia.",
      });
    }

    await db.collection("notificaciones").add({
      uidPaciente,
      mensaje,
      frecuencia, // diario | semanal | mensual
      activo: true,
      creadoEn: new Date(),
    });

    return res
      .status(201)
      .json({ message: "✅ Notificación creada con éxito." });
  } catch (error) {
    console.error("❌ Error al crear notificación:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🧠 Enviar un recordatorio inmediato al paciente
 * HU 6.1 — Recordatorios automáticos con mensaje motivador
 */
export const testSendNotification = async (req, res) => {
  try {
    const { uidPaciente, mensaje } = req.body;

    if (!uidPaciente) {
      return res.status(400).json({ error: "El UID del paciente es obligatorio." });
    }

    // Si no se envía mensaje, usar uno motivador por defecto
    const mensajeFinal =
      mensaje ||
      "🧠 ¡Hora de ejercitar tu memoria con tus fotos favoritas! 💫";

    const ok = await sendNotification(uidPaciente, mensajeFinal);

    if (ok) {
      // Guardamos el registro del envío
      await db.collection("historial_notificaciones").add({
        uidPaciente,
        mensaje: mensajeFinal,
        enviadoEn: new Date(),
      });

      return res.json({ success: true, message: "✅ Recordatorio enviado correctamente." });
    } else {
      return res
        .status(500)
        .json({ success: false, error: "No se pudo enviar el recordatorio." });
    }
  } catch (error) {
    console.error("❌ Error enviando notificación:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ⏰ Guardar la configuración de horarios de recordatorios
 * HU 6.2 — Configuración de horarios personalizados por el cuidador
 */
export const saveSchedule = async (req, res) => {
  try {
    const { uidCuidador, uidPaciente, dias, horarios } = req.body;

    if (!uidCuidador || !uidPaciente || !dias || !horarios) {
      return res.status(400).json({
        error: "Debe enviar uidCuidador, uidPaciente, días y horarios.",
      });
    }

    await db.collection("horarios").add({
      uidCuidador,
      uidPaciente,
      dias, // Array de días (ej. ["Lunes", "Miércoles"])
      horarios, // Array de horas (ej. ["08:00", "15:00"])
      creadoEn: new Date(),
    });

    res.status(201).json({ message: "✅ Configuración de horario guardada correctamente." });
  } catch (error) {
    console.error("❌ Error guardando horario:", error.message);
    res.status(500).json({ error: error.message });
  }
};

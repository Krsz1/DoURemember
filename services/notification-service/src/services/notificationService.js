const nodemailer = require("nodemailer");
const { db } = require("../utils/firebaseConfig");

/**
 * Envía un recordatorio por correo al paciente, y registra el envío en Firestore.
 * @param {string} uidPaciente - UID del paciente en Firebase.
 * @param {string} frecuencia - "diario", "semanal" o "mensual"
 */
const sendNotification = async (uidPaciente, frecuencia = "diario") => {
  try {
    // Obtener datos del paciente desde Firestore
    const userSnap = await db.collection("usuarios").doc(uidPaciente).get();
    if (!userSnap.exists) throw new Error("Paciente no encontrado");

    const userData = userSnap.data();
    if (!userData.correo) throw new Error("El paciente no tiene correo registrado");

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🧠 Mensaje motivador en HTML
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 16px;">
        <h2 style="color: #3b82f6;">🧠 ¡Hora de ejercitar tu memoria!</h2>
        <p>Hola ${userData.nombre || "amigo/a"},</p>
        <p>Este es tu recordatorio ${frecuencia} para realizar tus evaluaciones cognitivas.</p>
        <p>Recuerda que mantener la constancia ayuda a mejorar tu seguimiento y bienestar.</p>
        <p>
          <a href="https://doyouremember.app/evaluacion" 
             style="display: inline-block; padding: 10px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
            Ir a mi evaluación
          </a>
        </p>
        <hr/>
        <p style="font-size: 0.9em; color: gray;">
          Si no deseas recibir estos recordatorios temporalmente, puedes desactivarlos desde tu perfil en la aplicación.
        </p>
      </div>
    `;

    // Configurar correo
    const mailOptions = {
      from: `"DoYouRemember" <${process.env.EMAIL_USER}>`,
      to: userData.correo,
      subject: "🧩 Recordatorio: ¡Hora de ejercitar tu memoria!",
      html: htmlMessage,
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    // Registrar envío en Firestore
    await db.collection("notificaciones").add({
      uidPaciente,
      correo: userData.correo,
      frecuencia,
      mensaje: "Recordatorio de evaluación cognitiva enviado correctamente",
      enviadoEn: new Date(),
    });

    console.log(`✅ Recordatorio ${frecuencia} enviado a ${userData.correo}`);
    return true;
  } catch (error) {
    console.error("❌ Error enviando notificación:", error.message);
    return false;
  }
};

module.exports = { sendNotification };

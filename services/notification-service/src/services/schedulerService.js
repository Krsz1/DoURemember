const cron = require("node-cron");
const { db } = require("../utils/firebaseConfig");
const { sendNotification } = require("./notificationService");

const diasSemana = {
  "Domingo": 0,
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  "Sábado": 6,
};

const startScheduler = async () => {
  console.log("⏰ Cargando horarios desde Firestore...");

  // ♻️ Limpia tareas previas
  cron.getTasks().forEach(task => task.stop());
  console.log("♻️ Reiniciando tareas programadas...");

  const snapshot = await db.collection("horarios").get();

  snapshot.forEach((doc) => {
    const data = doc.data();
    const { uidPaciente, dias, horarios } = data;

    dias.forEach((dia) => {
      horarios.forEach((hora) => {
        const [hh, mm] = hora.split(":");
        const diaCron = diasSemana[dia];

        if (diaCron !== undefined) {
          cron.schedule(`${mm} ${hh} * * ${diaCron}`, async () => {
            const mensaje = `🧠 Recordatorio programado (${dia} ${hora})`;
            console.log(`📩 Enviando notificación a ${uidPaciente}: ${mensaje}`);
            await sendNotification(uidPaciente, mensaje);
          });
          console.log(`✅ Recordatorio programado para ${dia} a las ${hora}`);
        }
      });
    });
  });
};

module.exports = { startScheduler };

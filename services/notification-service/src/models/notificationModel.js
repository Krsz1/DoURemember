const notificationSchema = {
  uidPaciente: "",
  tipo: "recordatorio",
  mensaje: "",
  frecuencia: "diario", // diario, semanal, mensual
  activo: true,
  fechaProgramada: null,
  creadoEn: new Date(),
};

module.exports = { notificationSchema };

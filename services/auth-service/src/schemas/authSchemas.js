const Joi = require("joi");

const registerSchema = Joi.object({
  rol: Joi.string().valid("paciente", "cuidador", "medico").required(),
  nombre: Joi.string().required(),
  documento: Joi.string().required(),
  correo: Joi.string().email().required(),
  telefono: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .pattern(/[^a-zA-Z0-9]/)
    .required(),
  medicoTratante: Joi.string().allow(null, ""),
  nombrePaciente: Joi.string().allow(null, ""),
  documentoPaciente: Joi.string().allow(null, ""),
});

const loginSchema = Joi.object({
  correo: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };

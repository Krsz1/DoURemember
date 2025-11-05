import Joi from "joi";

export const registerSchema = Joi.object({
  nombre: Joi.string().required(),
  documento: Joi.string().required(),
  correo: Joi.string().email().required(),
  telefono: Joi.string().required(),
  rol: Joi.string().valid("paciente", "cuidador", "medico").required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .pattern(/[^a-zA-Z0-9]/)
    .required(),
  medicoTratante: Joi.string().allow(null, ""),
  nombreCuidador: Joi.string().allow(null, ""),
  documentoCuidador: Joi.string().allow(null, ""),
});

export const loginSchema = Joi.object({
  correo: Joi.string().email().required(),
  password: Joi.string().required(),
});

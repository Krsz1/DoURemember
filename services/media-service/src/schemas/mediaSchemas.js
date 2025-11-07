import Joi from "joi";

export const uploadSchema = Joi.object({
  description: Joi.string().min(20).required(),
  patientId: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).max(10).optional(),
});

export const createSetSchema = Joi.object({
  name: Joi.string().min(3).required(),
  gameType: Joi.string().valid("Recuerda Quién", "Conecta y Recuerda", "Memoria Visual").required(),
  imageIds: Joi.array().items(Joi.string()).min(1).required(),
  patientId: Joi.string().required(),
});

export const editDescriptionSchema = Joi.object({
  description: Joi.string().min(20).required(),
});

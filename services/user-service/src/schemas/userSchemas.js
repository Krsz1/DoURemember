import Joi from "joi";

export const createUserSchema = Joi.object({
  uid: Joi.string().required(),
  name: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("admin", "auditor", "standard_user").optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("admin", "auditor", "standard_user").optional(),
});

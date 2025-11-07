import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  deleteUser,
} from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const router = express.Router();

// Rutas simples para Postman (sin tokens)
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.put("/password", changePassword);
router.delete("/delete", deleteUser);

export default router;

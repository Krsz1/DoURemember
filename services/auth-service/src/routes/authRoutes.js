const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
  deleteUser,
  logoutUser,
  getUserById
} = require("../controllers/authController");

const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../schemas/authSchemas");

// Middleware para verificar tokens Firebase
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Rutas públicas (no requieren token)
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

// Rutas protegidas (requieren token)
router.put("/password", verifyToken, changePassword);
router.delete("/delete", verifyToken, deleteUser);
router.post("/logout", verifyToken, logoutUser);

// Obtener datos de usuario por correo
router.get("/profile/:uid", verifyToken,getUserById);

module.exports = router;

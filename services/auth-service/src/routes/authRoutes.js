const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
  deleteUser,
} = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../schemas/authSchemas");

const router = express.Router();

// Rutas simples para Postman (sin tokens)
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.put("/password", changePassword);
router.delete("/delete", deleteUser);

module.exports = router;

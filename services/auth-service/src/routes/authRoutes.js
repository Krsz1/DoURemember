const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
  deleteUser,
  logoutUser, // <-- agregado
} = require("../controllers/authController");

const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../schemas/authSchemas");

const router = express.Router();

// Rutas existentes
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.put("/password", changePassword);
router.delete("/delete", deleteUser);

// Nueva ruta de logout
router.post("/logout", logoutUser);

module.exports = router;

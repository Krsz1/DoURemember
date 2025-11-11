const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const authRoutes = require("./routes/authRoutes");

const app = express();

// Configuración CORS correcta para frontend con credenciales
app.use(cors({
  origin: "http://localhost:5173",  // URL de tu frontend
  credentials: true,               // Permite enviar cookies o auth headers
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Auth-service running on port ${PORT}`));

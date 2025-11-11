const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const cors = require("cors"); // <- Importar CORS
const { connectMongo } = require("./utils/db");
const reportRoutes = require("./routes/report-routes");

const app = express();

// Conectar a MongoDB
connectMongo();

// Middlewares
app.use(express.json({ limit: "50mb" }));

// Configurar CORS
app.use(cors({
  origin: "http://localhost:5173", // URL de tu frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Permite enviar cookies o headers de autenticación
}));

// Rutas
app.use("/api/reports", reportRoutes);

const PORT = process.env.REPORT_SERVICE_PORT || 4003;
app.listen(PORT, () => console.log(`🚀 Report-Service corriendo en puerto ${PORT}`));

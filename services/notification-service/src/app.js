const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const notificationRoutes = require("./routes/notificationRoutes");
const { startScheduler } = require("./services/schedulerService");

const app = express();

// Middlewares
app.use(express.json());

// Configurar CORS para frontend moderno
app.use(cors({
  origin: "http://localhost:5173", // URL de tu frontend
  credentials: true,               // Permite enviar cookies / headers de autenticación
}));

// Rutas
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`🚀 Notification Service corriendo en el puerto ${PORT}`);
  startScheduler();
});

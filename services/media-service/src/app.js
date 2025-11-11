const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { connectMongo } = require("./utils/mongo");
const mediaRoutes = require("./routes/mediaRoutes");
const testRoutes = require("./test/testRoutes");

const app = express();

// Conectar a MongoDB
connectMongo();

// Middlewares
app.use(express.json({ limit: "50mb" }));

// Configurar CORS para frontend moderno
app.use(cors({
  origin: "http://localhost:5173", // URL del frontend
  credentials: true,               // Permite enviar cookies / headers de autenticación
}));

// Rutas
app.use("/api/media", mediaRoutes);
app.use("/api/media/test", testRoutes);

const PORT = process.env.MEDIA_SERVICE_PORT || 4001;
app.listen(PORT, () => console.log(`🚀 Media-Service escuchando en puerto ${PORT}`));

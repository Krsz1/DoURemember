const express = require("express");
const cors = require("cors"); // <- Importar CORS
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

// Configurar CORS
app.use(cors({
  origin: "http://127.0.0.1:5500", // <- el origen desde donde servirás el HTML
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "x-test-uid"]
}));

// Rutas
app.use("/api/media", mediaRoutes);
app.use("/api/test", testRoutes);

const PORT = process.env.MEDIA_SERVICE_PORT || 4001;
app.listen(PORT, () => console.log(`🚀 Media-Service escuchando en puerto ${PORT}`));

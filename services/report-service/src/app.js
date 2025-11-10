const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const { connectMongo } = require("./utils/bd");
const reportRoutes = require("./routes/report-routes");

const app = express();

// Conectar a MongoDB
connectMongo();

// Para JSON grandes (por ejemplo Base64)
app.use(express.json({ limit: "50mb" }));

// Rutas
app.use("/reports", reportRoutes);

const PORT = process.env.REPORT_SERVICE_PORT || 4004;
app.listen(PORT, () => console.log(`🚀 Report-Service corriendo en puerto ${PORT}`));

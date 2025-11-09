require('dotenv').config({ path: '../.env' });
const express = require("express");
const mongoose = require("mongoose");
const reportRoutes = require("./routes/report-routes");
require("dotenv").config();

const app = express();

// Para JSON grandes (si usaras Base64)
app.use(express.json({ limit: "50mb" }));

// Rutas
app.use("/reports", reportRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error conectando a MongoDB:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Report service corriendo en puerto ${PORT}`));

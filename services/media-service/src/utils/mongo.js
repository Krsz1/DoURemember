const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("La variable MONGO_URI no está definida en .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB (Media-Service)");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = { connectMongo };

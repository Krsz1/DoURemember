const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("Falta la variable GOOGLE_APPLICATION_CREDENTIALS en el .env");
}

const serviceAccountPath = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`No se encontró el archivo de credenciales en: ${serviceAccountPath}`);
}

if (!admin.apps.length) {
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("Firebase Admin inicializado correctamente");
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

module.exports = { admin, adminAuth, adminDb };

const admin = require("firebase-admin");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Cargar variables de entorno desde el .env ubicado en services/
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Construir la ruta absoluta al firebase.json usando la ruta relativa del .env
// Nota: tu .env tiene GOOGLE_APPLICATION_CREDENTIALS=../firebase.json
const serviceAccountPath = path.resolve(__dirname, "../../../", process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Verificar que el archivo exista antes de leerlo
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`No se encontró el archivo de credenciales en: ${serviceAccountPath}`);
}

// Cargar las credenciales
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Inicializar Firebase Admin solo si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { db };

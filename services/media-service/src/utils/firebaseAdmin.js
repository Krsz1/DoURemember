const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');

// ----------------- Cargar archivo .env -----------------
const envPath = path.resolve(__dirname, '../../../.env'); 
console.log('🧭 Cargando .env desde:', envPath);
dotenv.config({ path: envPath }); // Cargar variables de entorno

// ----------------- Inicializar Firebase Admin -----------------
if (!admin.apps.length) { // Evitar reinicialización si ya existe una app
  console.log('📦 Bucket leído del .env:', process.env.FIREBASE_STORAGE_BUCKET);

  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Credenciales por defecto de Firebase
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'doyouremember-bb895.appspot.com', // Configurar bucket de Storage
  });
}

// ----------------- Inicializar Firestore y Storage -----------------
const db = admin.firestore();
const bucket = admin.storage().bucket();

// ----------------- Exportar instancias para usar en otros módulos -----------------
module.exports = { admin, db, bucket };

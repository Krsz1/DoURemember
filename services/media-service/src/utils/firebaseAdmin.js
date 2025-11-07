const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../../.env');
console.log('🧭 Cargando .env desde:', envPath);
dotenv.config({ path: envPath });

if (!admin.apps.length) {
  console.log('📦 Bucket leído del .env:', process.env.FIREBASE_STORAGE_BUCKET);

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'doyouremember-bb895.appspot.com',
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };

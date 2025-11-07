import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Try to load service account from config file located at ../config/serviceAccountKey.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, "../config/serviceAccountKey.json");

let serviceAccount = null;
if (fs.existsSync(serviceAccountPath)) {
  const raw = fs.readFileSync(serviceAccountPath, "utf8");
  serviceAccount = JSON.parse(raw);
}

if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.warn("Could not parse FIREBASE_SERVICE_ACCOUNT env var");
  }
}

if (!serviceAccount) {
  console.warn("Firebase service account not found for audit-service. Firestore will be unavailable.");
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
  });
}

export const db = admin.firestore ? admin.firestore() : null;
export const adminSdk = admin;

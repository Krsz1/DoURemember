import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Initialize firebase-admin using the service account JSON bundled in the service
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, "../config/serviceAccountKey.json");

const serviceAccountRaw = fs.readFileSync(serviceAccountPath, "utf8");
const serviceAccount = JSON.parse(serviceAccountRaw);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "doyouremember-bb895.appspot.com",
});

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
export const adminSdk = admin;

// Note: use `bucket` to upload files to Firebase Storage and `db` for Firestore metadata.

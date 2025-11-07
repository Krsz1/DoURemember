import admin from "firebase-admin";
import fs from "fs";

let adminSdk = undefined;
let db = undefined;
let enabled = false;

try {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (keyPath && fs.existsSync(keyPath)) {
    // read and parse service account json from path provided by env (do NOT commit this file)
    const raw = fs.readFileSync(keyPath, "utf8");
    const serviceAccount = JSON.parse(raw);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    adminSdk = admin;
    db = admin.firestore();
    enabled = true;
  } else if (process.env.FIREBASE_EMULATOR_HOST) {
    // Using emulator: initialize default app
    admin.initializeApp();
    adminSdk = admin;
    db = admin.firestore();
    enabled = true;
  } else {
    console.warn("Firebase not initialized. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_PATH to enable Firestore.");
  }
} catch (err) {
  console.error("Failed to initialize firebase-admin:", err && err.message ? err.message : err);
}

export { adminSdk, db, enabled };

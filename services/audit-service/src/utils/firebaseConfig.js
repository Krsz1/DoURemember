import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Try to load service account from config file located at ../config/serviceAccountKey.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, "../config/serviceAccountKey.json");

let serviceAccount = null;

// 1) Try default config file in src/config
try {
  if (fs.existsSync(serviceAccountPath)) {
    const raw = fs.readFileSync(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(raw);
  }
} catch (e) {
  console.warn("Could not read default service account file:", e.message || e);
}

// 2) If env var provided, support either a JSON string or a path to a file (relative to project)
const envVal = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccount && envVal) {
  // If envVal looks like a path (endsWith .json or contains a slash/backslash), try to resolve file
  const looksLikePath = /\\|\/|\.json$/.test(envVal);
  if (looksLikePath) {
    // try absolute first, then relative to project root
    try {
      const tryPath = path.isAbsolute(envVal) ? envVal : path.join(process.cwd(), envVal);
      if (fs.existsSync(tryPath)) {
        const raw = fs.readFileSync(tryPath, "utf8");
        serviceAccount = JSON.parse(raw);
      } else {
        // try relative to this module
        const alt = path.join(__dirname, "..", envVal);
        if (fs.existsSync(alt)) {
          const raw = fs.readFileSync(alt, "utf8");
          serviceAccount = JSON.parse(raw);
        }
      }
    } catch (e) {
      console.warn("Could not load service account from path provided in FIREBASE_SERVICE_ACCOUNT:", e.message || e);
    }
  }

  // If still not set, try parse as JSON string
  if (!serviceAccount) {
    try {
      serviceAccount = JSON.parse(envVal);
    } catch (e) {
      console.warn("Could not parse FIREBASE_SERVICE_ACCOUNT env var as JSON nor load as file");
    }
  }
}

if (!serviceAccount) {
  console.warn("Firebase service account not found for audit-service. Firestore will be unavailable.");
}

// Initialize Firebase only if we have a valid service account
let firebaseInitialized = false;
if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
    });
    firebaseInitialized = true;
    console.log("Firebase admin initialized for audit-service");
  } catch (e) {
    console.error("Failed to initialize Firebase admin:", e.message || e);
  }
}

// Only initialize db if an app was successfully initialized
export const db = firebaseInitialized && admin.apps && admin.apps.length ? admin.firestore() : null;
export const adminSdk = admin;
export const firebaseInitializedFlag = firebaseInitialized;

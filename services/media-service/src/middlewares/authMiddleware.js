import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { adminSdk, db } from "../utils/firebaseConfig.js";

dotenv.config();

// Flexible authenticate middleware:
// - Try JWT HMAC (shared secret)
// - Then try Firebase ID token (admin.auth().verifyIdToken)
// - If MEDIA_ALLOW_NO_AUTH=true, allow with a dev user
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    console.log('MEDIA_ALLOW_NO_AUTH=', process.env.MEDIA_ALLOW_NO_AUTH);
    if (process.env.MEDIA_ALLOW_NO_AUTH === "true") {
      req.user = { id: "dev", role: "caregiver" };
      return next();
    }
    return res.status(401).json({ error: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Token error" });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: "Malformed token" });

  // 1) Try JWT HMAC
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = decoded; // expected: { id, role }
    return next();
  } catch (err) {
    // continue to try Firebase verify
  }

  // 2) Try Firebase ID token
  try {
    const decodedToken = await adminSdk.auth().verifyIdToken(token);
    // decodedToken contains uid; role is stored in Firestore (collection 'usuarios')
    const uid = decodedToken.uid;
    let role = null;
    try {
      const userDoc = await db.collection("usuarios").doc(uid).get();
      if (userDoc.exists) {
        const ud = userDoc.data();
        role = ud.rol || ud.role || null;
      }
    } catch (e) {
      console.warn("Could not fetch user role from Firestore:", e.message);
    }
    req.user = { id: uid, role: role || "caregiver" };
    return next();
  } catch (err) {
    if (process.env.MEDIA_ALLOW_NO_AUTH === "true") {
      req.user = { id: "dev", role: "caregiver" };
      return next();
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
  next();
};

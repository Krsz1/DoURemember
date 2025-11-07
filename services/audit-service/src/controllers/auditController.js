import { db } from "../utils/firebaseConfig.js";

export const createAudit = async (req, res) => {
  try {
    const payload = req.body || {};
    if (!db) return res.status(500).json({ error: "Firestore not configured" });
    await db.collection("audits").add(payload);
    return res.status(201).json({ message: "Audit recorded" });
  } catch (err) {
    console.error("Error recording audit:", err);
    return res.status(500).json({ error: "Error recording audit" });
  }
};

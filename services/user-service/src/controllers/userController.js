import { adminSdk, db, enabled } from "../utils/firebaseConfig.js";
import { FIREBASE_ERRORS } from "../utils/constants.js";

export const createUser = async (req, res) => {
  const { uid, name, email, role } = req.body;
  if (!uid) return res.status(400).json({ error: "uid is required" });

  try {
    if (!enabled || !db) throw new Error("Firestore not initialized");
  const userRef = db.collection("usuarios").doc(uid);
    await userRef.set({
      name: name || null,
      email: email || null,
      role: role || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({ message: "Perfil de usuario creado exitosamente" });
  } catch (error) {
    const firebaseError = (error && error.code) || "unknown";
    const errorMessage = FIREBASE_ERRORS[firebaseError] || "Error al crear el perfil";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getUsers = async (_req, res) => {
  try {
    if (!enabled || !db) throw new Error("Firestore not initialized");
  const usersSnapshot = await db.collection("usuarios").get();
    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "No se encontraron usuarios." });
    }
    const users = usersSnapshot.docs.map((d) => ({ userId: d.id, ...d.data() }));
    return res.status(200).json(users);
  } catch (error) {
    const firebaseError = (error && error.code) || "unknown";
    const errorMessage = FIREBASE_ERRORS[firebaseError] || "Error al obtener los usuarios";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getUser = async (req, res) => {
  const { uid } = req.params;
  try {
    if (!enabled || !db) throw new Error("Firestore not initialized");
  const userSnapshot = await db.collection("usuarios").doc(uid).get();
    if (!userSnapshot.exists) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    return res.status(200).json({ uid: userSnapshot.id, ...userSnapshot.data() });
  } catch (error) {
    const firebaseError = (error && error.code) || "unknown";
    const errorMessage = FIREBASE_ERRORS[firebaseError] || "Error al obtener el usuario";
    return res.status(400).json({ error: errorMessage });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  try {
    if (!enabled || !db) throw new Error("Firestore not initialized");
  const userRef = db.collection("usuarios").doc(userId);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    await userRef.update({
      ...updates,
      updatedAt: new Date(),
    });

    return res.status(200).json({ message: "Perfil de usuario actualizado exitosamente" });
  } catch (error) {
    const firebaseError = (error && error.code) || "unknown";
    const errorMessage = FIREBASE_ERRORS[firebaseError] || "Error al actualizar el perfil";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getUsersWithEvaluationsAndAudits = async (_req, res) => {
  try {
    if (!enabled || !db) throw new Error("Firestore not initialized");
  const usersSnapshot = await db.collection("usuarios").get();
    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "No se encontraron usuarios." });
    }

    const usersWithCounts = await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        const userId = userDoc.id;

        const evaluationsSnapshot = await db.collection("selfAssessments").where("userId", "==", userId).get();
        const evaluationsCount = evaluationsSnapshot.size || 0;

        const auditsSnapshot = await db.collection("audits").where("userId", "==", userId).get();
        const auditsCount = auditsSnapshot.size || 0;

        return {
          userId,
          ...(userDoc.data()),
          evaluationsCount,
          auditsCount,
        };
      })
    );

    return res.status(200).json(usersWithCounts.filter(Boolean));
  } catch (error) {
    const firebaseError = (error && error.code) || "unknown";
    const errorMessage = FIREBASE_ERRORS[firebaseError] || "Error al obtener los usuarios";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getMyPatients = async (req, res) => {
  try {
    // If Firestore is not configured, return an empty list (development fallback)
    if (!db) return res.status(200).json({ patients: [] });
    // doctorId is provided as path parameter since this endpoint is public (no tokens)
    const { doctorId } = req.params;
    if (!doctorId) return res.status(400).json({ error: "doctorId is required" });

    // Query users in 'usuarios' collection where medicoTratante == doctorId and rol == 'paciente'
    const usersSnapshot = await db.collection("usuarios").where("medicoTratante", "==", doctorId).where("rol", "==", "paciente").get();
    if (usersSnapshot.empty) return res.status(200).json({ patients: [] });

    const patients = usersSnapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
    return res.status(200).json({ patients });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching patients for doctor" });
  }
};

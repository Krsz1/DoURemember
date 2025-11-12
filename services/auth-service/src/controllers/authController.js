const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} = require("firebase/auth");
const {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  collection,
  getDocs,
} = require("firebase/firestore");
const dotenv = require("dotenv");
const { auth, db } = require("../utils/firebaseConfig");
const { adminAuth, adminDb } = require("../utils/firebaseAdmin");
const { FIREBASE_ERRORS } = require("../utils/constants");

dotenv.config();

// REGISTRO DE USUARIO
async function registerUser(req, res) {
  try {
    const {
      rol,
      nombre,
      documento,
      correo,
      telefono,
      password,
      medicoTratante,
      nombrePaciente,
      documentoPaciente,
    } = req.body;

    const rolesPermitidos = ["medico", "paciente", "cuidador"];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ message: "Rol inválido." });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: nombre });
    await sendEmailVerification(user);

    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      rol,
      nombre,
      documento,
      correo,
      telefono,
      password,
      medicoTratante: medicoTratante || null,
      nombrePaciente: nombrePaciente || null,
      documentoPaciente: documentoPaciente || null,
      creadoEn: new Date(),
    });

    return res.status(201).json({
      message: "✅ Usuario creado exitosamente. Verifica tu correo para completar el proceso.",
      uid: user.uid,
    });
  } catch (error) {
    console.error("❌ Error en registro:", error);
    return res.status(400).json({
      message: FIREBASE_ERRORS[error.code] || "Ocurrió un error inesperado.",
    });
  }
}


// LOGIN DE USUARIO
async function loginUser(req, res) {
  try {
    const { correo, password } = req.body;

    const userCredential = await signInWithEmailAndPassword(auth, correo, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "⚠️ Por favor verifica tu correo electrónico antes de iniciar sesión.",
      });
    }

    const q = query(collection(db, "usuarios"), where("correo", "==", correo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "Usuario no encontrado en Firestore." });
    }

    const userData = querySnapshot.docs[0].data();
    const token = await user.getIdToken(); // ✅ Generar token Firebase

    return res.status(200).json({
      message: "✅ Usuario logueado exitosamente.",
      token, // Se envía el token al frontend
      user: {
        uid: user.uid,
        email: user.email,
        rol: userData.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res.status(401).json({
      message: FIREBASE_ERRORS[error.code] || "Credenciales inválidas.",
    });
  }
}

// CAMBIO DE CONTRASEÑA
async function changePassword(req, res) {
  try {
    const { correo, oldPassword, newPassword } = req.body;

    const q = query(collection(db, "usuarios"), where("correo", "==", correo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const userRef = querySnapshot.docs[0].ref;
    const userData = querySnapshot.docs[0].data();

    if (oldPassword !== userData.password) {
      return res.status(401).json({ error: "Contraseña actual incorrecta." });
    }

    await updateDoc(userRef, { password: newPassword });

    return res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("❌ Error en cambio de contraseña:", error);
    return res.status(400).json({ error: error.message });
  }
}


// ELIMINAR USUARIO
async function deleteUser(req, res) {
  try {
    const { correo } = req.body;

    const q = query(collection(db, "usuarios"), where("correo", "==", correo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const userRef = querySnapshot.docs[0].ref;
    await deleteDoc(userRef);

    return res.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    return res.status(400).json({ error: error.message });
  }
}


// LOGOUT REAL
async function logoutUser(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No se proporcionó token de autorización." });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    const decoded = await adminAuth.verifyIdToken(token);

    // Revocar el token del usuario autenticado
    await adminAuth.revokeRefreshTokens(decoded.uid);

    return res.status(200).json({ message: "✅ Sesión cerrada e invalidada correctamente." });
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
    return res.status(400).json({ error: error.message });
  }
}

// Consultar datos de usuario por ID
async function getUserById(req, res) {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ message: "UID no proporcionado." });

    const userRecord = await adminAuth.getUser(uid); // ✅ Admin SDK
    const userDoc = await adminDb.collection("usuarios").doc(uid).get(); // ✅ Admin SDK

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const userData = userDoc.data();

    return res.status(200).json({
      uid: userRecord.uid,
      correo: userRecord.email,
      nombre: userData.nombre,
      telefono: userData.telefono,
      rol: userData.rol,
      documento: userData.documento,
      medicoTratante: userData.medicoTratante || null,
      nombrePaciente: userData.nombrePaciente || null,
      documentoPaciente: userData.documentoPaciente || null,
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return res.status(500).json({ message: "Error al obtener el perfil", error: error.message });
  }
}




module.exports = {
  registerUser,
  loginUser,
  changePassword,
  deleteUser,
  logoutUser,
  getUserById
};

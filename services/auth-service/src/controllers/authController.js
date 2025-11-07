import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import dotenv from "dotenv";
import { auth, db } from "../utils/firebaseConfig.js";
import { FIREBASE_ERRORS } from "../utils/constants.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const {
      nombre,
      documento,
      correo,
      telefono,
      rol,
      password,
      medicoTratante,
      nombreCuidador,
      documentoCuidador,
    } = req.body;

    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
    const user = userCredential.user;

    // Actualizar perfil
    await updateProfile(user, { displayName: nombre });

    // Enviar correo de verificación
    await sendEmailVerification(user);

    // Guardar usuario en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      nombre,
      documento,
      correo,
      telefono,
      rol,
      password, 
      medicoTratante: medicoTratante || null,
      nombreCuidador: nombreCuidador || null,
      documentoCuidador: documentoCuidador || null,
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
};


export const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Iniciar sesión
    const userCredential = await signInWithEmailAndPassword(auth, correo, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "⚠️ Por favor verifica tu correo electrónico antes de iniciar sesión.",
      });
    }

    // Buscar usuario en Firestore
    const q = query(collection(db, "usuarios"), where("correo", "==", correo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "Usuario no encontrado en Firestore." });
    }

    const userData = querySnapshot.docs[0].data();

    return res.status(200).json({
      message: "✅ Usuario logueado exitosamente.",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        rol: userData.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res.status(401).json({
      message: FIREBASE_ERRORS[error.code] || "Credenciales inválidas.",
    });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { correo, oldPassword, newPassword } = req.body;

    // Buscar usuario por correo
    const q = query(collection(db, "usuarios"), where("correo", "==", correo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const userRef = querySnapshot.docs[0].ref;
    const userData = querySnapshot.docs[0].data();

    // Validar contraseña actual
    if (oldPassword !== userData.password) {
      return res.status(401).json({ error: "Contraseña actual incorrecta." });
    }

    // Actualizar contraseña
    await updateDoc(userRef, { password: newPassword });

    return res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("❌ Error en cambio de contraseña:", error);
    return res.status(400).json({ error: error.message });
  }
};


export const deleteUser = async (req, res) => {
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
};

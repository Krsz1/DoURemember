import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Registrar un nuevo usuario
 */
export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Iniciar sesión con correo y contraseña
 */
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Cerrar sesión
 */
export const logoutUser = async () => {
  return await signOut(auth);
};

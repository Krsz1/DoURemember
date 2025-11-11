import { createAxiosInstance } from "./axios";

// URL base del microservicio de autenticación
const authApi = createAxiosInstance(import.meta.env.VITE_AUTH_API_URL);

// Interfaces para tipar los datos
export interface RegisterData {
  nombre: string;
  documento: string;
  correo: string;
  telefono: string;
  rol: string;
  password: string;
  medicoTratante?: string;
  nombrePaciente?: string;
  documentoPaciente?: string;
}

export interface LoginData {
  correo: string;
  password: string;
}

export interface ChangePasswordData {
  correo: string;
  oldPassword: string;
  newPassword: string;
}

export interface DeleteUserData {
  correo: string;
}

// Registrar usuario
export const registerUser = async (data: RegisterData) => {
  const res = await authApi.post("/auth/register", data);
  return res.data;
};

// Iniciar sesión
export const loginUser = async (data: LoginData) => {
  const res = await authApi.post("/auth/login", data);
  return res.data;
};

// Cambiar contraseña
export const changePassword = async (data: ChangePasswordData) => {
  const res = await authApi.put("/auth/password", data);
  return res.data;
};

// Eliminar usuario
export const deleteUser = async (data: DeleteUserData) => {
  const res = await authApi.delete("/auth/delete", { data });
  return res.data;
};

// Logout
export const logoutUser = async (uid: string) => {
  try {
    const res = await authApi.post("/auth/logout", { uid });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

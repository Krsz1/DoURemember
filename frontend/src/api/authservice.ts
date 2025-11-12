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
  try {
    const res = await authApi.post("/auth/register", data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error en registerUser:", error.response?.data || error.message);
    throw error;
  }
};

// Iniciar sesión
export const loginUser = async (data: LoginData) => {
  try {
    const res = await authApi.post("/auth/login", data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error en loginUser:", error.response?.data || error.message);
    throw error;
  }
};

// Cambiar contraseña
export const changePassword = async (data: ChangePasswordData, token: string) => {
  try {
    const res = await authApi.put("/auth/password", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Error en changePassword:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar usuario
export const deleteUser = async (data: DeleteUserData, token: string) => {
  try {
    const res = await authApi.delete("/auth/delete", {
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Error en deleteUser:", error.response?.data || error.message);
    throw error;
  }
};

// Logout real (invalida el token en el backend)
export const logoutUser = async (uid: string, token: string) => {
  try {
    const res = await authApi.post(
      "/auth/logout",
      { uid },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error: any) {
    console.error("❌ Error en logoutUser:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener datos del usuario
export const getUserData = async (uid: string, token: string) => {
  if (!uid) throw new Error("UID no proporcionado.");
  
  try {
    const res = await authApi.get(`/auth/profile/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Error en getUserData:", error.response?.data || error.message);
    throw error;
  }
};

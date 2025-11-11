// src/api/axios.ts
import axios, { AxiosInstance } from "axios";

/**
 * Crea una instancia de Axios con la configuración base.
 * @param baseURL URL base del microservicio (leída desde el .env)
 */
export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials: true, // para enviar cookies/tokens si los usas
  });

  // Interceptor para agregar token de autenticación (si aplica)
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Interceptor para manejar errores globales
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("❌ Error en Axios:", error.response || error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};

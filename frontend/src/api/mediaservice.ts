// src/api/mediaservice.ts
import { createAxiosInstance } from "./axios";

const mediaApi = createAxiosInstance(import.meta.env.VITE_MEDIA_API_URL);

// Subir una foto con descripción
export const uploadPhoto = async (token: string, file: File, description: string) => {
  const formData = new FormData();
  formData.append("photo", file); // ✅ debe coincidir con multer.single("photo")
  formData.append("description", description);

  const res = await mediaApi.post("/api/media/upload-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Obtener todas las fotos del usuario (sin el buffer)
export const getAllPhotos = async (token: string) => {
  const res = await mediaApi.get("/api/media/my-photos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.photos;
};

// Obtener una foto específica por ID
export const getPhotoById = async (token: string, id: string) => {
  const res = await mediaApi.get(`/api/media/photo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob", // 👈 Importante para recibir la imagen como archivo
  });
  return res.data;
};

// Actualizar descripción de una foto
export const updatePhotoDescription = async (token: string, id: string, description: string) => {
  const res = await mediaApi.put(
    `/api/media/photo/${id}/description`,
    { description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Eliminar una foto
export const deletePhoto = async (token: string, id: string) => {
  const res = await mediaApi.delete(`/api/media/photo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

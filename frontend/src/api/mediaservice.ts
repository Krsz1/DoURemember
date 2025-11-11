// src/api/mediaservice.ts
import { createAxiosInstance } from "./axios";

// Instancia de Axios apuntando al media-service
const mediaApi = createAxiosInstance(import.meta.env.VITE_MEDIA_API_URL);

// Subir una foto con descripción
export const uploadPhoto = async (token: string, file: File, description: string) => {
  const formData = new FormData();
  formData.append("photo", file); // Debe coincidir con multer.single("photo") en el backend
  formData.append("description", description);

  const res = await mediaApi.post("/media/upload-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Obtener todas las fotos del usuario (sin el buffer)
export const getAllPhotos = async (token: string) => {
  const res = await mediaApi.get("/media/my-photos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.photos;
};

// Obtener una foto específica por ID
export const getPhotoById = async (token: string, id: string) => {
  const res = await mediaApi.get(`/media/photo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob", // Importante para recibir la imagen como archivo
  });
  return res.data;
};

// Actualizar descripción de una foto
export const updatePhotoDescription = async (token: string, id: string, description: string) => {
  const res = await mediaApi.put(
    `/media/photo/${id}/description`,
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
  const res = await mediaApi.delete(`/media/photo/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

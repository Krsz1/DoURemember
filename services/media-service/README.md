# Media Service

Este servicio permite subir y gestionar fotografías y conjuntos de práctica.

Endpoints principales:
- POST /api/media/upload (caregiver) - campo `photo` (file), body: description, patientId, tags (array o JSON string). JPG/PNG ≤5MB.
- GET /api/media/patient/:patientId (caregiver, doctor) - lista medias.
- PUT /api/media/:id/description (caregiver) - editar descripción (mínimo 20 chars). Mantiene historial.
- POST /api/media/sets (caregiver) - crear conjunto de práctica (name, gameType, imageIds, patientId).
- GET /api/media/sets/:patientId (caregiver, doctor) - listar conjuntos.

Notas de implementación:
- Metadatos se guardan en Firestore (usa las mismas variables de entorno que otros servicios): FIREBASE_*.
- Archivos se almacenan localmente en `uploads/` (por defecto). Para usar Firebase Storage, se puede adaptar `src/controllers/mediaController.js` para subir con `firebase-admin`.
- Autenticación: se verifica JWT con `process.env.JWT_SECRET`. Se espera que el token incluya `id` y `role`.

Instalación rápida (desde la carpeta `services/media-service`):

```powershell
npm install
npm run dev
```

Variables de entorno recomendadas (ver otros servicios):
- FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID
- JWT_SECRET


Nota: para facilitar pruebas locales, todas las rutas del `media-service` están abiertas (no requieren token). Esto incluye:

- POST /api/media/upload
- PUT /api/media/:id/description
- POST /api/media/sets
- GET endpoints también públicos

Si más adelante quieres volver a exigir autenticación, restaura los middlewares `authenticate` y `requireRole` en `src/routes/mediaRoutes.js`.

Cloudinary
---------
This service supports uploading images to Cloudinary when the `CLOUDINARY_URL` environment variable is set.

Set the variable in your shell or in a `.env` file, for example:

```powershell
# example (do NOT commit your real secret)
setx CLOUDINARY_URL "cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>"
```

When Cloudinary is configured the service will try Cloudinary first, then Firebase Storage, then fall back to local `uploads/`.

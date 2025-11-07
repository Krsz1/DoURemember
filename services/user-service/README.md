# User Service

Microservicio encargado de gestionar perfiles de usuario en Firestore.

Endpoints principales:
- POST /api/users -> crear perfil
- GET /api/users -> listar perfiles
- GET /api/users/:uid -> obtener perfil
- PUT /api/users/:userId -> actualizar perfil

Variables de entorno:
- USERS_PORT (opcional, default 5001)
- GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_SERVICE_ACCOUNT_PATH para inicializar Firebase Admin

Instalación:
1. cd services/user-service
2. npm install
3. npm start

Nota: No incluir archivos de credenciales en el repositorio. Añade la ruta al archivo de credenciales en la variable FIREBASE_SERVICE_ACCOUNT_PATH o usa GOOGLE_APPLICATION_CREDENTIALS.

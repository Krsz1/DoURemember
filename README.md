# README - Proyecto DoURemember  

## Descripción del Proyecto  
Este proyecto tiene como objetivo el desarrollo de una aplicación web interactiva orientada al apoyo cognitivo de pacientes con deterioro cognitivo leve o Alzheimer temprano.  
La herramienta está diseñada para fortalecer la memoria y las capacidades cognitivas mediante ejercicios personalizados con fotografías familiares, juegos de memoria, recordatorios automáticos y reportes de progreso para cuidadores y médicos.  

DoURemember busca mejorar la calidad de vida de los pacientes al fomentar la estimulación cognitiva y emocional, y al mismo tiempo proporcionar a cuidadores y profesionales de la salud información útil y actualizada sobre el estado cognitivo del paciente.  

## Características Principales  

### Ejercicios Cognitivos Personalizados  
El sistema permite realizar ejercicios de memoria interactivos a partir de fotografías familiares cargadas por los cuidadores.  
Esto incluye actividades de reconocimiento, asociación y atención que se adaptan al desempeño del paciente.  

### Carga de Fotografías y Contenido  
Los cuidadores pueden subir imágenes familiares y descripciones, que el sistema utiliza como referencia para los juegos y ejercicios cognitivos.  

### Reportes de Progreso  
La plataforma genera reportes detallados que muestran el rendimiento del paciente a lo largo del tiempo, ayudando a los médicos y cuidadores a evaluar su progreso.  

### Notificaciones y Recordatorios  
El sistema envía recordatorios automáticos por correo electrónico para incentivar la práctica diaria de los ejercicios y garantizar la continuidad terapéutica.  

### Interfaz Intuitiva  
La interfaz está diseñada para ser sencilla y accesible tanto para pacientes como para cuidadores, con navegación clara, botones visibles y compatibilidad multiplataforma.  

---

## Tecnologías Utilizadas  

**Frontend:** React + JavaScript  
**Backend:** Node.js + Express  
**Base de Datos:** MongoDB Atlas  
**Autenticación y Notificaciones:** Firebase (Firestore, Authentication y Cloud Messaging)  
**Seguridad:** Implementación de cifrado de datos (AES-256) y autenticación robusta con Firebase Authentication  

---

## Instalación y Configuración  

### Requisitos Previos  
- Node.js instalado (versión 16.x o superior)  
- npm o yarn instalado  
- Cuenta de Firebase configurada con Firestore y Authentication habilitados  
- Git para clonar el repositorio  
- MongoDB Atlas configurado o instancia local activa  

### Pasos para Ejecutar el Proyecto  

#### Clonar el Repositorio  
```bash
git clone https://github.com/tu-repositorio/DoURemember.git
cd DoURemember
```
### Instalar Dependencias

**Frontend (React):**
```bash
cd frontend
npm install
```
**Backend (Node.js + Express):**
```bash
cd ../services
npm install
```
### Configurar Firebase

1. Cree un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Configure **Firestore**, **Authentication** y **Cloud Messaging** según sea necesario
3. Descargue el archivo de configuración desde la consola de Firebase
4. Coloque la configuración en las siguientes ubicaciones:
   - `frontend/src/firebaseConfig.json`
   - `backend/firebaseConfig.json`

### Configurar Variables de Entorno

**Frontend (`frontend/.env`):**

```env
VITE_FIREBASE_APIKEY=clave_api_firebase
VITE_FIREBASE_AUTHDOMAIN=dominio_autenticacion_firebase
VITE_FIREBASE_PROJECTID=id_proyecto_firebase
VITE_FIREBASE_STORAGEBUCKET=bucket_almacenamiento_firebase
VITE_FIREBASE_MESSAGING_SENDERID=id_mensajeria_firebase
VITE_FIREBASE_APPID=id_aplicacion_firebase
VITE_MONGODB_URI=tu_conexion_mongodb
```

**Backend (`backend/.env`):**

```env
FIREBASE_API_KEY=clave_api_firebase
FIREBASE_AUTH_DOMAIN=dominio_autenticacion_firebase
FIREBASE_PROJECT_ID=id_proyecto_firebase
FIREBASE_STORAGE_BUCKET=bucket_almacenamiento_firebase
FIREBASE_MESSAGING_SENDER_ID=id_mensajeria_firebase
FIREBASE_APP_ID=id_aplicacion_firebase
MONGODB_URI=tu_conexion_mongodb
PORT=5000
```

### Ejecutar la Aplicación

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm start
```

---

## Estructura General del Proyecto

```
DoURemember/
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas principales
│   │   ├── services/         # Comunicación con backend y Firebase
│   │   └── styles/           # Archivos de estilo
│   └── public/
│
├── services/                     # Microservicios del backend
│   ├── auth-service/             # Autenticación y gestión de usuarios
│   ├── media-service/            # Gestión de contenido multimedia
│   ├── notification-service/     # Envío de notificaciones y recordatorios
│   └── report-service/           # Generación de reportes y métricas
│
├── docs/                     # Documentación técnica y SRS
├── .gitignore                    # Archivos ignorados por Git
├── package.json                  # Dependencias globales del proyecto
└── README.md                     # Documentación principal
```

---

## Beneficios de la Arquitectura

### Modularidad
Cada servicio tiene una función específica, lo que facilita la escalabilidad y mantenimiento.

### Escalabilidad
El sistema permite crecer horizontalmente según el número de usuarios y volumen de datos.

### Reutilización
Los módulos pueden adaptarse para otros sistemas de apoyo cognitivo o clínico.

### Seguridad y Privacidad
Cumplimiento con estándares de protección de datos médicos (HIPAA, GDPR).

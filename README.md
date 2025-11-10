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

Instalar Dependencias

Frontend (React):

cd frontend
npm install


Backend (Node.js + Express):

cd ../backend
npm install

Configurar Firebase

Cree un proyecto en Firebase Console.

Configure Firestore, Authentication y Cloud Messaging según sea necesario.

Descargue el archivo firebaseConfig.json desde la consola de Firebase y colóquelo en las siguientes ubicaciones:

frontend/src/firebaseConfig.json

backend/firebaseConfig.json

Ejecutar la Aplicación

Backend:

cd backend
npm start


Frontend:

cd frontend
npm start

Estructura General del Proyecto

DoURemember/
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas principales
│   │   ├── services/         # Comunicación con backend y Firebase
│   │   └── styles/           # Archivos de estilo
│   └── public/
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # Controladores del backend
│   │   ├── models/           # Modelos de MongoDB
│   │   ├── routes/           # Definición de rutas API
│   │   ├── services/         # Lógica de negocio
│   │   └── utils/            # Utilidades (validaciones, envío de correos)
│   └── firebaseConfig.json
│
├── docs/                     # Documentación técnica y SRS
├── package.json
└── README.md

Descripción de los Módulos
1. Auth Service

Responsabilidad: Manejo de autenticación, autorización y gestión de usuarios.
Entidades Principales:

User: Información básica del usuario (correo, rol, estado).

UserProfile: Datos complementarios (nombre, relación con el paciente).
Funcionalidades:

Registro e inicio de sesión.

Validación de roles y permisos.

Sincronización de usuarios con Firebase.

2. Content Service

Responsabilidad: Gestión de fotografías familiares y descripciones de referencia.
Entidades Principales:

Photo: Imagen y metadatos (nombre, descripción, etiquetas).

MemorySet: Colección de fotografías asociadas a un paciente.
Funcionalidades:

Subida, edición y eliminación de fotos.

Asociación de imágenes con ejercicios cognitivos.

3. Game Service

Responsabilidad: Ejecución y control de los ejercicios cognitivos.
Entidades Principales:

GameSession: Registro de partidas y resultados.
Funcionalidades:

Iniciar y finalizar sesiones de juego.

Evaluar resultados de cada ejercicio.

4. Report Service

Responsabilidad: Generación de reportes cognitivos y monitoreo del progreso.
Entidades Principales:

Report: Registro de resultados, métricas e historial del paciente.
Funcionalidades:

Generar reportes automáticos.

Mostrar tendencias de progreso.

5. Notification Service

Responsabilidad: Envío de recordatorios y alertas por correo electrónico.
Entidades Principales:

Notification: Mensaje, destinatario y estado.
Funcionalidades:

Recordatorios automáticos de práctica.

Alertas de seguimiento médico.

Beneficios de la Arquitectura

Modularidad:
Cada servicio tiene una función específica, lo que facilita la escalabilidad y mantenimiento.

Escalabilidad:
El sistema permite crecer horizontalmente según el número de usuarios y volumen de datos.

Reutilización:
Los módulos pueden adaptarse para otros sistemas de apoyo cognitivo o clínico.

Seguridad y Privacidad:
Cumplimiento con estándares de protección de datos médicos (HIPAA, GDPR).


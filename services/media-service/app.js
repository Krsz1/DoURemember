const express = require('express');
const mediaRoutes = require('./src/routes/mediaRoutes');
const { db, bucket } = require('./src/utils/firebaseAdmin');
require('dotenv').config();

const app = express();
app.use(express.json());

// 🔗 Pasar Firestore y Storage a toda la app (disponibles en req.app.locals)
app.locals.db = db;
app.locals.bucket = bucket;

// Rutas principales del servicio de medios
app.use('/api/media', mediaRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Media Service running on port ${PORT}`));

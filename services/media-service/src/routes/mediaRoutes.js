const express = require('express');
const multer = require('multer');
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  uploadPhoto,
  addDescription,
  addTags,
  getPhoto,
} = require('../controllers/mediaController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// HU 2.1 - Subir foto
router.post('/:patientId/photos', verifyToken, upload.single('file'), uploadPhoto);

// HU 2.2 - Agregar descripción
router.post('/:patientId/photos/:photoId/description', verifyToken, addDescription);

// HU 2.3 - Agregar etiquetas
router.post('/:patientId/photos/:photoId/tags', verifyToken, addTags);

// HU 2.5 - Obtener foto
router.get('/:patientId/photos/:photoId', verifyToken, getPhoto);

// 🔍 Endpoint de prueba de conexión a Firebase
router.get('/test', async (req, res) => {
  try {
    // Probar Firestore
    const testRef = req.app.locals.db.collection('test').doc('connection');
    await testRef.set({ ok: true, timestamp: new Date().toISOString() });

    // Probar acceso a Storage
    const [files] = await req.app.locals.bucket.getFiles({ maxResults: 1 });
    const storageOk = files.length >= 0;

    res.json({
      message: '✅ Conexión a Firebase correcta',
      firestore: 'OK',
      storage: storageOk ? 'OK' : 'Vacío',
    });
  } catch (error) {
    console.error('❌ Error en la prueba de Firebase:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

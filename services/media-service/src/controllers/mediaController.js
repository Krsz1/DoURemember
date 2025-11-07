// controllers/mediaController.js
const { db, bucket, admin } = require('../utils/firebaseAdmin');
const { v4: uuidv4 } = require('uuid');

exports.uploadPhoto = async (req, res) => {
  try {
    const { patientId } = req.params;
    const file = req.file;
    const { description } = req.body;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype))
      return res.status(400).json({ error: 'Invalid file type' });

    const photoId = uuidv4();
    const filePath = `photos/${patientId}/${photoId}`;
    const blob = bucket.file(filePath);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: { firebaseStorageDownloadTokens: uuidv4() }
      }
    });

    blobStream.end(file.buffer);

    await db.collection('patients')
      .doc(patientId)
      .collection('photos')
      .doc(photoId)
      .set({
        photoId,
        filePath,
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        uploadedBy: req.user.uid,
        description: description || '',
        tags: [],
      });

    return res.status(201).json({ message: 'Photo uploaded', photoId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

exports.addDescription = async (req, res) => {
  const { patientId, photoId } = req.params;
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Description required' });

  const photoRef = db.collection('patients').doc(patientId).collection('photos').doc(photoId);
  await photoRef.update({
    description,
    lastModified: admin.firestore.FieldValue.serverTimestamp(),
  });
  res.json({ message: 'Description updated' });
};

exports.addTags = async (req, res) => {
  const { patientId, photoId } = req.params;
  const { tags } = req.body;
  if (!Array.isArray(tags)) return res.status(400).json({ error: 'Tags must be an array' });

  const photoRef = db.collection('patients').doc(patientId).collection('photos').doc(photoId);
  await photoRef.update({ tags });
  res.json({ message: 'Tags added' });
};

exports.getPhoto = async (req, res) => {
  const { patientId, photoId } = req.params;
  const photoSnap = await db.collection('patients').doc(patientId).collection('photos').doc(photoId).get();
  if (!photoSnap.exists) return res.status(404).json({ error: 'Photo not found' });

  const data = photoSnap.data();
  const [url] = await bucket.file(data.filePath).getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000
  });

  res.json({ ...data, url });
};

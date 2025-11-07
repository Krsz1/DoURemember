import fs from 'fs';
import path from 'path';
import { uploadPhoto } from '../src/controllers/mediaController.js';

async function run() {
  try {
    const filePath = path.join(process.cwd(), 'test-files', 'attachment.jpg');
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      process.exit(1);
    }
    const buffer = fs.readFileSync(filePath);
    const req = {
      file: {
        buffer,
        originalname: path.basename(filePath),
        mimetype: 'image/jpeg',
        size: buffer.length,
      },
      body: {
        description: 'Prueba subida desde adjunto. Más de veinte caracteres para validar.',
        patientId: 'test-patient-attachment',
        tags: JSON.stringify(['adjunto','test']),
      },
      user: { id: 'dev' },
    };

    const res = {
      status(code) {
        this._status = code;
        return this;
      },
      json(obj) {
        console.log('RESPONSE STATUS:', this._status || 200);
        console.log(JSON.stringify(obj, null, 2));
      }
    };

    await uploadPhoto(req, res);
  } catch (err) {
    console.error('Error running upload:', err);
    process.exit(1);
  }
}

run();

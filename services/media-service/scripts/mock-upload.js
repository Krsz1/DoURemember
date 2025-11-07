import fs from 'fs';
import path from 'path';
import { uploadPhoto } from '../src/controllers/mediaController.js';

async function run() {
  try {
    const filePath = 'C:/Windows/Web/Wallpaper/Windows/img0.jpg';
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
        description: 'Prueba automática: descripción con más de veinte caracteres para test.',
        patientId: 'test-patient',
        tags: JSON.stringify(['Prueba','Tag2']),
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
    console.error('Error running mock upload:', err);
    process.exit(1);
  }
}

run();

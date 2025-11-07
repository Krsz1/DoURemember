import { bucket, adminSdk } from '../src/utils/firebaseConfig.js';

async function check() {
  try {
    const name = bucket.name;
    console.log('Using bucket:', name);
    const [meta] = await bucket.getMetadata();
    console.log('Bucket metadata:', meta);
  } catch (err) {
    console.error('Bucket check failed:', err.message || err);
    process.exit(1);
  }
}

check();

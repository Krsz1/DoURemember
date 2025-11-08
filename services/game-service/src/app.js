import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import axios from "axios";
import crypto from "crypto";

const app = express();
const PORT = process.env.GAME_PORT || 5020;
const AUDIT_URL = process.env.AUDIT_SERVICE_URL || "http://localhost:5010/api/audits";

app.use(express.json());
app.use(cors());

// Uploads directory (relative to services folder) - used only as a final fallback
const UPLOADS_DIR = path.resolve(process.cwd(), '..', 'media-service', 'uploads');

// Media-service base URL (prefer to query media-service which returns Cloudinary/Firebase/local URLs)
// Default port for media-service is 4004 (see services/media-service/app.js). When running inside Docker on Windows
// use host.docker.internal to reach a media-service running on the host machine.
const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL || 'http://localhost:4004';

function ensureUploadsExists() {
	try {
		return fs.existsSync(UPLOADS_DIR) && fs.statSync(UPLOADS_DIR).isDirectory();
	} catch (e) {
		return false;
	}
}

// Serve images statically if available
if (ensureUploadsExists()) {
	app.use('/uploads', express.static(UPLOADS_DIR));
	console.log(`Serving uploads from ${UPLOADS_DIR}`);
} else {
	console.warn(`Uploads directory not found at ${UPLOADS_DIR}. /uploads will be empty.`);
}

function listLocalImages() {
	try {
		if (!ensureUploadsExists()) return [];
		const files = fs.readdirSync(UPLOADS_DIR, { withFileTypes: true })
			.filter(f => f.isFile())
			.map(f => f.name)
			.filter(name => /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(name));
		return files;
	} catch (e) {
		console.error('Error listing local images:', e);
		return [];
	}
}

async function fetchMediaForPatient(patientId) {
	// call media-service's list endpoint which returns metadata including url
	try {
		const url = `${MEDIA_SERVICE_URL.replace(/\/$/, '')}/api/media/patient/${encodeURIComponent(patientId)}`;
		const resp = await axios.get(url, { timeout: 4000 });
		// media-service returns { media: [...], reports }
		if (resp && resp.data && Array.isArray(resp.data.media)) {
			return resp.data.media.map(m => ({ filename: m.originalname || m.filename || m.id, url: m.url || m.publicUrl || m.storagePath || null }));
		}
		return [];
	} catch (e) {
		console.warn('Could not fetch media from media-service:', e.message || e);
		return [];
	}
}

// Helper to append interaction locally if audit-service forwarding fails
const LOCAL_INTERACTIONS_FILE = path.join(process.cwd(), 'game_interactions_local.json');
function writeLocalInteraction(payload) {
	const arr = [];
	try {
		if (fs.existsSync(LOCAL_INTERACTIONS_FILE)) {
			const raw = fs.readFileSync(LOCAL_INTERACTIONS_FILE, 'utf8');
			if (raw) {
				try { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) arr.push(...parsed); } catch (e) { /* ignore */ }
			}
		}
	} catch (e) {
		// ignore read errors
	}
	arr.push(payload);
	try {
		fs.writeFileSync(LOCAL_INTERACTIONS_FILE, JSON.stringify(arr, null, 2), 'utf8');
		return true;
	} catch (e) {
		console.error('Failed to write local interaction file:', e.message || e);
		return false;
	}
}

// GET /api/photos -> lista de fotos con URL
// GET /api/photos?patientId=...  -> Prefer media-service (Cloudinary/Firebase) else fallback to local uploads
app.get('/api/photos', async (req, res) => {
	const patientId = req.query.patientId || null;
	if (patientId) {
		const fromMedia = await fetchMediaForPatient(patientId);
		if (fromMedia && fromMedia.length) return res.json(fromMedia);
		// otherwise fallthrough to local
	}

	// If no patientId provided or media-service returned nothing, serve local uploads as last resort
	const files = listLocalImages();
	const host = req.get('host');
	const proto = req.protocol;
	const base = `${proto}://${host}`;
	const photos = files.map(filename => ({ filename, url: `${base}/uploads/${encodeURIComponent(filename)}` }));
	res.json(photos);
});

// POST /api/interactions -> registra interacción y reintenta/guarda local si falla forwarding
app.post('/api/interactions', async (req, res) => {
	try {
		const body = req.body || {};
		// Basic validation
		if (!body.photo || !body.event) {
			return res.status(400).json({ error: 'photo and event are required' });
		}

		const payload = {
				userType: body.userType || 'patient',
				userId: body.userId || null,
				patientId: body.patientId || null,
				// Extended fields for privacy/session tracing
				sessionId: body.sessionId || null,
				caregiverId: body.caregiverId || null,
				tags: Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : []),
				event: body.event,
				photo: body.photo,
				meta: body.meta || {},
				timestamp: body.timestamp || new Date().toISOString()
		};

				// Try forwarding to audit service. Optionally sign payload using HMAC if secret provided
				try {
					const headers = {};
					const hmacSecret = process.env.GAME_HMAC_SECRET || process.env.HMAC_SECRET || null;
					if (hmacSecret) {
						const str = JSON.stringify(payload);
						const sig = crypto.createHmac('sha256', hmacSecret).update(str).digest('hex');
						headers['X-Signature'] = sig;
					}
					await axios.post(AUDIT_URL, payload, { timeout: 4000, headers });
					return res.status(201).json({ message: 'Interaction forwarded to audit-service' });
				} catch (e) {
					console.warn('Forward to audit-service failed:', e.message || e);
					// fallback: write locally to ensure record
					const ok = writeLocalInteraction(payload);
					if (ok) return res.status(201).json({ message: 'Interaction recorded locally (audit forward failed)' });
					return res.status(500).json({ error: 'Failed to forward and failed to record locally' });
				}
	} catch (err) {
		console.error('Error handling interaction:', err);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

app.get('/', (_req, res) => res.status(200).send('Game service running'));

app.listen(PORT, () => console.log(`Game service running on http://localhost:${PORT}`));


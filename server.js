import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Diretório base de uploads
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Obter caminhos por evento
function getEventPaths(eventSlug) {
  const safeSlug = (eventSlug || 'demo-casamento').replace(/[^a-zA-Z0-9-]/g, '-');
  const eventDir = path.join(UPLOADS_DIR, safeSlug);
  const dbFile = path.join(eventDir, 'photos.json');

  if (!fs.existsSync(eventDir)) {
    fs.mkdirSync(eventDir, { recursive: true });
  }

  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify([]), 'utf8');
  }

  return { safeSlug, eventDir, dbFile };
}

// Configuração do Multer com destinos por evento
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const eventSlug = req.query.evento || req.body.evento || 'demo-casamento';
    const { eventDir } = getEventPaths(eventSlug);
    cb(null, eventDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${Date.now()}_${cleanName}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }
});

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.get('/api/network-ip', (req, res) => {
  const ip = getLocalIP();
  const eventSlug = req.query.evento || 'demo-casamento';
  res.json({
    ip,
    port: 5173,
    url: `http://${ip}:5173?evento=${eventSlug}`
  });
});

// GET: Obter fotos por evento
app.get('/api/photos', (req, res) => {
  try {
    const eventSlug = req.query.evento || 'demo-casamento';
    const { dbFile } = getEventPaths(eventSlug);
    const data = fs.readFileSync(dbFile, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler fotos do evento.' });
  }
});

// POST: Upload por evento
app.post('/api/upload', upload.single('photo'), (req, res) => {
  try {
    const file = req.file;
    const eventSlug = req.query.evento || req.body.evento || 'demo-casamento';
    const { safeSlug, dbFile } = getEventPaths(eventSlug);
    const { guestName, tableId, tableName, caption, message } = req.body;

    let photoUrl = '';
    if (file) {
      photoUrl = `/uploads/${safeSlug}/${file.filename}`;
    } else if (req.body.photoUrl) {
      photoUrl = req.body.photoUrl;
    } else {
      return res.status(400).json({ error: 'Nenhuma foto enviada.' });
    }

    const data = fs.readFileSync(dbFile, 'utf8');
    const photos = JSON.parse(data);

    const newPhoto = {
      id: `photo_${Date.now()}`,
      url: photoUrl,
      guestName: guestName ? guestName.trim() : 'Convidado',
      tableId: tableId || 't1',
      tableName: tableName || 'Casamento',
      caption: caption ? caption.trim() : '',
      messageToCouples: message ? message.trim() : '',
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString(),
      status: 'LIVE_APPROVED',
      likesCount: 0
    };

    photos.unshift(newPhoto);
    fs.writeFileSync(dbFile, JSON.stringify(photos, null, 2), 'utf8');

    console.log(`[Upload ${safeSlug}] Foto salva em: uploads/${safeSlug}/`);
    res.json({ success: true, photo: newPhoto });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro ao guardar fotografia.' });
  }
});

// POST: Gostar de foto por evento
app.post('/api/photos/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const eventSlug = req.query.evento || 'demo-casamento';
    const { dbFile } = getEventPaths(eventSlug);

    const data = fs.readFileSync(dbFile, 'utf8');
    let photos = JSON.parse(data);

    photos = photos.map((p) => {
      if (p.id === id) {
        return { ...p, likesCount: (p.likesCount || 0) + 1 };
      }
      return p;
    });

    fs.writeFileSync(dbFile, JSON.stringify(photos, null, 2), 'utf8');
    res.json({ success: true, photos });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar gostos.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log(`\n🚀 Servidor de Uploads do Álbum Casamento ativo!`);
  console.log(`📁 Pasta base de uploads: ${UPLOADS_DIR}`);
  console.log(`🌐 Endereço na rede Wi-Fi: http://${ip}:${PORT}\n`);
});

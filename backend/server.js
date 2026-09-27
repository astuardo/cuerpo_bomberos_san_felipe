import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, 'data', 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'noticia-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Helper to read DB
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error leyendo base de datos:', err);
    return { admin: {}, alerts: [], stats: {}, companies: [], news: [] };
  }
};

// Helper to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error escribiendo base de datos:', err);
    return false;
  }
};

// ================= Rutas de Autenticación =================
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();

  if (
    username === db.admin.username &&
    password === db.admin.password
  ) {
    return res.json({
      success: true,
      token: 'cbsf_admin_token_2026',
      user: {
        username: db.admin.username,
        name: db.admin.name,
        role: db.admin.role
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Credenciales inválidas. Compruebe usuario y contraseña.'
  });
});

// ================= Rutas de Noticias =================
// Listar noticias (con filtros de categoría opcionales)
app.get('/api/news', (req, res) => {
  const { category, search, status } = req.query;
  const db = readDB();
  let list = db.news || [];

  if (status) {
    list = list.filter(n => (n.status || 'PUBLICADO') === status);
  }

  if (category && category !== 'TODAS') {
    list = list.filter(n => n.category && n.category.toUpperCase() === category.toUpperCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.excerpt.toLowerCase().includes(q) ||
      (n.content && n.content.toLowerCase().includes(q))
    );
  }

  // Ordenar por fecha descendente
  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(list);
});

// Detalle de noticia
app.get('/api/news/:id', (req, res) => {
  const db = readDB();
  const item = db.news.find(n => n.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Noticia no encontrada' });
  }
  res.json(item);
});

// Crear noticia
app.post('/api/news', upload.single('image'), (req, res) => {
  const db = readDB();
  const { title, category, author, excerpt, content, featured, status } = req.body;

  let imageUrl = '/images/news/default-fire.jpg';
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }

  const newPost = {
    id: 'noticia-' + Date.now(),
    title: title || 'Sin título',
    category: (category || 'ACTUALIDAD').toUpperCase(),
    date: new Date().toISOString().split('T')[0],
    author: author || 'Prensa CBSF',
    excerpt: excerpt || '',
    content: content || '',
    imageUrl,
    featured: featured === 'true' || featured === true,
    status: status || 'PUBLICADO'
  };

  db.news.unshift(newPost);
  writeDB(db);

  res.status(201).json(newPost);
});

// Editar noticia
app.put('/api/news/:id', upload.single('image'), (req, res) => {
  const db = readDB();
  const idx = db.news.findIndex(n => n.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Noticia no encontrada' });
  }

  const existing = db.news[idx];
  const { title, category, author, excerpt, content, featured, status } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }

  const updatedPost = {
    ...existing,
    title: title !== undefined ? title : existing.title,
    category: category !== undefined ? category.toUpperCase() : existing.category,
    author: author !== undefined ? author : existing.author,
    excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
    content: content !== undefined ? content : existing.content,
    imageUrl,
    featured: featured !== undefined ? (featured === 'true' || featured === true) : existing.featured,
    status: status !== undefined ? status : existing.status,
    updatedAt: new Date().toISOString()
  };

  db.news[idx] = updatedPost;
  writeDB(db);

  res.json(updatedPost);
});

// Eliminar noticia
app.delete('/api/news/:id', (req, res) => {
  const db = readDB();
  const initialLen = db.news.length;
  db.news = db.news.filter(n => n.id !== req.params.id);

  if (db.news.length === initialLen) {
    return res.status(404).json({ message: 'Noticia no encontrada' });
  }

  writeDB(db);
  res.json({ success: true, message: 'Noticia eliminada correctamente' });
});

// ================= Rutas de Compañías =================
app.get('/api/companies', (req, res) => {
  const db = readDB();
  res.json(db.companies || []);
});

app.get('/api/companies/:id', (req, res) => {
  const db = readDB();
  const comp = db.companies.find(c => c.id === req.params.id || String(c.number) === req.params.id);
  if (!comp) {
    return res.status(404).json({ message: 'Compañía no encontrada' });
  }
  res.json(comp);
});

app.post('/api/companies', (req, res) => {
  const db = readDB();
  const body = req.body;
  if (!db.companies) db.companies = [];

  if (Array.isArray(body)) {
    db.companies = body;
  } else if (body && (body.id || body.number)) {
    const idx = db.companies.findIndex(c => c.id === body.id || c.number === body.number);
    if (idx >= 0) {
      db.companies[idx] = { ...db.companies[idx], ...body };
    } else {
      db.companies.push(body);
    }
  }
  writeDB(db);
  res.json({ success: true, companies: db.companies });
});

// ================= Rutas de Institución y Directorio =================
app.get('/api/institution', (req, res) => {
  const db = readDB();
  res.json(db.institution || {
    superintendentName: 'David Nehemia Guajardo Sandoval',
    superintendentRole: 'Superintendente',
    superintendentBio: 'Representante legal y máxima autoridad directiva del Cuerpo de Bomberos de San Felipe.',
    commanderName: 'Walter Román Staforelli Delgado',
    commanderRole: 'Comandante',
    commanderBio: 'Jefe de las operaciones activas, despacho de unidades y disciplina de las 7 compañías.',
    historyParagraph1: 'El Cuerpo de Bomberos de San Felipe fue fundado el 11 de marzo de 1883 gracias al liderazgo del ciudadano y abogado don Moisés del Fierro y Arcaya, junto a vecinos progresistas que sintieron la imperiosa necesidad de dotar a la ciudad de una entidad organizada y voluntaria para proteger a las familias del Valle de Aconcagua.',
    historyParagraph2: 'A lo largo de las décadas, la institución se expandió desde su primera bomba hasta consolidar una fuerza de 7 compañías, abarcando no solo la comuna de San Felipe, sino también Curimón, El Almendral y la vecina comuna de Panquehue, incorporando unidades especializadas en rescate subacuático (GERSA) y rescate agreste cordillerano.',
    headquartersAddress: 'Calle Merced N° 832, San Felipe, Región de Valparaíso, Chile.',
    headquartersPhone: '(34) 251 8817',
    headquartersEmergency: '132'
  });
});

app.post('/api/institution', (req, res) => {
  const db = readDB();
  db.institution = { ...(db.institution || {}), ...req.body };
  writeDB(db);
  res.json({ success: true, institution: db.institution });
});

// ================= Rutas de Alertas =================
app.get('/api/alerts', (req, res) => {
  const db = readDB();
  res.json(db.alerts || []);
});

app.post('/api/alerts', (req, res) => {
  const db = readDB();
  const { title, message, active, type } = req.body;

  const newAlert = {
    id: 'alert-' + Date.now(),
    title: title || 'ALERTA DE EMERGENCIA',
    message: message || '',
    active: active !== undefined ? active : true,
    type: type || 'warning',
    updatedAt: new Date().toISOString()
  };

  // Reemplazar o actualizar la primera alerta activa
  db.alerts = [newAlert];
  writeDB(db);

  res.json(newAlert);
});

// ================= Rutas de Estadísticas =================
app.get('/api/stats', (req, res) => {
  const db = readDB();
  res.json(db.stats || {});
});

app.post('/api/stats', (req, res) => {
  const db = readDB();
  db.stats = { ...(db.stats || {}), ...req.body };
  writeDB(db);
  res.json({ success: true, stats: db.stats });
});

// ================= Rutas de Slider de Portada =================
app.get('/api/slides', (req, res) => {
  const db = readDB();
  res.json(db.slides || []);
});

app.post('/api/slides', (req, res) => {
  const db = readDB();
  if (Array.isArray(req.body)) {
    db.slides = req.body;
  } else {
    if (!db.slides) db.slides = [];
    const item = req.body;
    const index = db.slides.findIndex(s => s.id === item.id);
    if (index >= 0) {
      db.slides[index] = item;
    } else {
      db.slides.push(item);
    }
  }
  writeDB(db);
  res.json({ success: true, slides: db.slides });
});

app.delete('/api/slides/:id', (req, res) => {
  const db = readDB();
  if (db.slides) {
    db.slides = db.slides.filter(s => s.id !== req.params.id);
    writeDB(db);
  }
  res.json({ success: true, message: 'Diapositiva eliminada' });
});


// ================= Ruta de Subida de Archivos / Imágenes =================
app.post('/api/upload', (req, res) => {
  const filename = req.query.filename || `upload-${Date.now()}.jpg`;
  const ext = path.extname(filename) || '.jpg';
  const targetName = 'noticia-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
  const targetPath = path.join(UPLOADS_DIR, targetName);

  const fileStream = fs.createWriteStream(targetPath);
  req.pipe(fileStream);

  fileStream.on('finish', () => {
    res.json({
      url: `/uploads/${targetName}`,
      pathname: targetName
    });
  });

  fileStream.on('error', (err) => {
    console.error('Error guardando archivo local:', err);
    res.status(500).json({ error: 'Error al guardar archivo localmente' });
  });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`[CBSF Backend] Servidor ejecutándose en http://localhost:${PORT}`);
});

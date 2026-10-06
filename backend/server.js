import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
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

// Password hashing helpers
const AUTH_SECRET = process.env.AUTH_SECRET || '';
const DEFAULT_TEMP_HASH = '6f837a24d2eebc3cd85d2ffacacdc1cb219fe388d843461f48434231965b2154';

const hashPassword = (plain) => {
  if (!plain) return '';
  if (AUTH_SECRET) {
    return crypto.createHmac('sha256', AUTH_SECRET).update(plain).digest('hex');
  }
  return crypto.createHash('sha256').update(plain).digest('hex');
};

const verifyPassword = (inputPlain, storedPassword) => {
  if (!inputPlain || !storedPassword) return false;
  
  // 1. Verificación con HMAC si AUTH_SECRET está configurado
  if (AUTH_SECRET) {
    const hmacHash = crypto.createHmac('sha256', AUTH_SECRET).update(inputPlain).digest('hex');
    if (storedPassword === hmacHash) return true;
  }

  // 2. Verificación estándar con SHA-256
  const sha256Hash = crypto.createHash('sha256').update(inputPlain).digest('hex');
  if (storedPassword === sha256Hash) return true;

  // 3. Fallback directo si existiese en texto claro
  return storedPassword === inputPlain;
};

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

// ================= Rutas de Autenticación y Usuarios =================
const handleAuthLogin = (req, res) => {
  const { username, password } = req.body || {};
  const db = readDB();
  const users = db.users || [];

  const foundUser = users.find(u => u.username.toLowerCase() === (username || '').toLowerCase().trim());

  if (foundUser && verifyPassword(password, foundUser.password)) {
    return res.json({
      success: true,
      token: 'cbsf_token_' + Buffer.from(foundUser.username + ':' + Date.now()).toString('base64'),
      user: {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role,
        companyId: foundUser.companyId || null,
        mustChangePassword: foundUser.mustChangePassword === true
      }
    });
  }

  // Fallback con usuario maestro legacy si aún no estuviera en array
  if (db.admin && username === db.admin.username && verifyPassword(password, db.admin.password)) {
    return res.json({
      success: true,
      token: 'cbsf_admin_token_2026',
      user: {
        id: 'usr-admin',
        username: db.admin.username,
        name: db.admin.name || 'Superintendencia',
        role: 'SUPERADMIN',
        companyId: null,
        mustChangePassword: false
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Credenciales inválidas. Compruebe usuario y contraseña.'
  });
};

app.post('/api/auth', handleAuthLogin);
app.post('/api/auth/login', handleAuthLogin);

// Cambio obligatorio o voluntario de contraseña
app.post('/api/auth/change-password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body || {};

  if (!username || !newPassword) {
    return res.status(400).json({ success: false, message: 'Faltan parámetros obligatorios.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  const db = readDB();
  let users = db.users || [];
  const idx = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase().trim());

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado en la base de datos.' });
  }

  // Si se envió currentPassword, validarla
  if (currentPassword && !verifyPassword(currentPassword, users[idx].password)) {
    return res.status(401).json({ success: false, message: 'La contraseña actual ingresada es incorrecta.' });
  }

  const hashedNew = hashPassword(newPassword);
  users[idx].password = hashedNew;
  users[idx].mustChangePassword = false;
  users[idx].updatedAt = new Date().toISOString();

  // Si es admin principal, mantener sincronizado db.admin
  if (users[idx].username === 'admin') {
    db.admin.password = hashedNew;
  }

  db.users = users;
  writeDB(db);

  return res.json({
    success: true,
    message: 'Contraseña actualizada exitosamente en la base de datos.',
    user: {
      id: users[idx].id,
      username: users[idx].username,
      name: users[idx].name,
      role: users[idx].role,
      companyId: users[idx].companyId || null,
      mustChangePassword: false
    }
  });
});

// ================= CRUD de Usuarios (Superadmin) =================
// Listar usuarios
app.get('/api/users', (req, res) => {
  const db = readDB();
  const users = (db.users || []).map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    companyId: u.companyId || null,
    mustChangePassword: u.mustChangePassword === true,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt
  }));
  return res.json(users);
});

// Crear o actualizar usuario / Resetear clave
app.post('/api/users', (req, res) => {
  const { id, username, name, role, companyId, password, resetPassword } = req.body || {};
  const db = readDB();
  let users = db.users || [];

  if (id) {
    // Edición de usuario existente
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    if (name) users[idx].name = name;
    if (role) users[idx].role = role;
    if (companyId !== undefined) users[idx].companyId = companyId || null;

    if (resetPassword || password) {
      users[idx].password = password ? hashPassword(password) : DEFAULT_TEMP_HASH;
      users[idx].mustChangePassword = true; // Exige cambiarla en su próximo login
    }

    users[idx].updatedAt = new Date().toISOString();
    db.users = users;
    writeDB(db);

    return res.json({
      success: true,
      message: 'Usuario actualizado exitosamente.',
      user: {
        id: users[idx].id,
        username: users[idx].username,
        name: users[idx].name,
        role: users[idx].role,
        companyId: users[idx].companyId,
        mustChangePassword: users[idx].mustChangePassword
      }
    });
  }

  // Creación de nuevo usuario
  if (!username || !name || !role) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios: usuario, nombre y rol.' });
  }

  const cleanUsername = username.toLowerCase().trim();
  if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
    return res.status(400).json({ success: false, message: 'El nombre de usuario ya existe en el sistema.' });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    username: cleanUsername,
    password: password ? hashPassword(password) : DEFAULT_TEMP_HASH,
    name,
    role,
    companyId: companyId || null,
    mustChangePassword: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  db.users = users;
  writeDB(db);

  return res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente en la base de datos.',
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
      companyId: newUser.companyId,
      mustChangePassword: newUser.mustChangePassword
    }
  });
});

// Eliminar usuario
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  let users = db.users || [];

  const target = users.find(u => u.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
  }

  if (target.username === 'admin') {
    return res.status(400).json({ success: false, message: 'No se puede eliminar al Superadministrador principal.' });
  }

  db.users = users.filter(u => u.id !== id);
  writeDB(db);

  return res.json({ success: true, message: 'Usuario eliminado exitosamente de la base de datos.' });
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

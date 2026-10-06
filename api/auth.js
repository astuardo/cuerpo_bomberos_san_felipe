import { neon } from '@neondatabase/serverless';

import crypto from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const AUTH_SECRET = process.env.AUTH_SECRET || '';

export const DEFAULT_TEMP_HASH = '6f837a24d2eebc3cd85d2ffacacdc1cb219fe388d843461f48434231965b2154';

export function hashPassword(plainText) {
  if (!plainText) return '';
  if (AUTH_SECRET) {
    return crypto.createHmac('sha256', AUTH_SECRET).update(plainText).digest('hex');
  }
  return crypto.createHash('sha256').update(plainText).digest('hex');
}

export function verifyPassword(inputPlain, storedPassword) {
  if (!inputPlain || !storedPassword) return false;
  
  // 1. Verificación con HMAC si AUTH_SECRET está configurado en Vercel
  if (AUTH_SECRET) {
    const hmacHash = crypto.createHmac('sha256', AUTH_SECRET).update(inputPlain).digest('hex');
    if (storedPassword === hmacHash) return true;
  }

  // 2. Verificación estándar con SHA-256
  const sha256Hash = crypto.createHash('sha256').update(inputPlain).digest('hex');
  if (storedPassword === sha256Hash) return true;

  // 3. Fallback directo si existiese en texto claro
  return storedPassword === inputPlain;
}

export const DEFAULT_USERS = [
  {
    id: "usr-admin",
    username: "admin",
    password: "afc8d7fd5abbe616265ce6941dfa964092e3d530949194539e200fa8bdb1ac3c",
    name: "Superintendencia y Directorio General",
    role: "SUPERADMIN",
    companyId: null,
    mustChangePassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-comandancia",
    username: "comandancia",
    password: "3c5ecde5a00733ca261b08246b7da6e3cd0b169d59ade45e4a3613cd0262f280",
    name: "Comandancia y Central de Comunicaciones",
    role: "COMANDANCIA",
    companyId: null,
    mustChangePassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-cia-1",
    username: "cia1",
    password: "66d36647236673601bdaf85c19e204d6a5c9f546d164368ce98f700539a92916",
    name: "1ª Cía. Bomba Aconcagua",
    role: "COMPANY_ADMIN",
    companyId: "1",
    mustChangePassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-cia-2",
    username: "cia2",
    password: "a4c327cb393ef9dd1348fd1300b4c7574be2ba658a064f49c3274f2675287295",
    name: "2ª Cía. La Internacional",
    role: "COMPANY_ADMIN",
    companyId: "2",
    mustChangePassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-cia-3",
    username: "cia3",
    password: "fbac9da981e61e1c3147d65357dbaeb640e822c6310be2a39fcc889fcf2d81bd",
    name: "3ª Cía. San Felipe",
    role: "COMPANY_ADMIN",
    companyId: "3",
    mustChangePassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-cia-4",
    username: "cia4",
    password: "b12c2684af39ecbc6ddc1c5cdb223fe9f33885d98446a40b39cdd1f68d480cc9",
    name: "4ª Cía. Bomba Almendral",
    role: "COMPANY_ADMIN",
    companyId: "4",
    mustChangePassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-cia-5",
    username: "cia5",
    password: "8bac1833e413ca851a14fcb2af6b593d5954fa418abdab0874f43c40baeab523",
    name: "5ª Cía. Bomba Curimón",
    role: "COMPANY_ADMIN",
    companyId: "5",
    mustChangePassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-cia-6",
    username: "cia6",
    password: "0a7cfa160934a32ed4103f40cde40f33792406583615ddf66688f57442f645ce",
    name: "6ª Cía. Bomba Panquehue (GERSA)",
    role: "COMPANY_ADMIN",
    companyId: "6",
    mustChangePassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-cia-7",
    username: "cia7",
    password: "89738b70acd71c8993d2130322550a85d6a39e21a163ed88ad4b785a232abae1",
    name: "7ª Cía. Rescate Agreste y Montaña",
    role: "COMPANY_ADMIN",
    companyId: "7",
    mustChangePassword: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];

let inMemoryUsers = [...DEFAULT_USERS];

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const body = req.body || {};
  const isChangePassword = req.query.action === 'change-password' || body.action === 'change-password';

  // ================= CASO 1: FALLBACK EN MEMORIA (SIN POSTGRES) =================
  if (!DATABASE_URL) {
    if (isChangePassword) {
      const { username, currentPassword, newPassword } = body;
      if (!username || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      }

      const idx = inMemoryUsers.findIndex(u => u.username.toLowerCase() === username.toLowerCase().trim());
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      }

      if (currentPassword && !verifyPassword(currentPassword, inMemoryUsers[idx].password)) {
        return res.status(401).json({ success: false, message: 'La contraseña actual no es válida.' });
      }

      inMemoryUsers[idx].password = hashPassword(newPassword);
      inMemoryUsers[idx].mustChangePassword = false;
      inMemoryUsers[idx].updatedAt = new Date().toISOString();

      return res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente.',
        user: {
          id: inMemoryUsers[idx].id,
          username: inMemoryUsers[idx].username,
          name: inMemoryUsers[idx].name,
          role: inMemoryUsers[idx].role,
          companyId: inMemoryUsers[idx].companyId,
          mustChangePassword: false
        }
      });
    }

    // Login en memoria
    const { username, password } = body;
    const cleanUser = (username || '').toLowerCase().trim();
    const user = inMemoryUsers.find(u => u.username.toLowerCase() === cleanUser);

    if (user && verifyPassword(password, user.password)) {
      return res.json({
        success: true,
        token: 'cbsf_auth_' + Buffer.from(user.username + ':' + Date.now()).toString('base64'),
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          companyId: user.companyId || null,
          mustChangePassword: user.mustChangePassword === true
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas. Compruebe usuario y contraseña.'
    });
  }

  // ================= CASO 2: CON POSTGRESQL (NEON) =================
  try {
    const sql = neon(DATABASE_URL);

    // Asegurar existencia de tabla users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role VARCHAR(30) NOT NULL,
        company_id VARCHAR(50),
        must_change_password BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Si la tabla está vacía, sembrar los 9 usuarios iniciales
    const countRes = await sql`SELECT COUNT(*)::int as count FROM users;`;
    if (countRes[0]?.count === 0) {
      for (const u of DEFAULT_USERS) {
        await sql`
          INSERT INTO users (id, username, password, name, role, company_id, must_change_password)
          VALUES (${u.id}, ${u.username}, ${u.password}, ${u.name}, ${u.role}, ${u.companyId}, ${u.mustChangePassword})
          ON CONFLICT (username) DO NOTHING;
        `;
      }
    }

    // Acción: Cambio de contraseña en Postgres
    if (isChangePassword) {
      const { username, currentPassword, newPassword } = body;
      if (!username || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      }

      const rows = await sql`SELECT * FROM users WHERE LOWER(username) = LOWER(${username.trim()}) LIMIT 1;`;
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado en la base de datos.' });
      }

      const u = rows[0];
      if (currentPassword && !verifyPassword(currentPassword, u.password)) {
        return res.status(401).json({ success: false, message: 'La contraseña actual no es correcta.' });
      }

      const hashedNew = hashPassword(newPassword);
      await sql`
        UPDATE users 
        SET password = ${hashedNew}, must_change_password = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${u.id};
      `;

      return res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente en PostgreSQL.',
        user: {
          id: u.id,
          username: u.username,
          name: u.name,
          role: u.role,
          companyId: u.company_id,
          mustChangePassword: false
        }
      });
    }

    // Acción: Login contra PostgreSQL
    const { username, password } = body;
    const cleanUser = (username || '').toLowerCase().trim();
    const rows = await sql`
      SELECT id, username, password, name, role, company_id as "companyId", must_change_password as "mustChangePassword"
      FROM users
      WHERE LOWER(username) = LOWER(${cleanUser})
      LIMIT 1;
    `;

    if (rows.length > 0 && verifyPassword(password, rows[0].password)) {
      const u = rows[0];
      return res.json({
        success: true,
        token: 'cbsf_auth_' + Buffer.from(u.username + ':' + Date.now()).toString('base64'),
        user: {
          id: u.id,
          username: u.username,
          name: u.name,
          role: u.role,
          companyId: u.companyId || null,
          mustChangePassword: u.mustChangePassword === true
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas. Compruebe usuario y contraseña.'
    });

  } catch (err) {
    console.error('Error en /api/auth con base de datos:', err);
    return res.status(500).json({ success: false, message: 'Error de conexión con la base de datos.' });
  }
}

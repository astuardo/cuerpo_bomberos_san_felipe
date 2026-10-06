import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const DEFAULT_USERS = [
  {
    id: "usr-admin",
    username: "admin",
    password: "bomberosanfelipe2026",
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
    password: "comandancia2026",
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
    password: "bombaaconcagua1",
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
    password: "internacional2",
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
    password: "sanfelipe3",
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
    password: "almendral4",
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
    password: "curimon5",
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
    password: "panquehue6",
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
    password: "sanfelipe7",
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

      if (currentPassword && inMemoryUsers[idx].password !== currentPassword) {
        return res.status(401).json({ success: false, message: 'La contraseña actual no es válida.' });
      }

      inMemoryUsers[idx].password = newPassword;
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

    if (user && user.password === password) {
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
      if (currentPassword && u.password !== currentPassword) {
        return res.status(401).json({ success: false, message: 'La contraseña actual no es correcta.' });
      }

      await sql`
        UPDATE users 
        SET password = ${newPassword}, must_change_password = FALSE, updated_at = CURRENT_TIMESTAMP
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

    if (rows.length > 0 && rows[0].password === password) {
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

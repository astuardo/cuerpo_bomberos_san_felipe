import { neon } from '@neondatabase/serverless';
import { DEFAULT_USERS } from './auth.js';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let inMemoryUsers = [...DEFAULT_USERS];

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Fallback si no hay PostgreSQL configurado
  if (!DATABASE_URL) {
    if (req.method === 'GET') {
      const sanitized = inMemoryUsers.map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        role: u.role,
        companyId: u.companyId || null,
        mustChangePassword: u.mustChangePassword === true,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      }));
      return res.json(sanitized);
    }

    if (req.method === 'POST') {
      const { id, username, name, role, companyId, password, resetPassword } = req.body || {};

      if (id) {
        const idx = inMemoryUsers.findIndex(u => u.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

        if (name) inMemoryUsers[idx].name = name;
        if (role) inMemoryUsers[idx].role = role;
        if (companyId !== undefined) inMemoryUsers[idx].companyId = companyId || null;

        if (resetPassword || password) {
          inMemoryUsers[idx].password = password || 'bombero2026';
          inMemoryUsers[idx].mustChangePassword = true;
        }

        inMemoryUsers[idx].updatedAt = new Date().toISOString();
        return res.json({ success: true, user: inMemoryUsers[idx] });
      }

      if (!username || !name || !role) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const cleanUser = username.toLowerCase().trim();
      if (inMemoryUsers.some(u => u.username.toLowerCase() === cleanUser)) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      const newUser = {
        id: 'usr-' + Date.now(),
        username: cleanUser,
        password: password || 'bombero2026',
        name,
        role,
        companyId: companyId || null,
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      inMemoryUsers.push(newUser);
      return res.status(201).json({ success: true, user: newUser });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const target = inMemoryUsers.find(u => u.id === id);
      if (!target) return res.status(404).json({ error: 'Usuario no encontrado' });
      if (target.username === 'admin') return res.status(400).json({ error: 'No se puede eliminar al Superadmin' });

      inMemoryUsers = inMemoryUsers.filter(u => u.id !== id);
      return res.json({ success: true, message: 'Usuario eliminado' });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Conexión con PostgreSQL en Neon
  try {
    const sql = neon(DATABASE_URL);

    // GET: Listar usuarios
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, username, name, role, company_id as "companyId", must_change_password as "mustChangePassword", created_at as "createdAt", updated_at as "updatedAt"
        FROM users
        ORDER BY created_at ASC;
      `;
      return res.json(rows);
    }

    // POST: Crear o Actualizar / Resetear contraseña
    if (req.method === 'POST') {
      const { id, username, name, role, companyId, password, resetPassword } = req.body || {};

      if (id) {
        if (resetPassword || password) {
          const pass = password || 'bombero2026';
          await sql`
            UPDATE users 
            SET name = COALESCE(${name}, name),
                role = COALESCE(${role}, role),
                company_id = ${companyId || null},
                password = ${pass},
                must_change_password = TRUE,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id};
          `;
        } else {
          await sql`
            UPDATE users 
            SET name = COALESCE(${name}, name),
                role = COALESCE(${role}, role),
                company_id = ${companyId || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id};
          `;
        }
        return res.json({ success: true, message: 'Usuario actualizado en PostgreSQL' });
      }

      // Crear usuario nuevo
      if (!username || !name || !role) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const cleanUser = username.toLowerCase().trim();
      const newId = 'usr-' + Date.now();
      const pass = password || 'bombero2026';

      await sql`
        INSERT INTO users (id, username, password, name, role, company_id, must_change_password)
        VALUES (${newId}, ${cleanUser}, ${pass}, ${name}, ${role}, ${companyId || null}, TRUE);
      `;

      return res.status(201).json({ success: true, message: 'Usuario creado en PostgreSQL', id: newId });
    }

    // DELETE: Eliminar usuario
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Falta el id del usuario' });

      const check = await sql`SELECT username FROM users WHERE id = ${id} LIMIT 1;`;
      if (check.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      if (check[0].username === 'admin') return res.status(400).json({ error: 'No se puede eliminar al Superadmin' });

      await sql`DELETE FROM users WHERE id = ${id};`;
      return res.json({ success: true, message: 'Usuario eliminado de PostgreSQL' });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('Error en /api/users:', err);
    return res.status(500).json({ error: 'Error de base de datos' });
  }
}

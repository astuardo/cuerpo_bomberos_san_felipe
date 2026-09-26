import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('[Security Warning] DATABASE_URL no está configurada en las variables de entorno.');
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = neon(DATABASE_URL);

    // POST: ACTUALIZAR ALERTA EN VIVO
    if (req.method === 'POST') {
      const { title, message, active, type } = req.body || {};
      const alertId = 'alert-1';
      const isAct = active !== undefined ? active : true;
      const t = title || 'ALERTA TEMPRANA PREVENTIVA';
      const m = message || '';
      const typ = type || 'warning';

      await sql`
        INSERT INTO alerts (id, active, type, title, message, updated_at)
        VALUES (${alertId}, ${isAct}, ${typ}, ${t}, ${m}, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          active = EXCLUDED.active,
          type = EXCLUDED.type,
          title = EXCLUDED.title,
          message = EXCLUDED.message,
          updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({
        id: alertId,
        active: isAct,
        type: typ,
        title: t,
        message: m
      });
    }

    // GET: OBTENER ALERTA ACTIVA
    const rows = await sql`
      SELECT id, active, type, title, message, updated_at AS "updatedAt"
      FROM alerts
      LIMIT 1;
    `;

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error en /api/alerts con Neon:', error);
    return res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
}

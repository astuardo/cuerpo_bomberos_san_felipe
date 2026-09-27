import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const DEFAULT_SLIDES = [
  {
    id: 'slide-1',
    tag: 'DESDE EL 11 DE MARZO DE 1883',
    title: 'CONSTANCIA Y DISCIPLINA AL SERVICIO DEL VALLE DE ACONCAGUA',
    subtitle: 'Más de 141 años protegiendo vidas y bienes en San Felipe, Curimón, Panquehue y sectores rurales con vocación 100% voluntaria.',
    bgImage: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Conoce las 7 Compañías',
    action: 'companias',
    order: 1
  },
  {
    id: 'slide-2',
    tag: 'FUERZA OPERATIVA MULTIDISCIPLINARIA',
    title: 'ESPECIALISTAS EN RESCATE SUBACUÁTICO Y AGRESTE',
    subtitle: 'Dotados de grupos de rescate técnico: unidad GERSA en el río Aconcagua, brigada forestal GTO y rescate agreste de montaña.',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Nuestras Especialidades',
    action: 'especialidades',
    order: 2
  },
  {
    id: 'slide-3',
    tag: 'CENTRAL DE ALARMAS Y DESPACHO 132',
    title: 'HASTA DAR LA VIDA SI FUERE NECESARIO',
    subtitle: 'Guardianes las 24 horas del día ante incendios estructurales, rescates en autopista CH-60 e incidentes con materiales peligrosos.',
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Últimas Noticias',
    action: 'noticias',
    order: 3
  }
];

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!DATABASE_URL) {
    if (req.method === 'GET') {
      return res.status(200).json(DEFAULT_SLIDES);
    }
    return res.status(200).json({ success: true, message: 'Operación en memoria local' });
  }

  try {
    const sql = neon(DATABASE_URL);

    // Asegurar tabla
    await sql`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id VARCHAR(50) PRIMARY KEY,
        tag VARCHAR(255) NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        bg_image TEXT NOT NULL,
        cta_primary VARCHAR(100),
        action VARCHAR(100),
        sort_order INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // DELETE SLIDE
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (id) {
        await sql`DELETE FROM hero_slides WHERE id = ${id};`;
        return res.status(200).json({ success: true, message: 'Diapositiva eliminada' });
      }
      return res.status(400).json({ error: 'Falta el id de la diapositiva' });
    }

    // POST: GUARDAR O ACTUALIZAR
    if (req.method === 'POST') {
      const body = req.body;

      // Si viene un arreglo completo de slides
      if (Array.isArray(body)) {
        for (let i = 0; i < body.length; i++) {
          const item = body[i];
          const id = item.id || ('slide-' + (i + 1));
          const tag = item.tag || '';
          const title = item.title || '';
          const subtitle = item.subtitle || '';
          const bgImage = item.bgImage || item.bg_image || '';
          const ctaPrimary = item.ctaPrimary || item.cta_primary || 'Ver más';
          const action = item.action || 'companias';
          const order = item.order || (i + 1);

          await sql`
            INSERT INTO hero_slides (id, tag, title, subtitle, bg_image, cta_primary, action, sort_order)
            VALUES (${id}, ${tag}, ${title}, ${subtitle}, ${bgImage}, ${ctaPrimary}, ${action}, ${order})
            ON CONFLICT (id) DO UPDATE SET
              tag = EXCLUDED.tag,
              title = EXCLUDED.title,
              subtitle = EXCLUDED.subtitle,
              bg_image = EXCLUDED.bg_image,
              cta_primary = EXCLUDED.cta_primary,
              action = EXCLUDED.action,
              sort_order = EXCLUDED.sort_order;
          `;
        }
        return res.status(200).json({ success: true, count: body.length });
      }

      // Si viene un solo slide
      const item = body || {};
      const id = item.id || ('slide-' + Date.now());
      const tag = item.tag || '';
      const title = item.title || '';
      const subtitle = item.subtitle || '';
      const bgImage = item.bgImage || item.bg_image || '';
      const ctaPrimary = item.ctaPrimary || item.cta_primary || 'Ver más';
      const action = item.action || 'companias';
      const order = item.order || 1;

      await sql`
        INSERT INTO hero_slides (id, tag, title, subtitle, bg_image, cta_primary, action, sort_order)
        VALUES (${id}, ${tag}, ${title}, ${subtitle}, ${bgImage}, ${ctaPrimary}, ${action}, ${order})
        ON CONFLICT (id) DO UPDATE SET
          tag = EXCLUDED.tag,
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          bg_image = EXCLUDED.bg_image,
          cta_primary = EXCLUDED.cta_primary,
          action = EXCLUDED.action,
          sort_order = EXCLUDED.sort_order;
      `;

      return res.status(200).json({ success: true, id });
    }

    // GET: LISTAR SLIDES
    const rows = await sql`
      SELECT 
        id, 
        tag, 
        title, 
        subtitle, 
        bg_image AS "bgImage", 
        cta_primary AS "ctaPrimary", 
        action, 
        sort_order AS "order"
      FROM hero_slides
      ORDER BY sort_order ASC, created_at ASC;
    `;

    if (!rows || rows.length === 0) {
      return res.status(200).json(DEFAULT_SLIDES);
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error en /api/slides:', error);
    return res.status(200).json(DEFAULT_SLIDES);
  }
}

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.warn('[Security Warning] Ni DATABASE_URL ni POSTGRES_URL están configuradas en las variables de entorno.');
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = neon(DATABASE_URL);

    // DELETE NOTICIA
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (id) {
        await sql`DELETE FROM news WHERE id = ${id};`;
        return res.status(200).json({ success: true, message: 'Noticia eliminada de la base de datos' });
      }
      return res.status(400).json({ error: 'Falta el id de la noticia' });
    }

    // POST: CREAR O ACTUALIZAR NOTICIA
    if (req.method === 'POST') {
      const item = req.body || {};
      const id = item.id || ('noticia-' + Date.now());
      const title = item.title || 'Nueva Noticia';
      const category = (item.category || 'ACTUALIDAD').toUpperCase();
      const date = item.date || new Date().toISOString().split('T')[0];
      const author = item.author || 'Prensa CBSF';
      const excerpt = item.excerpt || '';
      const content = item.content || '';
      const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80';
      const featured = item.featured === true || item.featured === 'true';
      const status = item.status || 'PUBLICADO';

      await sql`
        INSERT INTO news (id, title, category, date, author, excerpt, content, image_url, featured, status)
        VALUES (${id}, ${title}, ${category}, ${date}, ${author}, ${excerpt}, ${content}, ${imageUrl}, ${featured}, ${status})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          author = EXCLUDED.author,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          image_url = EXCLUDED.image_url,
          featured = EXCLUDED.featured,
          status = EXCLUDED.status;
      `;

      return res.status(201).json({
        id,
        title,
        category,
        date,
        author,
        excerpt,
        content,
        imageUrl,
        featured,
        status
      });
    }

    // GET: LISTAR NOTICIAS
    const rows = await sql`
      SELECT id, title, category, date, author, excerpt, content, image_url AS "imageUrl", featured, status
      FROM news
      ORDER BY date DESC, created_at DESC;
    `;

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error en /api/news con Neon:', error);
    return res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
}

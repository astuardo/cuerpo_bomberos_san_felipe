import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utilice POST.' });
  }

  try {
    const rawFilename = req.query.filename || `noticia-${Date.now()}.jpg`;
    const filename = decodeURIComponent(rawFilename).replace(/[^a-zA-Z0-9.-]/g, '_');

    // Comprobar token de Vercel Blob
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('[Vercel Blob] BLOB_READ_WRITE_TOKEN no está configurada.');
      return res.status(500).json({
        error: 'BLOB_READ_WRITE_TOKEN no configurada',
        message: 'Para subir imágenes a Vercel Blob, debes conectar una base Blob en Vercel (Pestaña Storage -> Blob).'
      });
    }

    // Leer el buffer del archivo enviado en el cuerpo de la petición
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length === 0) {
      return res.status(400).json({ error: 'El archivo enviado está vacío.' });
    }

    // Subir a Vercel Blob con acceso público
    const contentType = req.headers['content-type'] || 'image/jpeg';
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });

    // Retorna { url: 'https://...public.blob.vercel-storage.com/...', downloadUrl, pathname, ... }
    return res.status(200).json(blob);
  } catch (error) {
    console.error('Error al subir a Vercel Blob:', error);
    return res.status(500).json({
      error: 'Error al subir imagen a Vercel Blob',
      message: error.message
    });
  }
}

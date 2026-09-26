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

    // Buscar cualquier token de Vercel Blob disponible en las variables de entorno
    const tokenKey = Object.keys(process.env).find(
      k => k === 'BLOB_READ_WRITE_TOKEN' || k.endsWith('_READ_WRITE_TOKEN') || k.includes('BLOB_TOKEN')
    );
    const blobToken = tokenKey ? process.env[tokenKey] : process.env.BLOB_READ_WRITE_TOKEN;

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
    const putOptions = {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    };
    if (blobToken) {
      putOptions.token = blobToken;
    }

    const blob = await put(filename, buffer, putOptions);

    // Retorna { url: 'https://...public.blob.vercel-storage.com/...', downloadUrl, pathname, ... }
    return res.status(200).json(blob);
  } catch (error) {
    console.error('Error al subir a Vercel Blob:', error);
    const msg = error.message || '';
    const isMissingToken = msg.includes('No blob credentials found') || 
                           msg.includes('BLOB_READ_WRITE_TOKEN') ||
                           !process.env.BLOB_READ_WRITE_TOKEN;
    return res.status(500).json({
      error: 'Error al subir imagen a Vercel Blob',
      message: isMissingToken 
        ? 'El almacenamiento Vercel Blob no está conectado aún al proyecto en Vercel. Ve a la pestaña Storage en Vercel, conecta el Blob Store al proyecto y presiona Redeploy.'
        : msg
    });
  }
}

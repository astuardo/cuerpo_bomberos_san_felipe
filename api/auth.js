export default function handler(req, res) {
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

  const { username, password } = req.body || {};
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bomberosanfelipe2026';

  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      token: 'cbsf_auth_' + Buffer.from(ADMIN_USER + ':' + Date.now()).toString('base64'),
      user: {
        username: ADMIN_USER,
        name: 'Encargado de Comunicaciones y Prensa',
        role: 'Oficial de Relaciones Públicas'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Credenciales inválidas. Compruebe usuario y contraseña.'
  });
}

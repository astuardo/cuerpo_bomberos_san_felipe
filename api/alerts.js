export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    const { title, message, active, type } = req.body || {};
    return res.status(200).json({
      id: 'alert-' + Date.now(),
      title: title || 'ALERTA TEMPRANA PREVENTIVA',
      message: message || '',
      active: active !== undefined ? active : true,
      type: type || 'warning',
      updatedAt: new Date().toISOString()
    });
  }

  return res.status(200).json([
    {
      id: 'alert-1',
      active: true,
      type: 'warning',
      title: 'ALERTA TEMPRANA PREVENTIVA DE INCENDIOS',
      message: 'Condiciones de altas temperaturas y viento en el Valle de Aconcagua. Prohibidas las quemas agrícolas. Ante emergencias llame de inmediato al 132.',
      updatedAt: new Date().toISOString()
    }
  ]);
}

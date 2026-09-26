export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const INITIAL_NEWS = [
    {
      id: 'noticia-1',
      title: 'Cuerpo de Bomberos de San Felipe conmemora 141 años de historia y entrega voluntaria en el Valle de Aconcagua',
      category: 'ACTUALIDAD',
      date: '2026-09-24',
      author: 'Superintendencia CBSF',
      excerpt: 'Con un solemne acto y desfile de las 7 compañías frente a la Plaza de Armas, la institución conmemoró más de un siglo de ininterrumpida entrega hacia los vecinos.',
      content: "Con la presencia de autoridades regionales, representantes comunales y una masiva concurrencia ciudadana, el Cuerpo de Bomberos de San Felipe llevó a cabo su tradicional desfile de gala en honor a sus 141 años de vida institucional.\n\nEl Superintendente, Sr. David Guajardo Sandoval, junto al Comandante Walter Staforelli Delgado, destacaron el crecimiento técnico y humano de las 7 compañías que conforman el Cuerpo.",
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      status: 'PUBLICADO'
    },
    {
      id: 'noticia-2',
      title: 'Grupo GERSA de la Sexta Compañía realiza exhaustivo ejercicio de rescate en el Río Aconcagua',
      category: 'EMERGENCIAS',
      date: '2026-09-20',
      author: 'Comandancia CBSF',
      excerpt: 'Voluntarios especialistas practicaron técnicas de buceo, rastreo con sonar y rescate en aguas rápidas para optimizar tiempos de respuesta ante crecidas.',
      content: "En el sector de Panquehue, los buzos del Grupo Especializado en Rescate Subacuático (GERSA) de la Sexta Compañía ejecutaron una jornada intensiva de entrenamiento táctico en las aguas del río Aconcagua.\n\nBajo la supervisión de la Comandancia, las maniobras contemplaron simulación de búsqueda de personas extraviadas.",
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      status: 'PUBLICADO'
    },
    {
      id: 'noticia-3',
      title: 'Cuarta Compañía activa plan preventivo forestal ante temporada de altas temperaturas en El Almendral',
      category: 'CAPACITACIÓN',
      date: '2026-09-15',
      author: 'Capitanía 4ª Compañía',
      excerpt: 'Se instruyó a juntas de vecinos sobre despeje de vegetación e implementación de cortafuegos en sectores de interfaz rural del valle.',
      content: "La Cuarta Compañía 'Moisés del Fierro Arcaya', bajo su lema 'Vigentes a toda hora', desarrolló un taller comunitario enfocado en la prevención de incendios forestales para los habitantes de El Almendral.",
      imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      status: 'PUBLICADO'
    },
    {
      id: 'noticia-4',
      title: 'Segunda Compañía responde con éxito a simulacro de colisión de alta energía en la Ruta 60 CH',
      category: 'EMERGENCIAS',
      date: '2026-09-10',
      author: 'Área Operativa CBSF',
      excerpt: 'El ejercicio puso a prueba la coordinación entre Bomberos, SAMU Aconcagua y Carabineros para la extricación segura de pacientes atrapados.',
      content: "A la altura del enlace Curimón, la Segunda Compañía 'La Internacional' junto a personal médico de SAMU desarrollaron un simulacro de impacto de alta energía con múltiples lesionados.",
      imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      featured: false,
      status: 'PUBLICADO'
    },
    {
      id: 'noticia-5',
      title: 'Séptima Compañía capacita a su dotación en técnicas avanzadas de rescate agreste y cuerdas',
      category: 'CAPACITACIÓN',
      date: '2026-09-05',
      author: 'Escuela de Formación CBSF',
      excerpt: 'Instrucción intensiva en cerros tutelares de San Felipe con anclajes ecualizados y tirolesas para descenso vertical.',
      content: "La Séptima Compañía llevó adelante un taller de perfeccionamiento en rescate técnico vertical en las inmediaciones del cerro El Asiento.",
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      featured: false,
      status: 'PUBLICADO'
    }
  ];

  if (req.method === 'POST') {
    const item = req.body || {};
    const newItem = {
      id: 'noticia-' + Date.now(),
      title: item.title || 'Nueva Noticia',
      category: (item.category || 'ACTUALIDAD').toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      author: item.author || 'Prensa CBSF',
      excerpt: item.excerpt || '',
      content: item.content || '',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
      featured: !!item.featured,
      status: item.status || 'PUBLICADO'
    };
    return res.status(201).json(newItem);
  }

  return res.status(200).json(INITIAL_NEWS);
}

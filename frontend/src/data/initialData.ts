import { Company, EmergencyAlert, NewsItem, StatsData } from '../types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: '1',
    number: 1,
    name: 'Primera Compañía "Bomba Aconcagua"',
    shortName: '1ª Cía. Bomba Aconcagua',
    foundingDate: '11 de marzo de 1883',
    motto: 'Constancia y Abnegación',
    address: 'Calle Merced 832, San Felipe',
    phone: '(34) 251 8817',
    specialty: 'Agua, Zapadores, Escala y Salvamento',
    description: 'Compañía fundadora del Cuerpo de Bomberos de San Felipe y la institución bomberil más antigua de todo el Valle de Aconcagua. Custodia las tradiciones históricas y responde a incendios estructurales urbanos y salvamentos complejos.',
    units: ['B-1 (Bomba Urbana Pesada)', 'Q-1 (Unidad de Escala y Zapadores)', 'Z-1 (Cisterna Gran Caudal)'],
    captain: 'Rodrigo Silva Castro',
    director: 'Patricio Gómez Ahumada',
    color: '#C40000'
  },
  {
    id: '2',
    number: 2,
    name: 'Segunda Compañía "La Internacional"',
    shortName: '2ª Cía. La Internacional',
    foundingDate: '15 de octubre de 1895',
    motto: 'Unión y Sacrificio',
    address: 'Avenida Tacna Sur N° 22, San Felipe',
    phone: '(34) 251 2240',
    specialty: 'Rescate Vehicular y Agua',
    description: 'Fundada a finales del siglo XIX por inmigrantes y vecinos sanfelipeños. Especializada en la atención de rescates vehiculares de alta complejidad en las rutas del valle, así como control de incendios en zonas comerciales.',
    units: ['R-2 (Unidad de Rescate Vehicular Pesado)', 'B-2 (Carro Bomba de Primera Intervención)'],
    captain: 'Esteban Muñoz Vergara',
    director: 'Mauricio Vega Arancibia',
    color: '#1B4D3E'
  },
  {
    id: '3',
    number: 3,
    name: 'Tercera Compañía',
    shortName: '3ª Cía. San Felipe',
    foundingDate: '20 de mayo de 1938',
    motto: 'Disciplina y Deber',
    address: 'San Felipe Centro',
    phone: '(34) 251 3311',
    specialty: 'Extinción de Incendios y Abastecimiento',
    description: 'Unidad de ataque contraincendios dotada de moderno material mayor para abastecimiento en masa de agua en sectores con baja presión de grifos o áreas industriales del valle.',
    units: ['B-3 (Carro Bomba Urbano)', 'BT-3 (Bomba Nodriza 10.000 Litros)'],
    captain: 'Carlos Herrera Tapia',
    director: 'Fernando Cabrera Soto',
    color: '#003366'
  },
  {
    id: '4',
    number: 4,
    name: 'Cuarta Compañía "Moisés del Fierro Arcaya"',
    shortName: '4ª Cía. Bomba Almendral',
    foundingDate: '18 de septiembre de 1952',
    motto: 'Vigentes a toda hora',
    address: 'Calle Escultor Ambrosio Santelices N° 980, El Almendral',
    phone: '(34) 251 4455',
    specialty: 'Incendios Forestales / Grupo Técnico Operativo (GTO)',
    description: 'Ubicada en el tradicional y patrimonial sector de El Almendral. Especialistas acreditados en combate de incendios forestales e interfaz urbano-forestal en laderas y predios agrícolas de la provincia.',
    units: ['BF-4 (Bomba Forestal 4x4)', 'B-4 (Carro Bomba Multipropósito)'],
    captain: 'Jorge Henríquez Morales',
    director: 'Luis Delgado Riquelme',
    color: '#D35400'
  },
  {
    id: '5',
    number: 5,
    name: 'Quinta Compañía "Bomba Curimón"',
    shortName: '5ª Cía. Bomba Curimón',
    foundingDate: '12 de octubre de 1968',
    motto: 'Valor y Servicio',
    address: 'Calle Santiago Bueras s/n, Localidad de Curimón',
    phone: '(34) 253 1290',
    specialty: 'Cobertura Rural, Patrimonial y Ruta 60 CH',
    description: 'Resguarda el poblado histórico de Curimón, su convento colonial y una extensa zona de parcelaciones y predios rurales, además de ser primera respuesta en accidentes sobre la autopista CH-60.',
    units: ['B-5 (Bomba Urbana Mayor)', 'R-5 (Unidad de Apoyo Rápido)'],
    captain: 'Manuel Espinoza González',
    director: 'Guillermo Farías Castro',
    color: '#8E44AD'
  },
  {
    id: '6',
    number: 6,
    name: 'Sexta Compañía "Bomba Panquehue"',
    shortName: '6ª Cía. Bomba Panquehue',
    foundingDate: '24 de junio de 1994',
    motto: 'Superación y Entrega',
    address: 'Comuna de Panquehue (Nuevo Cuartel Panquehue)',
    phone: '(34) 259 8810',
    specialty: 'Rescate Subacuático (GERSA) y Rutas Viales',
    description: 'Asentada en Panquehue con modernas dependencias inauguradas recientemente. Cuenta con el Grupo Especializado de Rescate Subacuático (GERSA) con buzos tácticos certificados para emergencias en el río Aconcagua y canales de regadío.',
    units: ['B-6 (Carro Bomba)', 'RX-6 (Unidad de Rescate Técnico y Bote GERSA)'],
    captain: 'Cristóbal Pizarro Fuentes',
    director: 'Álvaro Miranda Rojas',
    color: '#00838F'
  },
  {
    id: '7',
    number: 7,
    name: 'Séptima Compañía',
    shortName: '7ª Cía. San Felipe',
    foundingDate: '14 de agosto de 2004',
    motto: 'Honor y Voluntad',
    address: 'San Felipe Oriente / Sector 21 de Mayo',
    phone: '(34) 251 7712',
    specialty: 'Rescate Agreste, Búsqueda en Montaña y Soporte',
    description: 'Especialistas en búsqueda, rescate y evacuación en zonas de difícil acceso agreste, quebradas y cerros del Valle de Aconcagua, equipados con cuerdas de alta montaña y camillas agrestes.',
    units: ['B-7 (Bomba de Ataque Rápido)', 'J-7 (Vehículo Táctico Agreste 4x4)'],
    captain: 'Felipe Salinas Toro',
    director: 'Ignacio Astudillo Peña',
    color: '#27AE60'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'noticia-1',
    title: 'Cuerpo de Bomberos de San Felipe conmemora 141 años de historia y entrega voluntaria en el Valle de Aconcagua',
    category: 'ACTUALIDAD',
    date: '2026-09-24',
    author: 'Superintendencia CBSF',
    excerpt: 'Con un solemne acto y desfile de las 7 compañías frente a la Plaza de Armas, la institución conmemoró más de un siglo de ininterrumpida entrega hacia los vecinos.',
    content: `Con la presencia de autoridades regionales, representantes comunales y una masiva concurrencia ciudadana, el Cuerpo de Bomberos de San Felipe llevó a cabo su tradicional desfile de gala en honor a sus 141 años de vida institucional.

El Superintendente, Sr. David Guajardo Sandoval, junto al Comandante Walter Staforelli Delgado, destacaron el crecimiento técnico y humano de las 7 compañías que conforman el Cuerpo: 'Hoy somos un referente en el Valle de Aconcagua gracias al compromiso desinteresado de nuestras voluntarias y voluntarios. San Felipe cuenta con personal altamente capacitado en rescate vehicular, incendios de interfaz, operaciones subacuáticas GERSA y rescate agreste'.

Durante la ceremonia se entregaron premios de constancia por 10, 20, 30 y más de 50 años de servicio, reconociendo la lealtad y el honor de quienes han dedicado sus vidas al lema de Abnegación y Sacrificio.`,
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
    content: `En el sector de Panquehue, los buzos del Grupo Especializado en Rescate Subacuático (GERSA) de la Sexta Compañía ejecutaron una jornada intensiva de entrenamiento táctico en las aguas del río Aconcagua.

Bajo la supervisión de la Comandancia, las maniobras contemplaron simulación de búsqueda de personas extraviadas, descenso en botes zodiac y protocolos de seguridad en corrientes variables.

'Nuestra misión es asegurar que los operadores cuenten con el más alto estándar de preparación para actuar de manera inmediata ante cualquier emergencia en el cauce del río o tranques de la provincia', afirmó el oficial a cargo.`,
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
    content: `La Cuarta Compañía 'Moisés del Fierro Arcaya', bajo su lema 'Vigentes a toda hora', desarrolló un taller comunitario enfocado en la prevención de incendios forestales para los habitantes de El Almendral y callejones adyacentes.

Los voluntarios explicaron la importancia del manejo de pastizales secos, la mantención de fuentes de agua y la denuncia inmediata al teléfono 132 frente a columnas de humo incipientes.

La unidad forestal BF-4 recorrió los puntos críticos para verificar rutas de evacuación y accesos a zonas rurales complejas.`,
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
    content: `A la altura del enlace Curimón, la Segunda Compañía 'La Internacional' junto a personal médico de SAMU desarrollaron un simulacro de impacto de alta energía con múltiples lesionados.

Se emplearon herramientas hidráulicas de última generación para corte de pilares y estabilización de carrocerías, logrando extraer a las víctimas ficticias en menos de 18 minutos.

La institución reafirma su compromiso de vigilancia constante en una de las rutas con mayor flujo vehicular de la región.`,
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
    content: `La Séptima Compañía llevó adelante un taller de perfeccionamiento en rescate técnico vertical en las inmediaciones del cerro El Asiento. Las cuadrillas pusieron a prueba sistemas de izaje, poleas de desmultiplicación y uso de camilla canasta para la extracción segura en terrenos escarpados.

Esta especialidad posiciona al Cuerpo de Bomberos de San Felipe como un pilar fundamental de socorro en senderos de trekking y excursión en el Valle de Aconcagua.`,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'PUBLICADO'
  }
];

export const INITIAL_STATS: StatsData = {
  companies: 7,
  firefighters: 465,
  yearsOfHistory: 141,
  annualEmergencies: 1350,
  volunteerPercentage: 100
};

export const INITIAL_ALERT: EmergencyAlert = {
  id: 'alert-1',
  active: true,
  type: 'warning',
  title: 'ALERTA TEMPRANA PREVENTIVA DE INCENDIOS',
  message: 'Condiciones de altas temperaturas y viento en el Valle de Aconcagua. Prohibidas las quemas agrícolas. Ante emergencias llame de inmediato al 132.',
  updatedAt: new Date().toISOString()
};

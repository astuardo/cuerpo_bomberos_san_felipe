export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const companies = [
    {
      id: "1",
      number: 1,
      name: "Primera Compañía \"Bomba Aconcagua\"",
      shortName: "1ª Cía. Bomba Aconcagua",
      foundingDate: "11 de marzo de 1883",
      motto: "Constancia y Abnegación",
      address: "Calle Merced 832, San Felipe",
      phone: "(34) 251 8817",
      specialty: "Agua, Zapadores, Escala y Salvamento",
      description: "Compañía fundadora del Cuerpo de Bomberos de San Felipe y la institución bomberil más antigua de todo el Valle de Aconcagua.",
      units: ["B-1 (Bomba Urbana Pesada)", "Q-1 (Unidad de Escala y Zapadores)", "Z-1 (Cisterna Gran Caudal)"],
      captain: "Rodrigo Silva Castro",
      director: "Patricio Gómez Ahumada",
      color: "#C40000"
    },
    {
      id: "2",
      number: 2,
      name: "Segunda Compañía \"La Internacional\"",
      shortName: "2ª Cía. La Internacional",
      foundingDate: "15 de octubre de 1895",
      motto: "Unión y Sacrificio",
      address: "Avenida Tacna Sur N° 22, San Felipe",
      phone: "(34) 251 2240",
      specialty: "Rescate Vehicular y Agua",
      description: "Fundada por vecinos e inmigrantes a fines del siglo XIX. Especializada en la atención de rescates vehiculares en las rutas del valle.",
      units: ["R-2 (Unidad de Rescate Vehicular Pesado)", "B-2 (Carro Bomba de Primera Intervención)"],
      captain: "Esteban Muñoz Vergara",
      director: "Mauricio Vega Arancibia",
      color: "#1B4D3E"
    },
    {
      id: "3",
      number: 3,
      name: "Tercera Compañía",
      shortName: "3ª Cía. San Felipe",
      foundingDate: "20 de mayo de 1938",
      motto: "Disciplina y Deber",
      address: "San Felipe Centro",
      phone: "(34) 251 3311",
      specialty: "Extinción de Incendios y Abastecimiento",
      description: "Unidad de ataque contraincendios dotada de moderno material mayor para abastecimiento en masa de agua.",
      units: ["B-3 (Carro Bomba Urbano)", "BT-3 (Bomba Nodriza 10.000 Litros)"],
      captain: "Carlos Herrera Tapia",
      director: "Fernando Cabrera Soto",
      color: "#003366"
    },
    {
      id: "4",
      number: 4,
      name: "Cuarta Compañía \"Moisés del Fierro Arcaya\"",
      shortName: "4ª Cía. Bomba Almendral",
      foundingDate: "18 de septiembre de 1952",
      motto: "Vigentes a toda hora",
      address: "Calle Escultor Ambrosio Santelices N° 980, El Almendral",
      phone: "(34) 251 4455",
      specialty: "Incendios Forestales / Grupo Técnico Operativo (GTO)",
      description: "Ubicada en El Almendral. Especialistas acreditados en combate de incendios forestales e interfaz urbano-forestal.",
      units: ["BF-4 (Bomba Forestal 4x4)", "B-4 (Carro Bomba Multipropósito)"],
      captain: "Jorge Henríquez Morales",
      director: "Luis Delgado Riquelme",
      color: "#D35400"
    },
    {
      id: "5",
      number: 5,
      name: "Quinta Compañía \"Bomba Curimón\"",
      shortName: "5ª Cía. Bomba Curimón",
      foundingDate: "12 de octubre de 1968",
      motto: "Valor y Servicio",
      address: "Calle Santiago Bueras s/n, Localidad de Curimón",
      phone: "(34) 253 1290",
      specialty: "Cobertura Rural, Patrimonial y Ruta 60 CH",
      description: "Resguarda el poblado histórico de Curimón, su convento colonial y la autopista CH-60.",
      units: ["B-5 (Bomba Urbana Mayor)", "R-5 (Unidad de Apoyo Rápido)"],
      captain: "Manuel Espinoza González",
      director: "Guillermo Farías Castro",
      color: "#8E44AD"
    },
    {
      id: "6",
      number: 6,
      name: "Sexta Compañía \"Bomba Panquehue\"",
      shortName: "6ª Cía. Bomba Panquehue",
      foundingDate: "24 de junio de 1994",
      motto: "Superación y Entrega",
      address: "Comuna de Panquehue (Nuevo Cuartel Panquehue)",
      phone: "(34) 259 8810",
      specialty: "Rescate Subacuático (GERSA) y Rutas Viales",
      description: "Asentada en Panquehue con el Grupo Especializado de Rescate Subacuático (GERSA) con buzos tácticos certificados para el río Aconcagua.",
      units: ["B-6 (Carro Bomba)", "RX-6 (Unidad de Rescate Técnico y Bote GERSA)"],
      captain: "Cristóbal Pizarro Fuentes",
      director: "Álvaro Miranda Rojas",
      color: "#00838F"
    },
    {
      id: "7",
      number: 7,
      name: "Séptima Compañía",
      shortName: "7ª Cía. San Felipe",
      foundingDate: "14 de agosto de 2004",
      motto: "Honor y Voluntad",
      address: "San Felipe Oriente / Sector 21 de Mayo",
      phone: "(34) 251 7712",
      specialty: "Rescate Agreste, Búsqueda en Montaña y Soporte",
      description: "Especialistas en búsqueda, rescate y evacuación en zonas de difícil acceso agreste, quebradas y cerros del Valle de Aconcagua.",
      units: ["B-7 (Bomba de Ataque Rápido)", "J-7 (Vehículo Táctico Agreste 4x4)"],
      captain: "Felipe Salinas Toro",
      director: "Ignacio Astudillo Peña",
      color: "#27AE60"
    }
  ];

  return res.status(200).json(companies);
}

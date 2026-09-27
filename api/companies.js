import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const DEFAULT_COMPANIES = [
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
    description: "Compañía fundadora del Cuerpo de Bomberos de San Felipe y la institución bomberil más antigua de todo el Valle de Aconcagua. Custodia las tradiciones históricas y responde a incendios estructurales urbanos y salvamentos complejos.",
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

let inMemoryCompanies = [...DEFAULT_COMPANIES];

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!DATABASE_URL) {
    if (req.method === 'POST') {
      const body = req.body;
      if (Array.isArray(body)) {
        inMemoryCompanies = body;
      } else if (body && (body.id || body.number)) {
        const idx = inMemoryCompanies.findIndex(c => c.id === body.id || c.number === body.number);
        if (idx >= 0) {
          inMemoryCompanies[idx] = { ...inMemoryCompanies[idx], ...body };
        } else {
          inMemoryCompanies.push(body);
        }
      }
      return res.status(200).json({ success: true, companies: inMemoryCompanies });
    }
    return res.status(200).json(inMemoryCompanies);
  }

  try {
    const sql = neon(DATABASE_URL);

    // Asegurar existencia de tabla en PostgreSQL
    await sql`
      CREATE TABLE IF NOT EXISTS companies (
        id VARCHAR(50) PRIMARY KEY,
        number INT NOT NULL,
        name TEXT NOT NULL,
        short_name TEXT NOT NULL,
        founding_date TEXT NOT NULL,
        motto TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        specialty TEXT NOT NULL,
        description TEXT NOT NULL,
        units JSONB DEFAULT '[]'::jsonb,
        captain TEXT NOT NULL,
        director TEXT NOT NULL,
        color VARCHAR(50) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Si la tabla está vacía, sembrar las 7 compañías
    const countResult = await sql`SELECT COUNT(*)::int as count FROM companies;`;
    if (countResult[0]?.count === 0) {
      for (const comp of DEFAULT_COMPANIES) {
        await sql`
          INSERT INTO companies (id, number, name, short_name, founding_date, motto, address, phone, specialty, description, units, captain, director, color)
          VALUES (
            ${comp.id}, 
            ${comp.number}, 
            ${comp.name}, 
            ${comp.shortName}, 
            ${comp.foundingDate}, 
            ${comp.motto}, 
            ${comp.address}, 
            ${comp.phone}, 
            ${comp.specialty}, 
            ${comp.description}, 
            ${JSON.stringify(comp.units)}::jsonb, 
            ${comp.captain}, 
            ${comp.director}, 
            ${comp.color}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    // POST: ACTUALIZAR O GUARDAR COMPAÑÍA EN BASE DE DATOS
    if (req.method === 'POST') {
      const body = req.body;

      if (Array.isArray(body)) {
        for (const comp of body) {
          await sql`
            INSERT INTO companies (id, number, name, short_name, founding_date, motto, address, phone, specialty, description, units, captain, director, color, updated_at)
            VALUES (
              ${comp.id}, 
              ${comp.number}, 
              ${comp.name}, 
              ${comp.shortName || comp.short_name}, 
              ${comp.foundingDate || comp.founding_date}, 
              ${comp.motto}, 
              ${comp.address}, 
              ${comp.phone}, 
              ${comp.specialty}, 
              ${comp.description}, 
              ${JSON.stringify(comp.units || [])}::jsonb, 
              ${comp.captain}, 
              ${comp.director}, 
              ${comp.color}, 
              CURRENT_TIMESTAMP
            )
            ON CONFLICT (id) DO UPDATE SET
              number = EXCLUDED.number,
              name = EXCLUDED.name,
              short_name = EXCLUDED.short_name,
              founding_date = EXCLUDED.founding_date,
              motto = EXCLUDED.motto,
              address = EXCLUDED.address,
              phone = EXCLUDED.phone,
              specialty = EXCLUDED.specialty,
              description = EXCLUDED.description,
              units = EXCLUDED.units,
              captain = EXCLUDED.captain,
              director = EXCLUDED.director,
              color = EXCLUDED.color,
              updated_at = CURRENT_TIMESTAMP;
          `;
        }
        return res.status(200).json({ success: true, count: body.length });
      }

      // Actualizar una compañía específica
      const comp = body || {};
      const id = String(comp.id || comp.number);
      const number = comp.number || parseInt(id) || 1;
      const name = comp.name || '';
      const shortName = comp.shortName || comp.short_name || '';
      const foundingDate = comp.foundingDate || comp.founding_date || '';
      const motto = comp.motto || '';
      const address = comp.address || '';
      const phone = comp.phone || '';
      const specialty = comp.specialty || '';
      const description = comp.description || '';
      const units = comp.units || [];
      const captain = comp.captain || '';
      const director = comp.director || '';
      const color = comp.color || '#C40000';

      await sql`
        INSERT INTO companies (id, number, name, short_name, founding_date, motto, address, phone, specialty, description, units, captain, director, color, updated_at)
        VALUES (
          ${id}, 
          ${number}, 
          ${name}, 
          ${shortName}, 
          ${foundingDate}, 
          ${motto}, 
          ${address}, 
          ${phone}, 
          ${specialty}, 
          ${description}, 
          ${JSON.stringify(units)}::jsonb, 
          ${captain}, 
          ${director}, 
          ${color}, 
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          number = EXCLUDED.number,
          name = EXCLUDED.name,
          short_name = EXCLUDED.short_name,
          founding_date = EXCLUDED.founding_date,
          motto = EXCLUDED.motto,
          address = EXCLUDED.address,
          phone = EXCLUDED.phone,
          specialty = EXCLUDED.specialty,
          description = EXCLUDED.description,
          units = EXCLUDED.units,
          captain = EXCLUDED.captain,
          director = EXCLUDED.director,
          color = EXCLUDED.color,
          updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({ success: true, company: { id, number, name, shortName, foundingDate, motto, address, phone, specialty, description, units, captain, director, color } });
    }

    // GET: LISTAR COMPAÑÍAS DESDE LA BD
    const rows = await sql`
      SELECT 
        id, 
        number, 
        name, 
        short_name AS "shortName", 
        founding_date AS "foundingDate", 
        motto, 
        address, 
        phone, 
        specialty, 
        description, 
        units, 
        captain, 
        director, 
        color
      FROM companies
      ORDER BY number ASC;
    `;

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error en /api/companies con Neon:', error);
    return res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
}

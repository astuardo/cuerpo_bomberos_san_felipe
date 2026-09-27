import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const DEFAULT_INSTITUTION = {
  superintendentName: 'David Nehemia Guajardo Sandoval',
  superintendentRole: 'Superintendente',
  superintendentBio: 'Representante legal y máxima autoridad directiva del Cuerpo de Bomberos de San Felipe.',
  commanderName: 'Walter Román Staforelli Delgado',
  commanderRole: 'Comandante',
  commanderBio: 'Jefe de las operaciones activas, despacho de unidades y disciplina de las 7 compañías.',
  historyParagraph1: 'El Cuerpo de Bomberos de San Felipe fue fundado el 11 de marzo de 1883 gracias al liderazgo del ciudadano y abogado don Moisés del Fierro y Arcaya, junto a vecinos progresistas que sintieron la imperiosa necesidad de dotar a la ciudad de una entidad organizada y voluntaria para proteger a las familias del Valle de Aconcagua.',
  historyParagraph2: 'A lo largo de las décadas, la institución se expandió desde su primera bomba hasta consolidar una fuerza de 7 compañías, abarcando no solo la comuna de San Felipe, sino también Curimón, El Almendral y la vecina comuna de Panquehue, incorporando unidades especializadas en rescate subacuático (GERSA) y rescate agreste cordillerano.',
  headquartersAddress: 'Calle Merced N° 832, San Felipe, Región de Valparaíso, Chile.',
  headquartersPhone: '(34) 251 8817',
  headquartersEmergency: '132'
};

let inMemoryInstitution = { ...DEFAULT_INSTITUTION };

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
      if (req.body) {
        inMemoryInstitution = { ...inMemoryInstitution, ...req.body };
      }
      return res.status(200).json({ success: true, institution: inMemoryInstitution });
    }
    return res.status(200).json(inMemoryInstitution);
  }

  try {
    const sql = neon(DATABASE_URL);

    // Asegurar tabla en PostgreSQL
    await sql`
      CREATE TABLE IF NOT EXISTS institution (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'institution-main',
        superintendent_name TEXT NOT NULL,
        superintendent_role TEXT NOT NULL,
        superintendent_bio TEXT NOT NULL,
        commander_name TEXT NOT NULL,
        commander_role TEXT NOT NULL,
        commander_bio TEXT NOT NULL,
        history_paragraph1 TEXT NOT NULL,
        history_paragraph2 TEXT,
        headquarters_address TEXT NOT NULL,
        headquarters_phone TEXT NOT NULL,
        headquarters_emergency TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Si está vacía, sembrar con valores predeterminados
    const countResult = await sql`SELECT COUNT(*)::int as count FROM institution;`;
    if (countResult[0]?.count === 0) {
      await sql`
        INSERT INTO institution (
          id, 
          superintendent_name, 
          superintendent_role, 
          superintendent_bio, 
          commander_name, 
          commander_role, 
          commander_bio, 
          history_paragraph1, 
          history_paragraph2, 
          headquarters_address, 
          headquarters_phone, 
          headquarters_emergency
        ) VALUES (
          'institution-main',
          ${DEFAULT_INSTITUTION.superintendentName},
          ${DEFAULT_INSTITUTION.superintendentRole},
          ${DEFAULT_INSTITUTION.superintendentBio},
          ${DEFAULT_INSTITUTION.commanderName},
          ${DEFAULT_INSTITUTION.commanderRole},
          ${DEFAULT_INSTITUTION.commanderBio},
          ${DEFAULT_INSTITUTION.historyParagraph1},
          ${DEFAULT_INSTITUTION.historyParagraph2},
          ${DEFAULT_INSTITUTION.headquartersAddress},
          ${DEFAULT_INSTITUTION.headquartersPhone},
          ${DEFAULT_INSTITUTION.headquartersEmergency}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // POST: GUARDAR CAMBIOS INSTITUCIONALES EN LA BD
    if (req.method === 'POST') {
      const data = req.body || {};
      const superintendentName = data.superintendentName || '';
      const superintendentRole = data.superintendentRole || 'Superintendente';
      const superintendentBio = data.superintendentBio || '';
      const commanderName = data.commanderName || '';
      const commanderRole = data.commanderRole || 'Comandante';
      const commanderBio = data.commanderBio || '';
      const historyParagraph1 = data.historyParagraph1 || '';
      const historyParagraph2 = data.historyParagraph2 || '';
      const headquartersAddress = data.headquartersAddress || '';
      const headquartersPhone = data.headquartersPhone || '';
      const headquartersEmergency = data.headquartersEmergency || '132';

      await sql`
        INSERT INTO institution (
          id, 
          superintendent_name, 
          superintendent_role, 
          superintendent_bio, 
          commander_name, 
          commander_role, 
          commander_bio, 
          history_paragraph1, 
          history_paragraph2, 
          headquarters_address, 
          headquarters_phone, 
          headquarters_emergency, 
          updated_at
        ) VALUES (
          'institution-main',
          ${superintendentName},
          ${superintendentRole},
          ${superintendentBio},
          ${commanderName},
          ${commanderRole},
          ${commanderBio},
          ${historyParagraph1},
          ${historyParagraph2},
          ${headquartersAddress},
          ${headquartersPhone},
          ${headquartersEmergency},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          superintendent_name = EXCLUDED.superintendent_name,
          superintendent_role = EXCLUDED.superintendent_role,
          superintendent_bio = EXCLUDED.superintendent_bio,
          commander_name = EXCLUDED.commander_name,
          commander_role = EXCLUDED.commander_role,
          commander_bio = EXCLUDED.commander_bio,
          history_paragraph1 = EXCLUDED.history_paragraph1,
          history_paragraph2 = EXCLUDED.history_paragraph2,
          headquarters_address = EXCLUDED.headquarters_address,
          headquarters_phone = EXCLUDED.headquarters_phone,
          headquarters_emergency = EXCLUDED.headquarters_emergency,
          updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({ success: true, institution: data });
    }

    // GET: LEER DIRECTAMENTE DESDE LA BD
    const rows = await sql`
      SELECT 
        superintendent_name AS "superintendentName",
        superintendent_role AS "superintendentRole",
        superintendent_bio AS "superintendentBio",
        commander_name AS "commanderName",
        commander_role AS "commanderRole",
        commander_bio AS "commanderBio",
        history_paragraph1 AS "historyParagraph1",
        history_paragraph2 AS "historyParagraph2",
        headquarters_address AS "headquartersAddress",
        headquarters_phone AS "headquartersPhone",
        headquarters_emergency AS "headquartersEmergency"
      FROM institution
      LIMIT 1;
    `;

    if (rows && rows.length > 0) {
      return res.status(200).json(rows[0]);
    }

    return res.status(200).json(DEFAULT_INSTITUTION);
  } catch (error) {
    console.error('Error en /api/institution con Neon:', error);
    return res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
}

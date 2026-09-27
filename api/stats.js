import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const DEFAULT_STATS = {
  companies: 7,
  firefighters: 465,
  yearsOfHistory: 141,
  annualEmergencies: 1350,
  volunteerPercentage: 100
};

let inMemoryStats = { ...DEFAULT_STATS };

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
        inMemoryStats = { ...inMemoryStats, ...req.body };
      }
      return res.status(200).json({ success: true, stats: inMemoryStats });
    }
    return res.status(200).json(inMemoryStats);
  }

  try {
    const sql = neon(DATABASE_URL);

    // Asegurar tabla en PostgreSQL
    await sql`
      CREATE TABLE IF NOT EXISTS site_stats (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'stats-main',
        companies INT NOT NULL,
        firefighters INT NOT NULL,
        years_of_history INT NOT NULL,
        annual_emergencies INT NOT NULL,
        volunteer_percentage INT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Si está vacía, sembrar con cifras iniciales
    const countResult = await sql`SELECT COUNT(*)::int as count FROM site_stats;`;
    if (countResult[0]?.count === 0) {
      await sql`
        INSERT INTO site_stats (
          id, 
          companies, 
          firefighters, 
          years_of_history, 
          annual_emergencies, 
          volunteer_percentage
        ) VALUES (
          'stats-main',
          ${DEFAULT_STATS.companies},
          ${DEFAULT_STATS.firefighters},
          ${DEFAULT_STATS.yearsOfHistory},
          ${DEFAULT_STATS.annualEmergencies},
          ${DEFAULT_STATS.volunteerPercentage}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // POST: GUARDAR ESTADÍSTICAS EN LA BD
    if (req.method === 'POST') {
      const data = req.body || {};
      const companies = parseInt(data.companies) || DEFAULT_STATS.companies;
      const firefighters = parseInt(data.firefighters) || DEFAULT_STATS.firefighters;
      const yearsOfHistory = parseInt(data.yearsOfHistory) || DEFAULT_STATS.yearsOfHistory;
      const annualEmergencies = parseInt(data.annualEmergencies) || DEFAULT_STATS.annualEmergencies;
      const volunteerPercentage = parseInt(data.volunteerPercentage) || DEFAULT_STATS.volunteerPercentage;

      await sql`
        INSERT INTO site_stats (
          id, 
          companies, 
          firefighters, 
          years_of_history, 
          annual_emergencies, 
          volunteer_percentage, 
          updated_at
        ) VALUES (
          'stats-main',
          ${companies},
          ${firefighters},
          ${yearsOfHistory},
          ${annualEmergencies},
          ${volunteerPercentage},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          companies = EXCLUDED.companies,
          firefighters = EXCLUDED.firefighters,
          years_of_history = EXCLUDED.years_of_history,
          annual_emergencies = EXCLUDED.annual_emergencies,
          volunteer_percentage = EXCLUDED.volunteer_percentage,
          updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({ 
        success: true, 
        stats: { companies, firefighters, yearsOfHistory, annualEmergencies, volunteerPercentage } 
      });
    }

    // GET: LEER DIRECTAMENTE DESDE LA BD
    const rows = await sql`
      SELECT 
        companies,
        firefighters,
        years_of_history AS "yearsOfHistory",
        annual_emergencies AS "annualEmergencies",
        volunteer_percentage AS "volunteerPercentage"
      FROM site_stats
      LIMIT 1;
    `;

    if (rows && rows.length > 0) {
      return res.status(200).json(rows[0]);
    }

    return res.status(200).json(DEFAULT_STATS);
  } catch (error) {
    console.error('Error en /api/stats con Neon:', error);
    return res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
}

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  return res.status(200).json({
    companies: 7,
    firefighters: 465,
    yearsOfHistory: 141,
    annualEmergencies: 1350,
    volunteerPercentage: 100
  });
}

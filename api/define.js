export default async function handler(req, res) {
  // CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check family password
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token !== process.env.FAMILY_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const word = req.query.word;
  if (!word) {
    return res.status(400).json({ error: 'Missing word parameter' });
  }

  try {
    const apiKey = process.env.MW_API_KEY;
    const url = `https://dictionaryapi.com/api/v3/references/sd2/json/${encodeURIComponent(word)}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch definition' });
  }
}

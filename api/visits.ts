import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.counterapi.dev/v1/archangelinux-portfolio/visits/up', {
      method: 'GET',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from counter API' });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Visits API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

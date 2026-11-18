// Vercel Serverless Function: Save and Fetch Story Votes from Supabase
export const config = { maxDuration: 15 };

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    return { url: url.replace(/\/+$/, ''), key };
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sb = getSupabaseConfig();
  if (!sb) {
    return res.status(200).json({ configured: false, message: 'Supabase environment variables not set' });
  }

  const headers = {
    apikey: sb.key,
    Authorization: `Bearer ${sb.key}`,
    'Content-Type': 'application/json'
  };

  try {
    // GET: Fetch all vote rows to calculate total scores and determine the winning story
    if (req.method === 'GET') {
      const resp = await fetch(`${sb.url}/rest/v1/story_votes?select=story_index,story_title`, { headers });
      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(resp.status).json({ error: errText || 'Failed to fetch votes' });
      }
      const rows = await resp.json();
      return res.status(200).json({ configured: true, votes: rows });
    }

    // POST: Insert 1 to 3 story votes
    if (req.method === 'POST') {
      const { votes } = req.body || {};
      if (!votes || !Array.isArray(votes) || votes.length === 0) {
        return res.status(400).json({ error: 'Votes array is required' });
      }

      const rows = votes.map(v => ({
        story_index: Number(v.story_index),
        story_title: String(v.story_title || ''),
        voter_id: v.voter_id ? String(v.voter_id) : null
      }));

      const resp = await fetch(`${sb.url}/rest/v1/story_votes`, {
        method: 'POST',
        headers: {
          ...headers,
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(rows)
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(resp.status).json({ error: errText || 'Failed to save votes' });
      }

      return res.status(200).json({ success: true, count: rows.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

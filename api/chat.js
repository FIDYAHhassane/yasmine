export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  const apiKey = process.env.CODECRAFT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API non configurée sur le serveur Vercel.' });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Le champ "message" est obligatoire.' });
    }

    const response = await fetch('https://codecraftapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'GPT-5.6 Luna',
        messages: [
          { role: 'system', content: "Vous êtes l'assistant IA officiel d'IvoireFoot Market." },
          { role: 'user', content: message }
        ]
      })
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: 'CodeCraft a renvoyé du HTML, pas du JSON',
        status: response.status,
        url: response.url,
        extrait: text.slice(0, 300)
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erreur CodeCraft', details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la communication avec l'API.", details: error.message });
  }
}

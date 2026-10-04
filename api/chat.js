export default async function handler(req, res) {
  // Accepter uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  // Vérification de la présence de la clé API d'environnement
  const apiKey = process.env.CODECRAFT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API non configurée sur le serveur Vercel.' });
  }

  try {
    const { message } = req.body;

    // Appel à l'API distante depuis le serveur Vercel
    const response = await fetch('https://codecraftapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'GPT-5.6 Luna',
        messages: [
          { role: 'system', content: 'Vous êtes l\'assistant IA officiel d\'IvoireFoot Market.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la communication avec l\'API.', details: error.message });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { prompt, context } = req.body || {};

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await r.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      null;

    if (!text) {
      return res.status(500).json({ error: "Resposta inesperada", raw: data });
    }

    return res.status(200).json({ text });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Falha no servidor" });
  }
}

// api/ask.js — versão correta para Vercel Serverless

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const { prompt } = req.body;  // <<< AQUI É O CERTO NA VERCEL

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "A IA não retornou texto.";

    return res.status(200).json({ text });

  } catch (error) {
    console.error("Erro na IA:", error);
    return res.status(500).json({ error: "Falha ao conectar à IA." });
  }
}
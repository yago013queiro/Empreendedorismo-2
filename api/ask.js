export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        error: "GROQ_API_KEY não configurada. Adicione em Vercel Dashboard → Environment Variables"
      });
    }

    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Campo 'prompt' é obrigatório" });
    }

    // Endpoint do Groq
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // modelo rápido e barato
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1024
      })
    });

    const data = await
      response.json();

    if (!response.ok) {
      console.error("Erro da IA:", data);
      return res.status(500).json({ error: data.error?.message || "Erro ao conectar à IA" });
    }
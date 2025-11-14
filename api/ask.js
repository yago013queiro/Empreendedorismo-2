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

    // API do Groq (grátis, sem limites, super rápido)
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Groq API:", {
        status: response.status,
        data
      });
      return res.status(response.status).json({
        error: `Erro Groq (${response.status}): ${data?.error?.message || JSON.stringify(data)}`
      });
    }

    // Extrair texto da resposta
    const text = data?.choices?.[0]?.message?.content || null;

    if (!text) {
      return res.status(200).json({ text: "Desculpe, não consegui gerar uma resposta." });
    }

    return res.status(200).json({ text });

  } catch (err) {
    console.error("Erro no servidor:", err.message);
    return res.status(500).json({
      error: `Erro no servidor: ${err.message}`
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

    if (!CLAUDE_API_KEY) {
      return res.status(500).json({
        error: "CLAUDE_API_KEY não configurada. Adicione em Vercel Dashboard → Environment Variables"
      });
    }

    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Campo 'prompt' é obrigatório" });
    }

    // API correta do Claude (v1/messages - modelo atual)
    const endpoint = "https://api.anthropic.com/v1/messages";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    // Log de erro para debugar
    if (!response.ok) {
      console.error("Erro Claude API:", {
        status: response.status,
        data
      });
      return res.status(response.status).json({
        error: `Erro Claude (${response.status}): ${data?.error?.message || JSON.stringify(data)}`
      });
    }

    // Extrair texto da resposta correta
    const text = data?.content?.[0]?.text || null;

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

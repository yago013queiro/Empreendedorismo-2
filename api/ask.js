export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

    if (!CLAUDE_API_KEY) {
      return res.status(500).json({
        error: "CLAUDE_API_KEY não configurada"
      });
    }

    const endpoint = "https://api.anthropic.com/v1/complete";

    const prompt = `\n\nHuman: ${req.body.prompt}\n\nAssistant:`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY
      },
      body: JSON.stringify({
        model: "claude-2.1", 
        prompt,
        max_tokens_to_sample: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Claude API:", data);
      return res.status(response.status).json({
        error: data?.error?.message || JSON.stringify(data)
      });
    }

    const text = data?.completion || data?.completion?.text || data?.output || data?.response || null;

    if (!text) {
      return res.status(200).json({ text: "Desculpe, não consegui gerar uma resposta." });
    }

    return res.status(200).json({ text });

  } catch (err) {
    console.error("Erro no servidor:", err);
    return res.status(500).json({ 
      error: "Erro no servidor: " + err.message 
    });
  }
}

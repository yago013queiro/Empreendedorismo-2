export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY não configurada" 
      });
    }

    const GEMINI_MODEL = "gemini-1.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          role: "user", 
          parts: [{ text: req.body.prompt }] 
        }]
      })
    });

    const data = await response.json();

    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error("Erro Gemini API:", data);
      return res.status(response.status).json({ 
        error: data?.error?.message || "Erro na API do Gemini" 
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

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

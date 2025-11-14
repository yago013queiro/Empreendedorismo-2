export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const HF_API_KEY = process.env.HF_API_KEY;

    if (!HF_API_KEY) {
      return res.status(500).json({
        error: "HF_API_KEY não configurada. Adicione em Vercel Dashboard → Environment Variables"
      });
    }

    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Campo 'prompt' é obrigatório" });
    }

    // API Hugging Face (grátis e confiável)
    const endpoint = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro HF API:", {
        status: response.status,
        data
      });
      return res.status(response.status).json({
        error: `Erro IA (${response.status}): ${data?.error || JSON.stringify(data)}`
      });
    }

    // Extrair texto da resposta
    let text = null;
    if (Array.isArray(data) && data[0]) {
      text = data[0]?.generated_text || null;
      // Remover o prompt da resposta (HF retorna com o prompt incluído)
      if (text && text.includes(prompt)) {
        text = text.replace(prompt, "").trim();
      }
    }

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

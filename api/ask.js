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

    // Usar o Hugging Face Router (endpoint novo recomendado)
    const endpoint = "https://router.huggingface.co/hf-inference";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7
        }
      })
    });

    // Ler resposta com segurança: só parsear JSON se o content-type indicar
    let data = null;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error("Erro ao parsear JSON da HF API:", parseErr);
        const text = await response.text();
        return res.status(502).json({ error: `Erro ao interpretar resposta da IA: ${text}` });
      }
    } else {
      // resposta não-JSON (ex: "Not Found" ou HTML)
      const textBody = await response.text();
      if (!response.ok) {
        console.error("Erro HF API (não-JSON):", { status: response.status, body: textBody });
        return res.status(response.status).json({ error: `Erro IA (${response.status}): ${textBody}` });
      }
      // caso seja 200 mas texto simples, usar esse texto como resposta
      data = textBody;
    }

    // Extrair texto da resposta (suportando formatos distintos do router)
    let text = null;

    if (Array.isArray(data) && data[0]) {
      text = data[0].generated_text || data[0].text || null;
    }

    if (!text && data && typeof data === 'object') {
      text = data.generated_text || data.text || (Array.isArray(data.outputs) && data.outputs[0]?.text) || null;
    }

    // Se o modelo ecoou o prompt, remover para ficar só a resposta
    if (text && prompt && text.includes(prompt)) {
      text = text.replace(prompt, "").trim();
    }

    if (!text) {
      // Se data for string, devolver como texto cru
      if (typeof data === 'string' && data.trim()) {
        return res.status(200).json({ text: data.trim() });
      }
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

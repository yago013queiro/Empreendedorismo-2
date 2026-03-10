export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const { prompt, context } = req.body;

    let systemPrompt = `Você é uma assistente educacional focada no aprendizado.
Explique tudo de forma clara, objetiva e voltada para um estudante.
Use exemplos simples quando necessário.`;

    if (context) {
      const { area, linguagem, nivel } = context;
      if (area === 'programacao') {
        systemPrompt = `Você é um tutor especialista em programação, focado na linguagem ${linguagem || 'C'}.
O seu aluno está no nível ${nivel === 'faculdade' ? 'Universitário' : 'Ensino Médio'}.
Adapte sua explicação para esse nível acadêmico. Sempre que possível, mostre pequenos trechos de código comentados.`;
      } else if (area === 'materias') {
        systemPrompt = `Você é um professor de suporte escolar para matérias gerais.
O seu aluno está no nível ${nivel === 'faculdade' ? 'Universitário' : 'Ensino Médio'}.
Explique os conceitos de forma didática, usando analogias do dia a dia.`;
      } else if (area === 'estudo') {
        systemPrompt = `Você é um mentor de técnicas de estudo e produtividade.
Ajude o aluno (nível ${nivel === 'faculdade' ? 'Universitário' : 'Ensino Médio'}) a organizar seu tempo e entender melhor como aprender.`;
      }
    }

    if (!prompt) {
      return res.status(400).json({ error: "Campo 'prompt' é obrigatório" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        max_tokens: 400
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da Groq:", data);
      return res.status(500).json({ error: data.error?.message || "Erro desconhecido da Groq" });
    }

    const text = data.choices?.[0]?.message?.content || "Erro ao gerar resposta.";

    return res.status(200).json({ text });

  } catch (err) {
    console.error("ERRO NO SERVIDOR:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

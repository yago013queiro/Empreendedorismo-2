import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
Você é uma assistente educacional focada no aprendizado.
Explique tudo de forma clara, objetiva e voltada para um estudante.
Use exemplos simples quando necessário.
`;

export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });

    const texto = completion.choices[0].message.content;

    res.status(200).json({ output: texto });

  } catch (err) {
    res.status(500).json({ error: "Erro interno da IA" });
  }
}

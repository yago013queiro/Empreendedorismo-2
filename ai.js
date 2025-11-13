const GEMINI_API_KEY = "AIzaSyC13BHfl3aYpMqJ9Azjc0-TtwcsYltRJ6w";

async function askGemini(prompt) {
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar resposta.";
}

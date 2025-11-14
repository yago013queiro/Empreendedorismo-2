const API_KEY = "SUA_API_KEY_AQUI";  
const MODEL = "gemini-1.5-flash";

async function askGemini(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    return "❌ Erro desconhecido da IA.";
  } catch (error) {
    console.error(error);
    return "❌ Erro ao conectar à IA.";
  }
}

async function checkIAStatus() {
  const test = await askGemini("ping");
  return test && !test.includes("❌");
}

window.askGemini = askGemini;
window.checkIAStatus = checkIAStatus;

const GEMINI_API_KEY = "AIzaSyC0uUbZQcSlMc7jJwiP3DJjWj7eUz0-wew";
async function askGemini(prompt) {
  try {
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

    // Extrai o texto gerado
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.error("Erro ao conectar à IA:", err);
    return null;
  }
}

// === Verifica se a IA está online ===
async function checkIAStatus() {
  try {
    const test = await askGemini("teste rápido");
    // Se retornou alguma resposta de texto, considera OK
    return !!test;
  } catch {
    return false;
  }
}

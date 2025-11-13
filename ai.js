async function askGemini(prompt) {
  try {
    const res = await fetch("/api/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
});
    const data = await res.json();
    return data.text || "Não entendi a resposta da IA.";
  } catch (err) {
    console.error("Erro ao conectar com a IA:", err);
    return null;
  }
}

// Testa se o servidor responde
async function checkIAStatus() {
  const test = await askGemini("teste rápido");
  return test !== null;
}

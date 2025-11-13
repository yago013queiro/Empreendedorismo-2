// ===============================
// MENTECH.AI - CLIENTE (Frontend)
// Chama o backend da Vercel
// ===============================

async function askGemini(prompt) {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    return data.text || null;

  } catch (err) {
    console.error("❌ Erro IA (frontend):", err);
    return null;
  }
}

async function checkIAStatus() {
  const teste = await askGemini("teste rápido");
  return teste !== null;
}

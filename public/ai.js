
async function askClaude(prompt) {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Erro da IA:", data.error);
      return `❌ ${data.error || "Erro ao conectar à IA"}`;
    }
    
    return data.text || "❌ Sem resposta da IA.";
  } catch (error) {
    console.error("Erro ao chamar /api/ask:", error);
    return "❌ Erro de conexão com o servidor.";
  }
}

async function checkIAStatus() {
  try {
    const r = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "teste" })
    });
    return r.ok;
  } catch (e) {
    return false;
  }
}

window.askClaude = askClaude;
window.checkIAStatus = checkIAStatus;

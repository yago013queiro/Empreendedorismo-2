// Teste local da função serverless
async function testarAsk() {
  try {
    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Olá, quem é você?' })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resposta:', data);
  } catch (err) {
    console.error('Erro:', err.message);
  }
}

testarAsk();

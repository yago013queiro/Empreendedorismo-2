/**
 * MENTECH.AI - Cérebro Central
 * Lógica de estado, navegação, chat e interface.
 */

// --- Estado da Aplicação ---
const state = {
  area: null,
  linguagem: null,
  nivel: null
};

const LANG_DATA = {
  "C": {
    title: "C — Linguagem C",
    img: "https://cdn.pixabay.com/photo/2016/06/06/17/05/c-programming-1436536_1280.jpg",
    desc: "C é clássica, ótima para entender lógica e memória. Excelente para sistemas e fundamentos.",
    points: ["Sintaxe básica", "Ponteiros e memória", "Funções e estruturas", "Compilação com gcc"],
    code: `#include <stdio.h>\n\nint main() {\n  printf("Olá, MENTECH!\\n");\n  return 0;\n}`
  },
  "Java": {
    title: "Java — Linguagem Java",
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2f8d886e41b9bc2a6d8a7a4f1dfb4a50",
    desc: "Java é orientada a objetos, usada em aplicações e servidores — ótima para OOP.",
    points: ["Classes e objetos", "Herança e polimorfismo", "Coleções", "Compilação com javac"],
    code: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Olá, MENTECH!");\n  }\n}`
  },
  "Python": {
    title: "Python — Linguagem Python",
    img: "https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg",
    desc: "Python é simples e poderosa — ideal para iniciantes e scripts rápidos.",
    points: ["Sintaxe simples", "Bibliotecas ricas", "Interpretação imediata", "Ideal para protótipos"],
    code: `print("Olá, MENTECH!")`
  }
};

// --- Funções Globais (Disponíveis para o HTML imediatamente) ---

window.goToPage = function(id) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => {
    p.classList.remove('active');
    if (p.id === id) p.classList.add('active');
  });
  updateChips();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.setArea = function(a) { 
  state.area = a; 
  updateChips(); 
};

window.setLinguagem = function(l) { 
  state.linguagem = l; 
  updateChips(); 
};

window.setNivel = function(n) { 
  state.nivel = n; 
  updateChips(); 
  window.goToPage('page-chat'); 
};

window.prepareChat = function() {
  if (!state.area) { 
    alert('Escolha a área primeiro!'); 
    window.goToPage('page-escolha'); 
    return; 
  }
  if (state.area === 'programacao' && !state.linguagem) { 
    alert('Escolha a linguagem!'); 
    window.goToPage('page-programacao'); 
    return; 
  }
  if (!state.nivel) { 
    window.goToPage('page-nivel'); 
    return; 
  }
  window.goToPage('page-chat');
};

window.openLangOverlay = function(key) {
  const data = LANG_DATA[key];
  if (!data) return;

  const overlay = document.getElementById('lang-overlay');
  const langTitle = document.getElementById('lang-title');
  const langDesc = document.getElementById('lang-desc');
  const langImg = document.getElementById('lang-img');
  const langCode = document.getElementById('lang-code');
  const langPoints = document.getElementById('lang-points');

  langTitle.textContent = data.title;
  langDesc.textContent = data.desc;
  langImg.src = data.img;
  langCode.textContent = '';
  langPoints.innerHTML = '';
  
  data.points.forEach(p => { 
    const li = document.createElement('li'); 
    li.textContent = p; 
    langPoints.appendChild(li); 
  });

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');

  let i = 0;
  const codeStr = data.code;
  function step() {
    if (i <= codeStr.length) {
      langCode.textContent = codeStr.slice(0, i);
      i++;
      setTimeout(step, 10);
    }
  }
  step();

  state.linguagem = key;
  updateChips();
};

window.closeLangOverlay = function() {
  document.getElementById('lang-overlay').classList.remove('open');
};

window.proceedFromOverlay = function() {
  window.closeLangOverlay();
  window.goToPage('page-nivel');
};

window.copyCode = function() {
  const langCode = document.getElementById('lang-code');
  navigator.clipboard?.writeText(langCode.textContent).then(() => alert('Copiado!'));
};

window.sendMessage = async function() {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const prompt = input.value.trim();

  if (!prompt) return;

  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.innerHTML = `<div class="bubble">${prompt}</div>`;
  messages.appendChild(userMsg);
  
  input.value = '';
  messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });

  const typingMsg = document.createElement('div');
  typingMsg.className = 'message ai typing';
  typingMsg.innerHTML = `<div class="bubble">...</div>`;
  messages.appendChild(typingMsg);
  messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context: state })
    });

    const data = await res.json();
    typingMsg.remove();

    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai';
    marked.setOptions({ breaks: true, gfm: true });
    aiMsg.innerHTML = `<div class="bubble">${marked.parse(data.text || "❌ Erro.")}</div>`;
    messages.appendChild(aiMsg);
    
    aiMsg.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
    setTimeout(() => messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' }), 100);
  } catch (error) {
    typingMsg.remove();
    alert('Erro de conexão.');
  }
};

window.clearChat = function() {
  document.getElementById('chat-messages').innerHTML = '<div class="message ai"><div class="bubble">Chat limpo!</div></div>';
};

function updateChips() {
  const area = document.getElementById('chip-area');
  const lang = document.getElementById('chip-lang');
  const level = document.getElementById('chip-level');
  if (area) area.textContent = state.area ? state.area.toUpperCase() : '—';
  if (lang) lang.textContent = state.linguagem || '—';
  if (level) level.textContent = state.nivel ? (state.nivel === 'medio' ? 'MÉDIO' : 'FACULDADE') : '—';
}

// --- Inicialização de Eventos Fixos ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('brand-logo')?.addEventListener('click', () => window.goToPage('page-home'));
  document.getElementById('toggle-theme')?.addEventListener('click', () => document.body.classList.toggle('light-mode'));
  
  const input = document.getElementById('chat-input');
  if (input) {
    input.addEventListener('keypress', e => { if (e.key === 'Enter') window.sendMessage(); });
  }
  
  console.log('MENTECH.AI carregado com sucesso!');
});

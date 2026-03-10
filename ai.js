/**
 * MENTECH.AI - Cérebro Central
 * Contém toda a lógica de estado, navegação, chat e controles de interface.
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

// --- Navegação ---
function goToPage(id) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => {
    p.classList.remove('active', 'page-in', 'page-out');
    if (p.id === id) {
      p.classList.add('active', 'page-in');
    } else {
      p.classList.add('page-out');
    }
  });
  updateChips();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setArea(a) { 
  state.area = a; 
  updateChips(); 
}

function setLinguagem(l) { 
  state.linguagem = l; 
  updateChips(); 
}

function setNivel(n) { 
  state.nivel = n; 
  updateChips(); 
  goToPage('page-chat'); 
}

function updateChips() {
  const area = document.getElementById('chip-area');
  const lang = document.getElementById('chip-lang');
  const level = document.getElementById('chip-level');
  if (area) area.textContent = state.area || '—';
  if (lang) lang.textContent = state.linguagem || '—';
  if (level) level.textContent = state.nivel || '—';
}

// --- Overlay de Linguagens ---
function openLangOverlay(key) {
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

  // Efeito de digitação no código
  let i = 0;
  const codeStr = data.code;
  langCode.textContent = '';
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
}

function closeLangOverlay() {
  const overlay = document.getElementById('lang-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
}

function proceedFromOverlay() {
  closeLangOverlay();
  goToPage('page-nivel');
}

function copyCode() {
  const langCode = document.getElementById('lang-code');
  const txt = langCode.textContent;
  navigator.clipboard?.writeText(txt)
    .then(() => alert('Código copiado!'))
    .catch(() => alert('Não foi possível copiar.'));
}

// --- Chat e IA ---
async function askGroq(prompt) {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        context: {
          area: state.area,
          linguagem: state.linguagem,
          nivel: state.nivel
        }
      })
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        return "❌ **Erro de configuração:** A chave da API do Groq não está configurada. Verifique se o arquivo `.env` existe e contém a chave `GROQ_API_KEY`.";
      }
      return `❌ **Erro do servidor:** ${data.error || "Erro desconhecido"}`;
    }

    return data.text || "❌ Sem resposta da IA.";
  } catch (error) {
    console.error('Erro na API:', error);
    return "❌ **Erro de conexão:** Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
  }
}
          nivel: state.nivel
        }
      })
    });

    const data = await res.json();
    if (!res.ok) return `❌ ${data.error || "Erro ao conectar à IA"}`;
    return data.text || "❌ Sem resposta da IA.";
  } catch (error) {
    return "❌ Erro de conexão com o servidor.";
  }
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const prompt = input.value.trim();

  if (!prompt) return;

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const prompt = input.value.trim();

  if (!prompt) return;

  // Mensagem do Usuário
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.innerHTML = `<div class="bubble">${prompt}</div>`;
  messages.appendChild(userMsg);

  input.value = '';

  // Scroll para a nova mensagem
  messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });

  // Indicador de Digitação
  const typingMsg = document.createElement('div');
  typingMsg.className = 'message ai typing';
  typingMsg.innerHTML = `<div class="bubble"><span class="typing-dots">Digitando<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span></div>`;
  messages.appendChild(typingMsg);
  messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });

  try {
    const response = await askGroq(prompt);
    typingMsg.remove();

    // Mensagem da IA formatada
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai';

    // Configurar marked para melhor formatação
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false
    });

    const htmlContent = marked.parse(response);
    aiMsg.innerHTML = `<div class="bubble">${htmlContent}</div>`;

    messages.appendChild(aiMsg);

    // Aplicar highlight.js nos blocos de código
    aiMsg.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });

    // Scroll para o final
    setTimeout(() => {
      messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
    }, 100);

  } catch (error) {
    console.error('Erro no chat:', error);
    typingMsg.remove();

    const errorMsg = document.createElement('div');
    errorMsg.className = 'message ai error';
    errorMsg.innerHTML = `<div class="bubble">⚠️ Erro ao conectar com a IA. Verifique sua conexão e tente novamente.</div>`;
    messages.appendChild(errorMsg);
  }
}
}

function clearChat() {
  const messages = document.getElementById('chat-messages');
  messages.innerHTML = `
    <div class="message ai">
      <div class="bubble">🧹 Chat limpo! Qual sua dúvida sobre ${state.area || 'seus estudos'}?</div>
    </div>
  `;
}

function prepareChat() {
  // Verificar se área foi escolhida
  if (!state.area) {
    alert('❌ Por favor, escolha uma área primeiro (Programação, Matérias Gerais ou Dicas de Estudo).');
    goToPage('page-escolha');
    return;
  }

  // Verificar linguagem se for programação
  if (state.area === 'programacao' && !state.linguagem) {
    alert('❌ Para programação, escolha uma linguagem (C, Java ou Python) primeiro.');
    goToPage('page-programacao');
    return;
  }

  // Verificar nível
  if (!state.nivel) {
    alert('❌ Por favor, selecione seu nível de estudo (Ensino Médio ou Faculdade).');
    goToPage('page-nivel');
    return;
  }

  // Tudo OK, ir para o chat
  goToPage('page-chat');

  // Focar no input do chat
  setTimeout(() => {
    document.getElementById('chat-input').focus();
  }, 300);
}

// --- Controles de Tema e Fonte ---
const UI_Controls = {
  applyStoredSettings() {
    const theme = localStorage.getItem('site-theme');
    const font = localStorage.getItem('site-font-size');
    if (theme === 'light') document.body.classList.add('light-mode');
    if (font) document.documentElement.style.fontSize = font + 'px';
  },

  toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
  },

  changeFontSize(delta) {
    const root = document.documentElement;
    const current = parseInt(getComputedStyle(root).fontSize);
    let next = current + delta;
    if (next >= 12 && next <= 28) {
      root.style.fontSize = next + 'px';
      localStorage.setItem('site-font-size', next);
    }
  }
};

// --- Inicialização e Eventos ---
document.addEventListener('DOMContentLoaded', () => {
  UI_Controls.applyStoredSettings();

  // Cliques Gerais
  document.getElementById('brand-logo')?.addEventListener('click', () => goToPage('page-home'));
  document.getElementById('toggle-theme')?.addEventListener('click', UI_Controls.toggleTheme);
  document.getElementById('inc-font')?.addEventListener('click', () => UI_Controls.changeFontSize(1));
  document.getElementById('dec-font')?.addEventListener('click', () => UI_Controls.changeFontSize(-1));

  // Chat Input - múltiplos eventos
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Botão enviar do chat
  document.querySelector('.chat-input-area button')?.addEventListener('click', sendMessage);

  // Botão limpar chat
  document.querySelector('.chat-actions .btn.danger')?.addEventListener('click', clearChat);

  // Expor funções globais necessárias pelo HTML
  window.goToPage = goToPage;
  window.setArea = setArea;
  window.setLinguagem = setLinguagem;
  window.setNivel = setNivel;
  window.prepareChat = prepareChat;
  window.openLangOverlay = openLangOverlay;
  window.closeLangOverlay = closeLangOverlay;
  window.proceedFromOverlay = proceedFromOverlay;
  window.copyCode = copyCode;
  window.sendMessage = sendMessage;
  window.clearChat = clearChat;

  // Efeitos Hover
  window.hoverLang = (el) => {
    el.style.transform = 'scale(1.03)';
    el.style.zIndex = 5;
  };
  window.unhoverLang = (el) => {
    el.style.transform = '';
    el.style.zIndex = '';
  };

  console.log('MENTECH.AI inicializado com sucesso!');
});

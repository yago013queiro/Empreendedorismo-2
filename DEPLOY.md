# 🤖 MENTECH.AI - Integração Vercel + Gemini

## ✅ O que já está pronto:
- Backend (`/api/ask.js`) - Conecta com Gemini API
- Frontend (`ai.js`) - Faz requisições para o backend
- Interface (`index.html`) - Chat integrado
- Configuração Vercel (`vercel.json`)

## 🚀 Como fazer o deploy (4 passos):

### 1️⃣ **Obter a chave do Gemini** 
- Acesse: https://aistudio.google.com/apikey
- Clique em "Create API Key"
- Copie a chave gerada
- Cole no arquivo `.env.local`:
  ```
  GEMINI_API_KEY=sua_chave_aqui
  ```

### 2️⃣ **Instalar Vercel CLI** (no terminal)
```powershell
npm install -g vercel
```

### 3️⃣ **Deploy no Vercel**
```powershell
vercel
```
- Faça login com GitHub/Google
- Siga as instruções
- Quando perguntado sobre as variáveis de ambiente, adicione:
  - **Nome:** GEMINI_API_KEY
  - **Valor:** sua_chave_do_gemini

### 4️⃣ **Configurar variáveis no Vercel Dashboard**
- Acesse: https://vercel.com/dashboard
- Escolha seu projeto
- Vá em Settings → Environment Variables
- Adicione: `GEMINI_API_KEY=sua_chave`

## 🧪 Testar localmente
```powershell
npm install
vercel dev
```
Acesse `http://localhost:3000`

## 📝 Estrutura de pastas
```
Empreendedorismo 2/
├── api/
│   └── ask.js          (backend - Gemini)
├── index.html          (frontend)
├── ai.js               (cliente JavaScript)
├── style.css           (estilos)
├── package.json        (dependências)
├── vercel.json         (config Vercel)
└── .env.local          (chave local)
```

## ⚠️ Possíveis problemas:

### ❌ "GEMINI_API_KEY not found"
- Você esqueceu de adicionar a variável no Vercel Dashboard
- Solução: Settings → Environment Variables → Adicionar GEMINI_API_KEY

### ❌ "405 Method Not Allowed"
- Frontend está fazendo GET em vez de POST
- Verifique se `ai.js` usa `method: "POST"`

### ❌ "Erro de CORS"
- Vercel não permite requisições de domínios não autorizados
- Solução: Certifique-se que frontend e backend estão no mesmo domínio

## 💡 Alternativas (se Gemini não funcionar):

### OpenAI GPT-4 (mais poderoso, pago)
- API: https://platform.openai.com/api-keys
- Custo: $0.01-0.03 por requisição
- Melhor qualidade

### Claude (Anthropic)
- API: https://console.anthropic.com
- Grátis: 100k tokens/mês
- Recomendado

### Groq (Fastest LLM)
- API: https://console.groq.com
- Grátis: Sem limites
- Super rápido

## 📞 Suporte
Se der erro, verifique:
1. Chave do Gemini ativa e correta
2. Variável GEMINI_API_KEY no Vercel
3. Arquivo `api/ask.js` existe
4. Frontend chama `/api/ask` (POST)

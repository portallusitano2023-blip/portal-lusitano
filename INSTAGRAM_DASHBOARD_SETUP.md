# Dashboard Instagram - Setup Completo

## ✅ O Que Foi Criado

### 1. Dashboard Admin (`/admin/instagram`)
- Ver todos os materiais recebidos (pendentes, publicados, cancelados)
- Preview de imagens e vídeos inline
- Ver caption, hashtags, links, observações
- Botões "Marcar como Publicado" e "Cancelar"
- Notificação automática ao cliente quando publicar
- Filtros por status
- Estatísticas (pendentes, publicados, cancelados)
- Botão "Copiar" para caption e hashtags

### 2. APIs Criadas
- `/api/admin/instagram/list` - Lista uploads com filtros
- `/api/admin/instagram/update-status` - Atualiza status e notifica cliente

### 3. Modificações
- `app/api/instagram/upload/route.ts` - Agora busca email do cliente no Stripe e guarda na BD
- `supabase/instagram_uploads_add_email.sql` - Nova migração para adicionar coluna `customer_email`

---

## 📋 Passos de Setup

### 1. Executar SQL no Supabase

Vai ao **Supabase Dashboard** > **SQL Editor** e executa:

```sql
-- Adicionar coluna customer_email à tabela instagram_uploads
ALTER TABLE instagram_uploads
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

-- Criar índice para facilitar pesquisas
CREATE INDEX IF NOT EXISTS idx_instagram_uploads_email ON instagram_uploads(customer_email);
```

### 2. Verificar Bucket de Storage

Confirma que tens o bucket **"instagram_uploads"** criado:
- Supabase Dashboard > Storage
- Se não existir, cria com estas configs:
  - Nome: `instagram_uploads`
  - Public: ✅ Sim
  - Max file size: 50MB
  - Allowed MIME types: `image/*, video/*`

### 3. Testar o Sistema

#### A) Fazer uma compra teste
1. Vai a `http://localhost:3000/instagram`
2. Escolhe um pacote (ex: Story - €10)
3. Preenche o formulário
4. Clica "Continuar para Pagamento"
5. Usa cartão teste: `4242 4242 4242 4242`
6. Completa o pagamento

#### B) Upload de materiais
1. Vais receber um email com link de upload
2. Ou acede diretamente a `/instagram/upload/[session_id]`
3. Faz upload de 1-5 imagens/vídeos
4. Preenche caption, hashtags, link, observações
5. Clica "Enviar Materiais"

#### C) Aceder ao Dashboard
1. Vai a `http://localhost:3000/admin/instagram`
2. Vais ver o upload pendente
3. Preview de imagens aparece inline
4. Podes copiar caption e hashtags
5. Clica "Marcar como Publicado"
6. Cliente recebe email automático

---

## 🎯 Como Funciona (Fluxo Completo)

### 1. Cliente Compra (via Stripe)
- Cliente vai a `/instagram`
- Escolhe pacote (Story €10, Post €30, Reels €50, Pack €75)
- Paga via Stripe
- Webhook guarda pagamento em `payments`
- Cliente recebe email com link de upload

### 2. Cliente Faz Upload
- Cliente acede `/instagram/upload/[session_id]`
- Faz upload de 1-5 ficheiros
- Preenche caption, hashtags, link, observações
- Sistema:
  - Faz upload para Supabase Storage
  - Guarda tudo em `instagram_uploads` (incluindo email do cliente)
  - Envia email ao admin com TUDO pronto para copiar
  - Envia email ao cliente confirmando receção

### 3. Admin Gere no Dashboard
- Admin acede `/admin/instagram`
- Vê todos os materiais pendentes
- Preview de imagens/vídeos inline
- Copia caption e hashtags com 1 clique
- Faz download dos ficheiros
- Publica no Instagram manualmente
- Clica "Marcar como Publicado"
- Sistema:
  - Atualiza status para "published"
  - Guarda `published_at` timestamp
  - Envia email automático ao cliente: "🎉 O seu post foi publicado!"

---

## 🔐 Segurança (TODO)

Atualmente o dashboard **NÃO tem autenticação**. Qualquer pessoa pode aceder a `/admin/instagram`.

### Para adicionar autenticação:

Tens estas opções:

#### Opção 1: Autenticação Simples (Password)
Adiciona isto no início de `app/admin/instagram/page.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";

export default function AdminInstagramPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
    } else {
      alert("Password incorreta");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="bg-zinc-900 p-8 rounded-xl max-w-md w-full">
          <h1 className="text-2xl text-white mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-black border border-zinc-800 px-4 py-3 text-white mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-[#C5A059] text-black py-3 font-bold"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ... resto do código
}
```

E adiciona ao `.env.local`:
```
NEXT_PUBLIC_ADMIN_PASSWORD=TuaPasswordSecreta123
```

#### Opção 2: NextAuth.js
Implementar sistema completo de autenticação com NextAuth.js

---

## 📊 Tabela `instagram_uploads`

```sql
CREATE TABLE instagram_uploads (
  id UUID PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL UNIQUE,
  caption TEXT,
  hashtags VARCHAR(500),
  link VARCHAR(500),
  observacoes TEXT,
  files_urls TEXT[],
  status VARCHAR(50) DEFAULT 'pending',
  customer_email VARCHAR(255),       -- 🆕 NOVA COLUNA
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);
```

---

## 🎨 Features do Dashboard

### Stats Cards
- 🟠 **Pendentes** - Materiais aguardando publicação
- 🟢 **Publicados** - Materiais já publicados
- ⚪ **Cancelados** - Materiais cancelados

### Filtros
- **Todos** - Ver tudo
- **Pendentes** - Só materiais por publicar
- **Publicados** - Histórico de publicações
- **Cancelados** - Materiais rejeitados

### Cards de Upload
Cada upload mostra:
- **Status badge** (pending, published, cancelled)
- **Data de criação**
- **Email do cliente**
- **Ficheiros** (imagens inline, vídeos com player)
- **Caption** (com botão Copiar)
- **Hashtags** (com botão Copiar)
- **Link** (clicável)
- **Observações**
- **Botões de ação** (Marcar Publicado, Cancelar)
- **Data de publicação** (se já publicado)

### Botões de Download
Cada imagem/vídeo tem link de download direto

---

## 🚀 Próximos Passos (Opcional)

### 1. Agendamento Automático
Sistema sugere melhor hora para publicar baseado em engagement

### 2. Analytics Pós-Publicação
Rastrear likes, comentários, alcance de cada post patrocinado

### 3. Publicação Direta via Instagram Graph API
Publicar direto no Instagram sem copiar/colar (limitações da API)

### 4. Campanhas Recorrentes
Clientes podem comprar pacotes mensais com renovação automática

---

## 📞 Suporte

Se tiveres algum problema:
1. Verifica se a migração SQL foi executada
2. Verifica se o bucket "instagram_uploads" existe e é público
3. Testa o fluxo completo (compra → upload → dashboard)
4. Verifica os logs do servidor (`npm run dev`)

---

## ✅ Checklist de Setup

- [ ] Executar SQL migration (`instagram_uploads_add_email.sql`)
- [ ] Verificar bucket Supabase Storage "instagram_uploads"
- [ ] Testar compra com cartão teste
- [ ] Testar upload de materiais
- [ ] Aceder dashboard `/admin/instagram`
- [ ] Testar botão "Marcar como Publicado"
- [ ] Verificar se cliente recebeu email de publicação
- [ ] (Opcional) Adicionar autenticação ao dashboard

---

Está tudo pronto para usar! 🎉

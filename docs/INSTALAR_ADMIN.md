# 🚀 Instalação Admin Portal Lusitano

## ⚠️ IMPORTANTE: Executar SQL Primeiro!

Os erros que estás a ver são porque as tabelas da base de dados ainda não foram criadas.

## 📋 Passo a Passo (5 minutos)

### 1️⃣ Ir ao Supabase SQL Editor

1. Abre o Supabase: https://supabase.com/dashboard
2. Seleciona o teu projeto **Portal Lusitano**
3. No menu lateral, clica em **SQL Editor**

### 2️⃣ Executar o Script SQL

1. Abre o ficheiro `SETUP_ADMIN_COMPLETO.sql` (está na raiz do projeto)
2. **Copia TUDO** (Ctrl+A, Ctrl+C)
3. No SQL Editor do Supabase, **cola** o código
4. Clica em **Run** (ou F5)

⏱️ Deve demorar 2-3 segundos.

### 3️⃣ Verificar se Funcionou

No final da execução, deves ver uma tabela com:

```
tabela                  | registos
------------------------|----------
contact_submissions     | 0
payments                | X
leads                   | X
```

✅ Se vires isto, está tudo OK!

### 4️⃣ Recarregar o Admin

1. Vai a `http://localhost:3000/admin/login`
2. Faz login com:
   - **Email**: portal.lusitano2023@gmail.com
   - **Password**: Gg940142222222.@

3. Deves ver o dashboard completo sem erros! 🎉

---

## 🔧 O Que o SQL Faz?

Cria as tabelas necessárias:

- ✅ `contact_submissions` - Inbox de mensagens
- ✅ `payments` - Melhorada com product_type, metadata
- ✅ `leads` - Para analytics de conversão
- ✅ Índices para performance
- ✅ Triggers para updated_at automático
- ✅ RLS policies para segurança

---

## ❓ Problemas?

### Erro: "relation already exists"

- **Solução**: Está tudo bem! Significa que a tabela já existe. Continua.

### Erro: "permission denied"

- **Solução**: Tens de estar logado como owner do projeto Supabase.

### Dashboard ainda mostra erros?

1. Verifica se o SQL foi executado com sucesso
2. Faz refresh do navegador (Ctrl+F5)
3. Verifica se o servidor dev está a correr (`npm run dev`)

---

## ✨ Depois de Instalado

Terás acesso a:

- 💰 **Dashboard Financeiro** - Receitas, MRR, gráficos, CSV export
- 📨 **Inbox de Mensagens** - Todos os contactos centralizados
- 📊 **Analytics** - Tráfego, conversões, performance
- 🎯 **Gestão Completa** - Cavalos, eventos, reviews, etc.

**Tudo num admin profissional ao nível de empresas reconhecidas!** 🚀

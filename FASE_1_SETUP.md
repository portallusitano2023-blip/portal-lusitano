# ✅ FASE 1: Prevenir Perda de Dados - SETUP COMPLETO

## 🎯 O Que Foi Implementado

A **Fase 1** corrige o problema crítico de perda de dados nos formulários. Agora todos os contactos são guardados permanentemente na base de dados ANTES do pagamento Stripe.

### Ficheiros Criados/Modificados:

✅ **Migrações SQL:**
- `supabase/migrations/001_contact_submissions.sql` - Tabela para todos os contactos
- `supabase/migrations/002_enhance_payments.sql` - Melhora tabela payments

✅ **APIs Modificadas:**
- `app/api/vender-cavalo/checkout/route.ts` - Guarda em BD antes de Stripe
- `app/api/publicidade/checkout/route.ts` - Guarda em BD antes de Stripe
- `app/api/instagram/checkout/route.ts` - Guarda em BD antes de Stripe
- `app/api/stripe/webhook/route.ts` - Liga pagamentos aos contactos

---

## 📋 PASSO A PASSO - O QUE FAZER AGORA

### PASSO 1: Executar Migrações SQL no Supabase

#### 1.1 Aceder ao Supabase SQL Editor
1. Vai a **https://supabase.com**
2. Faz login na tua conta
3. Seleciona o projeto **Portal Lusitano**
4. No menu lateral esquerdo, clica em **SQL Editor**

#### 1.2 Executar Migração 001 - contact_submissions
1. Clica em **+ New query**
2. Abre o ficheiro: `supabase/migrations/001_contact_submissions.sql`
3. **Copia TODO o conteúdo do ficheiro**
4. Cola no SQL Editor do Supabase
5. Clica em **RUN** (ou `Ctrl + Enter`)
6. Verifica se aparece: ✅ **Success. No rows returned**

**O que esta migração faz:**
- Cria tabela `contact_submissions` para guardar todos os contactos
- Cria índices para performance
- Cria trigger para atualizar `updated_at` automaticamente
- Configura Row Level Security (RLS)

#### 1.3 Executar Migração 002 - enhance_payments
1. Clica em **+ New query** (nova query)
2. Abre o ficheiro: `supabase/migrations/002_enhance_payments.sql`
3. **Copia TODO o conteúdo do ficheiro**
4. Cola no SQL Editor do Supabase
5. Clica em **RUN**
6. Verifica se aparece: ✅ **Success. No rows returned**

**O que esta migração faz:**
- Adiciona colunas `product_type`, `product_metadata`, `stripe_session_id` à tabela `payments`
- Cria índices para as novas colunas
- Adiciona comentários explicativos

---

### PASSO 2: Verificar se as Tabelas Foram Criadas

1. No Supabase, vai a **Table Editor** (menu lateral)
2. Deves ver a nova tabela **`contact_submissions`**
3. Clica nela e verifica se tem estas colunas:
   - `id` (UUID)
   - `form_type` (TEXT)
   - `name` (TEXT)
   - `email` (TEXT)
   - `telefone` (TEXT)
   - `company` (TEXT)
   - `form_data` (JSONB)
   - `status` (TEXT)
   - `priority` (TEXT)
   - `payment_id` (UUID)
   - `created_at` (TIMESTAMP)
   - ... (e outras colunas)

4. Vai à tabela **`payments`**
5. Verifica se tem as NOVAS colunas:
   - `product_type` (TEXT)
   - `product_metadata` (JSONB)
   - `stripe_session_id` (TEXT)

✅ Se vires todas as colunas, as migrações foram bem-sucedidas!

---

### PASSO 3: Fazer Build do Projeto

No terminal, executa:

```bash
npm run build
```

Deves ver:
```
✓ Compiled successfully
Route (app)
...
✓ Generating static pages
```

✅ Se o build for bem-sucedido, está tudo pronto!

---

### PASSO 4: Testar o Novo Sistema

#### Teste 1: Vender Cavalo (Dados NÃO Perdidos)

1. Inicia o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Vai a `http://localhost:3000/vender-cavalo`

3. Preenche o formulário completo (6 steps):
   - Step 1: Nome cavalo, sexo, idade, pelagem
   - Step 2: Altura, preço, localização
   - Step 3: Linhagem (pai, mãe, coudelaria)
   - Step 4: Nível de treino, disciplinas
   - Step 5: Saúde (registo APSL, documentos)
   - Step 6: Proprietário (nome, email, telefone, NIF)

4. **ANTES de clicar "Publicar Anúncio":**
   - Abre o Supabase → Table Editor → `contact_submissions`
   - Mantém esta aba aberta

5. Clica em **"Publicar Anúncio"**

6. **VERIFICA NO SUPABASE:**
   - Dá refresh na tabela `contact_submissions`
   - ✅ Deves ver UM NOVO registo COM TODOS OS DADOS
   - Verifica que `form_type` = `'vender_cavalo'`
   - Verifica que `form_data` tem todos os campos preenchidos
   - Verifica que `status` = `'novo'`

7. Continua o checkout Stripe:
   - Usa cartão teste: `4242 4242 4242 4242`
   - Data: qualquer data futura (ex: 12/25)
   - CVC: qualquer 3 dígitos (ex: 123)
   - Nome: qualquer nome
   - Completa o pagamento

8. **VERIFICA NO SUPABASE (depois do pagamento):**
   - Vai à tabela `payments`
   - Dá refresh
   - ✅ Deves ver UM NOVO pagamento
   - Verifica que `product_type` = `'cavalo_anuncio'`
   - Verifica que `stripe_session_id` está preenchido
   - Verifica que `product_metadata` tem informação do cavalo

9. **VERIFICA LIGAÇÃO:**
   - Volta à tabela `contact_submissions`
   - Dá refresh
   - Clica no registo que criaste
   - ✅ Verifica que `payment_id` agora está preenchido
   - ✅ Verifica que `cavalo_id` agora está preenchido

#### Teste 2: Instagram (Dados Guardados)

1. Vai a `http://localhost:3000/instagram`
2. Escolhe um pacote (ex: Post - €30)
3. Preenche: Nome, Email, Empresa, Instagram, Mensagem
4. Clica "Continuar para Pagamento"

**VERIFICA NO SUPABASE:**
- Tabela `contact_submissions` deve ter novo registo
- `form_type` = `'instagram'`
- `form_data` tem toda a informação

5. Completa o pagamento (cartão teste: 4242...)

**VERIFICA NO SUPABASE:**
- Tabela `payments` tem novo registo
- `product_type` = `'instagram'`
- O `contact_submission` está ligado ao `payment_id`

#### Teste 3: Publicidade (Dados Guardados)

1. Vai a `http://localhost:3000/publicidade`
2. Escolhe um pacote (ex: Banner Lateral - €25/mês)
3. Preenche: Email, Empresa, Telefone
4. Clica "Começar Agora"

**VERIFICA NO SUPABASE:**
- Tabela `contact_submissions` deve ter novo registo
- `form_type` = `'publicidade'`

5. Completa o pagamento

**VERIFICA NO SUPABASE:**
- Tabela `payments` tem novo registo
- `product_type` = `'publicidade'`
- `product_metadata` tem package = 'lateral' (ou outro)

---

## ✅ CHECKLIST FINAL

Marca conforme fores completando:

### Migrações SQL
- [ ] Executei migração 001_contact_submissions.sql no Supabase
- [ ] Executei migração 002_enhance_payments.sql no Supabase
- [ ] Verifiquei que tabela `contact_submissions` foi criada
- [ ] Verifiquei que tabela `payments` tem novas colunas

### Build & Deploy
- [ ] Executei `npm run build` com sucesso
- [ ] Executei `npm run dev` sem erros

### Testes
- [ ] Testei formulário "Vender Cavalo"
- [ ] Verifiquei que dados aparecem em `contact_submissions` ANTES do pagamento
- [ ] Completei pagamento teste e verifiquei ligação `payment_id`
- [ ] Testei formulário "Instagram"
- [ ] Testei formulário "Publicidade"

### Verificação Final
- [ ] Todos os contactos estão guardados em BD
- [ ] Nenhum contacto é perdido
- [ ] Payments estão ligados aos contact_submissions
- [ ] `product_type` está preenchido em todos os payments

---

## 🎉 RESULTADO

**ANTES (PROBLEMA):**
- ❌ Dados guardados em memória (perdidos após 1 hora)
- ❌ Se servidor reiniciar, dados perdidos
- ❌ Sem visibilidade dos contactos
- ❌ Impossível gerir mensagens

**AGORA (SOLUÇÃO):**
- ✅ Dados guardados PERMANENTEMENTE em BD
- ✅ Impossível perder contactos
- ✅ Todos os dados acessíveis via Supabase
- ✅ Pronto para criar inbox de mensagens (Fase 2)

---

## 🔧 Troubleshooting

### Erro: "relation contact_submissions does not exist"
**Causa:** A migração SQL não foi executada
**Solução:** Vai ao Supabase SQL Editor e executa `001_contact_submissions.sql`

### Erro: "column product_type does not exist"
**Causa:** A migração 002 não foi executada
**Solução:** Vai ao Supabase SQL Editor e executa `002_enhance_payments.sql`

### Erro no checkout: "Erro ao processar formulário"
**Causa:** O insert em `contact_submissions` falhou
**Solução:**
1. Verifica logs no terminal (`npm run dev`)
2. Verifica se tens permissões no Supabase
3. Verifica se a tabela foi criada corretamente

### Dados não aparecem em contact_submissions
**Causa:** Possível erro de permissões RLS
**Solução:**
1. Vai ao Supabase → Authentication → Policies
2. Verifica se existe policy "Allow all for service role" em `contact_submissions`
3. Se não existir, executa novamente a migração 001

---

## 📞 Suporte

Se encontrares algum problema:
1. Verifica os logs do terminal (`npm run dev`)
2. Verifica os logs do Supabase (SQL Editor → Query History)
3. Verifica se as variáveis de ambiente estão corretas (`.env.local`)

---

## 🚀 Próximos Passos (FASE 2)

Depois de confirmar que a Fase 1 está funcional:
- Criar Inbox de Mensagens (`/admin/mensagens`)
- Ver todos os contactos num só sítio
- Responder por email
- Workflow de estados (novo → lido → respondido)

**Estimativa Fase 2:** 3-4 dias

---

✨ **Parabéns! A Fase 1 está completa. Agora NENHUM contacto é perdido!**

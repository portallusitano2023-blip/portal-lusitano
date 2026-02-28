# 🔧 CONFIGURAÇÃO DO STRIPE - PASSO A PASSO

## ⚡ SETUP RÁPIDO (15 minutos)

### PASSO 1: Criar Conta Stripe

1. Ir a **https://dashboard.stripe.com/register**
2. Criar conta (gratuita)
3. Ativar **modo de teste** (toggle no canto superior direito deve dizer "Test mode")

---

### PASSO 2: Obter API Keys

1. No Dashboard do Stripe, ir a: **Developers > API keys**
2. Copiar as duas chaves:

```
Publishable key: pk_test_51...
Secret key: sk_test_51...
```

3. Adicionar ao `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_51XXXXXXXXXXXXXXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51XXXXXXXXXXXXXXXXX
```

📸 **Screenshot**: https://i.imgur.com/example.png

---

### PASSO 3: Criar Produtos e Preços

1. No Dashboard, ir a: **Products > Add product**

#### Produto 1: Portal Lusitano - Aficionado

```
Nome: Portal Lusitano - Aficionado
Descrição: Para quem ama o Lusitano e quer aprender mais
```

**Preços a criar:**

1. **Preço Mensal**:
   - Modelo de preços: Recurring
   - Preço: €9.99
   - Frequência: Monthly
   - Clicar "Add price"
   - **Copiar o Price ID** (começa com `price_...`)
     v
2. **Preço Anual**:
   - Clicar "Add another price"
   - Preço: €99.90
   - Frequência: Yearly
   - **Copiar o Price ID**

#### Produto 2: Portal Lusitano - Criador

```
Nome: Portal Lusitano - Criador
Descrição: Para criadores e profissionais do sector
```

**Preços:**

- Mensal: €49.99
- Anual: €499.90

#### Produto 3: Portal Lusitano - Elite

```
Nome: Portal Lusitano - Elite
Descrição: Acesso total + suporte personalizado
```

**Preços:**

- Mensal: €199.00
- Anual: €1990.00

---

### PASSO 4: Adicionar Price IDs ao .env.local

Depois de criar todos os produtos e preços, copiar os IDs:

```env
STRIPE_PRICE_AFICIONADO_MONTHLY=price_1ABC123...
STRIPE_PRICE_AFICIONADO_YEARLY=price_1ABC456...
STRIPE_PRICE_CRIADOR_MONTHLY=price_1ABC789...
STRIPE_PRICE_CRIADOR_YEARLY=price_1ABC012...
STRIPE_PRICE_ELITE_MONTHLY=price_1ABC345...
STRIPE_PRICE_ELITE_YEARLY=price_1ABC678...
```

---

### PASSO 5: Configurar Webhook (Opcional para Desenvolvimento Local)

Para **desenvolvimento local**, vais usar o Stripe CLI.

#### Instalar Stripe CLI:

**Windows:**

```bash
# Baixar de: https://github.com/stripe/stripe-cli/releases
# Ou usar scoop:
scoop install stripe
```

**Mac/Linux:**

```bash
brew install stripe/stripe-cli/stripe
```

#### Fazer Login:

```bash
stripe login
```

#### Forward webhooks para localhost:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Este comando vai mostrar:

```
> Ready! Your webhook signing secret is whsec_XXXXXXXXXXXX
```

Copiar o `whsec_...` para `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXX
```

**IMPORTANTE**: Deixar este comando a correr enquanto testa localmente!

---

### PASSO 6: Reiniciar Servidor

```bash
# Parar o servidor (Ctrl+C)
# Iniciar de novo:
npm run dev
```

---

### PASSO 7: Testar Checkout

1. Ir a: **http://localhost:3000/pro**
2. Escolher um plano (ex: Criador)
3. Clicar "Começar Agora"
4. Introduzir qualquer email
5. Clicar "Continuar para Pagamento"

Deverá redirecionar para o **Stripe Checkout**!

---

## 💳 CARTÕES DE TESTE

Use estes cartões para testar pagamentos:

```
✅ Sucesso:
Número: 4242 4242 4242 4242
Data: Qualquer futura (ex: 12/25)
CVC: Qualquer 3 dígitos (ex: 123)

❌ Pagamento Recusado:
Número: 4000 0000 0000 0002

⚠️ Requer Autenticação (3D Secure):
Número: 4000 0027 6000 3184
```

---

## 🧪 VERIFICAR SE ESTÁ A FUNCIONAR

### Checklist:

- [ ] ✅ Consegues aceder ao Stripe Dashboard
- [ ] ✅ Modo de teste está ativo
- [ ] ✅ API keys copiadas para `.env.local`
- [ ] ✅ 3 produtos criados no Stripe
- [ ] ✅ 6 preços criados (2 por produto)
- [ ] ✅ Price IDs copiados para `.env.local`
- [ ] ✅ Stripe CLI instalado (opcional para desenvolvimento)
- [ ] ✅ Webhook secret configurado (se usar CLI)
- [ ] ✅ Servidor reiniciado (`npm run dev`)
- [ ] ✅ Checkout redireciona para Stripe

---

## 🔍 TROUBLESHOOTING

### Erro: "Plano inválido"

- ✅ Verificar se os Price IDs no `.env.local` estão corretos
- ✅ Verificar se não há espaços extra nas variáveis

### Erro: "Stripe not configured"

- ✅ Verificar se `STRIPE_SECRET_KEY` está no `.env.local`
- ✅ Reiniciar o servidor (`npm run dev`)

### Checkout não redireciona

- ✅ Abrir console do browser (F12)
- ✅ Ver se há erros na aba "Console"
- ✅ Ver se a chamada a `/api/stripe/checkout` retorna erro

### Email não chega após pagamento

- ✅ Verificar se `RESEND_API_KEY` está configurado
- ✅ Verificar se Stripe CLI está a correr (`stripe listen`)
- ✅ Ver logs do webhook no terminal do Stripe CLI

---

## 📊 VER PAGAMENTOS DE TESTE

1. Dashboard do Stripe > **Payments**
2. Ver todos os pagamentos de teste
3. Clicar num pagamento para ver detalhes
4. Ver eventos associados (checkout.session.completed, etc.)

---

## 🚀 PRODUÇÃO (Quando Pronto para Lançar)

Quando estiveres pronto para aceitar pagamentos reais:

### 1. Ativar Conta Stripe

- Preencher informações da empresa
- Adicionar conta bancária
- Verificar identidade

### 2. Mudar para Modo Live

- Toggle no Dashboard: "Test mode" → "Live mode"

### 3. Obter Chaves de Produção

- Copiar as chaves **LIVE** (começam com `pk_live_` e `sk_live_`)
- Atualizar `.env.local` (ou `.env.production`)

### 4. Criar Produtos em Live Mode

- Recriar os 3 produtos em modo live
- Copiar os novos Price IDs (live)

### 5. Configurar Webhook de Produção

- Dashboard > Developers > Webhooks
- "Add endpoint"
- URL: `https://portal-lusitano.pt/api/stripe/webhook`
- Eventos:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Copiar **Webhook signing secret**

### 6. Atualizar .env.production

```env
NEXT_PUBLIC_SITE_URL=https://portal-lusitano.pt
STRIPE_SECRET_KEY=sk_live_XXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX (do webhook de produção)
STRIPE_PRICE_AFICIONADO_MONTHLY=price_XXXXX (live)
STRIPE_PRICE_AFICIONADO_YEARLY=price_XXXXX (live)
# ... etc
```

---

## 💰 CUSTOS

### Modo de Teste: **GRÁTIS** ✅

- Pagamentos falsos
- Sem custos
- Usar para desenvolvimento

### Modo Live:

- **2.9% + €0.25** por transação bem-sucedida
- Sem mensalidade
- Exemplo:
  - Venda de €49.99 → Taxa: €1.70 → Tu recebes: €48.29

---

## 📞 SUPORTE

Se tiveres problemas:

1. **Documentação Stripe**: https://stripe.com/docs
2. **Support Chat**: No Dashboard do Stripe (canto inferior direito)
3. **Community**: https://discord.gg/stripe

---

## ✅ FICHEIRO .env.local COMPLETO (EXEMPLO)

```env
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe Test Mode
STRIPE_SECRET_KEY=sk_test_51AbCdEf123456789...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEf123456789...
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefg...

# Stripe Price IDs (Test Mode)
STRIPE_PRICE_AFICIONADO_MONTHLY=price_1ABCD1234567890
STRIPE_PRICE_AFICIONADO_YEARLY=price_1ABCD1234567891
STRIPE_PRICE_CRIADOR_MONTHLY=price_1ABCD1234567892
STRIPE_PRICE_CRIADOR_YEARLY=price_1ABCD1234567893
STRIPE_PRICE_ELITE_MONTHLY=price_1ABCD1234567894
STRIPE_PRICE_ELITE_YEARLY=price_1ABCD1234567895

# Resend (Emails)
RESEND_API_KEY=re_cPTyybFU_EbRvBA6oCJ9a6LWGMJ8gjqDi

# Sanity (CMS)
NEXT_PUBLIC_SANITY_PROJECT_ID=ofrzpaxa
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=sk7A0Gf0q2GvNsy8...

# Shopify
NEXT_PUBLIC_SHOPIFY_DOMAIN=portal-lusitano.myshopify.com
NEXT_PUBLIC_SHOPIFY_TOKEN=5566f8155086c19776145d6ff669019b
```

---

**Boa sorte! Qualquer dúvida, consulta a documentação oficial do Stripe.** 💪🚀

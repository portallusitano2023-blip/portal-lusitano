# Setup do Sistema de Automações

## Passo 1: Executar a Migração SQL

Copie todo o conteúdo do ficheiro:
```
supabase/migrations/20260207000001_automations.sql
```

E execute no **Supabase SQL Editor**:

1. Ir para o dashboard do Supabase: https://supabase.com
2. Selecionar o projeto "Portal Lusitano"
3. Ir para "SQL Editor" no menu lateral
4. Clicar em "New Query"
5. Colar o conteúdo do ficheiro SQL
6. Clicar em "Run" (ou pressionar Ctrl+Enter)

### Verificar se foi criado corretamente

Execute este query para verificar:

```sql
-- Ver as tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('admin_automations', 'admin_automation_logs');

-- Ver automações de exemplo
SELECT id, name, enabled, trigger_type, action_type
FROM admin_automations;

-- Ver estrutura da tabela
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'admin_automations';
```

Se retornar resultados, está tudo OK!

---

## Passo 2: Verificar Variáveis de Ambiente

Certifique-se de que tem estas variáveis no ficheiro `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (para emails)
RESEND_API_KEY=re_your_api_key

# Site URL (para automações)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Passo 3: Adicionar Página ao Menu Admin

A página já foi adicionada ao menu do admin em `app/admin-app/page.tsx`.

Procure por:
```typescript
{
  id: "automations",
  title: "Automações",
  icon: FiActivity,
  emoji: "⚡",
  component: AutomationsContent,
}
```

---

## Passo 4: Testar o Sistema

### 1. Aceder à página de Automações

1. Fazer login no Admin App: http://localhost:3000/admin-app
2. Clicar em "Automações" (⚡) na sidebar

Deverá ver:
- 3 automações de exemplo criadas pela migração
- Estatísticas: Total, Ativas, Execuções, Taxa de Sucesso
- Filtros e pesquisa

### 2. Testar criar uma automação

Clicar em "Nova Automação" e preencher:

```
Nome: Teste Email
Descrição: Enviar email de teste
Trigger: Lead Criado
Trigger Conditions: {}
Action: Enviar Email
Action Config:
{
  "to": "seu-email@example.com",
  "subject": "Teste de Automação",
  "template": "welcome"
}
Delay: 0
Ativar: Sim
```

Guardar e verificar se aparece na lista.

### 3. Executar manualmente

1. Clicar no botão "▶️ Play" da automação
2. Deverá ver uma mensagem de sucesso
3. Verificar os logs clicando no botão "👁️ Eye"

### 4. Verificar no Supabase

```sql
-- Ver todas as automações
SELECT * FROM admin_automations;

-- Ver logs de execução
SELECT * FROM admin_automation_logs ORDER BY executed_at DESC LIMIT 10;

-- Ver estatísticas
SELECT
  name,
  enabled,
  total_runs,
  successful_runs,
  failed_runs,
  ROUND(
    CASE
      WHEN total_runs > 0
      THEN (successful_runs::float / total_runs) * 100
      ELSE 0
    END,
    2
  ) as success_rate
FROM admin_automations;
```

---

## Passo 5: Integrar com APIs Existentes (Opcional)

Para que as automações sejam disparadas automaticamente, adicione chamadas em suas APIs.

### Exemplo 1: CRM - Nova Lead

Em `app/api/admin/crm/route.ts`:

```typescript
import { triggerAutomations } from "@/lib/automations";

// No POST, após criar o lead:
if (lead) {
  await triggerAutomations("lead_created", {
    email: lead.email,
    name: lead.name,
    lead_id: lead.id,
  });
}
```

### Exemplo 2: Pagamentos

Em `app/api/webhooks/stripe/route.ts`:

```typescript
import { triggerAutomations } from "@/lib/automations";

if (event.type === "payment_intent.succeeded") {
  await triggerAutomations("payment_succeeded", {
    email: paymentIntent.receipt_email,
    amount: paymentIntent.amount,
    payment_id: paymentIntent.id,
  });
}
```

Ver mais exemplos em: `AUTOMATION_INTEGRATION_EXAMPLES.md`

---

## Passo 6: Configurar Resend (Para Emails)

1. Criar conta em https://resend.com
2. Obter API Key
3. Adicionar ao `.env.local`:
   ```
   RESEND_API_KEY=re_your_key_here
   ```
4. Verificar domínio (opcional, para emails de produção)

### Testar Email

Criar automação:
```json
{
  "name": "Teste Email",
  "trigger_type": "lead_created",
  "action_type": "send_email",
  "action_config": {
    "to": "seu-email@example.com",
    "subject": "Teste Portal Lusitano",
    "template": "welcome"
  }
}
```

Executar manualmente e verificar inbox.

---

## Troubleshooting

### Erro: "Tabela não existe"

Execute a migração SQL novamente. Verifique se está no projeto correto do Supabase.

### Erro: "Não autorizado"

Verifique se está logado no Admin App e se o token de sessão é válido.

### Automação não executa

1. Verificar se está `enabled: true`
2. Verificar se o JSON das configs está válido
3. Ver logs: `SELECT * FROM admin_automation_logs WHERE status = 'failed'`
4. Ver `last_error` na tabela `admin_automations`

### Email não envia

1. Verificar `RESEND_API_KEY`
2. Verificar formato do email
3. Ver logs no dashboard Resend: https://resend.com/logs

### Performance lenta

1. Verificar índices na base de dados
2. Adicionar `delay_minutes` para ações não-urgentes
3. Considerar implementar job queue para alto volume

---

## Próximos Passos

1. ✅ Executar migração SQL
2. ✅ Testar criar automação
3. ✅ Testar executar manualmente
4. ✅ Ver logs
5. ⏳ Integrar com APIs (lead_created, payment_succeeded, etc.)
6. ⏳ Configurar Resend para emails
7. ⏳ Criar automações personalizadas
8. ⏳ Monitorar logs e estatísticas

---

## Documentação Completa

- **Manual Completo:** `AUTOMATIONS_README.md`
- **Exemplos de Integração:** `AUTOMATION_INTEGRATION_EXAMPLES.md`
- **Código Fonte:**
  - API: `app/api/admin/automations/`
  - UI: `components/admin-app/AutomationsContent.tsx`
  - Helper: `lib/automations.ts`
  - Migration: `supabase/migrations/20260207000001_automations.sql`

---

**Bom trabalho! O sistema de automações está pronto para uso! ⚡🎉**

# Sistema de Automações - Portal Lusitano

Sistema completo de automações com triggers e ações configuráveis.

## Estrutura

### Database Tables

#### `admin_automations`

Tabela principal que armazena as automações configuradas.

```sql
- id: UUID (primary key)
- name: TEXT (nome da automação)
- description: TEXT (descrição)
- enabled: BOOLEAN (ativa/inativa)
- trigger_type: TEXT (tipo de trigger)
- trigger_conditions: JSONB (condições do trigger)
- action_type: TEXT (tipo de ação)
- action_config: JSONB (configuração da ação)
- delay_minutes: INTEGER (delay em minutos)
- total_runs: INTEGER (total de execuções)
- successful_runs: INTEGER (execuções bem-sucedidas)
- failed_runs: INTEGER (execuções falhadas)
- last_run_at: TIMESTAMP
- last_error: TEXT
- created_by: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `admin_automation_logs`

Tabela de logs de execução das automações.

```sql
- id: UUID (primary key)
- automation_id: UUID (foreign key)
- status: TEXT ('success', 'failed', 'pending')
- trigger_data: JSONB (dados do trigger)
- action_result: JSONB (resultado da ação)
- error_message: TEXT
- executed_at: TIMESTAMP
- completed_at: TIMESTAMP
```

### API Routes

#### `GET /api/admin/automations`

Lista todas as automações com filtros opcionais.

**Query Parameters:**

- `enabled`: 'true' | 'false' | null (default: todas)
- `trigger_type`: string (default: 'all')
- `action_type`: string (default: 'all')

**Response:**

```json
{
  "automations": [...],
  "stats": {
    "total": 10,
    "enabled": 7,
    "disabled": 3,
    "total_runs": 150,
    "total_successful": 142,
    "total_failed": 8,
    "success_rate": 94
  }
}
```

#### `POST /api/admin/automations`

Criar nova automação.

**Body:**

```json
{
  "name": "Boas-vindas a novos leads",
  "description": "Enviar email automático",
  "trigger_type": "lead_created",
  "trigger_conditions": { "email_contains": "@gmail.com" },
  "action_type": "send_email",
  "action_config": {
    "template": "welcome",
    "subject": "Bem-vindo ao Portal Lusitano"
  },
  "delay_minutes": 0,
  "enabled": true
}
```

#### `PUT /api/admin/automations`

Atualizar automação existente.

**Body:**

```json
{
  "id": "uuid",
  "enabled": false
}
```

#### `DELETE /api/admin/automations?id=UUID`

Apagar automação.

#### `POST /api/admin/automations/execute`

Executar automação manualmente ou via trigger.

**Body:**

```json
{
  "automation_id": "uuid",
  "trigger_data": {
    "email": "user@example.com",
    "amount": 5000
  }
}
```

#### `GET /api/admin/automations/logs?automation_id=UUID&limit=10`

Listar logs de uma automação específica.

---

## Trigger Types

### 1. `lead_created`

Disparado quando um novo lead se regista.

**Trigger Data:**

```json
{
  "email": "user@example.com",
  "name": "João Silva",
  "lead_id": "uuid"
}
```

**Exemplo de Condições:**

```json
{
  "email_contains": "@gmail.com"
}
```

### 2. `payment_succeeded`

Disparado após pagamento bem-sucedido.

**Trigger Data:**

```json
{
  "email": "user@example.com",
  "amount": 4900,
  "payment_id": "uuid",
  "product_type": "cavalo_destaque"
}
```

**Exemplo de Condições:**

```json
{
  "amount_min": 5000,
  "amount_max": 10000
}
```

### 3. `review_submitted`

Disparado quando uma nova review é submetida.

**Trigger Data:**

```json
{
  "review_id": "uuid",
  "rating": 5,
  "reviewer_email": "user@example.com"
}
```

### 4. `cavalo_created`

Disparado quando um novo cavalo é adicionado.

**Trigger Data:**

```json
{
  "cavalo_id": "uuid",
  "name": "Novilheiro",
  "price": 15000
}
```

### 5. `time_based`

Execução agendada (diária, semanal, etc.)

**Nota:** Requer implementação de cron job ou job queue.

---

## Action Types

### 1. `send_email`

Envia email via Resend.

**Action Config:**

```json
{
  "to": "user@example.com",
  "subject": "Bem-vindo!",
  "template": "welcome"
}
```

**Templates Disponíveis:**

- `welcome`: Email de boas-vindas
- `default`: Email genérico

### 2. `create_task`

Cria tarefa na tabela `admin_tasks`.

**Action Config:**

```json
{
  "title": "Follow-up com cliente",
  "description": "Contactar cliente sobre interesse",
  "task_type": "follow_up",
  "priority": "alta"
}
```

### 3. `update_field`

Atualiza um campo numa tabela.

**Action Config:**

```json
{
  "table": "reviews",
  "id": "uuid",
  "field": "status",
  "value": "approved"
}
```

### 4. `approve_review`

Aprova review automaticamente.

**Action Config:**

```json
{
  "review_id": "uuid"
}
```

### 5. `send_notification`

Cria notificação/tarefa para o admin.

**Action Config:**

```json
{
  "title": "Nova Review Pendente",
  "message": "Review aguarda aprovação",
  "type": "info"
}
```

**Types:** `info`, `important`, `urgent`

---

## Como Integrar Automações no Código

### 1. Importar a função helper

```typescript
import { triggerAutomations } from "@/lib/automations";
```

### 2. Chamar após eventos relevantes

#### Exemplo: Nova Lead Criada

```typescript
// Em /api/crm/route.ts
const { data: lead, error } = await supabase
  .from("crm_leads")
  .insert({ ... })
  .select()
  .single();

if (lead) {
  await triggerAutomations("lead_created", {
    email: lead.email,
    name: lead.name,
    lead_id: lead.id,
  });
}
```

#### Exemplo: Pagamento Bem-Sucedido

```typescript
// Em /api/webhooks/stripe/route.ts
if (event.type === "payment_intent.succeeded") {
  await triggerAutomations("payment_succeeded", {
    email: paymentIntent.receipt_email,
    amount: paymentIntent.amount,
    payment_id: paymentIntent.id,
  });
}
```

#### Exemplo: Review Submetida

```typescript
// Em /api/reviews/route.ts
const { data: review, error } = await supabase
  .from("reviews_cavalos")
  .insert({ ... })
  .select()
  .single();

if (review) {
  await triggerAutomations("review_submitted", {
    review_id: review.id,
    rating: review.rating,
    reviewer_email: review.email,
  });
}
```

#### Exemplo: Cavalo Criado

```typescript
// Em /api/admin/cavalos/route.ts
const { data: cavalo, error } = await supabase
  .from("cavalos_venda")
  .insert({ ... })
  .select()
  .single();

if (cavalo) {
  await triggerAutomations("cavalo_created", {
    cavalo_id: cavalo.id,
    name: cavalo.nome,
    price: cavalo.preco,
  });
}
```

---

## Exemplos de Automações Úteis

### 1. Email de Boas-Vindas

```json
{
  "name": "Email de Boas-Vindas",
  "trigger_type": "lead_created",
  "action_type": "send_email",
  "action_config": {
    "subject": "Bem-vindo ao Portal Lusitano!",
    "template": "welcome"
  },
  "delay_minutes": 0
}
```

### 2. Follow-up 24h Após Pagamento

```json
{
  "name": "Follow-up Pós-Pagamento",
  "trigger_type": "payment_succeeded",
  "action_type": "create_task",
  "action_config": {
    "title": "Follow-up com cliente",
    "task_type": "follow_up",
    "priority": "normal"
  },
  "delay_minutes": 1440
}
```

### 3. Notificação de Nova Review

```json
{
  "name": "Alerta de Nova Review",
  "trigger_type": "review_submitted",
  "action_type": "send_notification",
  "action_config": {
    "title": "Nova Review Pendente",
    "message": "Uma review aguarda aprovação",
    "type": "important"
  },
  "delay_minutes": 0
}
```

### 4. Auto-Aprovar Reviews 5 Estrelas

```json
{
  "name": "Auto-Aprovar Reviews Excelentes",
  "trigger_type": "review_submitted",
  "trigger_conditions": {
    "rating_min": 5
  },
  "action_type": "approve_review",
  "action_config": {},
  "delay_minutes": 0
}
```

---

## UI - AutomationsContent.tsx

Interface completa para gestão de automações no admin:

### Features:

- Lista de automações com filtros (status, trigger, action)
- Pesquisa por nome/descrição
- Cards com estatísticas (total, ativas, execuções, taxa de sucesso)
- Toggle enable/disable
- Executar manualmente
- Ver logs de execução (últimas 10)
- Criar/Editar modal com:
  - Seleção de trigger e action
  - Editores JSON para conditions e config
  - Input de delay em minutos
- Confirmação antes de apagar
- Visual feedback com toast notifications

### Atalhos de Teclado:

- **Criar Nova:** Botão "Nova Automação"
- **Filtros:** Dropdowns de Status, Trigger e Action
- **Pesquisa:** Campo de texto com ícone de lupa

---

## Migração SQL

Executar o ficheiro:

```bash
supabase/migrations/20260207000001_automations.sql
```

Este ficheiro cria:

- Tabela `admin_automations`
- Tabela `admin_automation_logs`
- Índices para performance
- RLS policies
- Trigger para updated_at
- 3 automações de exemplo

---

## Próximos Passos (Melhorias Futuras)

1. **Job Queue:** Implementar sistema de filas para delays (usar BullMQ ou similar)
2. **Time-Based Triggers:** Implementar cron jobs para automações agendadas
3. **Webhooks:** Permitir chamar webhooks externos como ação
4. **Templates Avançados:** Editor visual de emails com templates personalizados
5. **Condições Complexas:** Suporte para AND/OR lógico nas conditions
6. **Rate Limiting:** Prevenir execução excessiva de automações
7. **Testing Mode:** Modo de teste para validar automações antes de ativar
8. **Export/Import:** Exportar e importar configurações de automações
9. **Analytics:** Dashboard dedicado com métricas detalhadas
10. **A/B Testing:** Testar diferentes configs de automações

---

## Troubleshooting

### Automação não executa

1. Verificar se está `enabled: true`
2. Verificar se as `trigger_conditions` correspondem aos dados
3. Verificar logs na tabela `admin_automation_logs`
4. Verificar `last_error` na tabela `admin_automations`

### Email não envia

1. Verificar se `RESEND_API_KEY` está configurada
2. Verificar formato do email no `action_config.to`
3. Verificar logs de erro no Resend dashboard

### Tarefa não é criada

1. Verificar se tabela `admin_tasks` existe
2. Verificar permissões RLS
3. Verificar formato do `action_config`

---

## Segurança

- Todas as rotas requerem autenticação via `verifySession()`
- RLS policies aplicadas nas tabelas
- Validação de JSON antes de executar
- Rate limiting recomendado em produção
- Logs de todas as execuções

---

## Performance

- Índices criados em campos frequentemente filtrados
- Limit de 10 logs por automação na UI
- Execução assíncrona para não bloquear requests
- Cache considerations para triggers frequentes

---

## Suporte

Para questões ou bugs, contactar a equipa de desenvolvimento.

**Versão:** 1.0.0
**Última Atualização:** 2026-02-07

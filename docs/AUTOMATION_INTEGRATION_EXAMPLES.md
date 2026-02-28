# Exemplos de Integração - Sistema de Automações

Este documento mostra como integrar o sistema de automações nas suas rotas API existentes.

## 1. CRM - Quando um novo Lead é criado

**Ficheiro:** `app/api/admin/crm/route.ts`

```typescript
import { triggerAutomations } from "@/lib/automations";

// No POST handler, após criar o lead:
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data: lead, error } = await supabase
      .from("crm_leads")
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        status: "novo",
        source: body.source,
      })
      .select()
      .single();

    if (error) throw error;

    // ✅ TRIGGER AUTOMATIONS
    await triggerAutomations("lead_created", {
      email: lead.email,
      name: lead.name,
      lead_id: lead.id,
      source: lead.source,
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Automações que podem ser disparadas:**

- Email de boas-vindas
- Criar tarefa de follow-up
- Notificar admin de novo lead
- Adicionar a lista de email marketing

---

## 2. Pagamentos - Após pagamento bem-sucedido

**Ficheiro:** `app/api/webhooks/stripe/route.ts`

```typescript
import { triggerAutomations } from "@/lib/automations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // Gravar na base de dados
      const { data: payment } = await supabase
        .from("payments")
        .insert({
          stripe_payment_id: paymentIntent.id,
          email: paymentIntent.receipt_email,
          amount: paymentIntent.amount,
          status: "succeeded",
        })
        .select()
        .single();

      // ✅ TRIGGER AUTOMATIONS
      await triggerAutomations("payment_succeeded", {
        email: paymentIntent.receipt_email,
        amount: paymentIntent.amount,
        payment_id: payment.id,
        product_type: paymentIntent.metadata.product_type,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Automações que podem ser disparadas:**

- Email de confirmação de pagamento
- Criar tarefa de follow-up 24h depois
- Desbloquear acesso premium
- Atualizar status de cavalo para "vendido"

---

## 3. Reviews - Quando uma review é submetida

**Ficheiro:** `app/api/reviews/route.ts`

```typescript
import { triggerAutomations } from "@/lib/automations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data: review, error } = await supabase
      .from("reviews_cavalos")
      .insert({
        cavalo_id: body.cavalo_id,
        nome_avaliador: body.nome_avaliador,
        email: body.email,
        rating: body.rating,
        comentario: body.comentario,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // ✅ TRIGGER AUTOMATIONS
    await triggerAutomations("review_submitted", {
      review_id: review.id,
      rating: review.rating,
      reviewer_email: review.email,
      cavalo_id: review.cavalo_id,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Automações que podem ser disparadas:**

- Notificar admin de nova review pendente
- Auto-aprovar reviews de 5 estrelas
- Email de agradecimento ao reviewer
- Criar tarefa para moderar review

---

## 4. Cavalos - Quando um cavalo é criado

**Ficheiro:** `app/api/admin/cavalos/route.ts`

```typescript
import { triggerAutomations } from "@/lib/automations";

export async function POST(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();

    const { data: cavalo, error } = await supabase
      .from("cavalos_venda")
      .insert({
        nome: body.nome,
        preco: body.preco,
        idade: body.idade,
        descricao: body.descricao,
        status: "ativo",
      })
      .select()
      .single();

    if (error) throw error;

    // ✅ TRIGGER AUTOMATIONS
    await triggerAutomations("cavalo_created", {
      cavalo_id: cavalo.id,
      name: cavalo.nome,
      price: cavalo.preco,
      created_by: email,
    });

    return NextResponse.json({ cavalo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Automações que podem ser disparadas:**

- Notificar admin de novo cavalo
- Publicar automaticamente em redes sociais
- Enviar email para leads interessados
- Criar backup de imagens

---

## 5. Contactos - Formulário de Contacto

**Ficheiro:** `app/api/contact/route.ts`

```typescript
import { triggerAutomations } from "@/lib/automations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data: contact, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message,
        form_type: body.form_type || "geral",
        status: "novo",
      })
      .select()
      .single();

    if (error) throw error;

    // ✅ TRIGGER AUTOMATIONS
    // Tratar como lead_created se for primeira mensagem
    await triggerAutomations("lead_created", {
      email: contact.email,
      name: contact.name,
      lead_id: contact.id,
      source: "contact_form",
      message: contact.message,
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Configurações de Automações Recomendadas

### 1. Workflow de Novos Leads

**Automação 1: Email Imediato**

```json
{
  "name": "Boas-vindas Imediatas",
  "trigger_type": "lead_created",
  "action_type": "send_email",
  "action_config": {
    "template": "welcome",
    "subject": "Obrigado pelo seu interesse!"
  },
  "delay_minutes": 0
}
```

**Automação 2: Follow-up 24h**

```json
{
  "name": "Follow-up 24h",
  "trigger_type": "lead_created",
  "action_type": "create_task",
  "action_config": {
    "title": "Follow-up com {{name}}",
    "priority": "normal"
  },
  "delay_minutes": 1440
}
```

### 2. Workflow de Pagamentos

**Automação 1: Confirmação**

```json
{
  "name": "Confirmação de Pagamento",
  "trigger_type": "payment_succeeded",
  "action_type": "send_email",
  "action_config": {
    "template": "payment_confirmation",
    "subject": "Pagamento Confirmado"
  },
  "delay_minutes": 0
}
```

**Automação 2: Follow-up Qualidade**

```json
{
  "name": "Pedir Feedback",
  "trigger_type": "payment_succeeded",
  "trigger_conditions": {
    "amount_min": 5000
  },
  "action_type": "create_task",
  "action_config": {
    "title": "Pedir feedback ao cliente",
    "priority": "normal"
  },
  "delay_minutes": 10080
}
```

### 3. Workflow de Reviews

**Automação 1: Notificar Admin**

```json
{
  "name": "Alerta de Nova Review",
  "trigger_type": "review_submitted",
  "action_type": "send_notification",
  "action_config": {
    "title": "Nova Review",
    "type": "important"
  },
  "delay_minutes": 0
}
```

**Automação 2: Auto-Aprovar 5 Estrelas**

```json
{
  "name": "Auto-Aprovar Excelentes",
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

## Boas Práticas

### 1. Always Await

```typescript
// ✅ CORRETO
await triggerAutomations("lead_created", data);

// ❌ ERRADO (não espera)
triggerAutomations("lead_created", data);
```

### 2. Dados Completos

```typescript
// ✅ CORRETO - Dados completos
await triggerAutomations("payment_succeeded", {
  email: payment.email,
  amount: payment.amount,
  payment_id: payment.id,
  product_type: payment.product_type,
  customer_name: payment.customer_name,
});

// ❌ ERRADO - Dados incompletos
await triggerAutomations("payment_succeeded", {
  email: payment.email,
});
```

### 3. Error Handling

```typescript
try {
  await triggerAutomations("lead_created", data);
} catch (error) {
  // Não falhar o request principal se automação falhar
  console.error("Automation error:", error);
}
```

### 4. Logging

```typescript
console.log("Triggering automations:", {
  type: "lead_created",
  lead_id: lead.id,
});

await triggerAutomations("lead_created", data);
```

---

## Testing

### 1. Criar Lead de Teste

```bash
curl -X POST http://localhost:3000/api/admin/crm \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Silva",
    "email": "teste@example.com",
    "phone": "912345678",
    "source": "website"
  }'
```

### 2. Verificar Logs

```sql
SELECT * FROM admin_automation_logs
ORDER BY executed_at DESC
LIMIT 10;
```

### 3. Verificar Estatísticas

```sql
SELECT
  name,
  total_runs,
  successful_runs,
  failed_runs,
  last_run_at
FROM admin_automations
WHERE enabled = true;
```

---

## Troubleshooting

### Automação não dispara

1. Verificar se `triggerAutomations()` é chamado
2. Verificar se automação está `enabled: true`
3. Verificar se `trigger_conditions` correspondem
4. Ver logs: `admin_automation_logs`

### Email não envia

1. Verificar `RESEND_API_KEY`
2. Verificar formato de email
3. Ver logs no dashboard da Resend

### Performance Issues

1. Usar `delay_minutes` para ações não-urgentes
2. Implementar job queue para alto volume
3. Adicionar rate limiting

---

## Next Steps

Após integrar as automações:

1. Monitorar logs regularmente
2. Ajustar `trigger_conditions` conforme necessário
3. Criar automações baseadas em padrões de uso
4. Implementar A/B testing de emails
5. Adicionar métricas de conversion

**Documentação Completa:** Ver `AUTOMATIONS_README.md`

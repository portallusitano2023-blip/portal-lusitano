# 🚀 PLANO MASTER - Features Admin Portal Lusitano

## 📊 FEATURES SOLICITADAS (por ordem de impacto)

### ✅ JÁ IMPLEMENTADO

- ✅ **Dashboard Financeiro Completo**
  - Receitas, MRR, gráficos interativos
  - Transações com filtros
  - Export CSV

- ✅ **Inbox de Mensagens**
  - Gestão centralizada de contactos
  - Responder por email via Resend
  - Filtros, pesquisa, ações em massa

- ✅ **Autenticação JWT Unificada**
  - Sessões 7 dias
  - Sistema único em todo o admin

- ✅ **APIs de Analytics** (parcial)
  - Traffic analytics
  - Conversions funnel
  - Sources & ROI

---

## 🎯 A IMPLEMENTAR (por prioridade)

### 🔥 PRIORIDADE ALTA (Impacto Imediato)

#### 1. 📊 **Dashboard Analytics Completo** ⏱️ 2-3 horas

**Estado**: APIs criadas, falta página UI

**O que faz:**

- Funil de conversão visual (visitantes → leads → clientes)
- ROI por canal de marketing (Google, Facebook, Instagram)
- Páginas que geram mais vendas
- Gráficos de tendências

**Valor:** ⭐⭐⭐⭐⭐ - Sabes EXATAMENTE o que funciona

---

#### 2. 🔔 **Notificações em Tempo Real** ⏱️ 3-4 horas

**O que faz:**

- Badge com contador de mensagens novas
- Som de alerta quando chega mensagem
- Auto-refresh a cada 30s
- Visual de "mensagem nova" destacado

**Valor:** ⭐⭐⭐⭐⭐ - Nunca mais perdes um cliente

**Tecnologia:** Polling simples (sem WebSockets para simplicidade)

---

#### 3. 📈 **Relatórios Automáticos PDF** ⏱️ 4-5 horas

**O que faz:**

- Relatório mensal automático
  - Receitas e crescimento
  - Top 10 cavalos mais vistos
  - Leads gerados
  - ROI por canal
- Export PDF profissional com branding
- Envio automático por email no dia 1 do mês
- Download manual a qualquer momento

**Valor:** ⭐⭐⭐⭐⭐ - Partilhar com investidores/parceiros

**Tecnologia:**

- `@react-pdf/renderer` para gerar PDFs
- Cron job ou Next.js API routes com agendamento

---

### ⚡ PRIORIDADE MÉDIA (Grande Valor)

#### 4. 📅 **Calendário de Follow-ups** ⏱️ 5-6 horas

**O que faz:**

- Sistema de tarefas/lembretes
- "Ligar ao João dia 15"
- "Follow-up proposta Maria"
- Vista de calendário mensal
- Notificações de tarefas pendentes

**Valor:** ⭐⭐⭐⭐ - Nunca esqueces um follow-up

**Tabelas SQL:**

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  due_date DATE,
  status TEXT, -- 'pending', 'done', 'cancelled'
  related_to TEXT, -- email do contacto
  created_at TIMESTAMP
);
```

---

#### 5. 🎯 **CRM Simplificado** ⏱️ 6-8 horas

**O que faz:**

- Pipeline visual de vendas
- Estados: "Novo → Contactado → Proposta → Ganho/Perdido"
- Drag & drop para mover clientes
- Histórico de interações
- Valor estimado do negócio

**Valor:** ⭐⭐⭐⭐ - Gestão profissional de vendas

**Tabelas SQL:**

```sql
CREATE TABLE deals (
  id UUID PRIMARY KEY,
  contact_email TEXT,
  contact_name TEXT,
  stage TEXT, -- 'new', 'contacted', 'proposal', 'won', 'lost'
  value DECIMAL,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE deal_activities (
  id UUID PRIMARY KEY,
  deal_id UUID REFERENCES deals(id),
  activity_type TEXT, -- 'call', 'email', 'meeting', 'note'
  description TEXT,
  created_at TIMESTAMP
);
```

---

#### 6. 📱 **WhatsApp Integration** ⏱️ 4-5 horas

**O que faz:**

- Responder mensagens via WhatsApp direto do inbox
- Templates de respostas rápidas
- Histórico de conversas
- Botão "Contactar via WhatsApp" em cada mensagem

**Valor:** ⭐⭐⭐⭐ - Vender onde os clientes estão

**Tecnologia:**

- WhatsApp Business API ou Twilio
- Integração com o inbox existente

---

### 🌟 PRIORIDADE BAIXA (Nice to Have)

#### 7. 📊 **A/B Testing** ⏱️ 8-10 horas

**O que faz:**

- Testar 2 versões de preços
- Testar diferentes títulos
- Testar fotos diferentes
- Métricas de performance

**Valor:** ⭐⭐⭐ - Otimização contínua

---

#### 8. 🤖 **Respostas Automáticas com IA** ⏱️ 6-8 horas

**O que faz:**

- IA responde perguntas simples automaticamente
- "Qual o preço?" → resposta automática
- "Está disponível?" → verifica BD e responde
- Review humano antes de enviar

**Valor:** ⭐⭐⭐ - Poupa tempo em respostas repetitivas

**Tecnologia:** OpenAI GPT-4 API

---

#### 9. 📸 **Galeria Inteligente** ⏱️ 4-5 horas

**O que faz:**

- Upload múltiplo de fotos
- Resize automático (otimização)
- Compressão inteligente
- Sugestão de melhor foto (IA)

**Valor:** ⭐⭐⭐ - Facilita gestão de imagens

---

#### 10. 💾 **Backup Automático** ⏱️ 3-4 horas

**O que faz:**

- Export diário para Google Drive
- Backup de BD completa
- Histórico de 30 dias
- Restore fácil

**Valor:** ⭐⭐⭐ - Segurança de dados

---

## 📅 CRONOGRAMA SUGERIDO

### Semana 1 (Máximo Impacto)

- ✅ Dia 1-2: Dashboard Analytics Completo
- ✅ Dia 3: Notificações em Tempo Real
- ✅ Dia 4-5: Relatórios Automáticos PDF

### Semana 2 (Gestão de Vendas)

- 📅 Dia 1-2: Calendário de Follow-ups
- 🎯 Dia 3-5: CRM Simplificado

### Semana 3 (Comunicação)

- 📱 Dia 1-2: WhatsApp Integration
- 🤖 Dia 3-4: Respostas Automáticas IA

### Semana 4 (Otimização)

- 📊 Dia 1-3: A/B Testing
- 📸 Dia 4: Galeria Inteligente
- 💾 Dia 5: Backup Automático

---

## 💰 ESTIMATIVA DE CUSTOS EXTERNOS

- WhatsApp Business API: ~€50/mês
- OpenAI GPT-4 API: ~€20-50/mês (depende do uso)
- Google Drive API: Grátis até 15GB

**Total:** ~€70-100/mês

---

## 🎯 RECOMENDAÇÃO

**COMEÇAR COM (Semana 1):**

1. Dashboard Analytics ← **AGORA**
2. Notificações em Tempo Real
3. Relatórios PDF

**POR QUÊ?**

- Impacto imediato
- Não requer APIs externas (sem custos)
- Dão-te visibilidade total do negócio
- Impressionam investidores/parceiros

---

## ❓ PRÓXIMO PASSO

Queres que:

- **A)** Complete o Dashboard Analytics (2-3h)
- **B)** Faça as 3 features da Semana 1 completas
- **C)** Escolhas outro conjunto de features

Diz-me e arranco! 🚀

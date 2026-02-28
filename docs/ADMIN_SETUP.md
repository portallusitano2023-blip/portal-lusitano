# Setup do Painel Admin Avançado

## 🎯 12 Features Implementadas

✅ Todas as features foram implementadas e o código compila sem erros!

### Core Functionality (4)

1. **Dashboard Widgets** - Customizável com 6 widgets
2. **Pesquisa Global** - Ctrl+K para buscar em tudo
3. **Centro Notificações** - Auto-refresh 30s
4. **Logs Atividade** - Timeline com filtros

### Analytics (4)

5. **Comparações Temporais** - Comparar períodos
6. **Funis Conversão** - Visualização interativa
7. **Heatmaps Portugal** - Análise geográfica
8. **Previsões IA** - Forecasting com tendências

### Produtividade (4)

9. **Ações em Massa** - Sistema universal
10. **Exportação** - CSV/JSON/Excel
11. **Email Campaigns** - Envio em massa
12. **Gestão Users** - CRUD admin users

---

## ⚠️ MIGRAÇÃO PENDENTE (OBRIGATÓRIA)

Precisa aplicar esta migração no Supabase Dashboard:

### 1. Email Campaigns Table

```sql
-- Ir a: https://supabase.com/dashboard/project/[PROJECT_ID]/editor

-- Copiar e executar o conteúdo de:
-- supabase/migrations/20260207000002_email_campaigns.sql
```

**Localização:** `supabase/migrations/20260207000002_email_campaigns.sql`

**O que faz:**

- Cria tabela `email_campaigns`
- Permite criar e enviar campanhas de email
- Tracking de estatísticas (enviados, abertos, clicks)

---

## 🔧 Verificações Opcionais

### Verificar Tabelas Existentes

Confirmar que estas tabelas já existem no Supabase:

- [x] `admin_users` - Gestão utilizadores admin
- [x] `admin_activity_log` - Logs de atividade
- [x] `contact_submissions` - Inbox centralizado
- [x] `payments` - Dados financeiros
- [x] `leads` - Dados de leads
- [x] `cavalos_venda` - Cavalos
- [ ] `email_campaigns` - **APLICAR MIGRAÇÃO**

### Testar Features Novas

1. **Gestão Utilizadores** (`/admin-app` → Utilizadores 🔐)
   - Criar novo utilizador admin
   - Editar roles (admin vs super_admin)
   - Ativar/desativar utilizador

2. **Geo Analytics** (`/admin-app` → Geo Analytics 🗺️)
   - Selecionar métrica (Leads, Pagamentos, Clientes)
   - Hover sobre distritos no mapa
   - Ver top 5 distritos

3. **Previsões** (`/admin-app` → Previsões 🔮)
   - Escolher métrica (Receita, Leads, Clientes)
   - Ajustar dias históricos e futuros
   - Ver confiança da previsão

4. **Email Campaigns** (via API ou criar UI)
   - POST `/api/admin/campaigns` com:
   ```json
   {
     "name": "Teste",
     "subject": "Olá!",
     "html_content": "<p>Conteúdo</p>",
     "recipient_type": "all_leads"
   }
   ```

---

## 📊 Funcionalidades do Dashboard

### Widgets Disponíveis

- **Receita** - Total, mensal, MRR, crescimento
- **Mensagens** - Novas, totais
- **Quick Stats** - Leads, eventos, cavalos
- **Atividade Recente** - Timeline
- **Ações Rápidas** - Atalhos
- **Alertas** - Notificações importantes

### Pesquisa Global (Ctrl+K)

Busca em:

- Cavalos à venda
- Eventos
- Mensagens (contactos)
- Coudelarias
- Profissionais
- Reviews

### Notificações (🔔)

Agrega de:

- Novas mensagens (contact_submissions)
- Pagamentos recentes
- Reviews pendentes
- Cavalos novos
- Uploads Instagram

---

## 🚀 Como Usar

### 1. Aplicar Migração

```sql
-- No Supabase Dashboard → SQL Editor
-- Colar conteúdo de: supabase/migrations/20260207000002_email_campaigns.sql
-- Clicar "Run"
```

### 2. Testar Build Local

```bash
npm run build  # ✅ Já passou!
npm run dev    # Testar funcionalidades
```

### 3. Aceder Admin

```
URL: http://localhost:3000/admin-app
Email: portal.lusitano2023@gmail.com
Password: [a tua password]
```

### 4. Explorar Menu

- 🏠 Dashboard
- 🐴 Cavalos
- 📅 Eventos
- 🏛️ Coudelarias
- 👔 Profissionais
- ⭐ Reviews
- 📧 Mensagens
- 💰 Cupões
- 💵 Financeiro
- 💬 Depoimentos
- 📸 Instagram
- 💼 CRM
- 📅 Calendário
- 📊 Analytics
- 🗺️ **Geo Analytics** (NOVO)
- 🔮 **Previsões** (NOVO)
- 📋 Logs
- 🔐 **Utilizadores** (NOVO)
- ⚙️ Definições

---

## 📚 APIs Criadas

### Novas Endpoints

| Endpoint                   | Método         | Função               |
| -------------------------- | -------------- | -------------------- |
| `/api/admin/search`        | GET            | Pesquisa global      |
| `/api/admin/notifications` | GET            | Listar notificações  |
| `/api/admin/logs`          | GET            | Logs com filtros     |
| `/api/admin/campaigns`     | GET/POST       | Campanhas email      |
| `/api/admin/users`         | GET/POST       | Listar/criar users   |
| `/api/admin/users/[id]`    | GET/PUT/DELETE | CRUD user específico |
| `/api/admin/geo`           | GET            | Dados geográficos    |
| `/api/admin/forecasting`   | GET            | Previsões/forecasts  |

---

## 🎨 Componentes Reutilizáveis

Criados para usar em todo o admin:

### `<TemporalComparison>`

```tsx
import TemporalComparison from "@/components/admin-app/TemporalComparison";

<TemporalComparison current={150} previous={100} label="Leads este mês" format="number" />;
```

### `<ConversionFunnel>`

```tsx
import ConversionFunnel from "@/components/admin-app/ConversionFunnel";

<ConversionFunnel
  stages={[
    { id: "visitors", label: "Visitantes", count: 1000, icon: Users, color: "..." },
    { id: "leads", label: "Leads", count: 200, icon: Mail, color: "..." },
    // ...
  ]}
/>;
```

### `<PortugalHeatmap>`

```tsx
import PortugalHeatmap from "@/components/admin-app/PortugalHeatmap";

<PortugalHeatmap
  data={[
    { name: "Lisboa", value: 150 },
    { name: "Porto", value: 80 },
    // ...
  ]}
  colorScheme="gold"
/>;
```

### `useBulkSelection` Hook

```tsx
import { useBulkSelection } from "@/components/admin-app/BulkActions";

const { selectedIds, toggleItem, selectAll, clearSelection } = useBulkSelection(items, "id");
```

### Export Functions

```tsx
import { exportToCSV, exportToJSON, exportToExcel } from "@/lib/export";
import { ExportButton, ExportMenu } from "@/components/ExportButtons";

<ExportButton data={myData} format="csv" filename="export" />
<ExportMenu data={myData} />
```

---

## ✨ Melhorias Futuras (Opcional)

Se quiseres expandir ainda mais:

1. **Email Templates** - Editor visual de templates
2. **A/B Testing** - Testar campanhas de email
3. **Webhooks** - Notificar sistemas externos
4. **Relatórios PDF** - Exportar analytics em PDF
5. **Chatbot Integrado** - Responder leads automaticamente
6. **Multi-idioma** - Suporte PT/EN/ES
7. **Permissões Granulares** - Roles mais específicos
8. **Audit Trail Completo** - Rastrear TODAS as mudanças
9. **Backup Automático** - Backup BD agendado
10. **Mobile App Admin** - React Native para mobile

---

## 🐛 Troubleshooting

### Erro: "Table email_campaigns does not exist"

**Solução:** Aplicar migração SQL (ver secção acima)

### Erro: TypeScript compilation error

**Solução:** `npm run build` deve passar agora (exit code 0)

### Notificações não aparecem

**Verificar:**

1. Centro de notificações está no header (🔔)
2. Auto-refresh de 30s está ativo
3. Existem dados nas tabelas

### Heatmap vazio

**Verificar:**

1. Campo `location` nos leads está preenchido
2. Localização corresponde a cidades portuguesas
3. API `/api/admin/geo` retorna dados

---

## 📞 Suporte

Se encontrares problemas:

1. Verificar logs do browser (F12 → Console)
2. Verificar logs do servidor (terminal npm run dev)
3. Verificar se migração foi aplicada no Supabase
4. Confirmar variáveis ambiente (.env.local)

---

**🚀 O admin está pronto para usar! Basta aplicar a migração e explorar as novas funcionalidades.**

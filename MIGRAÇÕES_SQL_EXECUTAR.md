# 🚀 Migrações SQL - Portal Lusitano Admin

## 📋 **Ficheiros SQL para Executar no Supabase Dashboard**

Tens **6 migrações** para executar. Executa pela **ORDEM** indicada!

---

## ✅ **ORDEM DE EXECUÇÃO:**

### **1. Views Count** (Analytics)
**Ficheiro:** `supabase/migrations/20260206_add_views_count.sql`
**O que faz:** Adiciona contadores de visualizações a cavalos e eventos

```
1. Abre Supabase Dashboard → SQL Editor
2. Copia TODO o conteúdo do ficheiro
3. Cola e clica "Run"
4. ✅ Deves ver "Success. No rows returned"
```

---

### **2. Coudelarias** (Diretório GRÁTIS)
**Ficheiro:** `supabase/migrations/20260206_coudelarias_simple.sql`
**O que faz:** Cria tabela de coudelarias (só informação, SEM pagamentos)

```
1. Abre Supabase Dashboard → SQL Editor
2. Copia TODO o conteúdo do ficheiro
3. Cola e clica "Run"
4. ✅ Deves ver "Success. No rows returned"
```

---

### **3. Profissionais PREMIUM** (Sistema PAGO)
**Ficheiro:** `supabase/migrations/20260206_profissionais_premium.sql`
**O que faz:** Sistema completo de profissionais com:
- Planos: Bronze (€10/mês), Prata (€20/mês), Ouro (€40/mês)
- Reviews de clientes
- Lead generation
- Analytics avançado
- Portfolio e certificações

```
1. Abre Supabase Dashboard → SQL Editor
2. Copia TODO o conteúdo do ficheiro
3. Cola e clica "Run"
4. ✅ Deves ver "Success. No rows returned"
```

---

### **4. Admin Tasks** (Calendário)
**Ficheiro:** `supabase/migrations/20260206_admin_tasks.sql`
**O que faz:** Sistema de tarefas e follow-ups para o calendário

```
1. Abre Supabase Dashboard → SQL Editor
2. Copia TODO o conteúdo do ficheiro
3. Cola e clica "Run"
4. ✅ Deves ver "Success. No rows returned"
```

---

### **5. CRM Leads** (Pipeline de Vendas)
**Ficheiro:** `supabase/migrations/20260206_crm_leads.sql`
**O que faz:** Sistema CRM com pipeline drag-and-drop

```
1. Abre Supabase Dashboard → SQL Editor
2. Copia TODO o conteúdo do ficheiro
3. Cola e clica "Run"
4. ✅ Deves ver "Success. No rows returned"
```

---

### **6. Admin Logs** (Auditoria)
**Ficheiro:** `supabase/migrations/20260206_admin_logs.sql`
**O que faz:** Sistema de logs para ver TUDO o que acontece no admin

```
1. Abre Supabase Dashboard → SQL Editor
2. Copia TODO o conteúdo do ficheiro
3. Cola e clica "Run"
4. ✅ Deves ver "Success. No rows returned"
```

---

### **7. Cupões de Desconto**
**Ficheiro:** `supabase/migrations/20260206_cupoes_desconto.sql`
**O que faz:** Sistema de cupões promocionais (ex: BLACK10 = 10% desconto)

```
1. Abre Supabase Dashboard → SQL Editor
2. Copia TODO o conteúdo do ficheiro
3. Cola e clica "Run"
4. ✅ Deves ver "Success. No rows returned"
```

---

## 🎯 **Depois de Executar TODAS:**

Reinicia o servidor dev:
```bash
npm run dev
```

E acede a:
- `/admin` - Dashboard principal
- `/admin/coudelarias` - Gestão coudelarias (grátis)
- `/admin/profissionais` - Gestão profissionais (PAGO)
- `/admin/calendario` - Tarefas e follow-ups
- `/admin/crm` - Pipeline de vendas
- `/admin/logs` - Ver auditoria
- `/admin/cupoes` - Gerir cupões

---

## ❓ **Se Aparecer Erro "Already Exists":**

É normal! Significa que essa tabela JÁ EXISTE. Podes ignorar.

Mas se aparecer **ERROR** a vermelho, copia a mensagem e envia-me!

---

## 💡 **Funcionalidades Implementadas:**

✅ Push Notifications desktop
✅ Coudelarias (diretório grátis)
✅ Profissionais SUPER PREMIUM (planos €10/€20/€40)
✅ Sistema de Reviews
✅ Lead Generation
✅ Analytics avançado
✅ CRM com pipeline
✅ Calendário de tarefas
✅ Sistema de Logs
✅ Cupões de desconto
✅ WhatsApp integration
✅ Dashboard financeiro
✅ Relatórios PDF

---

**Total de tempo para executar:** ~5 minutos

**Depois está TUDO pronto!** 🚀

# 🔍 Teste de Verificação das Tabelas

## ⚠️ Os erros continuam? Vamos verificar:

### 1️⃣ Verificar se o SQL foi executado com SUCESSO

No Supabase SQL Editor, **depois de executar** o `SETUP_ADMIN_COMPLETO.sql`, deves ver:

✅ **Mensagem de sucesso** sem erros
✅ **Tabela de resultados** no final:

```
tabela                  | registos
------------------------|----------
contact_submissions     | 0
payments                | X
leads                   | X
```

### ❌ Se viste algum ERRO ao executar o SQL:

Copia o erro completo e diz-me qual é.

---

## 2️⃣ Testar Manualmente no Supabase

Para confirmar que as tabelas existem:

1. Supabase Dashboard → **Table Editor**
2. Procura as tabelas:
   - `contact_submissions` ✅
   - `payments` ✅
   - `leads` ✅

### ❌ Se NÃO vires estas tabelas:

O SQL não foi executado corretamente. Tenta novamente:

1. **APAGA tudo** do SQL Editor
2. **COPIA tudo** do ficheiro `SETUP_ADMIN_COMPLETO.sql` (Ctrl+A no ficheiro)
3. **COLA** no SQL Editor
4. **RUN** (F5)
5. **ESPERA** pela mensagem de sucesso

---

## 3️⃣ Verificar Permissões RLS

Se as tabelas existem mas continuam os erros, pode ser RLS.

No Supabase SQL Editor, executa este comando para **desabilitar temporariamente** o RLS:

```sql
-- Desabilitar RLS temporariamente para testar
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
```

Depois **recarrega o admin** (Ctrl+F5).

---

## 4️⃣ Verificar Logs de Erro

Se os erros continuam, preciso ver o erro **completo**.

No navegador:
1. Abre **DevTools** (F12)
2. Vai à tab **Console**
3. Clica no erro vermelho
4. **Copia tudo** e manda-me

---

## 🎯 Próximo Passo

Diz-me qual dos cenários acima é o teu caso:

A) ❌ O SQL deu erro ao executar (qual erro?)
B) ✅ O SQL executou mas não vejo as tabelas no Table Editor
C) ✅ Vejo as tabelas mas continuam os 3 erros (manda-me o log completo)
D) ✅ Funcionou depois de desabilitar RLS

Assim consigo ajudar-te melhor! 😊

# 🚀 COPIAR PÁGINAS REAIS PARA COMPONENTES TAB

## Instruções Rápidas

Para cada página, faz copy/paste do código completo de uma página para o componente correspondente, **MUDANDO APENAS AS CORES** para o tema escuro.

---

## 1. DashboardContent.tsx

**COPIAR DE:** `app/admin/page.tsx`
**COLAR EM:** `components/admin-app/DashboardContent.tsx`

**Mudanças a fazer:**

1. Mudar `export default function AdminDashboard()` para `export default function DashboardContent()`
2. **Remover** imports e componentes de:
   - `useRouter` e `router.push()` - JÁ estás no admin
   - `NotificationBadge` - não precisa
   - `handleLogout` - não precisa (já está na sidebar)
   - Links de navegação `<Link href="/admin"` - remover botões de voltar

3. **Cores - substituir:**
   - `bg-white` → `bg-[#0A0A0A]`
   - `bg-gray-50` → `bg-[#050505]`
   - `text-gray-900` → `text-white`
   - `text-gray-600` → `text-gray-400`
   - `border-gray-200` → `border-white/10`

---

## 2. EventosContent.tsx

**COPIAR DE:** `app/admin/eventos/page.tsx`
**COLAR EM:** `components/admin-app/EventosContent.tsx`

**Mudanças:**

1. Mudar `export default function AdminEventosPage()` para `export default function EventosContent()`
2. Remover `<Link href="/admin"` (botão voltar)
3. Mesmas substituições de cores acima
4. `bg-white shadow` → `bg-[#0A0A0A] border border-[#1A1A1A]`

---

## 3. CoudelariasContent.tsx

**COPIAR DE:** `app/admin/coudelarias/page.tsx`
**COLAR EM:** `components/admin-app/CoudelariasContent.tsx`

**Mudanças:**

1. Mudar `export default function CoudelariasPage()` para `export default function CoudelariasContent()`
2. Remover links de navegação
3. Cores já estão certas (página já usa tema escuro!) ✅
4. **ADICIONAR:** `const [planoFilter, setPlanoFilter] = useState("all");` (faltava declaração)

---

## 4. ReviewsContent.tsx

**COPIAR DE:** `app/admin/reviews/page.tsx`
**COLAR EM:** `components/admin-app/ReviewsContent.tsx`

**Mudanças:**

1. Mudar `export default function AdminReviewsPage()` para `export default function ReviewsContent()`
2. Remover `<Link href="/admin"` (botão voltar)
3. Substituir cores:
   - `bg-white` → `bg-[#0A0A0A]`
   - `bg-gray-50` → `bg-[#050505]`
   - Mesmas substituições acima

---

## 5. FinanceiroContent + MensagensContent

Estas páginas são mais complexas. Vou criar ficheiros simplificados para começar.

---

## ⚡ ATALHO SUPER RÁPIDO

Abre 2 janelas lado a lado:

1. **Esquerda**: `app/admin/[nome]/page.tsx`
2. **Direita**: `components/admin-app/[Nome]Content.tsx`

**Faz:**

1. Copia TUDO da esquerda
2. Cola na direita
3. Ctrl+H (Find & Replace):
   - `bg-white` → `bg-[#0A0A0A]`
   - `bg-gray-50` → `bg-[#050505]`
   - `text-gray-900` → `text-white`
   - `text-gray-600` → `text-gray-400`
   - `border-gray-200` → `border-white/10`
4. Muda nome da função
5. Remove imports/código de navegação

**Demora 2 minutos por página!** 🚀

---

## ✅ Ficheiros FEITOS:

- [x] CavalosContent.tsx (já está com dados reais!)

## 📋 Ficheiros TODO:

- [ ] DashboardContent.tsx
- [ ] EventosContent.tsx
- [ ] CoudelariasContent.tsx (fix planoFilter)
- [ ] ReviewsContent.tsx
- [ ] FinanceiroContent.tsx
- [ ] MensagensContent.tsx
- [ ] ProfissionaisContent.tsx (criar novo)
- [ ] CupoesContent.tsx (criar novo)

---

**Queres que eu faça isto programaticamente ou preferes fazer manualmente?**

- **Manual** = Tu fazes, 15 minutos
- **Programático** = Eu faço, mas demora mais porque tenho que fazer um a um devido ao tamanho dos ficheiros

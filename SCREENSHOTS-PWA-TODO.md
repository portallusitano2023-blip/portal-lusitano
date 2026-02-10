# 📸 SCREENSHOTS PWA - INSTRUÇÕES

**Status:** ⏳ TODO - Aguarda captura manual
**Impacto:** +15-25% install rate do PWA

---

## 🎯 OBJETIVO

Capturar 4 screenshots de alta qualidade do Portal Lusitano para o PWA manifest. Screenshots são exibidos na Chrome install prompt e aumentam significativamente a taxa de instalação.

---

## 📋 SCREENSHOTS NECESSÁRIOS

### 1. Home Desktop (Wide)

**Ficheiro:** `public/screenshots/home-desktop.webp`
**Tamanho:** 1280x720px
**Página:** https://portal-lusitano.pt/
**Viewport:** Desktop (1280px largura mínimo)

**Como capturar:**

1. Abrir https://portal-lusitano.pt/ em Chrome
2. DevTools (F12) → Device Toolbar (Ctrl+Shift+M)
3. Selecionar "Responsive" e definir 1280x720
4. Scroll até o topo (mostrar hero section)
5. Screenshot: DevTools → ⋮ (três pontos) → Capture screenshot
6. Converter para WebP (ver seção "Conversão" abaixo)

**O que incluir:**

- ✅ Hero section com imagem de cavalo
- ✅ Título "Portal Lusitano"
- ✅ Citação do Mestre Nuno Oliveira
- ✅ Navbar dourado

---

### 2. Marketplace Desktop (Wide)

**Ficheiro:** `public/screenshots/marketplace-desktop.webp`
**Tamanho:** 1280x720px
**Página:** https://portal-lusitano.pt/marketplace
**Viewport:** Desktop (1280px largura mínimo)

**Como capturar:**

1. Abrir https://portal-lusitano.pt/marketplace
2. DevTools → Device Toolbar → 1280x720
3. Scroll para mostrar 4-6 cards de cavalos
4. Capture screenshot
5. Converter para WebP

**O que incluir:**

- ✅ Cards de cavalos com fotos
- ✅ Filtros laterais (coudelaria, preço, etc.)
- ✅ Título "Cavalos Lusitanos à Venda"

---

### 3. Loja Mobile (Narrow)

**Ficheiro:** `public/screenshots/loja-mobile.webp`
**Tamanho:** 750x1334px (iPhone 6/7/8 Plus)
**Página:** https://portal-lusitano.pt/loja
**Viewport:** Mobile (750px largura)

**Como capturar:**

1. Abrir https://portal-lusitano.pt/loja
2. DevTools → Device Toolbar → iPhone 6/7/8 Plus (750x1334)
3. Scroll para mostrar produtos variados
4. Capture screenshot
5. Converter para WebP

**O que incluir:**

- ✅ Grid de produtos (selins, rédeas, etc.)
- ✅ Preços visíveis
- ✅ Botões "Adicionar ao Carrinho"

---

### 4. Jornal Mobile (Narrow)

**Ficheiro:** `public/screenshots/jornal-mobile.webp`
**Tamanho:** 750x1334px
**Página:** https://portal-lusitano.pt/jornal
**Viewport:** Mobile (750px largura)

**Como capturar:**

1. Abrir https://portal-lusitano.pt/jornal
2. DevTools → Device Toolbar → iPhone 6/7/8 Plus
3. Scroll para mostrar artigos
4. Capture screenshot
5. Converter para WebP

**O que incluir:**

- ✅ Cards de artigos com imagens
- ✅ Títulos e categorias visíveis
- ✅ Pelo menos 3 artigos

---

## 🔧 CONVERSÃO PARA WEBP

### Opção 1: Online (Mais fácil)

1. Ir para https://cloudconvert.com/png-to-webp
2. Upload da imagem PNG
3. Quality: 85%
4. Convert & Download
5. Renomear conforme especificado

### Opção 2: Command Line (Requer cwebp)

```bash
# Instalar cwebp
# Windows: https://developers.google.com/speed/webp/download
# Mac: brew install webp
# Linux: sudo apt install webp

# Converter
cwebp -q 85 input.png -o output.webp

# Exemplo
cwebp -q 85 home-desktop.png -o home-desktop.webp
```

### Opção 3: Photoshop/GIMP

- File → Export → WebP
- Quality: 85%
- Save

---

## 📁 ESTRUTURA DE DIRETÓRIOS

```
public/
  screenshots/          ← CRIAR ESTA PASTA
    home-desktop.webp
    marketplace-desktop.webp
    loja-mobile.webp
    jornal-mobile.webp
```

**Comandos:**

```bash
cd public
mkdir screenshots
cd screenshots
# Colocar os 4 ficheiros WebP aqui
```

---

## ✅ CHECKLIST DE QUALIDADE

Antes de considerar completo, verificar:

### Conteúdo

- [ ] Todas as 4 screenshots capturadas
- [ ] Nomes de ficheiros corretos (lowercase, hífens)
- [ ] Formato WebP (não PNG ou JPG)

### Tamanhos

- [ ] home-desktop.webp: 1280x720px
- [ ] marketplace-desktop.webp: 1280x720px
- [ ] loja-mobile.webp: 750x1334px
- [ ] jornal-mobile.webp: 750x1334px

### Qualidade

- [ ] Quality 85% (equilíbrio tamanho/qualidade)
- [ ] Sem textos cortados
- [ ] Cores vibrantes (não muito escuras)
- [ ] Sem elementos de UI do browser (tabs, etc.)

### Ficheiros

- [ ] Pasta `public/screenshots/` criada
- [ ] 4 ficheiros WebP na pasta
- [ ] Tamanho total < 1MB (idealmente < 500KB)

---

## 🧪 TESTAR PWA SCREENSHOTS

Após adicionar os screenshots:

### 1. Build de produção

```bash
npm run build
npm start
```

### 2. Testar em Chrome DevTools

1. Abrir https://localhost:3000
2. DevTools → Application → Manifest
3. Verificar se screenshots aparecem na seção "Screenshots"

### 3. Testar install prompt

1. Chrome em mobile ou desktop
2. Clicar no ícone de instalação (⊕) na URL bar
3. Verificar se screenshots aparecem no dialog

---

## 📊 IMPACTO ESPERADO

**Antes (sem screenshots):**

- Install prompt sem preview
- Taxa de conversão: ~5-10%

**Depois (com screenshots):**

- Install prompt com carousel de screenshots
- Taxa de conversão: ~20-35% (+15-25%)

**ROI:** ~3x mais instalações do PWA

---

## 🔗 REFERÊNCIAS

- [Web.dev - Add a web app manifest](https://web.dev/add-manifest/)
- [MDN - Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Chrome - Richer PWA installation](https://developer.chrome.com/blog/richer-pwa-installation/)

---

## ✅ VERIFICAÇÃO FINAL

Após criar os screenshots, executar:

```bash
npx tsx scripts/validate-pwa-screenshots.ts
```

Este script verificará:

- ✅ Todos os 4 ficheiros existem
- ✅ Tamanhos corretos
- ✅ Formato WebP
- ✅ Tamanho de ficheiro < 200KB cada

---

**IMPORTANTE:** Só marcar como completo após:

1. ✅ 4 screenshots criados
2. ✅ Ficheiros na pasta `public/screenshots/`
3. ✅ Script de validação passa 100%
4. ✅ PWA install prompt mostra screenshots

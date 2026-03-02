# Auditoria Completa — Portal Lusitano

**Data:** 2 de Março de 2026
**Âmbito:** Performance, Imagens, Bundle JS, CSS, Fonts, Caching, Core Web Vitals, SEO Técnico

---

## Resumo Executivo

O Portal Lusitano tem uma base técnica forte — Next.js 16, Tailwind v4, ISR bem configurado, JSON-LD extenso e code-splitting inteligente. A auditoria identificou **oportunidades de melhoria concretas** organizadas por impacto.

**Score estimado atual:** LCP ~2.0-2.5s | CLS ~0.05-0.1 | INP <100ms
**Score possível após melhorias:** LCP <1.5s | CLS <0.05 | INP <50ms

---

## 1. IMAGENS — Impacto: ALTO

### 1.1 Estado Atual

- **194 ficheiros de imagem** (~37MB na pasta public/)
- **65% já em WebP** (126 ficheiros) — bom
- **35% ainda em JPG/PNG** (46 ficheiros) — oportunidade
- Logo: `logo.png` (62KB) vs `logo.webp` (4.3KB) — redução de 93%
- Coudelarias: 33MB de 37MB total (89%) — imagens entre 350-537KB
- **36 componentes** usam `next/image`, apenas **1 usa `<img>` nativo** (InstagramContent.tsx)

### 1.2 Problemas Identificados

**P1. Tag `<img>` nativa sem otimização** — `components/admin-app/InstagramContent.tsx:241`

```tsx
// PROBLEMA: Sem width/height, sem lazy loading, sem otimização
<img src={url} alt={`Media ${idx + 1}`} className="w-full h-auto" />
```

**P2. Imagens de coudelarias entre 350-537KB** — demasiado pesadas para mobile.

**P3. Sem geração automática de múltiplos tamanhos** — depende do Next.js Image API em runtime.

### 1.3 Soluções

**S1. Corrigir `<img>` nativo:**

```tsx
// components/admin-app/InstagramContent.tsx
import Image from "next/image";
// ...
<Image src={url} alt={`Media ${idx + 1}`} width={300} height={300} className="w-full h-auto" />;
```

**S2. Script de otimização de imagens (build time):**
Criar `scripts/optimize-images.ts`:

```typescript
import sharp from "sharp";
import { readdirSync, existsSync, mkdirSync } from "fs";
import { join, parse } from "path";

const SIZES = [400, 800, 1200, 1600];
const QUALITY = { webp: 80, avif: 65, jpeg: 85 };
const INPUT_DIR = "public/images";
const OUTPUT_DIR = "public/images/optimized";

async function optimizeImage(filePath: string) {
  const { name } = parse(filePath);
  const image = sharp(filePath);
  const metadata = await image.metadata();

  for (const width of SIZES) {
    if (metadata.width && width > metadata.width) continue;

    // WebP
    await image
      .clone()
      .resize(width)
      .webp({ quality: QUALITY.webp })
      .toFile(join(OUTPUT_DIR, `${name}-${width}w.webp`));

    // AVIF (melhor compressão, suporte crescente)
    await image
      .clone()
      .resize(width)
      .avif({ quality: QUALITY.avif })
      .toFile(join(OUTPUT_DIR, `${name}-${width}w.avif`));

    // JPEG fallback
    await image
      .clone()
      .resize(width)
      .jpeg({ quality: QUALITY.jpeg, progressive: true })
      .toFile(join(OUTPUT_DIR, `${name}-${width}w.jpg`));
  }

  // Placeholder blur (base64, 20px wide)
  const blurBuffer = await image.clone().resize(20).webp({ quality: 20 }).toBuffer();

  return `data:image/webp;base64,${blurBuffer.toString("base64")}`;
}
```

Adicionar ao `package.json`:

```json
"optimize-images": "npx tsx scripts/optimize-images.ts"
```

**S3. Componente ResponsiveImage com srcset:**

```tsx
// components/ui/ResponsiveImage.tsx
import Image from "next/image";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  aspectRatio?: string; // ex: "4/5", "16/9"
}

export default function ResponsiveImage({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className = "",
  aspectRatio = "4/5",
}: ResponsiveImageProps) {
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={80}
        placeholder={priority ? undefined : "blur"}
        blurDataURL={priority ? undefined : undefined} // usar blur-data.json
        className={`object-cover ${className}`}
      />
    </div>
  );
}
```

A propriedade `aspectRatio` no container **elimina CLS** antes da imagem carregar.

---

## 2. BUNDLE JAVASCRIPT — Impacto: MÉDIO-ALTO

### 2.1 Estado Atual — Excelente Base

- **Code-splitting bem implementado:** Leaflet, PDF, Confetti são `dynamic()`
- **Sentry:** Lazy-loaded pós-hydration, 10% sampling, replays desactivados
- **ClientOverlays:** Tudo lazy — CookieConsent, Newsletter, CartDrawer, Analytics, MobileNav
- **serverExternalPackages:** @react-pdf, resend, sanitize-html, sharp, jspdf, sanity
- **optimizePackageImports:** 16 packages com tree-shaking

### 2.2 Problemas Identificados

**P1. ShareButtons.tsx (18KB/358 linhas) — NÃO é lazy-loaded**
Carrega em todas as páginas mesmo quando não visível.

**P2. Chunk JS de 4.1MB no build** — precisa investigação.

**P3. Ficheiros de tradução ~112KB cada** — carregados inteiros.

### 2.3 Soluções

**S1. Lazy-load ShareButtons:**

```tsx
// Em qualquer componente que use ShareButtons
const ShareButtons = dynamic(() => import("@/components/ShareButtons"), {
  ssr: false,
  loading: () => null,
});
```

**S2. Investigar chunk de 4.1MB:**

```bash
# Correr bundle analyzer para identificar o culpado
ANALYZE=true npm run build
```

Provavelmente é o Sanity Studio (`/studio`). Se for, adicionar lazy-loading:

```tsx
// app/studio/[[...tool]]/page.tsx
const Studio = dynamic(() => import("./StudioComponent"), { ssr: false });
```

**S3. Split de traduções por namespace:**

```typescript
// Em vez de carregar 112KB inteiro:
const translations = await import(`@/locales/${lang}.json`);

// Carregar por namespace:
const common = await import(`@/locales/${lang}/common.json`);
const tools = await import(`@/locales/${lang}/tools.json`);
// Carregar tools apenas nas páginas de ferramentas
```

**S4. Verificar @stripe/stripe-js:**

```tsx
// Deve ser importado apenas nas páginas de pagamento
// lib/stripe.ts
export async function getStripe() {
  const { loadStripe } = await import("@stripe/stripe-js");
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
}
```

---

## 3. CSS — Impacto: BAIXO

### 3.1 Estado Atual — Bem Otimizado

- **globals.css:** 1.042 linhas (~23KB) — razoável
- **~30 animações** — todas parecem ser usadas
- **Respeita `prefers-reduced-motion`** — excelente
- **`content-visibility: auto`** para conteúdo off-screen
- **Tailwind v4** com purge automático
- **Sem CSS duplicado** — tudo via Tailwind utilities

### 3.2 Oportunidade Menor

**Optimização:** Verificar se todas as 30 animações são realmente usadas:

```bash
# Grep para cada keyframe name nos componentes
grep -r "preloaderLine\|preloaderBar\|auth-shake\|gentle-bounce" --include="*.tsx" components/ app/
```

---

## 4. CACHING — Impacto: MÉDIO

### 4.1 Estado Actual — Muito Bom

| Recurso           | Cache-Control           | Notas            |
| ----------------- | ----------------------- | ---------------- |
| `/_next/static/*` | 1 ano, immutable        | Hash no filename |
| `/images/*`       | 1 ano, immutable (prod) | Correcto         |
| `*.woff2`         | 1 ano, immutable        | Fonts            |
| `/sw.js`          | 0, must-revalidate      | Service worker   |
| `/sitemap.xml`    | 24h + SWR 1h            | Bom              |
| API cavalos       | 30min + SWR 1h          | Adequado         |
| API search        | 30s + SWR 2min          | Adequado         |

### 4.2 ISR (Incremental Static Regeneration)

| Rota             | Revalidate    | Adequado? |
| ---------------- | ------------- | --------- |
| `/`              | 3600s (1h)    | Sim       |
| `/comprar`       | 3600s (1h)    | Sim       |
| `/comprar/[id]`  | 1800s (30min) | Sim       |
| `/jornal/[slug]` | 21600s (6h)   | Sim       |
| `/loja`          | 1800s (30min) | Sim       |
| `/glossario`     | 86400s (24h)  | Sim       |

### 4.3 Oportunidades

**S1. Adicionar `stale-while-revalidate` ao Service Worker para APIs:**
O sw.js já tem uma estratégia Network-First para APIs. Considerar adicionar SWR para dados que mudam pouco (linhagens, glossário).

**S2. Client Router Cache — já configurado:**

```javascript
staleTimes: { dynamic: 180, static: 300 }
```

Navegação back/forward instantânea. Excelente.

---

## 5. CORE WEB VITALS — Impacto: ALTO

### 5.1 LCP (Largest Contentful Paint)

**Alvo: < 2.5s (bom), < 1.5s (excelente)**

O LCP é provavelmente a hero image na homepage ou a primeira imagem em `/comprar`.

**Melhorias concretas:**

```tsx
// HomeContent.tsx — marcar hero image como priority
<Image
  src="/images/home/hero.webp"
  alt="Cavalo Lusitano"
  fill
  priority // <- Desactiva lazy loading, adiciona preload
  sizes="100vw"
  quality={80}
/>
```

```tsx
// HorseCard.tsx — primeiros 4 cards com priority
// Já implementado! priority={priority} na linha 88
// Verificar que as páginas passam priority={true} aos primeiros 4 cards
```

**Adicionar preload da LCP image no `<head>`:**

```tsx
// app/layout.tsx ou app/page.tsx
<link
  rel="preload"
  as="image"
  href="/images/home/hero.webp"
  type="image/webp"
  fetchPriority="high"
/>
```

### 5.2 CLS (Cumulative Layout Shift)

**Alvo: < 0.1 (bom), < 0.05 (excelente)**

**Estado actual:**

- `next/image` com `fill` + container `aspect-ratio` — previne shift
- Fonts com `display: "swap"` — pode causar shift menor
- `preload: true` nas fonts — minimiza shift

**Melhorias:**

```css
/* globals.css — font fallback metrics para minimizar swap shift */
@font-face {
  font-family: "Playfair Fallback";
  src: local("Times New Roman");
  ascent-override: 95%;
  descent-override: 22%;
  line-gap-override: 0%;
  size-adjust: 110%;
}
```

### 5.3 INP (Interaction to Next Paint)

**Alvo: < 200ms (bom), < 100ms (excelente)**

**Estado actual:** Provavelmente bom — sem cálculos pesados no main thread.

**Potencial problema:** HomeContent.tsx (38KB) é "use client" com muitos useMemo. Considerar:

```tsx
// Dividir HomeContent em Server Component + Client islands
// app/page.tsx
export default function HomePage() {
  return (
    <>
      <HeroSection /> {/* Server Component */}
      <FeaturesGrid /> {/* Server Component */}
      <InteractiveSection /> {/* Client Component */}
    </>
  );
}
```

---

## 6. FONTS — Impacto: BAIXO

### 6.1 Estado Actual — Excelente

- **Playfair Display:** 400, 700 (2 pesos) — correcto
- **Montserrat:** 300, 400, 700 (3 pesos) — correcto
- **Subset:** `latin` — reduz ~90% do tamanho
- **display: "swap"** — texto visível imediatamente
- **preload: true** — carrega no `<head>`
- **next/font/google** — self-hosted, sem round-trip a fonts.googleapis.com

### 6.2 Oportunidades Menores

**Considerar remover peso 300 do Montserrat** se usado raramente:

```typescript
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"], // Remover "300" se possível
  variable: "--font-sans",
  display: "swap",
  preload: true,
});
```

Cada peso removido poupa ~15-25KB.

---

## 7. SEO TÉCNICO — Impacto: CRÍTICO

### 7.1 O Que Está Bem

- **JSON-LD extenso:** 15+ tipos de schema (Organization, Website, Article, Product, FAQ, Event, LocalBusiness, Horse, Breadcrumb, Book, Video, etc.)
- **Sitemap dinâmico:** Gera URLs para coudelarias, eventos, cavalos, linhagens, artigos
- **hreflang no sitemap:** Cada URL tem alternates pt-PT, en-US, es-ES
- **robots.ts:** Bloqueia AI scrapers (GPTBot, CCBot, etc.)
- **Canonical URL** no root layout
- **Open Graph + Twitter Cards** no root layout
- **Google Search Console** verificado

### 7.2 Problemas CRÍTICOS

**P1. 55% das páginas SEM metadata exports (30/55 páginas)**

Páginas sem `export const metadata` ou `generateMetadata()`:

- `/cavalos-famosos` — página importante para SEO
- `/glossario` — target para featured snippets
- `/linhagens` — conteúdo educacional valioso
- `/piroplasmose` — conteúdo médico
- `/calculadora-valor` — ferramenta interactiva
- `/analise-perfil` — ferramenta interactiva
- `/comparador-cavalos` — ferramenta interactiva
- `/verificador-compatibilidade` — ferramenta interactiva
- `/ferramentas` — hub de ferramentas
- `/historico` — conteúdo educacional
- E mais ~20 páginas

**Impacto:** Google usa title e description genéricos do template root → CTR baixo nos resultados.

**P2. hreflang NÃO existe por página — apenas no root layout**

```typescript
// ACTUAL: Apenas no root layout
alternates: {
  languages: {
    "pt-PT": siteUrl,
    "en-US": `${siteUrl}/en`,
    "es-ES": `${siteUrl}/es`,
  }
}
```

Isto significa que `/jornal/genese-cavalo-iberico` NÃO tem hreflang para `/en/jornal/genese-cavalo-iberico`. O Google pode mostrar a versão errada ao utilizador errado.

**P3. Páginas de cavalo (`/cavalo/[slug]`) sem SEO**

- Sem `generateMetadata()`
- Sem JSON-LD (HorseSchema)
- Sem canonical URL
- Sem Open Graph

**P4. Directório (`/directorio/[slug]`) sem metadata completo**

### 7.3 Soluções

**S1. Helper de metadata reutilizável:**

```typescript
// lib/seo.ts
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

interface PageSEO {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
}: PageSEO): Metadata {
  const url = `${siteUrl}${path}`;
  const cleanPath = path === "/" ? "" : path;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "pt-PT": `${siteUrl}${path}`,
        "en-US": `${siteUrl}/en${cleanPath}`,
        "es-ES": `${siteUrl}/es${cleanPath}`,
        "x-default": `${siteUrl}${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type,
      locale: "pt_PT",
      alternateLocale: ["en_GB", "es_ES"],
      siteName: "Portal Lusitano",
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
```

**S2. Aplicar a TODAS as páginas — exemplo /cavalos-famosos:**

```typescript
// app/cavalos-famosos/page.tsx
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Cavalos Lusitanos Famosos — Os Mais Célebres da Raça",
  description:
    "Descubra os cavalos Lusitanos mais famosos da história: campeões olímpicos, garanhões lendários e cavalos que marcaram a raça PSL.",
  path: "/cavalos-famosos",
});
```

**S3. generateMetadata para /cavalo/[slug]:**

```typescript
// app/cavalo/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const horse = await fetchHorseBySlug(slug);
  if (!horse) return {};

  return generatePageMetadata({
    title: `${horse.nome} — Cavalo Lusitano ${horse.pelagem || ""}`,
    description: `${horse.nome}, cavalo Lusitano ${horse.idade ? `de ${horse.idade} anos` : ""} ${horse.localizacao ? `em ${horse.localizacao}` : ""}. Genealogia, pedigree e detalhes completos.`,
    path: `/cavalo/${slug}`,
    image: horse.image_url,
  });
}
```

**S4. generateMetadata para /directorio/[slug]:**

```typescript
// app/directorio/[slug]/page.tsx  (se existir como route)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const coudelaria = await fetchCoudelariaBySlug(slug);
  if (!coudelaria) return {};

  return generatePageMetadata({
    title: `${coudelaria.nome} — Coudelaria Lusitana`,
    description: `${coudelaria.nome}: coudelaria de cavalos Lusitanos em ${coudelaria.localizacao || "Portugal"}. ${coudelaria.descricao_curta || "Conheça a coudelaria, cavalos e contactos."}`,
    path: `/directorio/${slug}`,
    image: coudelaria.imagem_capa,
  });
}
```

---

## 8. PRIORIDADES DE IMPLEMENTAÇÃO

### Tier 1 — Impacto Imediato (1-2 dias)

| #   | Acção                                     | Impacto                 | Esforço                       |
| --- | ----------------------------------------- | ----------------------- | ----------------------------- |
| 1   | Adicionar metadata a TODAS as 30+ páginas | SEO: +30-50% impressões | 3-4h                          |
| 2   | Criar `lib/seo.ts` helper                 | Consistência            | 30min                         |
| 3   | generateMetadata para /cavalo/[slug]      | SEO: páginas chave      | 1h                            |
| 4   | generateMetadata para /directorio/[slug]  | SEO: directório         | 1h                            |
| 5   | hreflang por página (via helper)          | SEO: i18n               | 30min (já incluído no helper) |

### Tier 2 — Optimização (3-5 dias)

| #   | Acção                                       | Impacto                  | Esforço |
| --- | ------------------------------------------- | ------------------------ | ------- |
| 6   | Lazy-load ShareButtons                      | Bundle: -18KB initial    | 15min   |
| 7   | Corrigir `<img>` nativo no InstagramContent | CLS, perf                | 5min    |
| 8   | Investigar chunk 4.1MB com bundle analyzer  | Bundle size              | 1h      |
| 9   | Script optimize-images.ts                   | Imagens: -50-70% tamanho | 2h      |
| 10  | Preload hero LCP image                      | LCP: -200-500ms          | 15min   |

### Tier 3 — Aperfeiçoamento (1 semana)

| #   | Acção                                           | Impacto                | Esforço |
| --- | ----------------------------------------------- | ---------------------- | ------- |
| 11  | Split traduções por namespace                   | Bundle: -80KB+ initial | 4h      |
| 12  | Dividir HomeContent em Server + Client islands  | INP, TTI               | 4h      |
| 13  | Font fallback metrics (adjust-size)             | CLS: -0.02             | 1h      |
| 14  | Converter 100% imagens para WebP/AVIF           | Bandwidth: -30%        | 2h      |
| 15  | Verificar contraste WCAG AA para gold (#C5A059) | Acessibilidade         | 2h      |

---

## 9. O QUE JÁ ESTÁ EXCELENTE

Para referência — estas áreas estão bem implementadas e não precisam de alterações:

- **Code-splitting:** Leaflet, PDF tools, Confetti, modais — tudo lazy
- **Sentry:** Lazy-loaded, sampling baixo, sem replays
- **Fonts:** Subsets, pesos mínimos, swap, preload
- **Analytics:** GA4/Meta Pixel com consent mode v2, lazy
- **AdSense:** Apenas em 9 paths, `lazyOnload`
- **Service Worker:** Estratégias inteligentes por tipo de recurso
- **next.config.js:** optimizePackageImports, serverExternalPackages, image formats
- **Caching headers:** Imutáveis para estáticos, SWR para dinâmicos
- **ISR:** Tempos adequados por tipo de conteúdo
- **Middleware:** Rate limiting, CSRF, CSP, i18n, admin auth
- **JSON-LD:** 15+ schemas diferentes, muito abrangente
- **Sitemap:** Dinâmico com hreflang
- **robots.ts:** Bloqueia AI scrapers
- **Acessibilidade:** aria-labels, skip links, formulários com FieldError
- **React cache():** Deduplicação de queries Sanity/Supabase

"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import TextSplit from "@/components/TextSplit";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

// Dynamic imports for below-fold interactive components — reduces initial JS bundle
const MagneticButton = dynamic(() => import("@/components/ui/MagneticButton"));
const ParallaxSection = dynamic(() => import("@/components/ui/ParallaxSection"));
import {
  ShoppingCart,
  Crown,
  Calculator,
  BookOpen,
  Gift,
  Newspaper,
  ArrowRight,
  MapPin,
  Trophy,
  Shield,
  ChevronDown,
  Sparkles,
  Star,
  Heart,
  CheckCircle,
  Zap,
  Euro,
  ShoppingBag,
  Package,
} from "lucide-react";
import type { ProductListing } from "@/types/product";

export interface HomeProfissional {
  id: string;
  nome: string;
  especialidade: string;
  categoria: string;
  localizacao: string;
  avaliacao: number;
  numAvaliacoes: number;
  fotoUrl?: string | null;
  nivelVerificacao: string;
  destaque?: boolean;
  slug?: string;
}

// StickyCTA — componente isolado para o CTA mobile que aparece após scroll.
// Separado do HomeContent para que o scroll state não force re-render de toda a página.
function StickyCTA({ featuredProductHandle }: { featuredProductHandle?: string | null }) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setShow(window.scrollY > 380));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className={`sm:hidden fixed bottom-16 left-0 right-0 z-30 bg-[var(--background)]/96 backdrop-blur-md border-t border-[var(--border)] px-3 py-2.5 flex gap-2 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <LocalizedLink
        href="/comprar"
        className="flex-1 flex items-center justify-center py-3 text-[11px] uppercase tracking-[0.1em] font-semibold text-[var(--foreground-secondary)] border border-[var(--border)] active:scale-95 touch-manipulation transition-transform"
      >
        {tr("Cavalos", "Horses", "Caballos")}
      </LocalizedLink>
      <LocalizedLink
        href={featuredProductHandle ? `/loja/${featuredProductHandle}` : "/loja"}
        className="flex-1 flex items-center justify-center gap-1 py-3 text-[11px] uppercase tracking-[0.1em] font-semibold text-[var(--foreground-secondary)] border border-[var(--border)] active:scale-95 touch-manipulation transition-transform"
      >
        <ShoppingBag size={11} strokeWidth={2.5} />
        {tr("Loja", "Shop", "Tienda")}
      </LocalizedLink>
      <LocalizedLink
        href="/vender-cavalo"
        className="flex-[1.4] flex items-center justify-center gap-1.5 py-3 text-[11px] uppercase tracking-[0.1em] font-bold bg-[var(--gold)] text-black active:scale-95 touch-manipulation transition-transform shadow-[0_0_12px_rgba(197,160,89,0.25)]"
      >
        <Euro size={11} strokeWidth={2.5} />
        {tr("Vender", "Sell", "Vender")}
      </LocalizedLink>
    </div>
  );
}

export default function HomeContent({
  featuredProduct,
  profissionais = [],
}: {
  featuredProduct?: ProductListing | null;
  profissionais?: HomeProfissional[];
}) {
  const { language, t } = useLanguage();
  // createTranslator returns a pure function of language — memoize it so
  // the same reference is reused across renders when language is unchanged.
  const tr = useMemo(() => createTranslator(language), [language]);

  // Memoize all static data arrays so they are not recreated on every render.
  // These only need to change when `language` changes (tr/t depend on it).
  const pillars = useMemo(
    () => [
      {
        icon: BookOpen,
        title: tr("Conhecimento", "Knowledge", "Conocimiento"),
        desc: tr(
          "Arquivo editorial com investigação sobre a raça",
          "Editorial archive with research about the breed",
          "Archivo editorial con investigación sobre la raza"
        ),
      },
      {
        icon: Shield,
        title: tr("Verificação", "Verification", "Verificación"),
        desc: tr(
          "Dados verificados e fontes credíveis",
          "Verified data and credible sources",
          "Datos verificados y fuentes creíbles"
        ),
      },
      {
        icon: Crown,
        title: tr("Tradição", "Tradition", "Tradición"),
        desc: tr(
          "500 anos de história equestre portuguesa",
          "500 years of Portuguese equestrian history",
          "500 años de historia ecuestre portuguesa"
        ),
      },
      {
        icon: Gift,
        title: tr("Comunidade", "Community", "Comunidad"),
        desc: tr(
          "Uma rede de cavaleiros, criadores e entusiastas",
          "A network of riders, breeders and enthusiasts",
          "Una red de jinetes, criadores y entusiastas"
        ),
      },
    ],
    [tr]
  );

  const testimonials = useMemo(
    () => [
      {
        quote: tr(
          "O Portal Lusitano ajudou-me a encontrar o garanhão perfeito para a minha coudelaria. Processo simples e seguro.",
          "Portal Lusitano helped me find the perfect stallion for my stud farm. Simple and secure process.",
          "Portal Lusitano me ayudó a encontrar el semental perfecto para mi haras. Proceso simple y seguro."
        ),
        name: tr("João Ribeiro", "João Ribeiro", "João Ribeiro"),
        role: tr(
          "Criador, Coudelaria Vale do Tejo",
          "Breeder, Vale do Tejo Stud Farm",
          "Criador, Haras Vale do Tejo"
        ),
      },
      {
        quote: tr(
          "As ferramentas Pro são indispensáveis. A calculadora de valor poupou-me horas de pesquisa de mercado.",
          "The Pro tools are indispensable. The value calculator saved me hours of market research.",
          "Las herramientas Pro son indispensables. La calculadora de valor me ahorró horas de investigación."
        ),
        name: tr("Ana Santos", "Ana Santos", "Ana Santos"),
        role: tr("Veterinária Equina", "Equine Veterinarian", "Veterinaria Equina"),
      },
      {
        quote: tr(
          "Vendi o meu Lusitano em menos de duas semanas. Os compradores qualificados fazem toda a diferença.",
          "I sold my Lusitano in less than two weeks. The qualified buyers make all the difference.",
          "Vendí mi Lusitano en menos de dos semanas. Los compradores calificados marcan la diferencia."
        ),
        name: tr("Miguel Costa", "Miguel Costa", "Miguel Costa"),
        role: tr("Proprietário, Alentejo", "Owner, Alentejo", "Propietario, Alentejo"),
      },
    ],
    [tr]
  );

  const tickerItems = useMemo(
    () => [
      "● " + tr("23 compradores activos", "23 active buyers", "23 compradores activos"),
      tr("Última transação há 4h", "Last sale 4h ago", "Última transacción hace 4h"),
      tr("16 novos anúncios esta semana", "16 new listings this week", "16 nuevos anuncios esta semana"),
      tr("Procura: Garanhões 5–8 anos", "Demand: Stallions 5–8 yrs", "Demanda: Sementales 5–8 años"),
      tr("97 cavalos disponíveis", "97 horses available", "97 caballos disponibles"),
      "● " + tr("Mercado activo", "Market active", "Mercado activo"),
    ],
    [tr]
  );

  const buyerDemands = useMemo(
    () => [
      {
        type: tr("Garanhão · Dressage", "Stallion · Dressage", "Semental · Dressage"),
        detail: tr("Lisboa · Até €35.000", "Lisbon · Up to €35,000", "Lisboa · Hasta €35.000"),
        time: tr("há 1h", "1h ago", "hace 1h"),
      },
      {
        type: tr("Égua · Linhagem Alter", "Mare · Alter Line", "Yegua · Línea Alter"),
        detail: tr("Porto · Até €22.000", "Porto · Up to €22,000", "Oporto · Hasta €22.000"),
        time: tr("há 3h", "3h ago", "hace 3h"),
      },
      {
        type: tr("Jovem · 4–7 anos", "Young · 4–7 yrs", "Joven · 4–7 años"),
        detail: tr("Alentejo · Até €18.000", "Alentejo · Up to €18,000", "Alentejo · Hasta €18.000"),
        time: tr("há 6h", "6h ago", "hace 6h"),
      },
    ],
    [tr]
  );

  return (
    <>
      {/* ===== HERO — Full Screen with Parallax ===== */}
      <section className="relative min-h-[100svh] sm:min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden noise-overlay">
        {/* Background Image — native picture element for art direction */}
        {/* Mobile: portrait hero  |  Desktop (≥1024px): landscape hero  */}
        <picture
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
          aria-hidden="true"
        >
          <source
            media="(min-width: 1024px)"
            srcSet="/images/home/desktop/hero.png"
          />
          <img
            src="/images/home/mobile/hero.png"
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              opacity: 0.65,
            }}
            fetchPriority="high"
            loading="eager"
          />
        </picture>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-black/40 z-[1]" />

        {/* Floating Gold Orbs */}
        <div
          className="gradient-orb w-[500px] h-[500px] bg-[var(--gold)] top-1/4 -left-64 z-[1]"
          aria-hidden="true"
        />
        <div
          className="gradient-orb w-[400px] h-[400px] bg-[var(--gold)] bottom-1/4 -right-48 z-[1]"
          aria-hidden="true"
          style={{ animationDelay: "-3s" }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Brand identity — always visible */}
          <div
            className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.05s" }}
          >
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.45em] text-[var(--gold)] font-semibold drop-shadow-md">
              Portal Lusitano
            </p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[var(--foreground-muted)]/70 mt-1">
              {t.home.est}
            </p>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif text-[var(--foreground)] leading-[0.9] drop-shadow-lg">
            <TextSplit text={t.home.title_main} baseDelay={0.15} wordDelay={0.06} />
          </h1>

          {/* Decorative line */}
          <div
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          />

          <p
            className="text-sm md:text-base font-serif italic text-[var(--foreground)]/80 max-w-lg mx-auto leading-relaxed drop-shadow-md opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.35s" }}
          >
            &ldquo;{t.home.hero_text}&rdquo;
          </p>

          <div
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.45s" }}
          >
            {/* Mobile: solid gold primary CTA | Desktop: shimmer border */}
            <MagneticButton strength={0.2}>
              <LocalizedLink
                href="/vender-cavalo"
                className="ripple-btn inline-flex items-center gap-2 sm:gap-0 bg-[var(--gold)] sm:bg-black/20 text-black sm:text-[var(--foreground)] border border-[var(--gold)] sm:border-[var(--gold)]/30 sm:backdrop-blur-md shimmer-gold px-10 py-4 text-[11px] uppercase tracking-[0.25em] hover:bg-[var(--gold)] hover:text-black transition-all duration-500 font-semibold sm:font-normal w-full sm:w-auto justify-center"
              >
                {tr("Vender Cavalo", "Sell a Horse", "Vender Caballo")}
              </LocalizedLink>
            </MagneticButton>
            <MagneticButton strength={0.15}>
              <LocalizedLink
                href="/comprar"
                className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 text-[11px] uppercase tracking-[0.25em] text-[var(--foreground-secondary)] border border-[var(--foreground-muted)]/40 sm:border-transparent hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)]/50 transition-all duration-300 line-draw"
              >
                {tr("Comprar Cavalo", "Buy a Horse", "Comprar Caballo")} →
              </LocalizedLink>
            </MagneticButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-28 lg:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--foreground-muted)]">
            {t.home.scroll}
          </span>
          <ChevronDown size={14} className="text-[var(--gold)] animate-bounce" />
        </div>
      </section>

      {/* ===== CONVERSION HUB ===== */}
      <section className="bg-[var(--background)]" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

        {/* ── [1] ACTIVITY TICKER ─────────────────────────────────────── */}
        <div
          className="overflow-hidden"
          style={{ borderBottom: "1px solid rgba(197,160,89,0.08)", background: "rgba(197,160,89,0.015)" }}
        >
          <div
            className="flex whitespace-nowrap py-2"
            style={{ animation: "marquee 45s linear infinite" }}
          >
            {[0, 1].map((di) => (
              <div key={di} className="flex shrink-0">
                {tickerItems.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center text-[8px] font-mono uppercase tracking-[0.28em] text-[var(--foreground-muted)]/40 px-5 whitespace-nowrap"
                  >
                    {item}
                    <span className="ml-5 text-[var(--gold)]/15 select-none" aria-hidden>·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── CONVERSION HUB — 3 painéis com identidade clara ──────────── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >

          {/* ══ [A] LOJA — Produto ══════════════════════════════════════════ */}
          <LocalizedLink
            href={featuredProduct?.handle ? `/loja/${featuredProduct.handle}` : "/loja"}
            className="group flex flex-col order-1 lg:order-1"
            style={{ borderRight: "1px solid rgba(255,255,255,0.06)", minHeight: "460px" }}
          >
            {/* Panel label */}
            <div
              className="flex items-center justify-between px-6 py-3.5 flex-shrink-0 bg-[#090909]"
              style={{ borderBottom: "1px solid rgba(197,160,89,0.08)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--foreground-secondary)]">
                  {tr("Loja", "Shop", "Tienda")}
                </span>
              </div>
              <span
                className="text-[7px] font-mono uppercase tracking-[0.35em] px-2 py-1"
                style={{ color: "var(--gold)", border: "1px solid rgba(197,160,89,0.25)", background: "rgba(197,160,89,0.05)" }}
              >
                {tr("Nova Colecção", "New Collection", "Nueva Colección")}
              </span>
            </div>

            {/* Product image — ivory/cream stage, full product visible */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden" style={{ background: "#f0ebe1", minHeight: "260px" }}>
              {featuredProduct?.images[0]?.url ? (
                <Image
                  src={featuredProduct.images[0].url}
                  alt={featuredProduct.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain group-hover:scale-[1.04] transition-transform duration-700"
                  style={{ padding: "28px" }}
                  quality={85}
                  priority
                />
              ) : (
                <ShoppingBag size={56} className="text-[#b0a08080]" />
              )}
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#C5A059]/35 pointer-events-none" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#C5A059]/35 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#C5A059]/35 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#C5A059]/35 pointer-events-none" />
            </div>

            {/* Product info */}
            <div
              className="flex-shrink-0 px-5 pt-4 pb-5 bg-[#090909]"
              style={{ borderTop: "1px solid rgba(197,160,89,0.12)" }}
            >
              {/* Label row */}
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-3 h-px bg-[var(--gold)]" />
                <span className="text-[7px] uppercase tracking-[0.5em] text-[var(--gold)]/55">
                  {tr("Produto em Destaque", "Featured Product", "Producto Destacado")}
                </span>
              </div>
              <h3 className="font-serif text-[clamp(1.05rem,4vw,1.3rem)] text-white leading-tight mb-4">
                {featuredProduct?.title ?? tr("Colecção Portal", "Portal Collection", "Colección Portal")}
              </h3>
              {/* Price + CTA */}
              <div className="flex items-center justify-between gap-3">
                {featuredProduct?.priceRange ? (
                  <p className="text-xl font-serif text-[var(--gold)] tabular-nums flex-shrink-0">
                    {Number(featuredProduct.priceRange.minVariantPrice.amount).toFixed(2)} €
                  </p>
                ) : null}
                <div className="flex items-center gap-2 bg-[var(--gold)] text-black px-4 py-2.5 text-[8.5px] uppercase tracking-[0.22em] font-bold group-hover:bg-[var(--gold-hover)] transition-colors duration-200 flex-shrink-0 ml-auto">
                  <ShoppingBag size={10} strokeWidth={2.5} />
                  {tr("Comprar", "Buy now", "Comprar")}
                </div>
              </div>
            </div>
          </LocalizedLink>

          {/* ══ [B] MARKETPLACE — Vender Cavalo ════════════════════════════ */}
          <div
            className="flex flex-col order-2 lg:order-2"
            style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Panel label */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <Crown size={13} className="text-[var(--gold)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--foreground-secondary)]">
                  Marketplace
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-[0.25em]" style={{ color: "#ef4444" }}>
                <span
                  className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                  style={{ background: "#ef4444", animation: "pulse-scale 2s ease-in-out infinite" }}
                  aria-hidden
                />
                {tr("Activo", "Live", "Activo")}
              </span>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-10">

              {/* Headline */}
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gold)]/60 mb-5 font-medium">
                  {tr("Vender o seu Cavalo", "Sell Your Horse", "Vender su Caballo")}
                </p>
                <h2
                  className="font-serif text-[var(--foreground)] leading-[0.9] mb-5"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)" }}
                >
                  {tr("Compradores", "Qualified", "Compradores")}
                  <br />
                  {tr("qualificados,", "buyers,", "calificados,")}
                  <br />
                  <span style={{ color: "var(--gold)" }}>{tr("a aguardar.", "waiting.", "esperando.")}</span>
                </h2>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-[340px]">
                  {tr(
                    "Rede exclusiva de compradores verificados. Sem comissão sobre a transacção.",
                    "Exclusive network of verified buyers. Zero sales commission.",
                    "Red exclusiva de compradores verificados. Sin comisión sobre la venta."
                  )}
                </p>
              </div>

              {/* Buyer demand feed */}
              <div className="mb-8 space-y-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[var(--foreground-muted)]/50 mb-3">
                  {tr("Procura activa", "Active demand", "Demanda activa")}
                </p>
                {buyerDemands.map((demand, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span
                      className="w-[6px] h-[6px] rounded-full bg-[var(--gold)] flex-shrink-0"
                      style={{ animation: `pulse-opacity ${1.8 + i * 0.5}s ease-in-out infinite` }}
                      aria-hidden
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[var(--foreground)] font-medium truncate">{demand.type}</p>
                      <p className="text-[10px] text-[var(--gold)]/55 font-mono">{demand.detail}</p>
                    </div>
                    <span className="text-[9px] text-[var(--foreground-muted)]/35 font-mono flex-shrink-0">{demand.time}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <LocalizedLink
                  href="/vender-cavalo"
                  className="ripple-btn shimmer-gold inline-flex items-center gap-3 bg-[var(--gold)] text-black px-7 py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[var(--gold-hover)] transition-colors duration-200 shadow-[0_0_50px_rgba(197,160,89,0.18)]"
                >
                  {tr("Anunciar o meu Cavalo", "List My Horse", "Anunciar mi Caballo")}
                  <ArrowRight size={13} aria-hidden />
                </LocalizedLink>
                <p className="text-[9px] text-[var(--foreground-muted)]/45 uppercase tracking-[0.2em]">
                  {tr("Publicado em &lt; 5 min", "Live in &lt; 5 min", "Publicado en &lt; 5 min")}
                </p>
              </div>
            </div>
          </div>

          {/* ══ [C] PRO SUITE — Ferramentas ════════════════════════════════ */}
          <LocalizedLink
            href="/precos"
            className="group flex flex-col order-3 bg-[#060608]"
            style={{ minHeight: "400px" }}
          >
            {/* Panel label */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <Zap size={13} className="text-[var(--gold)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--foreground-secondary)]">
                  Pro Suite
                </span>
              </div>
              <span
                className="text-[8px] font-mono uppercase tracking-[0.25em] px-2 py-1"
                style={{ color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)", background: "rgba(34,197,94,0.06)" }}
              >
                {tr("Activo", "Active", "Activo")}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gold)]/60 mb-5 font-medium">
                {tr("Ferramentas Exclusivas", "Exclusive Tools", "Herramientas Exclusivas")}
              </p>
              <h3
                className="font-serif text-[var(--foreground)] leading-tight mb-2"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
              >
                {tr("Tome decisões", "Make decisions", "Tome decisiones")}
                <br />
                <span style={{ color: "var(--gold)" }}>{tr("com dados reais.", "with real data.", "con datos reales.")}</span>
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] mb-8 leading-relaxed">
                {tr("1.200+ utilizadores activos", "1,200+ active users", "1.200+ usuarios activos")}
              </p>

              {/* Tools — bigger, clearer */}
              <div className="flex-1 space-y-3 mb-8">
                {[
                  {
                    icon: "₪",
                    label: tr("Calculadora de Valor", "Market Value Calculator", "Calculadora de Valor"),
                    desc: tr("Preço justo de mercado", "Fair market price", "Precio justo de mercado"),
                  },
                  {
                    icon: "⇄",
                    label: tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"),
                    desc: tr("Compare lado a lado", "Compare side by side", "Compara lado a lado"),
                  },
                  {
                    icon: "◎",
                    label: tr("Perfil Genético", "Genetic Profile", "Perfil Genético"),
                    desc: tr("Análise de linhagem", "Lineage analysis", "Análisis de linaje"),
                  },
                ].map((tool, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-4 py-3.5 group-hover:border-[var(--gold)]/10 transition-colors duration-300"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span
                      className="text-base flex-shrink-0 w-8 text-center leading-none"
                      style={{ color: "var(--gold)", opacity: 0.7 }}
                      aria-hidden
                    >
                      {tool.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[var(--foreground)] truncate">{tool.label}</p>
                      <p className="text-[10px] text-[var(--foreground-muted)]/55 mt-0.5">{tool.desc}</p>
                    </div>
                    <span
                      className="text-[7px] uppercase tracking-[0.2em] px-1.5 py-0.5 flex-shrink-0"
                      style={{ color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
                    >
                      ON
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div
                className="flex items-center justify-between pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
                  {tr("Ver Planos", "View Plans", "Ver Planes")}
                </span>
                <ArrowRight size={14} className="text-[var(--gold)] group-hover:translate-x-1 transition-transform duration-300" aria-hidden />
              </div>
            </div>
          </LocalizedLink>
        </div>

        {/* ── QUICK LINKS STRIP ─────────────────────────────────────────── */}
        <div
          className="grid grid-cols-4 gap-px"
          style={{ background: "rgba(197,160,89,0.07)" }}
        >
          {[
            { href: "/comprar",      icon: ShoppingCart, label: tr("Cavalos",     "Horses",  "Caballos"),      count: "97" },
            { href: "/directorio",   icon: Crown,        label: tr("Coudelarias", "Studs",   "Haras"),         count: "52" },
            { href: "/jornal",       icon: Newspaper,    label: tr("Jornal",      "Journal", "Revista"),       count: "34" },
            { href: "/ebook-gratis", icon: Gift,         label: tr("Ebook",       "Ebook",   "Ebook"),         count: tr("Grátis", "Free", "Gratis") },
          ].map((item) => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between px-3 sm:px-5 py-3.5 bg-[var(--background)] hover:bg-[var(--gold)]/[0.04] active:bg-[var(--gold)]/[0.07] transition-colors duration-200 touch-manipulation"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <item.icon size={11} strokeWidth={1.5} className="text-[var(--foreground-muted)] group-hover:text-[var(--gold)] transition-colors duration-200 flex-shrink-0" />
                <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[var(--foreground-muted)] group-hover:text-[var(--foreground-secondary)] transition-colors duration-200">
                  {item.label}
                </span>
              </div>
              <span className="text-[7px] font-mono text-[var(--gold)]/40 group-hover:text-[var(--gold)]/70 transition-colors duration-200">
                {item.count}
              </span>
            </LocalizedLink>
          ))}
        </div>
      </section>


      {/* ===== PILLARS ===== */}
      <section className="py-10 sm:py-28 border-t border-[var(--border)] relative overflow-hidden">
        {/* Background orb */}
        <div className="gradient-orb w-[600px] h-[600px] bg-[var(--gold)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <RevealOnScroll variant="fade-scale" className="text-center mb-8 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {tr("Os Nossos Pilares", "Our Pillars", "Nuestros Pilares")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4 leading-tight">
              {tr("Porquê o Portal Lusitano", "Why Portal Lusitano", "Por Qué Portal Lusitano")}
            </h2>
          </RevealOnScroll>

          {/* Desktop: 4-col grid with gap-px hairlines */}
          <div
            className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: "rgba(197,160,89,0.08)" }}
          >
            {pillars.map((pillar, i) => (
              <RevealOnScroll key={pillar.title} delay={i * 120} variant="fade-up">
                <div
                  className="relative group overflow-hidden flex flex-col p-7 lg:p-9 transition-all duration-500"
                  style={{ background: "var(--background)" }}
                >
                  {/* Hover fill */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "rgba(197,160,89,0.025)" }} />
                  {/* Top gold accent */}
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, rgba(197,160,89,0.5) 0%, rgba(197,160,89,0.1) 60%, transparent 100%)" }} />
                  {/* Bottom hover sweep */}
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-[var(--gold)]/30 pointer-events-none" />

                  {/* Ordinal */}
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[var(--gold)]/35 mb-4 font-medium relative z-10">
                    {String(i + 1).padStart(2, "0")}
                  </p>

                  {/* Icon — square geometric */}
                  <div
                    className="w-11 h-11 flex items-center justify-center mb-6 relative z-10 glow-pulse group-hover:border-[var(--gold)]/40 transition-all duration-300"
                    style={{ border: "1px solid rgba(197,160,89,0.2)", background: "rgba(197,160,89,0.05)" }}
                  >
                    <pillar.icon size={19} className="text-[var(--gold)]" />
                  </div>

                  <h3 className="font-serif text-[var(--foreground)] mb-2 text-lg relative z-10">
                    {pillar.title}
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed relative z-10">
                    {pillar.desc}
                  </p>

                  {/* Ghost watermark */}
                  <span
                    className="absolute bottom-1 right-2 font-serif select-none pointer-events-none"
                    aria-hidden="true"
                    style={{ fontSize: "64px", color: "rgba(197,160,89,0.04)", lineHeight: 1 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* Mobile: 2-col tight grid */}
          <div
            className="sm:hidden grid grid-cols-2 gap-px"
            style={{ background: "rgba(197,160,89,0.1)" }}
          >
            {pillars.map((pillar, i) => (
              <RevealOnScroll key={pillar.title} delay={i * 80} variant="fade-up">
                <div
                  className="relative overflow-hidden flex flex-col p-5 active:scale-[0.97] touch-manipulation transition-transform"
                  style={{ background: "var(--background)", minHeight: "180px" }}
                >
                  {/* Top gold accent */}
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, rgba(197,160,89,0.55) 0%, rgba(197,160,89,0.08) 60%, transparent 100%)" }} />

                  {/* Ordinal */}
                  <p className="text-[8px] uppercase tracking-[0.35em] text-[var(--gold)]/35 mb-3 font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </p>

                  {/* Icon */}
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-4 glow-pulse"
                    style={{ border: "1px solid rgba(197,160,89,0.25)", background: "rgba(197,160,89,0.06)" }}
                  >
                    <pillar.icon size={17} className="text-[var(--gold)]" />
                  </div>

                  <h3 className="font-serif text-[var(--foreground)] text-base mb-1.5 leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-xs leading-relaxed">
                    {pillar.desc}
                  </p>

                  {/* Ghost watermark */}
                  <span
                    className="absolute bottom-0 right-1 font-serif select-none pointer-events-none"
                    aria-hidden="true"
                    style={{ fontSize: "52px", color: "rgba(197,160,89,0.05)", lineHeight: 1 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF — Testimonials ===== */}
      <section className="py-10 sm:py-28 border-t border-[var(--border)] bg-[var(--background-secondary)]/30">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 sm:px-6">
          <RevealOnScroll variant="fade-up" className="mb-8 sm:mb-14">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-[1px] bg-[var(--gold)]" />
              <span className="text-[9px] uppercase tracking-[0.55em] text-[var(--gold)]">
                {tr("Testemunhos", "Testimonials", "Testimonios")}
              </span>
            </div>
            <h2
              className="font-serif text-[var(--foreground)] leading-none"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}
            >
              {tr(
                "O Que Dizem os Nossos Utilizadores",
                "What Our Users Say",
                "Lo Que Dicen Nuestros Usuarios"
              )}
            </h2>
          </RevealOnScroll>
          </div>

          {/* Mobile: horizontal scroll — Desktop: grid */}
          <div className="sm:hidden overflow-x-auto scrollbar-hide px-4 pb-4 snap-x snap-mandatory">
            <div className="flex gap-3" style={{ width: "max-content" }}>
              {testimonials.map((item, i) => (
                <div key={item.name} className="w-[80vw] max-w-[300px] flex-none snap-start bg-[var(--background-card)] border border-[var(--border)] p-5 relative overflow-hidden">
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: "linear-gradient(90deg, rgba(197,160,89,0.45) 0%, rgba(197,160,89,0.08) 55%, transparent 100%)" }}
                    aria-hidden
                  />
                  {/* Ordinal */}
                  <p className="text-[7px] font-mono uppercase tracking-[0.4em] text-[var(--gold)]/30 mb-3 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <span
                    className="text-[var(--gold)]/20 text-4xl font-serif leading-none select-none block mb-1"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="text-[var(--foreground-secondary)] text-xs leading-relaxed mb-4 italic">
                    {item.quote}
                  </p>
                  <div className="border-t border-[var(--border)] pt-3">
                    <p className="text-[var(--foreground)] font-serif text-sm">{item.name}</p>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] mt-0.5">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:grid sm:grid-cols-3 gap-6 px-6">
            {testimonials.map((item, i) => (
              <RevealOnScroll key={item.name} delay={i * 120} variant="fade-up">
                <div className="bg-[var(--background-card)] border border-[var(--border)] p-6 sm:p-8 relative overflow-hidden hover:border-[var(--gold)]/20 transition-all duration-500">
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: "linear-gradient(90deg, rgba(197,160,89,0.45) 0%, rgba(197,160,89,0.08) 55%, transparent 100%)" }}
                    aria-hidden
                  />
                  {/* Ordinal */}
                  <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-[var(--gold)]/30 mb-4 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <span
                    className="text-[var(--gold)]/20 text-4xl font-serif leading-none select-none block mb-1"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-6 italic">
                    {item.quote}
                  </p>
                  <div className="border-t border-[var(--border)] pt-4">
                    <p className="text-[var(--foreground)] font-serif text-sm">{item.name}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] mt-0.5">{item.role}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* Trust badges */}
          <RevealOnScroll className="mt-10 sm:mt-12">
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px"
              style={{ background: "rgba(197,160,89,0.07)" }}
            >
              {[
                { value: "5.000+", label: tr("Leads Ebook", "Ebook Leads", "Leads Ebook") },
                { value: "100+",   label: tr("Cavalos Listados", "Horses Listed", "Caballos Listados") },
                { value: "50+",    label: tr("Coudelarias", "Stud Farms", "Haras") },
                { value: "98%",    label: tr("Satisfação", "Satisfaction", "Satisfacción") },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center py-6 sm:py-8 px-4"
                  style={{ background: "var(--background-secondary)" }}
                >
                  <p className="text-2xl sm:text-3xl font-serif text-[var(--gold)] mb-1 tabular-nums">{badge.value}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] text-center leading-snug">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== PROFISSIONAIS VERIFICADOS ===== */}
      {profissionais.length > 0 && (
        <section className="py-10 sm:py-24 border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <RevealOnScroll variant="fade-up">
              <div className="flex items-end justify-between mb-8 sm:mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-[1px] bg-[var(--gold)]" />
                    <span className="text-[9px] uppercase tracking-[0.55em] text-[var(--gold)]">
                      {tr("Comunidade", "Community", "Comunidad")}
                    </span>
                  </div>
                  <h2
                    className="font-serif text-[var(--foreground)] leading-none"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}
                  >
                    {tr("Profissionais Verificados", "Verified Professionals", "Profesionales Verificados")}
                  </h2>
                </div>
                <LocalizedLink
                  href="/profissionais"
                  className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors duration-300"
                >
                  {tr("Ver todos", "View all", "Ver todos")}
                  <ArrowRight size={13} />
                </LocalizedLink>
              </div>
            </RevealOnScroll>

            {/* Desktop: sharp editorial cards */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "rgba(197,160,89,0.07)" }}>
              {profissionais.map((prof, i) => (
                <RevealOnScroll key={prof.id} delay={i * 80} variant="fade-up">
                  <LocalizedLink href={`/profissionais/${prof.slug}`} className="group block h-full">
                    <div
                      className="relative h-full overflow-hidden flex flex-col p-6 transition-all duration-500"
                      style={{ background: "var(--background)" }}
                    >
                      {/* Top gold sweep */}
                      <div className="absolute top-0 left-0 h-[1px] w-0 group-hover:w-full bg-[var(--gold)]/40 transition-all duration-500 pointer-events-none" />
                      {/* Left gold bar */}
                      <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full bg-[var(--gold)]/50 transition-all duration-500 pointer-events-none" />

                      {/* Avatar */}
                      <div className="flex items-start justify-between mb-5">
                        {prof.fotoUrl ? (
                          <Image
                            src={prof.fotoUrl}
                            alt={prof.nome}
                            width={52}
                            height={52}
                            className="object-cover flex-shrink-0"
                            style={{ borderRadius: 0 }}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-[52px] h-[52px] flex items-center justify-center font-serif text-lg text-[var(--gold)] flex-shrink-0 select-none"
                            style={{ background: "rgba(197,160,89,0.08)", border: "1px solid rgba(197,160,89,0.2)" }}
                          >
                            {prof.nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                        )}
                        {prof.nivelVerificacao === "verificado" && (
                          <span
                            className="text-[7px] uppercase tracking-[0.2em] px-1.5 py-0.5 font-semibold flex-shrink-0"
                            style={{ background: "rgba(197,160,89,0.12)", color: "var(--gold)", border: "1px solid rgba(197,160,89,0.2)" }}
                          >
                            ✓ {tr("Verificado", "Verified", "Verificado")}
                          </span>
                        )}
                        {prof.destaque && !prof.nivelVerificacao && (
                          <Sparkles size={12} className="text-[var(--gold)] flex-shrink-0" />
                        )}
                      </div>

                      {/* Name + specialty */}
                      <p className="font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors duration-300 leading-tight mb-1 text-[0.95rem]">
                        {prof.nome}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/60 mb-3 truncate">
                        {prof.especialidade}
                      </p>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <MapPin size={10} className="text-[var(--foreground-muted)] flex-shrink-0" />
                        <span className="text-[10px] text-[var(--foreground-muted)] truncate">
                          {prof.localizacao}
                        </span>
                      </div>

                      {/* Stars */}
                      {prof.avaliacao > 0 && (
                        <div className="flex items-center gap-1.5 mt-auto">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={10}
                                className={
                                  s <= Math.round(prof.avaliacao)
                                    ? "text-[var(--gold)] fill-[var(--gold)]"
                                    : "text-[var(--foreground-muted)]/20"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-[var(--foreground-muted)]">
                            ({prof.numAvaliacoes})
                          </span>
                        </div>
                      )}

                      {/* Explore line */}
                      <div className="flex items-center gap-2 mt-4 text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]/25 group-hover:text-[var(--gold)] transition-colors duration-300">
                        <div className="h-[1px] w-3 group-hover:w-6 bg-current transition-all duration-400" />
                        {tr("Ver perfil", "View profile", "Ver perfil")}
                      </div>
                    </div>
                  </LocalizedLink>
                </RevealOnScroll>
              ))}
            </div>

            {/* Mobile: horizontal snap scroll */}
            <div className="sm:hidden overflow-x-auto scrollbar-hide -mx-4 px-4 pb-3 snap-x snap-mandatory">
              <div className="flex gap-3" style={{ width: "max-content" }}>
                {profissionais.map((prof) => (
                  <LocalizedLink
                    key={prof.id}
                    href={`/profissionais/${prof.slug}`}
                    className="flex-none snap-start w-[190px] active:scale-[0.97] touch-manipulation transition-transform"
                  >
                    <div
                      className="w-full p-4 relative overflow-hidden"
                      style={{ background: "#0a0a0a", border: "1px solid rgba(197,160,89,0.12)" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {prof.fotoUrl ? (
                          <Image
                            src={prof.fotoUrl}
                            alt={prof.nome}
                            width={40}
                            height={40}
                            className="object-cover flex-shrink-0"
                            style={{ borderRadius: 0 }}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 flex items-center justify-center font-serif text-sm text-[var(--gold)] flex-shrink-0 select-none"
                            style={{ background: "rgba(197,160,89,0.08)", border: "1px solid rgba(197,160,89,0.18)" }}
                          >
                            {prof.nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-serif text-white text-sm leading-tight truncate">{prof.nome}</p>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--gold)]/50 truncate mt-0.5">
                            {prof.especialidade}
                          </p>
                        </div>
                      </div>
                      {prof.avaliacao > 0 && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={9}
                              className={
                                s <= Math.round(prof.avaliacao)
                                  ? "text-[var(--gold)] fill-[var(--gold)]"
                                  : "text-white/10"
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </LocalizedLink>
                ))}
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="sm:hidden mt-4">
              <LocalizedLink
                href="/profissionais"
                className="flex items-center justify-center gap-2 py-3 w-full text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] border border-[var(--border)] active:scale-[0.98] touch-manipulation transition-transform"
              >
                {tr("Ver todos os profissionais", "View all professionals", "Ver todos los profesionales")}
                <ArrowRight size={12} />
              </LocalizedLink>
            </div>
          </div>
        </section>
      )}

      {/* ===== VENDER CAVALO CTA ===== */}
      <section className="border-t border-[var(--border)] relative overflow-hidden">
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: "linear-gradient(to bottom, var(--gold), rgba(197,160,89,0.15))" }}
          aria-hidden
        />
        {/* Right ambient */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(197,160,89,0.03), transparent)" }}
          aria-hidden
        />
        {/* Gold orb */}
        <div
          className="absolute right-[10%] top-1/2 -translate-y-1/2 w-72 h-72 bg-[var(--gold)]/[0.04] blur-[100px] pointer-events-none"
          aria-hidden
        />

        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 sm:py-20">
          <RevealOnScroll variant="fade-right">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-12">
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-3 mb-3 justify-center sm:justify-start">
                  <div className="w-6 h-[1px] bg-[var(--gold)]" />
                  <span className="text-[9px] uppercase tracking-[0.55em] text-[var(--gold)]">
                    {tr("Para Proprietários", "For Owners", "Para Propietarios")}
                  </span>
                </div>
                <h2
                  className="font-serif text-[var(--foreground)] leading-tight mb-3"
                  style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)" }}
                >
                  {tr(
                    "Tem um Cavalo para Vender?",
                    "Have a Horse to Sell?",
                    "¿Tiene un Caballo para Vender?"
                  )}
                </h2>
                <p className="text-[var(--foreground-muted)] text-sm sm:text-base leading-relaxed max-w-md mx-auto sm:mx-0">
                  {tr(
                    "Publique o seu anúncio e alcance compradores qualificados em Portugal e no mundo.",
                    "Publish your listing and reach qualified buyers in Portugal and worldwide.",
                    "Publique su anuncio y alcance compradores calificados en Portugal y en el mundo."
                  )}
                </p>
              </div>

              <MagneticButton strength={0.15}>
                <LocalizedLink
                  href="/vender-cavalo"
                  className="ripple-btn shimmer-gold inline-flex items-center gap-3 border border-[var(--border-hover)] text-[var(--foreground)] px-8 py-4 text-[11px] uppercase tracking-[0.15em] hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-300 whitespace-nowrap"
                >
                  {tr("Anunciar Cavalo", "List Your Horse", "Anunciar Caballo")}
                  <ArrowRight size={14} aria-hidden="true" />
                </LocalizedLink>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </div>

        {/* Bottom hairline */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: "linear-gradient(to right, rgba(197,160,89,0.3), rgba(197,160,89,0.05) 50%, transparent)" }}
          aria-hidden
        />
      </section>

      {/* ===== EBOOK CTA ===== */}
      <section className="relative py-12 sm:py-32 border-t border-[var(--border)] overflow-hidden noise-overlay">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--gold)]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <RevealOnScroll variant="fade-left">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              {/* Book Preview */}
              <div className="flex-shrink-0">
                <div className="relative max-w-[200px] sm:max-w-[240px] mx-auto float-gentle">
                  {/* Glow externo */}
                  <div className="absolute inset-0 bg-[var(--gold)]/15 blur-[100px] scale-[1.3]" />

                  {/* Book */}
                  <div className="relative">
                    {/* Spine */}
                    <div className="absolute -left-4 top-2 bottom-2 w-6 bg-gradient-to-r from-[#2A1A04] via-[#7A5A1E] to-[#8B6B2E] shadow-2xl" />
                    {/* Page edge */}
                    <div className="absolute -right-0.5 top-3 bottom-3 w-1.5 bg-gradient-to-l from-transparent to-[#E8D5A0]/8" />

                    {/* Cover */}
                    <div className="relative bg-gradient-to-b from-[#0E0B04] via-[#0A0803] to-[#060401] border border-[#2A1E08] shadow-[0_30px_90px_rgba(0,0,0,0.85)] aspect-[3/4] overflow-hidden flex flex-col">

                      {/* Textura diagonal */}
                      <svg className="absolute inset-0 w-full h-full opacity-[0.022]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="ebook-grain-home" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="6" stroke="#C5A059" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#ebook-grain-home)"/>
                      </svg>

                      {/* Barras douradas — topo */}
                      <div className="absolute top-0 left-0 right-0 z-10">
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
                        <div className="h-px mt-[3px] bg-gradient-to-r from-transparent via-[var(--gold)]/25 to-transparent" />
                      </div>

                      {/* Bordas ornamentais */}
                      <div className="absolute inset-3 border border-[var(--gold)]/20 pointer-events-none z-10" />
                      <div className="absolute inset-[18px] border border-[var(--gold)]/10 pointer-events-none z-10" />

                      {/* Cantos SVG */}
                      <div className="absolute top-3 left-3 z-10">
                        <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M22 0 L0 0 L0 22" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeOpacity="0.45"/><path d="M22 5 L5 5 L5 22" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.2"/><circle cx="5" cy="5" r="1.5" fill="var(--gold)" fillOpacity="0.4"/></svg>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L22 0 L22 22" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeOpacity="0.45"/><path d="M0 5 L17 5 L17 22" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.2"/><circle cx="17" cy="5" r="1.5" fill="var(--gold)" fillOpacity="0.4"/></svg>
                      </div>
                      <div className="absolute bottom-3 left-3 z-10">
                        <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M22 22 L0 22 L0 0" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeOpacity="0.45"/><path d="M22 17 L5 17 L5 0" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.2"/><circle cx="5" cy="17" r="1.5" fill="var(--gold)" fillOpacity="0.4"/></svg>
                      </div>
                      <div className="absolute bottom-3 right-3 z-10">
                        <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M0 22 L22 22 L22 0" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeOpacity="0.45"/><path d="M0 17 L17 17 L17 0" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.2"/><circle cx="17" cy="17" r="1.5" fill="var(--gold)" fillOpacity="0.4"/></svg>
                      </div>

                      {/* Conteúdo interior */}
                      <div className="relative z-10 flex flex-col items-center justify-between flex-1 py-8 px-7 text-center">
                        {/* Topo */}
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-[var(--gold)]/50 text-[8px] uppercase tracking-[0.4em]">Portal Lusitano</p>
                          <div className="flex items-center gap-2">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]/25" />
                            <svg width="5" height="5" viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.5" y="0.5" width="4" height="4" transform="rotate(45 2.5 2.5)" fill="none" stroke="var(--gold)" strokeWidth="0.8" strokeOpacity="0.4"/>
                            </svg>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--gold)]/25" />
                          </div>
                        </div>

                        {/* Logo central */}
                        <div className="flex items-center justify-center flex-1 py-2">
                          <div className="relative flex flex-col items-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.12)_0%,transparent_65%)] scale-[2.5]" />
                            <svg className="absolute inset-[-40%] w-[180%] h-[180%]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="2 3"/>
                            </svg>
                            <Image src="/logo.webp" alt="Portal Lusitano" width={140} height={38} className="opacity-70 object-contain relative z-10" />
                          </div>
                        </div>

                        {/* Título */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2.5 mb-3">
                            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--gold)]/35" />
                            <svg width="7" height="7" viewBox="0 0 7 7" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.5" y="0.5" width="6" height="6" transform="rotate(45 3.5 3.5)" fill="none" stroke="var(--gold)" strokeWidth="0.9" strokeOpacity="0.55"/>
                            </svg>
                            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--gold)]/35" />
                          </div>
                          <p className="text-[var(--foreground-secondary)]/65 text-[8px] tracking-[0.45em] uppercase mb-2">Introdução ao</p>
                          <h3 className="font-serif text-[var(--gold)] text-[1.35rem] sm:text-[1.55rem] tracking-[0.12em] leading-none uppercase">Cavalo</h3>
                          <h3 className="font-serif text-[var(--gold)] text-[1.35rem] sm:text-[1.55rem] tracking-[0.12em] leading-none uppercase mb-3">Lusitano</h3>
                          <div className="flex items-center mb-2">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]/18" />
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]/18" />
                          </div>
                          <p className="text-[var(--foreground-muted)]/55 text-[7px] tracking-[0.3em] uppercase">O Guia Essencial · 2026</p>
                        </div>
                      </div>

                      {/* Barras douradas — fundo */}
                      <div className="absolute bottom-0 left-0 right-0 z-10">
                        <div className="h-px mb-[3px] bg-gradient-to-r from-transparent via-[var(--gold)]/25 to-transparent" />
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* GRÁTIS badge */}
                  <div className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 bg-[var(--gold)] text-black px-3 sm:px-5 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-bold shadow-lg">
                    GRÁTIS
                  </div>

                  {/* Star rating */}
                  <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-[var(--background-secondary)] border border-[var(--border)] px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl flex items-center gap-2 sm:gap-2.5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-[var(--gold)] text-[var(--gold)]" />
                      ))}
                    </div>
                    <span className="text-[var(--foreground)] text-[10px] sm:text-xs font-medium">4.9/5</span>
                    <span className="text-[var(--foreground-muted)] text-[10px]">(234)</span>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="text-center md:text-left flex-1">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-2 sm:mb-4 block">
                  Ebook {tr("Gratuito", "Free", "Gratuito")}
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-3 sm:mb-4">
                  {tr(
                    "O Guia Essencial do Lusitano",
                    "The Essential Lusitano Guide",
                    "La Guía Esencial del Lusitano"
                  )}
                </h2>
                <p className="block text-sm sm:text-base text-[var(--foreground-secondary)] leading-relaxed mb-5 sm:mb-8 max-w-lg mx-auto md:mx-0">
                  {tr(
                    "Descobre a história, as características e o que torna esta raça única. 30 páginas de conhecimento gratuito.",
                    "Discover the history, characteristics and what makes this breed unique. 30 pages of free knowledge.",
                    "Descubre la historia, las características y lo que hace única a esta raza. 30 páginas de conocimiento gratuito."
                  )}
                </p>
                <div className="flex justify-center md:justify-start">
                  <MagneticButton>
                    <LocalizedLink
                      href="/ebook-gratis"
                      className="ripple-btn inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-bold hover:from-white hover:to-white transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.15)]"
                    >
                      <Gift size={16} />
                      {tr("Descarregar Grátis", "Download Free", "Descargar Gratis")}
                    </LocalizedLink>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== STICKY SCROLL CTA — componente isolado para evitar re-render da página ===== */}
      <StickyCTA featuredProductHandle={featuredProduct?.handle} />

      {/* ===== PRODUTO EM DESTAQUE ===== */}
      <section className="border-t border-[var(--border)] overflow-hidden">
        {featuredProduct ? (
          <RevealOnScroll variant="fade-up">
            {/* ══ MOBILE — luxury editorial card ══ */}
            <div className="lg:hidden bg-[#080808]">
              {/* Image stage */}
              <div className="relative w-full" style={{ height: "72vh", minHeight: "380px" }}>
                {featuredProduct.images[0]?.url ? (
                  <Image
                    src={featuredProduct.images[0].url}
                    alt={featuredProduct.title}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    style={{ padding: "28px 24px 56px" }}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package size={48} className="text-[var(--gold)]/20" />
                  </div>
                )}
                {/* Edge vignette (not bottom — keeps product visible) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(8,8,8,0.9) 100%)" }}
                  aria-hidden
                />
                {/* Bottom fade only from 70% down */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                  style={{ background: "linear-gradient(to bottom, transparent, #080808)" }}
                  aria-hidden
                />
                {/* Corner ornaments */}
                <div className="absolute top-5 left-5 w-7 h-7 border-t border-l border-[var(--gold)]/25 pointer-events-none" />
                <div className="absolute top-5 right-5 w-7 h-7 border-t border-r border-[var(--gold)]/25 pointer-events-none" />
                {/* Label badge */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-[var(--gold)]/40" />
                  <span className="text-[7px] uppercase tracking-[0.5em] text-[var(--gold)]/70">
                    {tr("Destaque", "Featured", "Destacado")}
                  </span>
                  <div className="w-4 h-[1px] bg-[var(--gold)]/40" />
                </div>
                {/* Ghost lot number */}
                <div
                  className="absolute bottom-8 right-4 font-serif leading-none select-none pointer-events-none"
                  style={{ fontSize: "clamp(5rem, 22vw, 9rem)", color: "rgba(197,160,89,0.04)" }}
                  aria-hidden
                >
                  01
                </div>
              </div>

              {/* Info panel */}
              <div className="relative px-5 pb-10 pt-0" style={{ background: "#080808" }}>
                {/* Gold hairline */}
                <div className="w-full h-[1px] mb-5" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.45) 35%, rgba(197,160,89,0.45) 65%, transparent 100%)" }} />

                {/* Title + price row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <h2 className="text-[clamp(1.6rem,7vw,2.2rem)] font-serif text-white leading-tight flex-1">
                    {featuredProduct.title}
                  </h2>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[7px] uppercase tracking-[0.3em] text-white/25 mb-0.5">
                      {tr("Preço", "Price", "Precio")}
                    </p>
                    <p className="text-2xl font-serif text-[var(--gold)] tabular-nums">
                      {Number(featuredProduct.priceRange?.minVariantPrice.amount || 0).toFixed(2)} €
                    </p>
                  </div>
                </div>

                {featuredProduct.description && (
                  <p className="text-[13px] text-white/45 leading-relaxed mb-6">
                    {featuredProduct.description.length > 110
                      ? featuredProduct.description.slice(0, 107) + "..."
                      : featuredProduct.description}
                  </p>
                )}

                {/* Full-width CTA */}
                <LocalizedLink
                  href={`/loja/${featuredProduct.handle}`}
                  className="flex items-center justify-center gap-2.5 w-full py-4 bg-[var(--gold)] text-black text-[10px] uppercase tracking-[0.3em] font-bold active:scale-[0.98] touch-manipulation transition-transform shadow-[0_4px_40px_rgba(197,160,89,0.28)] mb-4"
                >
                  <ShoppingBag size={13} strokeWidth={2.5} />
                  {tr("Comprar Agora", "Buy Now", "Comprar Ahora")}
                </LocalizedLink>

                <LocalizedLink
                  href="/loja"
                  className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-white/25 active:text-[var(--gold)] transition-colors"
                >
                  {tr("Ver toda a coleção", "View full collection", "Ver colección completa")}
                  <ArrowRight size={9} />
                </LocalizedLink>
              </div>
            </div>

            {/* ══ DESKTOP — editorial split, full-bleed ══ */}
            <div className="hidden lg:grid lg:grid-cols-[62%_38%]" style={{ minHeight: "580px" }}>
              {/* Left: atmospheric dark image panel */}
              <LocalizedLink
                href={`/loja/${featuredProduct.handle}`}
                className="group relative overflow-hidden block"
                style={{ background: "#080808" }}
              >
                {featuredProduct.images[0]?.url ? (
                  <Image
                    src={featuredProduct.images[0].url}
                    alt={featuredProduct.title}
                    fill
                    sizes="62vw"
                    className="object-contain transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                    style={{ objectPosition: "center 40%", padding: "32px 40px" }}
                    priority
                    quality={90}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package size={80} className="text-[var(--gold)]/10" />
                  </div>
                )}
                {/* Right edge fade */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, transparent 75%, #080808)" }} />
                {/* Top-left corner ornament */}
                <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-[var(--gold)]/25 pointer-events-none" />
              </LocalizedLink>

              {/* Right: premium info panel */}
              <div
                className="relative flex flex-col justify-center px-14 xl:px-18 py-16"
                style={{ background: "var(--background)" }}
              >
                {/* Vertical gold accent on left edge */}
                <div
                  className="absolute top-0 left-0 w-[1px] h-full"
                  style={{ background: "linear-gradient(to bottom, transparent, rgba(197,160,89,0.25) 25%, rgba(197,160,89,0.25) 75%, transparent)" }}
                />
                {/* Corner ornaments */}
                <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-[var(--gold)]/20" aria-hidden="true" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-[var(--gold)]/20" aria-hidden="true" />

                {/* Label */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-[1px] bg-[var(--gold)]" />
                  <span className="text-[9px] uppercase tracking-[0.45em] text-[var(--gold)]">
                    {tr("Produto em Destaque", "Featured Product", "Producto Destacado")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-4xl xl:text-5xl font-serif text-[var(--foreground)] leading-[1.1] mb-5">
                  {featuredProduct.title}
                </h2>

                {/* Animated gold underline */}
                <div className="h-[1px] mb-6 w-16" style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }} />

                {/* Description */}
                {featuredProduct.description && (
                  <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-8 max-w-[300px]">
                    {featuredProduct.description.length > 160
                      ? featuredProduct.description.slice(0, 157) + "..."
                      : featuredProduct.description}
                  </p>
                )}

                {/* Feature list with bar accents */}
                <div className="flex flex-col gap-3.5 mb-10">
                  {[
                    tr("Qualidade premium portuguesa", "Premium Portuguese quality", "Calidad premium portuguesa"),
                    tr("Envio para todo o mundo", "Worldwide shipping", "Envío a todo el mundo"),
                    tr("Design equestre exclusivo", "Exclusive equestrian design", "Diseño ecuestre exclusivo"),
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-3">
                      <div className="w-[3px] h-4 bg-[var(--gold)]/50 flex-shrink-0 rounded-full" />
                      <span className="text-xs text-[var(--foreground-muted)] tracking-wide">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="mb-7">
                  <p className="text-[9px] uppercase tracking-[0.35em] text-[var(--foreground-muted)] mb-1.5">
                    {tr("Preço", "Price", "Precio")}
                  </p>
                  <p className="text-4xl font-serif text-[var(--gold)]">
                    {Number(featuredProduct.priceRange?.minVariantPrice.amount || 0).toFixed(2)} €
                  </p>
                </div>

                {/* CTA */}
                <MagneticButton strength={0.2}>
                  <LocalizedLink
                    href={`/loja/${featuredProduct.handle}`}
                    className="ripple-btn group inline-flex items-center justify-center gap-3 bg-[var(--gold)] text-black px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-300 shadow-[0_16px_50px_rgba(197,160,89,0.35)] w-full max-w-[280px]"
                  >
                    <ShoppingBag size={14} strokeWidth={2.5} />
                    {tr("Comprar Agora", "Buy Now", "Comprar Ahora")}
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform ml-auto" />
                  </LocalizedLink>
                </MagneticButton>

                <LocalizedLink
                  href="/loja"
                  className="inline-flex items-center gap-1.5 mt-5 text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors group/link w-fit"
                >
                  {tr("Ver toda a coleção", "View full collection", "Ver colección completa")}
                  <ArrowRight size={10} className="group-hover/link:translate-x-1 transition-transform" />
                </LocalizedLink>
              </div>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="py-10 sm:py-28">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <RevealOnScroll variant="fade-scale">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
                  {tr("Loja", "Shop", "Tienda")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
                  {tr("Vestuário & Acessórios Equestres", "Equestrian Clothing & Accessories", "Ropa y Accesorios Ecuestres")}
                </h2>
                <p className="text-[var(--foreground-muted)] max-w-lg mx-auto mb-10">
                  {tr(
                    "Peças que celebram a herança equestre portuguesa. Design contemporâneo, tradição secular.",
                    "Pieces that celebrate Portuguese equestrian heritage. Contemporary design, secular tradition.",
                    "Piezas que celebran el patrimonio ecuestre portugués. Diseño contemporáneo, tradición secular."
                  )}
                </p>
                <MagneticButton>
                  <LocalizedLink
                    href="/loja"
                    className="ripple-btn shimmer-gold inline-block border border-[var(--border-hover)] px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)] hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-500"
                  >
                    {t.home.cta}
                  </LocalizedLink>
                </MagneticButton>
              </RevealOnScroll>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

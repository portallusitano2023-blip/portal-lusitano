"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import LocalizedLink from "@/components/LocalizedLink";
import {
  ShoppingBag,
  ArrowRight,
  ListFilter,
  Package,
  Award,
  Truck,
  Star,
  Search,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ProductListing } from "@/types/product";

// ─── Types ─────────────────────────────────────────────────────────────────

type SortKey = "default" | "price_asc" | "price_desc" | "alpha";

// ─── Trust pillars ─────────────────────────────────────────────────────────

const TRUST = [
  { Icon: Package, label: "Artesanal",        sub: "Produção sob encomenda"      },
  { Icon: Truck,   label: "Envio Portugal",   sub: "Entrega em todo o país"      },
  { Icon: Award,   label: "Qualidade Premium",sub: "Materiais seleccionados"     },
  { Icon: Star,    label: "Exclusivo",        sub: "Peças em edição limitada"    },
] as const;

// ─── Sort options ───────────────────────────────────────────────────────────

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Relevância"        },
  { key: "price_asc",  label: "Preço: Crescente"  },
  { key: "price_desc", label: "Preço: Decrescente" },
  { key: "alpha",      label: "Alfabético"         },
];

// ─── Sort dropdown ──────────────────────────────────────────────────────────

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = SORT_OPTIONS.find((o) => o.key === value)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-secondary)] hover:text-[var(--gold)] border border-[var(--border)] hover:border-[var(--gold)]/40 px-4 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
      >
        <ListFilter size={12} aria-hidden="true" />
        {active.label}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1 z-50 bg-[var(--background)] border border-[var(--border)] shadow-[0_12px_40px_rgba(0,0,0,0.5)] min-w-[200px]"
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              role="option"
              aria-selected={value === opt.key}
              onClick={() => { onChange(opt.key); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-[var(--gold)]/[0.08] hover:text-[var(--gold)] ${
                value === opt.key
                  ? "text-[var(--gold)] bg-[var(--gold)]/[0.05]"
                  : "text-[var(--foreground-secondary)]"
              }`}
            >
              {opt.key === value && (
                <span className="inline-block w-1 h-1 rounded-full bg-[var(--gold)] mr-2 -translate-y-0.5" />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(product: ProductListing) {
  return Number(product.priceRange?.minVariantPrice.amount || 0).toFixed(2);
}

function ordinal(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Gallery Product Card ────────────────────────────────────────────────────
//  Image area + info panel that slides up from below on hover

function ProductCard({
  product,
  index,
  globalIndex,
  isNew,
}: {
  product: ProductListing;
  index: number;
  globalIndex: number;
  isNew?: boolean;
}) {
  const price = formatPrice(product);
  const secondImage = product.images[1]?.url;

  return (
    <LocalizedLink
      href={`/loja/${product.handle}`}
      className="group block relative overflow-hidden bg-[var(--background)] aspect-[3/4] active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
      style={{
        opacity: 0,
        animation: `fadeSlideIn 0.5s ease-out ${Math.min(index * 0.08, 0.5) + 0.2}s forwards`,
      }}
      aria-label={`${product.title} — ${price} EUR`}
    >
      {/* Gold top sweep on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 bg-[var(--gold)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Primary image */}
      {product.images[0]?.url ? (
        <Image
          src={product.images[0].url}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-all duration-700 ${secondImage ? "group-hover:opacity-0" : "group-hover:scale-[1.05]"}`}
          priority={index < 3}
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--background-secondary)] flex items-center justify-center">
          <ShoppingBag className="text-[var(--foreground-muted)]" size={32} aria-hidden="true" />
        </div>
      )}

      {/* Secondary image crossfade */}
      {secondImage && (
        <Image
          src={secondImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-[1.03]"
        />
      )}

      {/* Subtle gradient — just enough for contrast with the panel */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}
        aria-hidden
      />

      {/* Ghost ordinal watermark (positioned above the sliding panel) */}
      <span
        className="absolute right-3 bottom-24 sm:bottom-28 text-white/[0.05] font-serif text-[5rem] leading-none select-none pointer-events-none z-10 transition-colors duration-500 group-hover:text-white/[0.08]"
        aria-hidden="true"
      >
        {ordinal(globalIndex)}
      </span>

      {/* NOVO / EXCLUSIVO badge */}
      {isNew && (
        <div className="absolute top-4 left-4 z-20">
          <span className="text-[7px] uppercase tracking-[0.45em] font-bold bg-[var(--gold)] text-black px-3 py-1.5">
            NOVO
          </span>
        </div>
      )}

      {/* Sliding footer panel */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
        style={{ background: "var(--background)", borderTop: "1px solid rgba(197,160,89,0.2)" }}
      >
        <div className="px-3 sm:px-4 pt-2.5 pb-3">
          <span className="text-[7px] font-mono uppercase tracking-[0.45em] text-[var(--gold)]/55 block mb-1.5">
            Heritage
          </span>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-[15px] font-serif text-[var(--foreground)] leading-tight truncate">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-serif text-[var(--gold)] text-sm">
                {price}
                <span className="text-[9px] text-[var(--foreground-muted)] ml-0.5">€</span>
              </span>
              <ArrowRight size={12} className="text-[var(--gold)] group-hover:translate-x-0.5 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </div>
    </LocalizedLink>
  );
}

// ─── Hero (featured) card ─────────────────────────────────────────────────

function HeroCard({ product }: { product: ProductListing }) {
  const price = formatPrice(product);

  return (
    <LocalizedLink
      href={`/loja/${product.handle}`}
      className="group block relative overflow-hidden bg-[var(--background)] w-full aspect-[4/3] sm:aspect-[21/9] active:scale-[0.995] touch-manipulation focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
      style={{ opacity: 0, animation: "fadeSlideIn 0.6s ease-out 0.15s forwards" }}
      aria-label={`${product.title} — ${price} EUR`}
    >
      {/* Image */}
      {product.images[0]?.url && (
        <Image
          src={product.images[0].url}
          alt={product.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
          priority
        />
      )}

      {/* Top gradient */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)" }}
        aria-hidden
      />
      {/* Bottom gradient (for footer bar) */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}
        aria-hidden
      />

      {/* Gold top sweep */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 bg-[var(--gold)] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

      {/* Subtle gold shimmer */}
      <div className="absolute inset-0 bg-[var(--gold)]/0 group-hover:bg-[var(--gold)]/[0.03] transition-colors duration-700" />

      {/* Corner ornaments */}
      <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-[var(--gold)]/25 z-10" />
      <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-[var(--gold)]/25 z-10" />
      <div className="absolute bottom-[72px] left-5 w-8 h-8 border-b border-l border-[var(--gold)]/20 z-10" />
      <div className="absolute bottom-[72px] right-5 w-8 h-8 border-b border-r border-[var(--gold)]/20 z-10" />

      {/* Top meta bar */}
      <div className="absolute top-5 sm:top-7 left-14 right-14 z-10 flex items-center justify-between">
        <span className="text-[7px] uppercase tracking-[0.45em] font-bold bg-[var(--gold)] text-black px-3 py-1.5">
          DESTAQUE
        </span>
        <span className="text-[8px] font-mono uppercase tracking-[0.45em] text-white/45">
          Colecção Heritage
        </span>
        <span className="text-[8px] font-mono text-white/25">
          01
        </span>
      </div>

      {/* Ghost ordinal */}
      <span
        className="absolute right-6 sm:right-10 bottom-16 sm:bottom-20 text-white/[0.025] font-serif text-[8rem] sm:text-[14rem] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        01
      </span>

      {/* Footer info bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5"
        style={{ borderTop: "1px solid rgba(197,160,89,0.15)", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      >
        <h2 className="font-serif text-white text-lg sm:text-2xl md:text-3xl group-hover:text-[var(--gold)] transition-colors duration-500 leading-tight truncate mr-6">
          {product.title}
        </h2>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="font-serif text-[var(--gold)] text-xl sm:text-2xl tabular-nums">
            {price}
            <span className="text-[11px] text-white/35 ml-1">EUR</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-[8px] uppercase tracking-[0.3em] border border-white/20 group-hover:border-[var(--gold)] group-hover:text-[var(--gold)] text-white/45 px-4 py-2.5 transition-all duration-400">
            Ver peça
            <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-300" aria-hidden="true" />
          </span>
        </div>
      </div>
    </LocalizedLink>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function LojaContent({ products }: { products: ProductListing[] }) {
  const { t } = useLanguage();
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => {
    const list = [...products];
    if (sortKey === "price_asc")
      return list.sort(
        (a, b) =>
          Number(a.priceRange?.minVariantPrice.amount || 0) -
          Number(b.priceRange?.minVariantPrice.amount || 0)
      );
    if (sortKey === "price_desc")
      return list.sort(
        (a, b) =>
          Number(b.priceRange?.minVariantPrice.amount || 0) -
          Number(a.priceRange?.minVariantPrice.amount || 0)
      );
    if (sortKey === "alpha") return list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [products, sortKey]);

  const filtered = useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  }, [sorted, query]);

  const isSingle = products.length === 1;
  const featuredProduct = filtered[0];
  const restProducts = filtered.slice(1);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* ═══ HERO HEADER ════════════════════════════════════════════════════ */}
      <section className="relative pt-24 sm:pt-40 pb-12 sm:pb-20 overflow-hidden">

        {/* SVG grain overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.018]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <filter id="loja-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#loja-grain)" />
        </svg>

        {/* Atmospheric orbs */}
        <div
          className="gradient-orb absolute -top-32 right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 65%)" }}
          aria-hidden="true"
        />
        <div
          className="gradient-orb absolute bottom-0 left-[-8%] w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 65%)" }}
          aria-hidden="true"
        />

        {/* Vertical line from top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(197,160,89,0.7), transparent)" }}
          aria-hidden="true"
        />

        {/* Editorial vertical text — right */}
        <span
          className="hidden lg:block absolute right-8 top-40 text-[8px] uppercase tracking-[0.6em] text-[var(--foreground-muted)] select-none pointer-events-none"
          style={{
            writingMode: "vertical-rl",
            opacity: 0,
            animation: "fadeSlideIn 0.6s ease-out 0.6s forwards",
          }}
          aria-hidden="true"
        >
          Portugal — Colecção Equestre
        </span>

        {/* Editorial vertical text — left */}
        <span
          className="hidden lg:block absolute left-8 top-40 text-[8px] uppercase tracking-[0.6em] text-[var(--foreground-muted)] select-none pointer-events-none"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            opacity: 0,
            animation: "fadeSlideIn 0.6s ease-out 0.6s forwards",
          }}
          aria-hidden="true"
        >
          Heritage — Artesanal
        </span>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">

          {/* Badge */}
          <div
            className="flex items-center justify-center gap-4 mb-6"
            style={{ opacity: 0, animation: "fadeSlideIn 0.4s ease-out 0.05s forwards" }}
          >
            <span className="flex-1 max-w-[80px] h-px" style={{ background: "linear-gradient(to left, rgba(197,160,89,0.5), transparent)" }} aria-hidden />
            <span className="text-[8px] uppercase tracking-[0.55em] text-[var(--gold)]">Colecção Portuguesa</span>
            <span className="text-[var(--gold)]/40 text-[8px]">◆</span>
            <span className="flex-1 max-w-[80px] h-px" style={{ background: "linear-gradient(to right, rgba(197,160,89,0.5), transparent)" }} aria-hidden />
          </div>

          {/* Main headline — oversized */}
          <h1
            className="font-serif italic text-[var(--foreground)] leading-[0.9] tracking-[0.12em] sm:tracking-[0.18em] mb-6 selection:bg-[var(--gold)] selection:text-black"
            style={{
              fontSize: "clamp(3.2rem, 14vw, 10.5rem)",
              opacity: 0,
              animation: "fadeSlideIn 0.5s ease-out 0.15s forwards",
            }}
          >
            {t.shop.legacy}
          </h1>

          {/* Gold hairline divider */}
          <div
            className="flex items-center justify-center gap-3 mb-6"
            style={{ opacity: 0, animation: "fadeSlideIn 0.4s ease-out 0.28s forwards" }}
            aria-hidden="true"
          >
            <span
              className="flex-1 max-w-[120px] h-px"
              style={{ background: "linear-gradient(to left, rgba(197,160,89,0.4), transparent)" }}
            />
            <span className="text-[var(--gold)] text-[11px]">◈</span>
            <span
              className="flex-1 max-w-[120px] h-px"
              style={{ background: "linear-gradient(to right, rgba(197,160,89,0.4), transparent)" }}
            />
          </div>

          {/* Subtitle */}
          <p
            className="text-[8px] uppercase tracking-[0.55em] text-[var(--foreground-muted)] max-w-sm mx-auto"
            style={{ opacity: 0, animation: "fadeSlideIn 0.4s ease-out 0.35s forwards" }}
          >
            {t.shop.legacy_subtitle}
          </p>

          {/* Search + Toolbar */}
          {products.length > 0 && (
            <div
              className="mt-12 sm:mt-16 space-y-4 max-w-xl mx-auto"
              style={{ opacity: 0, animation: "fadeSlideIn 0.4s ease-out 0.45s forwards" }}
            >
              {/* Search input */}
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar peças..."
                  aria-label="Pesquisar produtos"
                  className="w-full bg-transparent pl-10 pr-10 py-3 text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-secondary)] placeholder:text-[var(--foreground-muted)] outline-none transition-all"
                  style={{
                    border: "1px solid rgba(197,160,89,0.18)",
                    boxShadow: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(197,160,89,0.5)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(197,160,89,0.18)")}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Limpar pesquisa"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Count + Sort bar */}
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-px h-4 bg-[var(--gold)]" aria-hidden="true" />
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
                    <span className="text-[var(--gold)] font-serif text-base mr-1">{filtered.length}</span>
                    {filtered.length === 1 ? "peça" : "peças"}
                    {query && <span className="ml-1">encontradas</span>}
                  </span>
                </div>
                {products.length > 1 && <SortDropdown value={sortKey} onChange={setSortKey} />}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ PRODUCTS AREA ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 sm:pb-40">

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-32 space-y-6">
            <div className="w-16 h-px bg-[var(--gold)] opacity-30" aria-hidden="true" />
            <ShoppingBag className="text-[var(--foreground-muted)]" size={40} aria-hidden="true" />
            {query ? (
              <>
                <p className="text-[var(--foreground-secondary)] font-serif text-xl italic">
                  Nenhuma peça encontrada para &ldquo;{query}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[var(--gold)] text-[10px] uppercase tracking-[0.35em] hover:text-[var(--foreground)] transition-colors"
                >
                  Limpar pesquisa →
                </button>
              </>
            ) : (
              <>
                <p className="text-[var(--foreground-secondary)] font-serif text-xl italic">
                  {t.shop.not_found || "Nenhum produto disponível de momento."}
                </p>
                <p className="text-[var(--foreground-muted)] text-[10px] uppercase tracking-[0.35em]">
                  {t.shop.back_collection || "Volte em breve"}
                </p>
              </>
            )}
          </div>
        )}

        {/* ── Single product — full editorial split screen ── */}
        {isSingle && featuredProduct && (
          <section
            aria-label={featuredProduct.title}
            className="grid md:grid-cols-2 gap-0 items-start"
            style={{ opacity: 0, animation: "fadeSlideIn 0.6s ease-out 0.3s forwards" }}
          >
            {/* Left: sticky image */}
            <LocalizedLink
              href={`/loja/${featuredProduct.handle}`}
              className="group block relative overflow-hidden md:sticky md:top-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
              aria-label={featuredProduct.title}
            >
              <div className="relative aspect-[3/4] md:h-screen">
                {/* Corner ornaments */}
                <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-[var(--gold)]/25 z-20" />
                <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-[var(--gold)]/25 z-20" />
                <div className="absolute bottom-5 left-5 w-8 h-8 border-b border-l border-[var(--gold)]/25 z-20" />
                <div className="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-[var(--gold)]/25 z-20" />
                {/* Gold top sweep */}
                <div className="absolute top-0 left-0 right-0 h-[2px] z-20 bg-[var(--gold)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                {featuredProduct.images[0]?.url ? (
                  <Image
                    src={featuredProduct.images[0].url}
                    alt={featuredProduct.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--background-secondary)] flex items-center justify-center">
                    <ShoppingBag className="text-[var(--foreground-muted)]" size={48} aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 bg-[var(--gold)]/0 group-hover:bg-[var(--gold)]/[0.03] transition-colors duration-700" />
                {/* Ordinal watermark */}
                <span
                  className="absolute right-6 bottom-6 text-white/[0.04] font-serif text-[7rem] leading-none select-none pointer-events-none"
                  aria-hidden="true"
                >
                  01
                </span>
              </div>
            </LocalizedLink>

            {/* Right: product info */}
            <div className="flex flex-col justify-center px-6 sm:px-12 py-14 md:py-20 md:min-h-screen">
              {/* Label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-[1px] bg-[var(--gold)]" />
                <span className="text-[8px] font-mono uppercase tracking-[0.55em] text-[var(--gold)]/70">
                  Colecção Heritage
                </span>
              </div>
              {/* Title */}
              <h2
                className="font-serif italic text-[var(--foreground)] leading-tight mb-5"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                {featuredProduct.title}
              </h2>
              {/* Description */}
              {featuredProduct.description && (
                <p className="text-[var(--foreground-secondary)] text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
                  {featuredProduct.description}
                </p>
              )}
              {/* Hairline */}
              <div className="h-px mb-8" style={{ background: "rgba(255,255,255,0.06)" }} />
              {/* Price */}
              <div className="flex items-baseline gap-3 mb-10">
                <span
                  className="font-serif text-[var(--gold)]"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)" }}
                >
                  {formatPrice(featuredProduct)}
                </span>
                <span className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider">EUR</span>
              </div>
              {/* CTA */}
              <LocalizedLink
                href={`/loja/${featuredProduct.handle}`}
                className="inline-flex items-center gap-2.5 bg-[var(--gold)] text-black px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-300 self-start shadow-[0_0_40px_rgba(197,160,89,0.22)] active:scale-95 touch-manipulation"
              >
                <ShoppingBag size={14} aria-hidden="true" />
                Descobrir Peça
              </LocalizedLink>
            </div>
          </section>
        )}

        {/* ── Multi-product layout ── */}
        {!isSingle && featuredProduct && (
          <div className="space-y-px">

            {/* FEATURED HERO */}
            <HeroCard product={featuredProduct} />

            {/* TRUST STRIP */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px"
              style={{ background: "rgba(197,160,89,0.06)" }}
              aria-label="Características da coleção"
            >
              {TRUST.map(({ Icon, label, sub }, i) => (
                <div
                  key={label}
                  className="relative bg-[var(--background)] px-5 py-6 sm:py-8 flex flex-col gap-3 group hover:bg-[var(--background-secondary)]/25 transition-colors duration-300 overflow-hidden"
                >
                  {/* Top accent hairline */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: "linear-gradient(90deg, rgba(197,160,89,0.45) 0%, rgba(197,160,89,0.06) 55%, transparent 100%)" }}
                    aria-hidden
                  />
                  {/* Ordinal */}
                  <span className="text-[8px] font-mono tracking-[0.4em] text-[var(--gold)]/30">
                    {ordinal(i + 1)}
                  </span>
                  {/* Icon box */}
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{ border: "1px solid rgba(197,160,89,0.2)", background: "rgba(197,160,89,0.05)" }}
                  >
                    <Icon size={14} className="text-[var(--gold)]" aria-hidden="true" />
                  </div>
                  {/* Text */}
                  <div>
                    <span className="font-serif text-[var(--foreground)] text-sm block mb-0.5">{label}</span>
                    <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-[var(--foreground-muted)] block hidden sm:block">{sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* PRODUCT GRID */}
            {restProducts.length > 0 && (
              <>
                {/* Grid header */}
                <div className="flex items-center gap-3 py-8 sm:py-10">
                  <div className="w-6 h-[1px] bg-[var(--gold)]" />
                  <span className="text-[9px] uppercase tracking-[0.55em] text-[var(--gold)]">
                    Toda a Colecção
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "linear-gradient(to right, rgba(197,160,89,0.15), transparent)" }}
                    aria-hidden
                  />
                  <span className="font-serif text-[var(--gold)] text-sm">{restProducts.length}</span>
                </div>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
                  style={{ background: "rgba(197,160,89,0.07)" }}
                  aria-label="Produtos"
                >
                  {restProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      globalIndex={i + 2}
                      isNew={i < 2}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Brand manifesto footer ── */}
        {filtered.length > 0 && (
          <div
            className="mt-24 sm:mt-36 relative"
            style={{ opacity: 0, animation: "fadeSlideIn 0.6s ease-out 0.5s forwards" }}
          >
            {/* Hairline with gold midpoint */}
            <div className="relative mb-16 sm:mb-20">
              <div
                className="h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(197,160,89,0.3) 50%, transparent)" }}
              />
              <span
                className="absolute -top-px left-1/2 -translate-x-1/2 w-16 h-px bg-[var(--gold)]/60"
                aria-hidden="true"
              />
            </div>

            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[8px] font-mono uppercase tracking-[0.6em] text-[var(--gold)]/55 block mb-6">
                A Nossa Promessa
              </span>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-4 mb-8" aria-hidden>
                <span
                  className="flex-1 max-w-[100px] h-px"
                  style={{ background: "linear-gradient(to left, rgba(197,160,89,0.25), transparent)" }}
                />
                <span className="text-[var(--gold)]/35 text-[10px]">◆</span>
                <span
                  className="flex-1 max-w-[100px] h-px"
                  style={{ background: "linear-gradient(to right, rgba(197,160,89,0.25), transparent)" }}
                />
              </div>

              <blockquote className="font-serif italic text-2xl sm:text-3xl text-[var(--foreground-secondary)] leading-relaxed mb-10">
                &ldquo;Produção artesanal sob encomenda. Cada peça é impressa individualmente
                com a mais alta qualidade, unindo a tradição equestre Lusitana ao design
                contemporâneo.&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-4 mb-8" aria-hidden>
                <span className="w-10 h-px bg-[var(--border)]" />
                <span className="text-[var(--gold)] text-[10px]">◆</span>
                <span className="w-10 h-px bg-[var(--border)]" />
              </div>

              <p className="text-[8px] uppercase tracking-[0.5em] text-[var(--foreground-muted)] font-mono">
                Portal Lusitano — Lisboa, Portugal
              </p>
              <p className="text-[7px] uppercase tracking-[0.45em] text-[var(--foreground-muted)]/35 font-mono mt-1.5">
                Anno MMXXV
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

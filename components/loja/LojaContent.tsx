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
  { Icon: Package, label: "Artesanal", sub: "Produção sob encomenda" },
  { Icon: Truck, label: "Envio Portugal", sub: "Entrega em todo o país" },
  { Icon: Award, label: "Qualidade Premium", sub: "Materiais seleccionados" },
  { Icon: Star, label: "Exclusivo", sub: "Peças em edição limitada" },
] as const;

// ─── Sort dropdown ──────────────────────────────────────────────────────────

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Relevância" },
  { key: "price_asc", label: "Preço: Crescente" },
  { key: "price_desc", label: "Preço: Decrescente" },
  { key: "alpha", label: "Alfabético" },
];

function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
}) {
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
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-secondary)] hover:text-[var(--gold)] border border-[var(--border)] hover:border-[var(--gold)]/40 px-4 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      >
        <ListFilter size={12} aria-hidden="true" />
        {active.label}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1 z-50 bg-[var(--background)] border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[190px]"
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              role="option"
              aria-selected={value === opt.key}
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-[var(--gold)]/8 hover:text-[var(--gold)] ${
                value === opt.key
                  ? "text-[var(--gold)] bg-[var(--gold)]/5"
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

// ─── Price helper ───────────────────────────────────────────────────────────

function formatPrice(product: ProductListing) {
  return Number(product.priceRange?.minVariantPrice.amount || 0).toFixed(2);
}

// ─── Ordinal to zero-padded string ─────────────────────────────────────────

function ordinal(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Regular product card (grid) ───────────────────────────────────────────

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
      className="group block relative overflow-hidden bg-[var(--background)] aspect-[3/4] active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      style={{
        opacity: 0,
        animation: `fadeSlideIn 0.5s ease-out ${Math.min(index * 0.08, 0.5) + 0.2}s forwards`,
      }}
      aria-label={`${product.title} — ${price} EUR`}
    >
      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-black/95 transition-opacity duration-500 z-10" />

      {/* Ghost ordinal watermark */}
      <span
        className="absolute right-3 top-4 text-white/5 font-serif text-[5rem] leading-none select-none pointer-events-none z-10 transition-colors duration-500 group-hover:text-white/8"
        aria-hidden="true"
      >
        {ordinal(globalIndex)}
      </span>

      {/* NEW badge */}
      {isNew && (
        <div className="absolute top-4 left-4 z-20">
          <span className="text-[7px] uppercase tracking-[0.45em] font-bold bg-[var(--gold)] text-black px-3 py-1.5">
            NOVO
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
        <span
          className="text-[8px] uppercase tracking-[0.45em] text-[var(--gold)]/60 block mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        >
          Heritage
        </span>

        <h3 className="text-base sm:text-[17px] font-serif text-white mb-2 leading-tight group-hover:text-[var(--gold)] transition-colors duration-300 line-clamp-2">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-white/50 text-[11px] leading-relaxed mb-2.5 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 hidden sm:block">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="font-serif text-[var(--gold)] text-sm sm:text-base">
            {price}
            <span className="text-[10px] text-white/40 ml-1">EUR</span>
          </span>
          <span
            className="hidden sm:flex items-center gap-1.5 text-[7px] uppercase tracking-[0.3em] border border-white/20 group-hover:border-[var(--gold)] px-3 py-1.5 text-white/40 group-hover:text-[var(--gold)] transition-all duration-300"
            aria-hidden="true"
          >
            Ver peça
            <ArrowRight
              size={8}
              className="group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </span>
        </div>
      </div>
    </LocalizedLink>
  );
}

// ─── Hero (wide) card for first featured product ─────────────────────────

function HeroCard({ product }: { product: ProductListing }) {
  const price = formatPrice(product);

  return (
    <LocalizedLink
      href={`/loja/${product.handle}`}
      className="group block relative overflow-hidden bg-[var(--background)] w-full aspect-[16/9] sm:aspect-[21/9] active:scale-[0.99] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      style={{ opacity: 0, animation: "fadeSlideIn 0.6s ease-out 0.15s forwards" }}
      aria-label={`${product.title} — ${price} EUR`}
    >
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image */}
      {product.images[0]?.url && (
        <Image
          src={product.images[0].url}
          alt={product.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
          priority
        />
      )}

      {/* Directional gradient — fades from left */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Subtle gold shimmer on hover */}
      <div className="absolute inset-0 bg-[var(--gold)]/0 group-hover:bg-[var(--gold)]/3 transition-colors duration-700" />

      {/* DESTAQUE badge */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-10 flex items-center gap-2">
        <span className="text-[7px] uppercase tracking-[0.45em] font-bold bg-[var(--gold)] text-black px-3 py-1.5">
          DESTAQUE
        </span>
      </div>

      {/* Ordinal ghost watermark */}
      <span
        className="absolute right-6 bottom-4 text-white/4 font-serif text-[8rem] sm:text-[12rem] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        01
      </span>

      {/* Content */}
      <div className="absolute bottom-0 left-0 sm:w-[55%] p-6 sm:p-10 md:p-12 z-10">
        <span
          className="text-[9px] uppercase tracking-[0.5em] text-[var(--gold)]/80 block mb-3"
          aria-hidden="true"
        >
          Colecção Heritage
        </span>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-serif text-white mb-3 leading-[1.1] group-hover:text-[var(--gold)] transition-colors duration-400">
          {product.title}
        </h2>
        {product.description && (
          <p className="text-white/55 text-sm mb-5 line-clamp-2 hidden sm:block leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-5">
          <span className="font-serif text-[var(--gold)] text-xl">
            {price}
            <span className="text-xs text-white/40 ml-1">EUR</span>
          </span>
          <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.3em] text-white/60 border border-white/20 px-4 py-2 group-hover:border-[var(--gold)] group-hover:text-[var(--gold)] transition-all duration-400">
            Ver peça
            <ArrowRight
              size={10}
              className="group-hover:translate-x-0.5 transition-transform duration-300"
              aria-hidden="true"
            />
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
      {/* ── HERO HEADER ── */}
      <section className="relative pt-24 sm:pt-40 pb-12 sm:pb-16 overflow-hidden">
        {/* Atmospheric glows */}
        <div
          className="gradient-orb absolute -top-32 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(197,160,89,0.10) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="gradient-orb absolute bottom-0 -left-16 w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(197,160,89,0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20vw] h-[20vw] max-w-[200px] max-h-[200px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(197,160,89,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Decorative top rule */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(197,160,89,0.6), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Editorial vertical text — right side, desktop only */}
        <span
          className="hidden lg:block absolute right-8 top-36 text-[8px] uppercase tracking-[0.6em] text-[var(--foreground-muted)] select-none pointer-events-none"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            opacity: 0,
            animation: "fadeSlideIn 0.6s ease-out 0.5s forwards",
          }}
          aria-hidden="true"
        >
          Portugal — Colecção Equestre
        </span>

        {/* Editorial vertical text — left side, desktop only */}
        <span
          className="hidden lg:block absolute left-8 top-36 text-[8px] uppercase tracking-[0.6em] text-[var(--foreground-muted)] select-none pointer-events-none"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            opacity: 0,
            animation: "fadeSlideIn 0.6s ease-out 0.5s forwards",
          }}
          aria-hidden="true"
        >
          Heritage — Artesanal
        </span>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <span
            className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] text-[var(--gold)] mb-6"
            style={{ opacity: 0, animation: "fadeSlideIn 0.4s ease-out 0.05s forwards" }}
          >
            <span className="w-6 h-px bg-[var(--gold)]/50" aria-hidden="true" />
            Colecção Portuguesa
            <span className="w-6 h-px bg-[var(--gold)]/50" aria-hidden="true" />
          </span>

          {/* Main headline */}
          <h1
            className="text-4xl sm:text-6xl md:text-8xl font-serif italic text-[var(--foreground)] leading-[0.95] tracking-wide mb-4 selection:bg-[var(--gold)] selection:text-black"
            style={{ opacity: 0, animation: "fadeSlideIn 0.4s ease-out 0.15s forwards" }}
          >
            {t.shop.legacy}
          </h1>

          {/* Decorative divider */}
          <div
            className="flex items-center justify-center gap-4 my-6"
            style={{ opacity: 0, animation: "fadeSlideIn 0.4s ease-out 0.25s forwards" }}
            aria-hidden="true"
          >
            <span className="w-12 h-px bg-[var(--gold)]/35" />
            <span className="text-[var(--gold)] text-[10px]">◆</span>
            <span className="w-12 h-px bg-[var(--gold)]/35" />
          </div>

          {/* Subtitle */}
          <p
            className="text-[9px] uppercase tracking-[0.45em] text-[var(--foreground-muted)] max-w-xs mx-auto"
            style={{ opacity: 0, animation: "fadeSlideIn 0.4s ease-out 0.3s forwards" }}
          >
            {t.shop.legacy_subtitle}
          </p>

          {/* Search + Toolbar */}
          {products.length > 0 && (
            <div
              className="mt-10 sm:mt-14 space-y-4"
              style={{ opacity: 0, animation: "fadeSlideIn 0.4s ease-out 0.4s forwards" }}
            >
              {/* Search input */}
              <div className="relative max-w-sm mx-auto">
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
                  className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--gold)]/50 pl-9 pr-9 py-2.5 text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-secondary)] placeholder:text-[var(--foreground-muted)] outline-none transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Limpar pesquisa"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Count + Sort bar */}
              <div className="flex items-center justify-between">
                {/* Left: piece count */}
                <div className="flex items-center gap-2">
                  <span className="w-px h-4 bg-[var(--gold)]" aria-hidden="true" />
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
                    <span className="text-[var(--gold)] font-serif text-base mr-1">
                      {filtered.length}
                    </span>
                    {filtered.length === 1 ? "peça" : "peças"}
                    {query && (
                      <span className="ml-1 text-[var(--foreground-muted)]">encontradas</span>
                    )}
                  </span>
                </div>

                {/* Right: sort */}
                {products.length > 1 && (
                  <SortDropdown value={sortKey} onChange={setSortKey} />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── PRODUCTS AREA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 sm:pb-36">
        {/* ── EMPTY STATE ── */}
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

        {/* ── SINGLE PRODUCT — split-screen ── */}
        {isSingle && featuredProduct && (
          <section
            aria-label={featuredProduct.title}
            className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
            style={{ opacity: 0, animation: "fadeSlideIn 0.6s ease-out 0.3s forwards" }}
          >
            {/* Image */}
            <LocalizedLink
              href={`/loja/${featuredProduct.handle}`}
              className="group block relative aspect-[3/4] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              aria-label={featuredProduct.title}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] z-20 bg-[var(--gold)]/0 group-hover:bg-[var(--gold)] transition-all duration-500" />
              {featuredProduct.images[0]?.url ? (
                <Image
                  src={featuredProduct.images[0].url}
                  alt={featuredProduct.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--background-secondary)] flex items-center justify-center">
                  <ShoppingBag className="text-[var(--foreground-muted)]" size={48} aria-hidden="true" />
                </div>
              )}
              <div className="absolute inset-0 bg-[var(--gold)]/0 group-hover:bg-[var(--gold)]/5 transition-colors duration-500" />
              {/* Ordinal */}
              <span
                className="absolute right-4 bottom-4 text-white/5 font-serif text-[7rem] leading-none select-none pointer-events-none"
                aria-hidden="true"
              >
                01
              </span>
            </LocalizedLink>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <span className="text-[9px] uppercase tracking-[0.5em] text-[var(--gold)] mb-6 block">
                Colecção Heritage
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-[var(--foreground)] mb-4 leading-tight">
                {featuredProduct.title}
              </h2>
              {featuredProduct.description && (
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-6">
                  {featuredProduct.description}
                </p>
              )}
              <div className="flex items-baseline gap-2 mb-10">
                <span className="font-serif text-[var(--gold)] text-3xl">
                  {formatPrice(featuredProduct)}
                </span>
                <span className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider">
                  EUR
                </span>
              </div>
              <LocalizedLink
                href={`/loja/${featuredProduct.handle}`}
                className="flex items-center justify-center gap-2.5 bg-[var(--gold)] text-black px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-300 active:scale-95 touch-manipulation shadow-[0_0_30px_rgba(197,160,89,0.2)]"
              >
                <ShoppingBag size={14} aria-hidden="true" />
                Descobrir Peça
              </LocalizedLink>
            </div>
          </section>
        )}

        {/* ── MULTI-PRODUCT LAYOUT ── */}
        {!isSingle && featuredProduct && (
          <div className="space-y-px">
            {/* HERO PRODUCT */}
            <HeroCard product={featuredProduct} />

            {/* TRUST STRIP */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px"
              style={{ background: "rgba(197,160,89,0.07)" }}
              aria-label="Características da coleção"
            >
              {TRUST.map(({ Icon, label, sub }) => (
                <div
                  key={label}
                  className="bg-[var(--background)] px-5 py-5 sm:py-7 flex items-start gap-3 group hover:bg-[var(--background-secondary)]/30 transition-colors duration-300"
                >
                  <Icon
                    size={16}
                    className="text-[var(--gold)] flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--foreground-secondary)] block">
                      {label}
                    </span>
                    <span className="text-[9px] text-[var(--foreground-muted)] block mt-0.5 hidden sm:block">
                      {sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* PRODUCT GRID */}
            {restProducts.length > 0 && (
              <>
                {/* Grid header */}
                <div className="pt-8 pb-4 flex items-center gap-4">
                  <span className="text-[9px] uppercase tracking-[0.5em] text-[var(--foreground-muted)]">
                    Toda a Colecção
                  </span>
                  <span className="flex-1 h-px bg-[var(--border)]" aria-hidden="true" />
                  <span className="text-[var(--gold)] font-serif text-sm">{restProducts.length}</span>
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

        {/* ── COLLECTION NOTE ── */}
        {filtered.length > 0 && (
          <div
            className="mt-20 sm:mt-28 relative"
            style={{ opacity: 0, animation: "fadeSlideIn 0.6s ease-out 0.5s forwards" }}
          >
            {/* Top rule with gold accent midpoint */}
            <div className="relative mb-12 sm:mb-16">
              <div className="border-t border-[var(--border)]" />
              <span
                className="absolute -top-px left-1/2 -translate-x-1/2 w-12 h-px bg-[var(--gold)]"
                aria-hidden="true"
              />
            </div>

            <div className="text-center max-w-2xl mx-auto">
              <span
                className="text-[9px] uppercase tracking-[0.5em] text-[var(--gold)] block mb-6"
                aria-hidden="true"
              >
                A Nossa Promessa
              </span>

              <blockquote className="font-serif italic text-xl sm:text-2xl text-[var(--foreground-secondary)] leading-relaxed mb-8">
                &ldquo;Produção artesanal sob encomenda. Cada peça é impressa individualmente com a
                mais alta qualidade, unindo a tradição equestre Lusitana ao design
                contemporâneo.&rdquo;
              </blockquote>

              {/* Decorative rule */}
              <div
                className="flex items-center justify-center gap-4 mb-8"
                aria-hidden="true"
              >
                <span className="w-8 h-px bg-[var(--border)]" />
                <span className="text-[var(--gold)] text-[10px]">◆</span>
                <span className="w-8 h-px bg-[var(--border)]" />
              </div>

              <p className="text-[9px] uppercase tracking-[0.4em] text-[var(--foreground-muted)]">
                Portal Lusitano — Lisboa, Portugal
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

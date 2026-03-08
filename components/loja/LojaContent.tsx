"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import LocalizedLink from "@/components/LocalizedLink";
import {
  ShoppingBag,
  ArrowRight,
  ListFilter,
  X,
  Search,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ProductListing } from "@/types/product";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "default" | "price_asc" | "price_desc" | "alpha";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(p: ProductListing) {
  return Number(p.priceRange?.minVariantPrice.amount || 0).toFixed(2);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Sort options ─────────────────────────────────────────────────────────────

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Relevância" },
  { key: "price_asc",  label: "Preço ↑"   },
  { key: "price_desc", label: "Preço ↓"   },
  { key: "alpha",      label: "A–Z"        },
];

// ─── Sort Dropdown ────────────────────────────────────────────────────────────

function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const active = SORT_OPTIONS.find((o) => o.key === value) ?? SORT_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors focus-visible:outline-none"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <ListFilter size={11} aria-hidden="true" />
        {active.label}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 z-50 bg-[var(--background)] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          style={{ border: "1px solid rgba(197,160,89,0.12)", minWidth: "160px" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              role="option"
              aria-selected={value === opt.key}
              onClick={() => { onChange(opt.key); setOpen(false); }}
              className={`w-full text-left px-5 py-3 text-[9px] uppercase tracking-[0.3em] transition-colors hover:text-[var(--gold)] ${
                value === opt.key ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"
              }`}
            >
              {value === opt.key && (
                <span className="inline-block w-1 h-1 rounded-full bg-[var(--gold)] mr-2 -translate-y-px" />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
//  Gallery card: image breathes freely, info panel slides up on hover

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
  const secondaryImageUrl = product.images[1]?.url;

  return (
    <LocalizedLink
      href={`/loja/${product.handle}`}
      className="group block relative overflow-hidden bg-[#0a0a0a] touch-manipulation"
      style={{
        aspectRatio: "3/4",
        opacity: 0,
        animation: `fadeSlideIn 0.65s ease-out ${Math.min(index * 0.08, 0.48) + 0.15}s forwards`,
        boxShadow: "inset 0 0 0 0px rgba(197,160,89,0)",
        transition: "box-shadow 0.4s ease",
      }}
      aria-label={`${product.title} — ${price} EUR`}
    >
      {/* ── Primary image ── */}
      {product.images[0]?.url ? (
        <Image
          src={product.images[0].url}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className={`object-cover transition-all duration-[900ms] ease-out ${
            secondaryImageUrl
              ? "group-hover:opacity-0"
              : "group-hover:scale-[1.07]"
          }`}
          priority={index < 6}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-secondary)]">
          <ShoppingBag className="text-[var(--foreground-muted)]" size={28} />
        </div>
      )}

      {/* ── Secondary image crossfade ── */}
      {secondaryImageUrl && (
        <Image
          src={secondaryImageUrl}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-[1.04]"
          aria-hidden
        />
      )}

      {/* ── Hover darkening ── */}
      <div
        className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-700 z-10"
        aria-hidden
      />

      {/* ── Gold top sweep on hover ── */}
      <div
        className="absolute top-0 inset-x-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-20"
        style={{ background: "rgba(197,160,89,0.5)" }}
        aria-hidden
      />

      {/* ── Lot number — top left ── */}
      <span
        className="absolute top-4 left-4 z-20 font-mono text-[7px] tracking-[0.55em] text-white/18 select-none"
        aria-hidden="true"
      >
        {pad(globalIndex)}
      </span>

      {/* ── Badge ── */}
      {isNew && (
        <div className="absolute top-4 right-4 z-20">
          <span className="text-[6px] uppercase tracking-[0.5em] font-bold bg-[var(--gold)] text-black px-2.5 py-1">
            NOVO
          </span>
        </div>
      )}

      {/* ── Static bottom — always visible on mobile, hidden on desktop (hover panel takes over) ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-14 sm:hidden"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)" }}
      >
        <h3
          className="font-serif text-white leading-tight truncate mb-1"
          style={{ fontSize: "clamp(0.82rem, 3.5vw, 0.95rem)" }}
        >
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-serif text-[var(--gold)] text-sm">{price}</span>
          <span className="text-[6px] font-mono text-white/30 tracking-widest">EUR</span>
        </div>
      </div>

      {/* ── Slide-up panel — title + price + arrow (desktop hover) ── */}
      <div
        className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 z-30 px-4 py-3 flex-col justify-center hidden sm:flex"
        style={{
          height: "76px",
          background: "var(--background-card, #111111)",
          borderTop: "1px solid rgba(197,160,89,0.18)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="text-[6px] font-mono uppercase tracking-[0.45em] text-[var(--gold)]/45">
            Heritage
          </p>
          <span className="text-[6px] font-mono tracking-[0.35em] text-[var(--foreground-muted)]/30">
            {pad(globalIndex)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-serif text-[var(--foreground)] leading-tight truncate"
            style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
          >
            {product.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-[var(--gold)]" style={{ fontSize: "0.9rem" }}>
                {price}
              </span>
              <span className="text-[5px] font-mono text-[var(--foreground-muted)]/40 tracking-widest">EUR</span>
            </div>
            <ArrowRight
              size={9}
              className="text-[var(--gold)]/70 group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </LocalizedLink>
  );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────
//  Full-bleed cinematic banner for the featured product

function HeroCard({ product }: { product: ProductListing }) {
  const price = formatPrice(product);

  return (
    <LocalizedLink
      href={`/loja/${product.handle}`}
      className="group block relative overflow-hidden bg-black w-full aspect-[4/3] sm:aspect-[21/9] active:scale-[0.999] touch-manipulation focus-visible:outline-none"
      style={{
        opacity: 0,
        animation: "fadeSlideIn 0.8s ease-out 0.05s forwards",
      }}
      aria-label={`${product.title} — ${price} EUR`}
    >
      {/* Image */}
      {product.images[0]?.url && (
        <Image
          src={product.images[0].url}
          alt={product.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          priority
        />
      )}

      {/* Bottom gradient — escurece apenas na base para legibilidade do texto */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,0.96) 100%)",
        }}
        aria-hidden
      />

      {/* Gold line sweep on hover */}
      <div
        className="absolute top-0 inset-x-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-all duration-700 z-20"
        style={{ background: "rgba(197,160,89,0.65)" }}
        aria-hidden
      />

      {/* Hover gold shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: "rgba(197,160,89,0.025)" }}
        aria-hidden
      />

      {/* Corner ornaments — frame the top of the card */}
      <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-[var(--gold)]/20 z-10 pointer-events-none" aria-hidden />
      <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-[var(--gold)]/20 z-10 pointer-events-none" aria-hidden />
      {/* Subtle full border */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px rgba(197,160,89,0.07)" }} aria-hidden />

      {/* Meta — top */}
      <div className="absolute top-6 left-7 z-10 flex items-center gap-5">
        <span className="text-[6px] uppercase tracking-[0.65em] text-white/30 font-mono">
          Destaque
        </span>
        <span
          className="w-10 h-px"
          style={{ background: "rgba(255,255,255,0.1)" }}
          aria-hidden
        />
        <span className="text-[6px] uppercase tracking-[0.6em] text-[var(--gold)]/50 font-mono">
          Heritage · MMXXV
        </span>
      </div>

      {/* Giant lot number watermark */}
      <span
        className="absolute right-5 sm:right-8 bottom-6 sm:bottom-8 font-serif text-white/[0.035] select-none pointer-events-none leading-none z-0 transition-opacity duration-700 group-hover:text-white/[0.055]"
        style={{ fontSize: "clamp(8rem, 22vw, 20rem)" }}
        aria-hidden="true"
      >
        01
      </span>

      {/* Bottom composition */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-7 sm:px-11 pb-8 sm:pb-11 pt-4"
        style={{ borderTop: "1px solid rgba(197,160,89,0.12)" }}
      >
        <div className="flex items-end justify-between gap-5">
          {/* Left: headline */}
          <div className="flex-1 min-w-0">
            <p className="text-[6px] uppercase tracking-[0.6em] text-[var(--gold)]/55 font-mono mb-3">
              Colecção Portuguesa
            </p>
            <h2
              className="font-serif italic text-white leading-[0.88] group-hover:text-[var(--gold)] transition-colors duration-500 truncate pr-4"
              style={{ fontSize: "clamp(1.6rem, 3.8vw, 3rem)" }}
            >
              {product.title}
            </h2>
          </div>

          {/* Right: price + CTA */}
          <div className="flex-shrink-0 flex flex-col items-end gap-4">
            <div className="text-right">
              <span
                className="font-serif text-[var(--gold)] block tabular-nums"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 2rem)" }}
              >
                {price}
              </span>
              <span className="text-[6px] font-mono uppercase tracking-[0.45em] text-white/22">
                EUR
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-[7px] uppercase tracking-[0.42em] text-white/45 group-hover:text-[var(--gold)] transition-all duration-400">
              Ver Peça
              <ArrowRight
                size={9}
                className="group-hover:translate-x-0.5 transition-transform duration-300"
              />
            </span>
          </div>
        </div>
      </div>
    </LocalizedLink>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
    if (sortKey === "alpha")
      return list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [products, sortKey]);

  const filtered = useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [sorted, query]);

  const isSingle = products.length === 1;
  const featured = filtered[0];
  const rest = filtered.slice(1);

  const marqueeItems = [
    "Portugal · Colecção Equestre",
    "Artesanal · Bordado à Mão",
    "Edição Limitada · Heritage",
    "Envio Nacional",
    "Qualidade Premium",
    "Tradição Lusitana · MMXXV",
    "Feito em Portugal",
    "Cavalo Lusitano · Raça Nobre",
    "Design Contemporâneo",
    "Peças Exclusivas",
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO HEADER — editorial composition, ordinal + collection label + title
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 sm:pt-32 pb-8 sm:pb-14 overflow-hidden">

        {/* Atmospheric glow — right */}
        <div
          className="absolute -top-32 right-[-20%] w-[90vw] h-[70vw] max-w-[1000px] max-h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(197,160,89,0.08) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        {/* Atmospheric glow — left subtle */}
        <div
          className="absolute bottom-0 left-[-15%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(197,160,89,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Decorative section number — low-opacity, far left */}
        <span
          className="absolute left-4 sm:left-8 bottom-0 font-serif select-none pointer-events-none leading-none text-[var(--foreground)]/[0.03] hidden xl:block"
          style={{ fontSize: "clamp(14rem, 30vw, 26rem)", lineHeight: 1 }}
          aria-hidden="true"
        >
          01
        </span>

        <div className="relative z-10">

          {/* Vertical accent text — right edge, desktop only */}
          <div
            className="absolute right-5 top-0 bottom-0 hidden xl:flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="font-mono text-[6px] uppercase tracking-[0.65em] text-[var(--gold)]/25"
              style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
            >
              Colecção Heritage · MMXXV · Portugal
            </span>
          </div>

          {/* ── Top bar: collection label + product count + controls ── */}
          <div
            className="px-6 sm:px-10 lg:px-14 flex items-center justify-between mb-12 sm:mb-20"
            style={{
              opacity: 0,
              animation: "fadeSlideIn 0.5s ease-out 0.05s forwards",
            }}
          >
            <div className="flex items-center gap-4">
              <span
                className="w-7 h-px"
                style={{ background: "rgba(197,160,89,0.7)" }}
                aria-hidden
              />
              <span className="text-[7px] font-mono uppercase tracking-[0.6em] text-[var(--gold)]/65">
                {t.shop.collection}
              </span>
              {products.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[var(--gold)]/20" aria-hidden />
                  <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-[var(--foreground-muted)]/40">
                    {products.length} {products.length === 1 ? "peça" : "peças"}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-5">
              {products.length > 1 && (
                <SortDropdown value={sortKey} onChange={setSortKey} />
              )}
            </div>
          </div>

          {/* ── Editorial title block ── */}
          <div
            className="px-6 sm:px-10 lg:px-14"
            style={{
              opacity: 0,
              animation: "fadeSlideIn 0.75s ease-out 0.1s forwards",
            }}
          >
            {/* Two-column on desktop: title left, editorial accent right */}
            <div className="flex items-end justify-between gap-10">

              {/* Left: ordinal + badge + h1 */}
              <div className="overflow-hidden">
                {/* Ordinal */}
                <span
                  className="text-[8px] font-mono tracking-[0.55em] text-[var(--gold)]/20 block mb-5"
                  aria-hidden="true"
                >
                  No. 01
                </span>

                {/* Collection badge — left-aligned line + label */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-8 h-px flex-shrink-0"
                    style={{ background: "rgba(197,160,89,0.5)" }}
                    aria-hidden
                  />
                  <span className="text-[7px] font-mono uppercase tracking-[0.55em] text-[var(--gold)]/55 whitespace-nowrap">
                    Colecção Portuguesa
                  </span>
                </div>

                {/* H1 — elegant, controlled */}
                <h1
                  className="font-serif italic text-[var(--foreground)] leading-[0.88] selection:bg-[var(--gold)] selection:text-black"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 4.2rem)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {t.shop.legacy}
                </h1>
              </div>

              {/* Right: decorative editorial accent — lg+ only */}
              <div className="hidden lg:flex flex-col items-end gap-3 flex-shrink-0 pb-1 self-end">
                <div
                  className="w-px"
                  style={{
                    height: "56px",
                    background:
                      "linear-gradient(to bottom, transparent, rgba(197,160,89,0.22), transparent)",
                  }}
                  aria-hidden
                />
                <span
                  className="text-right leading-loose"
                  style={{
                    fontFamily: "monospace",
                    fontSize: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5em",
                    color: "rgba(197,160,89,0.35)",
                  }}
                  aria-hidden="true"
                >
                  Heritage
                  <br />
                  MMXXV
                </span>
                <div
                  className="w-px"
                  style={{
                    height: "32px",
                    background:
                      "linear-gradient(to bottom, rgba(197,160,89,0.18), transparent)",
                  }}
                  aria-hidden
                />
              </div>

            </div>
          </div>

          {/* ── Bottom info bar: subtitle left, search right ── */}
          <div
            className="px-6 sm:px-10 lg:px-14 mt-8 sm:mt-10 pt-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10"
            style={{
              borderTop: "1px solid rgba(197,160,89,0.08)",
              opacity: 0,
              animation: "fadeSlideIn 0.5s ease-out 0.24s forwards",
            }}
          >
            <div className="flex-1 flex flex-col gap-1.5">
              <p className="text-[8px] font-mono uppercase tracking-[0.5em] text-[var(--foreground-muted)] leading-relaxed">
                Artesanal · Edição Limitada · Portugal
              </p>
              <p className="text-[7px] font-mono uppercase tracking-[0.35em] text-[var(--foreground-muted)]/40">
                Cada peça, bordada à mão e enraizada na tradição lusitana
              </p>
            </div>

            {/* Search */}
            {products.length > 0 && (
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="relative">
                  <Search
                    size={10}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pesquisar..."
                    aria-label="Pesquisar produtos"
                    className="bg-transparent pl-8 pr-8 py-2 text-[9px] uppercase tracking-[0.2em] text-[var(--foreground-secondary)] placeholder:text-[var(--foreground-muted)] outline-none w-40 sm:w-48 transition-all"
                    style={{ border: "1px solid rgba(197,160,89,0.22)" }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(197,160,89,0.45)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(197,160,89,0.22)")
                    }
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Limpar pesquisa"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
                <span className="text-[7px] font-mono text-[var(--foreground-muted)]/40 whitespace-nowrap tabular-nums">
                  {filtered.length} peça{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MARQUEE DIVIDER — editorial credentials ticker
      ══════════════════════════════════════════════════════════════════════════ */}
      <div
        className="overflow-hidden border-y"
        style={{
          borderColor: "rgba(197,160,89,0.09)",
          background: "rgba(197,160,89,0.02)",
        }}
        aria-hidden="true"
      >
        <div
          className="flex whitespace-nowrap py-4"
          style={{ animation: "marquee 50s linear infinite" }}
        >
          {[0, 1].map((di) => (
            <div key={di} className="flex shrink-0">
              {marqueeItems.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-5 text-[7px] font-mono uppercase tracking-[0.45em] text-[var(--foreground-muted)]/45 px-7"
                >
                  {item}
                  <span className="text-[var(--gold)]/25 text-[8px]">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRODUCTS AREA
      ══════════════════════════════════════════════════════════════════════════ */}
      <div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-40 space-y-6 px-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(197,160,89,0.3))" }} aria-hidden />
              <span className="text-[var(--gold)]/30 text-xs" aria-hidden>◆</span>
              <div className="w-16 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(197,160,89,0.3))" }} aria-hidden />
            </div>
            <ShoppingBag
              className="text-[var(--foreground-muted)]/40"
              size={32}
              aria-hidden="true"
            />
            {query ? (
              <>
                <p className="font-serif italic text-[var(--foreground-secondary)] leading-relaxed" style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
                  Nenhuma peça para{" "}
                  <span style={{ color: "var(--gold)" }}>&ldquo;{query}&rdquo;</span>
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[9px] uppercase tracking-[0.45em] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors flex items-center gap-2"
                >
                  Limpar pesquisa
                  <ArrowRight size={10} />
                </button>
              </>
            ) : (
              <>
                <p className="font-serif italic text-[var(--foreground-secondary)]" style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>
                  {t.shop.not_found}
                </p>
                <p className="text-[8px] font-mono uppercase tracking-[0.5em] text-[var(--foreground-muted)]/55">
                  {t.shop.back_collection}
                </p>
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            SINGLE PRODUCT — full-screen split view
        ═════════════════════════════════════════════════════════════════════ */}
        {isSingle && featured && (
          <section
            aria-label={featured.title}
            className="grid md:grid-cols-2"
            style={{
              opacity: 0,
              animation: "fadeSlideIn 0.7s ease-out 0.2s forwards",
            }}
          >
            {/* ── Left: full-height sticky image ── */}
            <LocalizedLink
              href={`/loja/${featured.handle}`}
              className="group block relative overflow-hidden bg-black md:sticky md:top-0 focus-visible:outline-none"
              aria-label={featured.title}
            >
              <div className="relative aspect-[3/4] md:h-screen">
                {/* Gold line sweep on hover */}
                <div
                  className="absolute top-0 inset-x-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-all duration-700 z-20"
                  style={{ background: "rgba(197,160,89,0.65)" }}
                  aria-hidden
                />

                {featured.images[0]?.url ? (
                  <Image
                    src={featured.images[0].url}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--background-secondary)] flex items-center justify-center">
                    <ShoppingBag
                      className="text-[var(--foreground-muted)]"
                      size={48}
                      aria-hidden="true"
                    />
                  </div>
                )}

                {/* Bottom gradient */}
                <div
                  className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-10"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}
                  aria-hidden
                />

                {/* Hover gold tint */}
                <div
                  className="absolute inset-0 bg-[var(--gold)]/0 group-hover:bg-[var(--gold)]/[0.03] transition-colors duration-700 z-10"
                  aria-hidden
                />

                {/* Corner ornaments */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[var(--gold)]/18 z-20 pointer-events-none" aria-hidden />
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[var(--gold)]/18 z-20 pointer-events-none" aria-hidden />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[var(--gold)]/18 z-20 pointer-events-none" aria-hidden />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[var(--gold)]/18 z-20 pointer-events-none" aria-hidden />

                {/* Giant ordinal watermark */}
                <span
                  className="absolute right-5 bottom-5 font-serif text-white/[0.04] select-none pointer-events-none leading-none z-10"
                  style={{ fontSize: "clamp(5rem, 15vw, 11rem)" }}
                  aria-hidden="true"
                >
                  01
                </span>
              </div>
            </LocalizedLink>

            {/* ── Right: editorial product info ── */}
            <div
              className="flex flex-col justify-center px-8 sm:px-14 py-16 md:py-24 md:min-h-screen relative overflow-hidden"
              style={{ borderLeft: "1px solid rgba(197,160,89,0.07)" }}
            >
              {/* Ghost watermark behind content */}
              <span
                className="absolute right-4 bottom-8 font-serif italic select-none pointer-events-none leading-none text-[var(--foreground)]/[0.04] hidden md:block"
                style={{ fontSize: "clamp(8rem, 14vw, 12rem)" }}
                aria-hidden="true"
              >
                01
              </span>

              {/* Atmospheric glow top-right */}
              <div
                className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(197,160,89,0.06) 0%, transparent 70%)" }}
                aria-hidden
              />
              {/* Collection label — hairlines both sides */}
              <div className="flex items-center gap-4 mb-10">
                <div
                  className="w-8 h-px flex-shrink-0"
                  style={{ background: "rgba(197,160,89,0.7)" }}
                  aria-hidden
                />
                <span className="text-[7px] font-mono uppercase tracking-[0.6em] text-[var(--gold)]/65 whitespace-nowrap">
                  {t.shop.collection}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "linear-gradient(to right, rgba(197,160,89,0.15), transparent)" }}
                  aria-hidden
                />
              </div>

              {/* Ordinal */}
              <span className="text-[8px] font-mono text-[var(--gold)]/20 mb-4 tracking-[0.4em]">01</span>

              {/* Title */}
              <h2
                className="font-serif italic text-[var(--foreground)] leading-[0.9] mb-7"
                style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
              >
                {featured.title}
              </h2>

              {/* Hairline */}
              <div
                className="h-px mb-7"
                style={{ background: "rgba(197,160,89,0.12)" }}
                aria-hidden
              />

              {/* Description */}
              {featured.description && (
                <p className="text-[var(--foreground-secondary)] text-sm sm:text-[15px] leading-[1.75] mb-10 max-w-sm">
                  {featured.description}
                </p>
              )}

              {/* Specs table */}
              <div className="mb-10 space-y-2.5">
                {[
                  { k: "Origem",    v: "Portugal"          },
                  { k: "Produção",  v: "Artesanal"         },
                  { k: "Coleção",   v: "Heritage · MMXXV"  },
                ].map(({ k, v }) => (
                  <div key={k} className="flex items-center gap-3">
                    <span className="text-[7px] font-mono uppercase tracking-[0.45em] text-[var(--foreground-muted)]/55 w-20 flex-shrink-0">
                      {k}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "rgba(197,160,89,0.07)" }} aria-hidden />
                    <span className="text-[8px] font-mono uppercase tracking-[0.35em] text-[var(--foreground-secondary)]">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-10">
                <span
                  className="font-serif text-[var(--gold)]"
                  style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
                >
                  {formatPrice(featured)}
                </span>
                <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--foreground-muted)]">
                  EUR
                </span>
              </div>

              {/* CTA */}
              <LocalizedLink
                href={`/loja/${featured.handle}`}
                className="inline-flex items-center gap-3 bg-[var(--gold)] text-black px-10 py-4 text-[9px] uppercase tracking-[0.35em] font-bold hover:bg-white transition-all duration-300 self-start active:scale-95 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)] group/cta"
                style={{ boxShadow: "0 0 45px rgba(197,160,89,0.2)" }}
              >
                <ShoppingBag size={13} aria-hidden="true" />
                Descobrir Peça
                <ArrowRight size={11} className="group-hover/cta:translate-x-1 transition-transform duration-300" aria-hidden />
              </LocalizedLink>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            MULTI-PRODUCT LAYOUT
        ═════════════════════════════════════════════════════════════════════ */}
        {!isSingle && featured && (
          <div>

            {/* ── Featured hero ── */}
            <HeroCard product={featured} />

            {/* ── Editorial statement ── */}
            <div
              className="px-7 sm:px-14 py-10 sm:py-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-16"
              style={{
                borderBottom: "1px solid rgba(197,160,89,0.06)",
                background: "rgba(197,160,89,0.015)",
              }}
            >
              <p
                className="font-serif italic text-[var(--foreground-secondary)] leading-[1.4] max-w-2xl"
                style={{ fontSize: "clamp(1.1rem, 2.8vw, 1.7rem)" }}
              >
                Cada peça conta uma história — bordada à mão,{" "}
                <span style={{ color: "var(--gold)" }}>enraizada na tradição lusitana.</span>
              </p>
              <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-1.5">
                <div className="w-10 h-px" style={{ background: "rgba(197,160,89,0.35)" }} aria-hidden />
                <span className="text-[7px] font-mono uppercase tracking-[0.55em] text-[var(--foreground-muted)]/50">
                  Heritage · MMXXV
                </span>
              </div>
            </div>

            {/* ── Trust strip — 4 colunas editoriais ── */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4"
              style={{
                borderBottom: "1px solid rgba(197,160,89,0.08)",
                borderTop: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              {[
                { label: "Artesanal",       sub: "Produção sob encomenda" },
                { label: "Envio Nacional",  sub: "Todo o Portugal"        },
                { label: "Premium",         sub: "Materiais seleccionados"},
                { label: "Edição Limitada", sub: "Peças exclusivas"       },
              ].map(({ label, sub }, i) => (
                <div
                  key={label}
                  className={`relative px-6 sm:px-8 py-6 flex flex-col gap-1 ${
                    i === 0 || i === 2 ? "border-r" :
                    i === 1 ? "sm:border-r" : ""
                  }`}
                  style={{ borderColor: "rgba(197,160,89,0.07)" }}
                >
                  {/* Hairline accent */}
                  <div className="absolute top-0 left-6 sm:left-8 w-8 h-px bg-[var(--gold)]/40" aria-hidden />
                  {/* Ordinal */}
                  <span className="text-[7px] font-mono text-[var(--gold)]/25 mb-1">{pad(i + 1)}</span>
                  <span className="text-[8px] font-mono uppercase tracking-[0.45em] text-[var(--foreground-secondary)] leading-none">
                    {label}
                  </span>
                  <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-[var(--foreground-muted)]/55 mt-0.5 leading-none">
                    {sub}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Product grid ── */}
            {rest.length > 0 && (
              <>
                {/* Grid header */}
                <div
                  className="px-7 sm:px-11 flex items-center gap-3 py-8 sm:py-10"
                  style={{ borderBottom: "1px solid rgba(197,160,89,0.07)" }}
                >
                  <div className="w-6 h-[1px] bg-[var(--gold)]" aria-hidden />
                  <span className="text-[9px] uppercase tracking-[0.55em] text-[var(--gold)]">
                    Toda a Colecção
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "linear-gradient(to right, rgba(197,160,89,0.15), transparent)" }}
                    aria-hidden
                  />
                  <span className="font-serif text-[var(--gold)] text-base tabular-nums">
                    {rest.length}
                  </span>
                </div>

                {/* Edge-to-edge product grid */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px"
                  style={{ background: "rgba(197,160,89,0.06)" }}
                  aria-label="Produtos"
                >
                  {rest.map((product, i) => (
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
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BRAND COLOPHON — Editorial closing spread
      ══════════════════════════════════════════════════════════════════════════ */}
      {filtered.length > 0 && (
        <footer
          className="relative overflow-hidden"
          style={{
            borderTop: "1px solid rgba(197,160,89,0.09)",
            opacity: 0,
            animation: "fadeSlideIn 0.6s ease-out 0.5s forwards",
          }}
        >
          {/* Atmospheric glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.06) 0%, transparent 65%)" }}
            aria-hidden
          />

          {/* ── Centred editorial content ── */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-10 sm:pt-24 sm:pb-14">

            {/* Ornament cluster */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 sm:w-28 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(197,160,89,0.35))" }} aria-hidden />
              <span className="text-[var(--gold)]/50 text-sm tracking-[0.2em]" aria-hidden>◆ ◈ ◆</span>
              <div className="w-16 sm:w-28 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(197,160,89,0.35))" }} aria-hidden />
            </div>

            {/* Label */}
            <p className="text-[7px] font-mono uppercase tracking-[0.65em] text-[var(--gold)]/50 mb-6">
              A Nossa Promessa
            </p>

            {/* Quote — large and dramatic */}
            <p
              className="font-serif italic text-[var(--foreground-secondary)] leading-[1.25] max-w-3xl mb-10"
              style={{ fontSize: "clamp(1.6rem, 4vw, 3rem)" }}
            >
              &ldquo;Produção artesanal sob encomenda. Cada peça une a tradição
              equestre Lusitana ao design contemporâneo.&rdquo;
            </p>

            {/* Bottom ornament */}
            <div className="w-8 h-px mb-6" style={{ background: "rgba(197,160,89,0.4)" }} aria-hidden />
            <p className="text-[7px] font-mono uppercase tracking-[0.55em] text-[var(--foreground-muted)]/60">
              Portal Lusitano
            </p>
          </div>

          {/* ── Three-column signature strip ── */}
          <div
            className="grid grid-cols-3"
            style={{ borderTop: "1px solid rgba(197,160,89,0.07)", borderBottom: "1px solid rgba(197,160,89,0.07)" }}
          >
            {[
              { top: "Artesanal",      bot: "Produção sob encomenda" },
              { top: "Anno MMXXV",     bot: "Lisboa · Portugal"      },
              { top: "Heritage",       bot: "Colecção exclusiva"     },
            ].map(({ top, bot }, i) => (
              <div
                key={top}
                className="relative flex flex-col items-center justify-center py-6 gap-1"
                style={{ borderRight: i < 2 ? "1px solid rgba(197,160,89,0.07)" : undefined }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-px bg-[var(--gold)]/35" aria-hidden />
                <span className="text-[var(--gold)]/30 text-[8px]" aria-hidden>◆</span>
                <span className="text-[8px] font-mono uppercase tracking-[0.45em] text-[var(--foreground-secondary)]">{top}</span>
                <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-[var(--foreground-muted)]/50">{bot}</span>
              </div>
            ))}
          </div>
        </footer>
      )}
    </main>
  );
}

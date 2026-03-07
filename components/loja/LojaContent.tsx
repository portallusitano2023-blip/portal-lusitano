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

  const active = SORT_OPTIONS.find((o) => o.key === value)!;

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
//  Cinematic card: info always visible at bottom, price + CTA reveal on hover

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
  const alt = product.images[1]?.url;

  return (
    <LocalizedLink
      href={`/loja/${product.handle}`}
      className="group block relative overflow-hidden bg-[#0a0a0a]"
      style={{
        aspectRatio: "3/4",
        opacity: 0,
        animation: `fadeSlideIn 0.65s ease-out ${Math.min(index * 0.08, 0.48) + 0.15}s forwards`,
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
            alt
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
      {alt && (
        <Image
          src={alt}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-[1.04]"
          aria-hidden
        />
      )}

      {/* ── Permanent bottom vignette ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 35%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* ── Hover darkening ── */}
      <div
        className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-700 z-10"
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

      {/* ── Bottom: title always visible, price + arrow reveal on hover ── */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4">
        <h3
          className="font-serif text-white leading-[1.15] mb-2 transition-all duration-500"
          style={{ fontSize: "clamp(0.9rem, 2.2vw, 1.1rem)" }}
        >
          {product.title}
        </h3>

        {/* Price + CTA — slide up on hover */}
        <div className="flex items-center justify-between translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <span
            className="font-serif text-[var(--gold)]"
            style={{ fontSize: "clamp(0.85rem, 1.8vw, 1rem)" }}
          >
            {price}
            <span className="text-[7px] text-white/30 ml-1 tracking-wide font-sans">EUR</span>
          </span>
          <span className="flex items-center gap-1 text-[7px] uppercase tracking-[0.4em] text-[var(--gold)]/70">
            Ver
            <ArrowRight
              size={9}
              className="group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </span>
        </div>

        {/* Gold sweep line */}
        <div
          className="mt-2.5 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-[40ms]"
          style={{ background: "rgba(197,160,89,0.4)" }}
          aria-hidden
        />
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
      className="group block relative overflow-hidden bg-black w-full active:scale-[0.999] touch-manipulation focus-visible:outline-none"
      style={{
        aspectRatio: "21/9",
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

      {/* Cinematic left gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(110deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.42) 40%, rgba(0,0,0,0.08) 100%)",
        }}
        aria-hidden
      />

      {/* Bottom gradient for text area */}
      <div
        className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88), transparent)" }}
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
          Heritage · 2025
        </span>
      </div>

      {/* Giant lot number watermark */}
      <span
        className="absolute right-5 sm:right-8 bottom-6 sm:bottom-8 font-serif text-white/[0.035] select-none pointer-events-none leading-none z-0 transition-opacity duration-700 group-hover:text-white/[0.055]"
        style={{ fontSize: "clamp(5rem, 18vw, 16rem)" }}
        aria-hidden="true"
      >
        01
      </span>

      {/* Bottom composition */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-7 sm:px-11 pb-7 sm:pb-10">
        <div className="flex items-end justify-between gap-5">
          {/* Left: headline */}
          <div className="flex-1 min-w-0">
            <p className="text-[6px] uppercase tracking-[0.6em] text-[var(--gold)]/55 font-mono mb-3">
              Colecção Portuguesa
            </p>
            <h2
              className="font-serif text-white leading-[0.88] group-hover:text-[var(--gold)] transition-colors duration-500 truncate pr-4"
              style={{ fontSize: "clamp(1.6rem, 3.8vw, 3rem)" }}
            >
              {product.title}
            </h2>
          </div>

          {/* Right: price + CTA */}
          <div className="flex-shrink-0 flex flex-col items-end gap-3.5">
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
            <span className="hidden sm:flex items-center gap-1.5 text-[7px] uppercase tracking-[0.42em] border border-white/15 group-hover:border-[var(--gold)]/55 text-white/38 group-hover:text-[var(--gold)] px-4 py-2.5 transition-all duration-400">
              Ver Peça
              <ArrowRight
                size={8}
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
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO HEADER — oversized typographic entry, no max-width constraint
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 sm:pt-28 pb-6 sm:pb-10 overflow-hidden">

        {/* Atmospheric glow */}
        <div
          className="absolute -top-32 right-[-20%] w-[90vw] h-[70vw] max-w-[1000px] max-h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(197,160,89,0.08) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">

          {/* ── Top bar: collection label + controls ── */}
          <div
            className="px-6 sm:px-10 lg:px-14 flex items-center justify-between mb-10 sm:mb-16"
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
            </div>

            <div className="flex items-center gap-5">
              {products.length > 1 && (
                <SortDropdown value={sortKey} onChange={setSortKey} />
              )}
            </div>
          </div>

          {/* ── GIANT TITLE — left-aligned, fills the line ── */}
          <div
            className="px-6 sm:px-10 lg:px-14 overflow-hidden"
            style={{
              opacity: 0,
              animation: "fadeSlideIn 0.75s ease-out 0.1s forwards",
            }}
          >
            <h1
              className="font-serif italic text-[var(--foreground)] leading-[0.82] selection:bg-[var(--gold)] selection:text-black"
              style={{
                fontSize: "clamp(3.8rem, 17vw, 14rem)",
                letterSpacing: "-0.01em",
              }}
            >
              {t.shop.legacy}
            </h1>
          </div>

          {/* ── Bottom info bar: subtitle left, search right ── */}
          <div
            className="px-6 sm:px-10 lg:px-14 mt-6 sm:mt-8 pt-5 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-10"
            style={{
              borderTop: "1px solid rgba(197,160,89,0.1)",
              opacity: 0,
              animation: "fadeSlideIn 0.5s ease-out 0.24s forwards",
            }}
          >
            <p className="text-[8px] uppercase tracking-[0.5em] text-[var(--foreground-muted)] flex-1 max-w-lg leading-relaxed">
              {t.shop.legacy_subtitle}
            </p>

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
                    style={{ border: "1px solid rgba(197,160,89,0.14)" }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(197,160,89,0.45)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(197,160,89,0.14)")
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
          background: "rgba(197,160,89,0.012)",
        }}
        aria-hidden="true"
      >
        <div
          className="flex whitespace-nowrap py-3"
          style={{ animation: "marquee 40s linear infinite" }}
        >
          {[0, 1].map((di) => (
            <div key={di} className="flex shrink-0">
              {marqueeItems.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-5 text-[7px] font-mono uppercase tracking-[0.45em] text-[var(--foreground-muted)]/32 px-7"
                >
                  {item}
                  <span className="text-[var(--gold)]/18 text-[8px]">◆</span>
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
          <div className="flex flex-col items-center justify-center text-center py-36 space-y-6 px-6">
            <div
              className="w-14 h-px"
              style={{ background: "rgba(197,160,89,0.3)" }}
              aria-hidden="true"
            />
            <ShoppingBag
              className="text-[var(--foreground-muted)]"
              size={36}
              aria-hidden="true"
            />
            {query ? (
              <>
                <p className="font-serif italic text-xl text-[var(--foreground-secondary)]">
                  Nenhuma peça para &ldquo;{query}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[var(--gold)] text-[9px] uppercase tracking-[0.4em] hover:text-[var(--foreground)] transition-colors"
                >
                  Limpar &rarr;
                </button>
              </>
            ) : (
              <>
                <p className="font-serif italic text-xl text-[var(--foreground-secondary)]">
                  {t.shop.not_found}
                </p>
                <p className="text-[9px] uppercase tracking-[0.4em] text-[var(--foreground-muted)]">
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

                {/* Hover gold tint */}
                <div
                  className="absolute inset-0 bg-[var(--gold)]/0 group-hover:bg-[var(--gold)]/[0.03] transition-colors duration-700"
                  aria-hidden
                />

                {/* Giant ordinal watermark */}
                <span
                  className="absolute right-5 bottom-5 font-serif text-white/[0.04] select-none pointer-events-none leading-none"
                  style={{ fontSize: "clamp(5rem, 15vw, 11rem)" }}
                  aria-hidden="true"
                >
                  01
                </span>
              </div>
            </LocalizedLink>

            {/* ── Right: editorial product info ── */}
            <div className="flex flex-col justify-center px-8 sm:px-14 py-16 md:py-24 md:min-h-screen">
              {/* Collection label */}
              <div className="flex items-center gap-3 mb-10">
                <span
                  className="w-8 h-px"
                  style={{ background: "rgba(197,160,89,0.7)" }}
                  aria-hidden
                />
                <span className="text-[7px] font-mono uppercase tracking-[0.6em] text-[var(--gold)]/65">
                  {t.shop.collection}
                </span>
              </div>

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

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-12">
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
                className="inline-flex items-center gap-2.5 bg-[var(--gold)] text-black px-10 py-4 text-[9px] uppercase tracking-[0.35em] font-bold hover:bg-white transition-all duration-300 self-start active:scale-95 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
                style={{ boxShadow: "0 0 45px rgba(197,160,89,0.2)" }}
              >
                <ShoppingBag size={13} aria-hidden="true" />
                Descobrir Peça
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

            {/* ── Trust strip — editorial single line ── */}
            <div
              className="px-7 sm:px-11 py-5 flex flex-wrap items-center gap-x-7 gap-y-2"
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
                <div key={label} className="flex items-center gap-3 py-1">
                  {i > 0 && (
                    <span
                      className="hidden sm:block w-px h-7 flex-shrink-0"
                      style={{ background: "rgba(197,160,89,0.12)" }}
                      aria-hidden
                    />
                  )}
                  <div>
                    <span className="text-[8px] font-mono uppercase tracking-[0.45em] text-[var(--foreground-secondary)] block leading-none">
                      {label}
                    </span>
                    <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-[var(--foreground-muted)]/55 block mt-0.5 leading-none">
                      {sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Product grid ── */}
            {rest.length > 0 && (
              <>
                {/* Grid header */}
                <div
                  className="px-7 sm:px-11 flex items-center gap-4 py-7 sm:py-9"
                  style={{
                    borderBottom: "1px solid rgba(197,160,89,0.07)",
                  }}
                >
                  <span
                    className="w-6 h-px"
                    style={{ background: "rgba(197,160,89,0.7)" }}
                    aria-hidden
                  />
                  <span className="text-[7px] uppercase tracking-[0.6em] text-[var(--gold)]/70 font-mono flex-1">
                    Toda a Colecção
                  </span>
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
          BRAND COLOPHON
      ══════════════════════════════════════════════════════════════════════════ */}
      {filtered.length > 0 && (
        <footer
          className="px-7 sm:px-11 py-16 sm:py-24"
          style={{
            borderTop: "1px solid rgba(197,160,89,0.09)",
            opacity: 0,
            animation: "fadeSlideIn 0.6s ease-out 0.5s forwards",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 max-w-6xl">
            {/* Left: statement */}
            <div className="max-w-2xl">
              <blockquote
                className="font-serif italic text-[var(--foreground-secondary)] leading-relaxed mb-6"
                style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)" }}
              >
                &ldquo;Produção artesanal sob encomenda. Cada peça une a tradição
                equestre Lusitana ao design contemporâneo.&rdquo;
              </blockquote>
              <p className="text-[7px] font-mono uppercase tracking-[0.55em] text-[var(--foreground-muted)]">
                Portal Lusitano — Lisboa, Portugal
              </p>
            </div>

            {/* Right: signature mark */}
            <div className="flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
              <span
                className="w-14 h-px"
                style={{ background: "rgba(197,160,89,0.35)" }}
                aria-hidden
              />
              <span className="text-[7px] font-mono uppercase tracking-[0.5em] text-[var(--foreground-muted)]/50">
                Anno MMXXV
              </span>
              <span className="text-[var(--gold)]/30 text-[10px]">◆</span>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}

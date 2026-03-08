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
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ProductListing } from "@/types/product";

// ─── Types & helpers ──────────────────────────────────────────────────────────

type SortKey = "default" | "price_asc" | "price_desc" | "alpha";

function formatPrice(p: ProductListing) {
  return Number(p.priceRange?.minVariantPrice.amount || 0).toFixed(2);
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Relevância" },
  { key: "price_asc",  label: "Preço ↑"   },
  { key: "price_desc", label: "Preço ↓"   },
  { key: "alpha",      label: "A–Z"        },
];

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
  refNum,
}: {
  product: ProductListing;
  index: number;
  refNum: string;
}) {
  const price = formatPrice(product);
  const secondaryImageUrl = product.images[1]?.url;

  return (
    <LocalizedLink
      href={`/loja/${product.handle}`}
      className="group block"
      data-cursor-text="Ver"
      style={{
        opacity: 0,
        animation: `fadeSlideIn 0.55s ease-out ${Math.min(index * 0.07, 0.45) + 0.05}s forwards`,
      }}
      aria-label={`${product.title} — ${price} EUR`}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[#0c0c0c]"
        style={{ aspectRatio: "3/4" }}
      >
        {product.images[0]?.url ? (
          <>
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 33vw"
              className={`object-cover transition-all duration-700 ease-out ${
                secondaryImageUrl
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-[1.06]"
              }`}
              priority={index < 6}
            />
            {secondaryImageUrl && (
              <Image
                src={secondaryImageUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 33vw"
                className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-[1.04]"
                aria-hidden
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="text-white/10" size={28} aria-hidden />
          </div>
        )}

        {/* Darkening */}
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/14 transition-colors duration-500 pointer-events-none"
          aria-hidden
        />

        {/* Gold top sweep */}
        <div
          className="absolute top-0 inset-x-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-600 z-10"
          style={{ background: "rgba(197,160,89,0.7)" }}
          aria-hidden
        />

        {/* Ref number */}
        <span
          className="absolute top-3 left-3.5 font-mono text-[6px] tracking-[0.4em] text-white/15 select-none z-10 group-hover:text-[var(--gold)]/30 transition-colors duration-500"
          aria-hidden
        >
          {refNum}
        </span>
      </div>

      {/* Info */}
      <div className="pt-4 pb-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-serif italic text-[var(--foreground)] leading-snug group-hover:text-[var(--gold)] transition-colors duration-300 flex-1 min-w-0"
            style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)" }}
          >
            {product.title}
          </h3>
          <div className="flex-shrink-0 text-right leading-none pt-0.5">
            <span className="font-serif text-[var(--gold)] tabular-nums" style={{ fontSize: "0.9rem" }}>
              {price}
            </span>
            <span className="block text-[5px] font-mono uppercase tracking-[0.4em] text-[var(--foreground-muted)]/30 mt-1">
              EUR
            </span>
          </div>
        </div>

        {/* Hover underline */}
        <div
          className="mt-3 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: "rgba(197,160,89,0.2)" }}
          aria-hidden
        />
      </div>
    </LocalizedLink>
  );
}

// ─── Featured Panel ───────────────────────────────────────────────────────────
// Editorial split: image left, details right — anchors the multi-product layout

function FeaturedPanel({ product }: { product: ProductListing }) {
  const price = formatPrice(product);

  return (
    <section
      className="grid lg:grid-cols-[11fr_9fr]"
      aria-label={`Destaque: ${product.title}`}
      style={{ opacity: 0, animation: "fadeSlideIn 0.7s ease-out 0.1s forwards" }}
    >
      {/* Left: full image */}
      <LocalizedLink
        href={`/loja/${product.handle}`}
        className="group block relative overflow-hidden bg-[#090909] focus-visible:outline-none"
        aria-label={product.title}
        data-cursor-text="Explorar"
      >
        <div className="relative min-h-[55vw] lg:min-h-[75vh]" style={{ height: "100%" }}>
          {product.images[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="text-white/10" size={48} aria-hidden />
            </div>
          )}

          {/* Darken on hover */}
          <div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700 pointer-events-none"
            aria-hidden
          />

          {/* Gold top sweep */}
          <div
            className="absolute top-0 inset-x-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 z-10"
            style={{ background: "rgba(197,160,89,0.65)" }}
            aria-hidden
          />

          {/* Right vignette feeds into info panel */}
          <div
            className="absolute top-0 right-0 bottom-0 w-1/5 pointer-events-none hidden lg:block"
            style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.3))" }}
            aria-hidden
          />
        </div>
      </LocalizedLink>

      {/* Right: product info */}
      <div
        className="flex flex-col justify-center px-8 sm:px-12 lg:px-14 xl:px-16 py-14 lg:py-20 relative"
        style={{
          borderTop: "1px solid rgba(197,160,89,0.06)",
          borderLeft: "1px solid rgba(197,160,89,0.04)",
        }}
      >
        {/* Atmospheric glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(197,160,89,0.05) 0%, transparent 70%)" }}
          aria-hidden
        />

        {/* Index label */}
        <span
          className="text-[8px] font-mono tracking-[0.55em] text-[var(--gold)]/18 block mb-8 select-none"
          aria-hidden
        >
          01 — Destaque
        </span>

        {/* Collection label */}
        <div className="flex items-center gap-4 mb-7">
          <div
            className="w-6 h-px flex-shrink-0"
            style={{ background: "rgba(197,160,89,0.55)" }}
            aria-hidden
          />
          <span className="text-[6.5px] font-mono uppercase tracking-[0.65em] text-[var(--gold)]/55">
            Colecção Portuguesa
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-serif italic text-[var(--foreground)] leading-[0.88] mb-6"
          style={{ fontSize: "clamp(1.9rem, 3.5vw, 3.2rem)" }}
        >
          {product.title}
        </h2>

        {/* Separator */}
        <div
          className="h-px mb-8"
          style={{ background: "rgba(197,160,89,0.09)" }}
          aria-hidden
        />

        {/* Description */}
        {product.description && (
          <p className="text-[var(--foreground-secondary)] text-[13px] sm:text-sm leading-[1.9] mb-9 max-w-[26ch] opacity-70">
            {product.description}
          </p>
        )}

        {/* Specs */}
        <div className="space-y-3 mb-9">
          {[
            { k: "Origem",   v: "Portugal"        },
            { k: "Produção", v: "Artesanal"        },
            { k: "Coleção",  v: "Heritage · MMXXV" },
          ].map(({ k, v }) => (
            <div key={k} className="flex items-center gap-3">
              <span className="text-[6.5px] font-mono uppercase tracking-[0.4em] text-[var(--foreground-muted)]/40 w-[4.5rem] flex-shrink-0">
                {k}
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(197,160,89,0.05)" }} aria-hidden />
              <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-[var(--foreground-secondary)]/80">
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-9">
          <span
            className="font-serif text-[var(--gold)] tabular-nums"
            style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)" }}
          >
            {price}
          </span>
          <span className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--foreground-muted)]/60">
            EUR
          </span>
        </div>

        {/* CTA */}
        <LocalizedLink
          href={`/loja/${product.handle}`}
          className="inline-flex items-center gap-3 self-start px-8 py-3.5 text-[8px] uppercase tracking-[0.4em] font-bold bg-[var(--gold)] text-black hover:bg-white transition-all duration-300 active:scale-[0.97] touch-manipulation group/cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
        >
          <ShoppingBag size={11} aria-hidden />
          Descobrir Peça
          <ArrowRight
            size={10}
            className="group-hover/cta:translate-x-1 transition-transform duration-300"
            aria-hidden
          />
        </LocalizedLink>
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LojaContent({ products }: { products: ProductListing[] }) {
  const { t } = useLanguage();
  const [sortKey,  setSortKey]  = useState<SortKey>("default");
  const [query,    setQuery]    = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

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

  const isSingle  = products.length === 1;
  const heroImage = products[0]?.images[0]?.url ?? null;
  const featured  = filtered[0];
  const rest      = filtered.slice(1);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — full viewport, cinematic
      ══════════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ height: "100svh", minHeight: "640px" }}
      >
        {/* Background image */}
        {heroImage ? (
          <Image
            src={heroImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 bg-[#070707]" />
        )}

        {/* Diagonal dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(155deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 48%, rgba(0,0,0,0.72) 100%)",
          }}
          aria-hidden
        />

        {/* Bottom gradient — text legibility */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "62%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.55) 42%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* Subtle gold tech grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(197,160,89,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.03) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
          aria-hidden
        />

        {/* ── Top meta bar ── */}
        <div
          className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 sm:px-10 lg:px-16"
          style={{
            paddingTop: "max(env(safe-area-inset-top), 2rem)",
            opacity: 0,
            animation: "fadeSlideIn 0.6s ease-out 0.05s forwards",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-px"
              style={{ background: "rgba(197,160,89,0.5)" }}
              aria-hidden
            />
            <span className="text-[6px] font-mono uppercase tracking-[0.7em] text-white/30">
              Portal Lusitano · Loja
            </span>
          </div>

          {products.length > 0 && (
            <div className="flex items-baseline gap-1.5" aria-hidden>
              <span
                className="font-serif italic text-[var(--gold)]/35 tabular-nums leading-none"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.6rem)" }}
              >
                {String(products.length).padStart(2, "0")}
              </span>
              <span className="text-[5.5px] font-mono uppercase tracking-[0.5em] text-white/20">
                {products.length === 1 ? "Peça" : "Peças"}
              </span>
            </div>
          )}
        </div>

        {/* ── Main content — bottom left ── */}
        <div
          className="absolute bottom-0 inset-x-0 z-20 px-6 sm:px-10 lg:px-16 pb-14 sm:pb-20 lg:pb-24"
          style={{
            opacity: 0,
            animation: "fadeSlideIn 0.95s ease-out 0.2s forwards",
          }}
        >
          <p className="text-[6.5px] font-mono uppercase tracking-[0.7em] text-[var(--gold)]/55 mb-5">
            {t.shop.collection}
          </p>

          <h1
            className="font-serif italic text-white leading-[0.84] mb-6 sm:mb-8"
            style={{ fontSize: "clamp(3.5rem, 9.5vw, 9.5rem)" }}
          >
            {t.shop.legacy}
          </h1>

          {/* Gold line */}
          <div
            className="mb-6"
            style={{
              width: "clamp(56px, 9vw, 140px)",
              height: "1px",
              background: "linear-gradient(to right, rgba(197,160,89,0.8), transparent)",
            }}
            aria-hidden
          />

          <p className="text-[7px] font-mono uppercase tracking-[0.55em] text-white/28 mb-10 sm:mb-12">
            Artesanal · Edição Limitada · Portugal
          </p>

          {/* CTA — bordered button */}
          {featured && (
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("colecao")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-3 group/cta border text-[7.5px] font-mono uppercase tracking-[0.45em] px-7 py-3.5 text-white/45 border-white/12 hover:border-[var(--gold)]/45 hover:text-[var(--gold)] transition-all duration-400 focus-visible:outline-none focus-visible:border-[var(--gold)]"
              aria-label={isSingle ? "Descobrir peça" : "Ver colecção"}
            >
              {isSingle ? "Descobrir Peça" : "Ver Colecção"}
              <ArrowRight
                size={10}
                className="group-hover/cta:translate-x-0.5 transition-transform duration-300"
                aria-hidden
              />
            </button>
          )}
        </div>

        {/* ── Scroll indicator ── */}
        <div
          className="absolute bottom-14 sm:bottom-20 right-6 sm:right-10 lg:right-16 z-20 hidden sm:flex flex-col items-center gap-3"
          style={{ opacity: 0, animation: "fadeSlideIn 0.5s ease-out 0.85s forwards" }}
          aria-hidden
        >
          <span
            className="text-[5px] font-mono uppercase tracking-[0.65em] text-white/18"
            style={{ writingMode: "vertical-lr" }}
          >
            Scroll
          </span>
          <div
            className="w-px"
            style={{
              height: "52px",
              background: "linear-gradient(to bottom, rgba(197,160,89,0.28), transparent)",
            }}
          />
        </div>

        {/* ── Coordinates ── */}
        <div
          className="absolute bottom-5 right-6 sm:right-10 lg:right-16 z-20 hidden md:block"
          aria-hidden
          style={{ opacity: 0, animation: "fadeSlideIn 0.5s ease-out 0.7s forwards" }}
        >
          <span className="text-[5.5px] font-mono tracking-[0.35em] text-white/12">
            38.7° N · 9.1° W
          </span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          COLLECTION
      ══════════════════════════════════════════════════════════════════════════ */}
      <div id="colecao">

        {/* ─── Single product ──────────────────────────────────────────────── */}
        {isSingle && featured && (
          <section
            className="grid md:grid-cols-2"
            aria-label={featured.title}
            style={{ opacity: 0, animation: "fadeSlideIn 0.7s ease-out 0.15s forwards" }}
          >
            {/* Left: sticky image */}
            <LocalizedLink
              href={`/loja/${featured.handle}`}
              className="group block relative overflow-hidden bg-[#0a0a0a] md:sticky md:top-0 focus-visible:outline-none"
              aria-label={featured.title}
            >
              <div className="relative aspect-[3/4] md:h-screen">
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="text-white/10" size={48} aria-hidden />
                  </div>
                )}
                <div
                  className="absolute top-0 inset-x-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 z-10"
                  style={{ background: "rgba(197,160,89,0.7)" }}
                  aria-hidden
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }}
                  aria-hidden
                />
              </div>
            </LocalizedLink>

            {/* Right: details */}
            <div className="flex flex-col justify-center px-8 sm:px-14 py-16 md:py-24 md:min-h-screen relative">
              <div
                className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(197,160,89,0.04) 0%, transparent 70%)" }}
                aria-hidden
              />

              <div className="flex items-center gap-4 mb-10">
                <div className="w-6 h-px flex-shrink-0" style={{ background: "rgba(197,160,89,0.55)" }} aria-hidden />
                <span className="text-[6.5px] font-mono uppercase tracking-[0.65em] text-[var(--gold)]/55">
                  {t.shop.collection}
                </span>
              </div>

              <h2
                className="font-serif italic text-[var(--foreground)] leading-[0.88] mb-8"
                style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
              >
                {featured.title}
              </h2>

              <div className="h-px mb-8" style={{ background: "rgba(197,160,89,0.09)" }} aria-hidden />

              {featured.description && (
                <p className="text-[var(--foreground-secondary)] text-[13px] sm:text-sm leading-[1.9] mb-10 max-w-xs opacity-70">
                  {featured.description}
                </p>
              )}

              <div className="space-y-3 mb-10">
                {[
                  { k: "Origem",   v: "Portugal"        },
                  { k: "Produção", v: "Artesanal"        },
                  { k: "Coleção",  v: "Heritage · MMXXV" },
                ].map(({ k, v }) => (
                  <div key={k} className="flex items-center gap-3">
                    <span className="text-[6.5px] font-mono uppercase tracking-[0.4em] text-[var(--foreground-muted)]/40 w-[4.5rem] flex-shrink-0">
                      {k}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "rgba(197,160,89,0.05)" }} aria-hidden />
                    <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-[var(--foreground-secondary)]/80">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-baseline gap-3 mb-10">
                <span
                  className="font-serif text-[var(--gold)] tabular-nums"
                  style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
                >
                  {formatPrice(featured)}
                </span>
                <span className="text-[7.5px] uppercase tracking-[0.4em] text-[var(--foreground-muted)]/60">
                  EUR
                </span>
              </div>

              <LocalizedLink
                href={`/loja/${featured.handle}`}
                className="inline-flex items-center gap-3 self-start px-8 py-3.5 text-[8px] uppercase tracking-[0.4em] font-bold bg-[var(--gold)] text-black hover:bg-white transition-all duration-300 active:scale-[0.97] touch-manipulation group/cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
              >
                <ShoppingBag size={11} aria-hidden />
                Descobrir Peça
                <ArrowRight size={10} className="group-hover/cta:translate-x-1 transition-transform duration-300" aria-hidden />
              </LocalizedLink>
            </div>
          </section>
        )}

        {/* ─── Multi-product: featured editorial panel ──────────────────────── */}
        {!isSingle && featured && <FeaturedPanel product={featured} />}

        {/* ─── Sticky toolbar: search + sort ───────────────────────────────── */}
        {!isSingle && products.length > 0 && (
          <div
            className="sticky top-0 z-40 px-6 sm:px-10 lg:px-12 py-3.5 flex items-center justify-between gap-4"
            style={{
              background: "rgba(7,7,7,0.92)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderBottom: "1px solid rgba(197,160,89,0.06)",
              borderTop: "1px solid rgba(197,160,89,0.06)",
            }}
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <div className="w-4 h-px" style={{ background: "rgba(197,160,89,0.45)" }} aria-hidden />
              <span className="text-[7px] font-mono uppercase tracking-[0.5em] text-[var(--foreground-secondary)]">
                Colecção
              </span>
              <span className="text-[6.5px] font-mono text-[var(--foreground-muted)]/28 tabular-nums">
                {filtered.length}
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Search */}
              <div className="relative flex items-center">
                <Search size={9} className="absolute left-2.5 text-[var(--foreground-muted)]/35 pointer-events-none" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar..."
                  aria-label="Pesquisar produtos"
                  className="bg-transparent pl-7 pr-6 py-1.5 text-[7px] uppercase tracking-[0.25em] text-[var(--foreground-secondary)] placeholder:text-[var(--foreground-muted)]/28 outline-none w-28 sm:w-40 transition-all"
                  style={{ border: "1px solid rgba(197,160,89,0.11)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(197,160,89,0.35)")}
                  onBlur={(e) =>  (e.currentTarget.style.borderColor = "rgba(197,160,89,0.11)")}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Limpar pesquisa"
                    className="absolute right-2 text-[var(--foreground-muted)]/30 hover:text-[var(--gold)] transition-colors"
                  >
                    <X size={8} />
                  </button>
                )}
              </div>

              {/* Sort */}
              {products.length > 1 && (
                <div ref={sortRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen((v) => !v)}
                    className="flex items-center gap-1.5 text-[7px] uppercase tracking-[0.35em] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors"
                    aria-expanded={sortOpen}
                    aria-haspopup="listbox"
                  >
                    <ListFilter size={9} aria-hidden />
                    <span className="hidden sm:inline">Ordenar</span>
                    <ChevronDown
                      size={8}
                      className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>

                  {sortOpen && (
                    <div
                      role="listbox"
                      className="absolute right-0 top-full mt-2 z-50 min-w-[148px] bg-[#090909] shadow-[0_24px_70px_rgba(0,0,0,0.9)]"
                      style={{ border: "1px solid rgba(197,160,89,0.1)" }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          role="option"
                          aria-selected={sortKey === opt.key}
                          onClick={() => { setSortKey(opt.key); setSortOpen(false); }}
                          className={`w-full text-left px-5 py-3 text-[7px] uppercase tracking-[0.3em] transition-colors hover:text-[var(--gold)] flex items-center gap-2.5 ${
                            sortKey === opt.key ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full flex-shrink-0 bg-[var(--gold)] transition-opacity ${
                              sortKey === opt.key ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Empty state ──────────────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-48 gap-6 px-6">
            <ShoppingBag className="text-[var(--foreground-muted)]/20" size={22} aria-hidden />
            {query ? (
              <>
                <p
                  className="font-serif italic text-[var(--foreground-secondary)]"
                  style={{ fontSize: "clamp(1.1rem, 3vw, 1.7rem)" }}
                >
                  Nenhuma peça para{" "}
                  <span style={{ color: "var(--gold)" }}>&ldquo;{query}&rdquo;</span>
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[7px] uppercase tracking-[0.45em] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors flex items-center gap-2"
                >
                  Limpar pesquisa
                  <ArrowRight size={9} />
                </button>
              </>
            ) : (
              <p
                className="font-serif italic text-[var(--foreground-secondary)]"
                style={{ fontSize: "clamp(1.1rem, 3vw, 1.7rem)" }}
              >
                {t.shop.not_found}
              </p>
            )}
          </div>
        )}

        {/* ─── Multi-product grid ───────────────────────────────────────────── */}
        {!isSingle && rest.length > 0 && (
          <div
            className="px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-20 sm:pb-32"
            style={{ opacity: 0, animation: "fadeSlideIn 0.6s ease-out 0.15s forwards" }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-14">
              {rest.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  refNum={String(i + 2).padStart(2, "0")}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════════ */}
      {filtered.length > 0 && (
        <footer
          className="px-6 sm:px-10 lg:px-16 py-14 sm:py-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8"
          style={{ borderTop: "1px solid rgba(197,160,89,0.06)" }}
        >
          <p
            className="font-serif italic text-[var(--foreground-secondary)] leading-[1.4] max-w-xs"
            style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.35rem)", opacity: 0.6 }}
          >
            Produção artesanal sob encomenda,
            <br />
            enraizada na tradição lusitana.
          </p>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="w-7 h-px" style={{ background: "rgba(197,160,89,0.38)" }} aria-hidden />
            <span className="text-[6px] font-mono uppercase tracking-[0.6em] text-[var(--foreground-muted)]/32">
              Heritage · MMXXV · Portugal
            </span>
          </div>
        </footer>
      )}
    </main>
  );
}

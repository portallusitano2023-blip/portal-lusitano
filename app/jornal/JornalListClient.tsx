"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import LocalizedLink from "@/components/LocalizedLink";
import {
  ArrowRight,
  Clock,
  BookOpen,
  Search,
  LayoutGrid,
  List,
  FileText,
  Newspaper,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import TextSplit from "@/components/TextSplit";
import type { SanityArticle } from "@/lib/sanity-queries";
import { getArticleImageUrl, formatArticleDate } from "@/lib/journal-utils";

interface JornalListClientProps {
  articles: SanityArticle[];
  articlesEN?: SanityArticle[];
  articlesES?: SanityArticle[];
}

// ── SKELETON ──────────────────────────────────────────────────────────────────
function ArticleCardSkeleton() {
  return (
    <div className="border border-[var(--border)] overflow-hidden animate-pulse">
      <div className="w-full aspect-[16/10] bg-[var(--background-secondary)]" />
      <div className="p-6 space-y-3">
        <div className="flex justify-between">
          <div className="h-2.5 w-20 bg-[var(--background-secondary)] rounded" />
          <div className="h-2.5 w-10 bg-[var(--background-secondary)] rounded" />
        </div>
        <div className="h-5 w-4/5 bg-[var(--background-secondary)] rounded" />
        <div className="h-3.5 w-full bg-[var(--background-secondary)] rounded" />
        <div className="h-3.5 w-2/3 bg-[var(--background-secondary)] rounded" />
      </div>
    </div>
  );
}

// ── READING DOTS ──────────────────────────────────────────────────────────────
function ReadDots({ minutes = 5, max = 60 }: { minutes?: number; max?: number }) {
  const total = 5;
  const filled = Math.max(1, Math.round((minutes / max) * total));
  return (
    <span className="flex items-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block w-1 h-1 rounded-full ${i < filled ? "bg-[var(--gold)]" : "bg-[var(--foreground-muted)]/20"}`}
        />
      ))}
    </span>
  );
}

// ── ARTICLE CARD (GRID) ───────────────────────────────────────────────────────
function ArticleCard({
  article,
  index,
  minReadLabel,
  readLabel,
  chronicleLabel,
  language,
}: {
  article: SanityArticle;
  index: number;
  minReadLabel: string;
  readLabel: string;
  chronicleLabel: string;
  language: string;
}) {
  const num = String(index + 1).padStart(2, "0");
  const imgUrl = getArticleImageUrl(article);

  return (
    <LocalizedLink href={`/jornal/${article.slug.current}`}>
      <article
        className="group cursor-pointer h-full flex flex-col bg-[var(--background)] border border-[var(--border)] hover:border-[var(--gold)]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(197,160,89,0.1)]"
      >
        {/* Image */}
        <div className="w-full aspect-[16/10] overflow-hidden relative bg-[var(--background-secondary)]">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={article.image?.alt || article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={28} className="text-[var(--foreground-muted)]/30" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Editorial number — top-left watermark */}
          <span className="absolute top-3 left-3.5 font-mono text-[11px] text-white/30 tracking-widest select-none">
            {num}
          </span>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {article.contentType === "post" && (
              <span className="bg-black/50 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-[8px] uppercase text-white/70 tracking-[0.2em]">
                {chronicleLabel}
              </span>
            )}
          </div>

          {/* Category pill — bottom-left */}
          {article.category && (
            <div className="absolute bottom-3 left-3.5">
              <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.22em] text-white/80">
                <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                {article.category}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-5 flex flex-col flex-grow">
          {/* Meta */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[var(--foreground-muted)] text-[9px] uppercase tracking-[0.2em]">
              {formatArticleDate(article.publishedAt, language)}
            </span>
            <span className="flex items-center gap-2 text-[var(--foreground-muted)] text-[9px]">
              <ReadDots minutes={article.estimatedReadTime} />
              <span className="tabular-nums">{article.estimatedReadTime}&thinsp;{minReadLabel}</span>
            </span>
          </div>

          {/* Gold hairline */}
          <div
            className="h-px mb-4 w-0 group-hover:w-full transition-all duration-500"
            style={{ background: "linear-gradient(to right, rgba(197,160,89,0.6), transparent)" }}
          />

          {/* Title */}
          <h3 className="text-[15px] sm:text-base font-serif text-[var(--foreground)] mb-2.5 group-hover:text-[var(--gold)] transition-colors duration-300 leading-snug flex-grow">
            {article.title}
          </h3>

          {/* Subtitle */}
          <p className="text-[var(--foreground-muted)] text-[11px] sm:text-xs leading-relaxed font-serif line-clamp-2 mb-4">
            {article.subtitle}
          </p>

          {/* CTA */}
          <div className="mt-auto">
            <span className="inline-flex items-center gap-1.5 text-[var(--gold)] text-[9px] uppercase tracking-[0.25em] relative">
              {readLabel}
              <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
            </span>
          </div>
        </div>
      </article>
    </LocalizedLink>
  );
}

// ── LIST ITEM ─────────────────────────────────────────────────────────────────
function ArticleListItem({
  article,
  index,
  minReadLabel,
  chronicleLabel,
  language,
}: {
  article: SanityArticle;
  index: number;
  minReadLabel: string;
  chronicleLabel: string;
  language: string;
}) {
  const imgUrl = getArticleImageUrl(article);
  return (
    <LocalizedLink href={`/jornal/${article.slug.current}`}>
      <article
        className="group cursor-pointer flex items-center gap-0 border-b border-[var(--border)] hover:border-b-[var(--gold)]/20 transition-all duration-300"
      >
        {/* Large editorial number */}
        <span className="hidden sm:flex items-center justify-center w-16 lg:w-20 flex-shrink-0 self-stretch border-r border-[var(--border)] group-hover:border-[var(--gold)]/20 transition-colors">
          <span className="font-mono text-[var(--foreground-muted)]/25 text-xl lg:text-2xl tabular-nums group-hover:text-[var(--gold)]/40 transition-colors duration-300">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>

        {/* Thumbnail */}
        <div className="w-28 sm:w-36 h-20 sm:h-24 flex-shrink-0 overflow-hidden relative bg-[var(--background-secondary)]">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={article.image?.alt || article.title}
              fill
              sizes="144px"
              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={16} className="text-[var(--foreground-muted)]/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center flex-1 min-w-0 px-5 py-4">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            {article.category && (
              <span className="flex items-center gap-1.5 text-[var(--gold)] text-[9px] uppercase tracking-[0.22em]">
                <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                {article.category}
              </span>
            )}
            {article.contentType === "post" && (
              <span className="text-[var(--foreground-muted)] text-[9px] uppercase tracking-[0.15em] flex items-center gap-1">
                <FileText size={9} />
                {chronicleLabel}
              </span>
            )}
            <span className="text-[var(--foreground-muted)] text-[9px] uppercase tracking-[0.1em] ml-auto">
              {article.estimatedReadTime}&thinsp;{minReadLabel}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors duration-300 truncate mb-1">
            {article.title}
          </h3>
          <p className="text-[var(--foreground-muted)] text-[11px] leading-relaxed font-serif line-clamp-1 hidden sm:block">
            {article.subtitle}
          </p>
        </div>

        {/* Arrow */}
        <ArrowRight
          size={13}
          className="text-[var(--foreground-muted)]/30 group-hover:text-[var(--gold)] self-center flex-shrink-0 mr-5 transition-all duration-300 group-hover:translate-x-1"
        />
      </article>
    </LocalizedLink>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function JornalListClient({
  articles,
  articlesEN,
  articlesES,
}: JornalListClientProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const displayArticles = useMemo(() => {
    if (language === "en" && articlesEN && articlesEN.length > 0) {
      if (articles[0]?.titleEn) {
        return articles.map((a) => ({
          ...a,
          title: a.titleEn || a.title,
          subtitle: a.subtitleEn || a.subtitle,
          category: a.categoryEn || a.category,
        }));
      }
      return articlesEN;
    }
    if (language === "es" && articlesES && articlesES.length > 0) return articlesES;
    return articles;
  }, [articles, articlesEN, articlesES, language]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
    setIsClient(true);
    const saved = localStorage.getItem("jornal-view-mode");
    if (saved === "grid" || saved === "list") setViewMode(saved);
  }, []);

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("jornal-view-mode", mode);
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    displayArticles.forEach((a) => { if (a.category) cats.add(a.category); });
    return Array.from(cats);
  }, [displayArticles]);

  const filteredArticles = useMemo(() => {
    return displayArticles.filter((article) => {
      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesType = !selectedType || article.contentType === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [displayArticles, searchQuery, selectedCategory, selectedType]);

  const hasFilters = !!(searchQuery || selectedCategory || selectedType);

  const featuredArticle = displayArticles.find((a) => a.featured) || displayArticles[0];
  const gridArticles = filteredArticles.filter((a) => a._id !== featuredArticle?._id);

  const minReadLabel = tr("min de leitura", "min read", "min de lectura");
  const allLabel = tr("Todos", "All", "Todos");
  const searchPlaceholder = tr("Pesquisar...", "Search...", "Buscar...");
  const noResultsLabel = tr("Nenhum artigo encontrado.", "No articles found.", "No se encontraron artículos.");
  const noResultsHintLabel = tr(
    "Tente um termo diferente ou limpe os filtros.",
    "Try a different term or clear the filters.",
    "Pruebe un término diferente o borre los filtros."
  );
  const clearFiltersLabel = tr("Limpar filtros", "Clear filters", "Borrar filtros");
  const articleLabel = tr("Artigo", "Article", "Artículo");
  const chronicleLabel = tr("Crónica", "Chronicle", "Crónica");
  const gridViewLabel = tr("Grelha", "Grid", "Cuadrícula");
  const listViewLabel = tr("Lista", "List", "Lista");
  const readLabel = tr("Ler", "Read", "Leer");

  // Marquee content for categories strip
  const marqueeText = categories.length > 0
    ? categories.map((c) => c.toUpperCase()).join(" · ") + " · "
    : "GENÉTICA · BIOMECÂNICA · HISTÓRIA · CULTURA · TREINO · ";

  return (
    <main className="min-h-screen bg-[var(--background)] pb-24">

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* HERO — editorial masthead                                             */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 sm:pt-28 pb-0 overflow-hidden">

        {/* Ambient gold glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[var(--gold)] opacity-[0.03] blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-[var(--gold)] opacity-[0.025] blur-[100px]" />
        </div>

        {/* Vertical left rule */}
        <div className="absolute left-6 sm:left-10 top-24 h-40 w-px bg-gradient-to-b from-transparent via-[var(--gold)]/40 to-transparent hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Issue / archive label row */}
          <div
            className="flex items-center justify-between mb-8 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-[var(--gold)]/60" />
              <span className="text-[9px] uppercase tracking-[0.45em] text-[var(--gold)]">
                {t.journal.archive}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] font-mono tabular-nums">
              {tr("Nº", "No.", "Nº")}&thinsp;{new Date().getFullYear()} · {displayArticles.length}&thinsp;{tr("estudos", "studies", "estudios")}
            </span>
          </div>

          {/* Title + subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12 mb-10">
            <div
              className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: "0.15s" }}
            >
              <h1
                className="font-serif text-[var(--foreground)] leading-[0.88] tracking-tight"
                style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
              >
                <TextSplit text={t.journal.title} baseDelay={0.2} wordDelay={0.07} />
              </h1>
            </div>

            <div
              className="lg:max-w-xs opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
              style={{ animationDelay: "0.35s" }}
            >
              <p className="font-serif italic text-[var(--foreground-secondary)] text-sm sm:text-base leading-relaxed lg:text-right">
                &ldquo;{t.journal.subtitle}&rdquo;
              </p>
              <div className="flex lg:justify-end mt-4 gap-6">
                <div className="text-center">
                  <p className="font-mono text-2xl text-[var(--gold)] tabular-nums leading-none mb-1">
                    {String(displayArticles.length).padStart(2, "0")}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
                    {tr("Estudos", "Studies", "Estudios")}
                  </p>
                </div>
                <div className="w-px h-10 bg-[var(--border)] self-center" />
                <div className="text-center">
                  <p className="font-mono text-2xl text-[var(--foreground)] tabular-nums leading-none mb-1">
                    {tr("PT", "EN", "ES")}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
                    {tr("Idioma", "Language", "Idioma")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category marquee strip */}
        <div
          className="overflow-hidden py-3 mb-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
          aria-hidden="true"
        >
          <div
            className="flex whitespace-nowrap"
            style={{ animation: "marquee 30s linear infinite" }}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                className="text-[7px] sm:text-[8px] uppercase tracking-[0.5em] text-[var(--foreground-muted)]/25 flex-shrink-0"
              >
                {Array(8).fill(marqueeText).join("")}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ARTIGO EM DESTAQUE                                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {featuredArticle && !hasFilters && (
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.4s" }}
        >
          <LocalizedLink href={`/jornal/${featuredArticle.slug.current}`}>
            {/* Mobile */}
            <div className="group md:hidden relative w-full h-[420px] overflow-hidden border border-[var(--border)] hover:border-[var(--gold)]/40 transition-colors duration-500">
              {getArticleImageUrl(featuredArticle) && (
                <Image
                  src={getArticleImageUrl(featuredArticle)}
                  alt={featuredArticle.image?.alt || featuredArticle.title}
                  fill
                  className="object-cover opacity-75 group-hover:opacity-95 group-hover:scale-[1.03] transition-all duration-700"
                  sizes="100vw"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-[var(--gold)] text-black px-3 py-1 text-[8px] font-bold uppercase tracking-[0.3em]">
                  {tr("Em Destaque", "Featured", "Destacado")}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                {featuredArticle.category && (
                  <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.22em] text-white/70 mb-3">
                    <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                    {featuredArticle.category}
                  </span>
                )}
                <h2 className="text-2xl font-serif text-white mb-3 leading-tight">
                  {featuredArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-[9px] text-white/50 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Clock size={10} className="text-[var(--gold)]" />
                    {featuredArticle.estimatedReadTime}&thinsp;{minReadLabel}
                  </span>
                  {featuredArticle.publishedAt && (
                    <span>{formatArticleDate(featuredArticle.publishedAt, language)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop — editorial split */}
            <div className="group hidden md:grid md:grid-cols-[3fr_2fr] overflow-hidden border border-[var(--border)] hover:border-[var(--gold)]/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(197,160,89,0.06)]">
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden bg-[var(--background-secondary)]">
                {getArticleImageUrl(featuredArticle) && (
                  <Image
                    src={getArticleImageUrl(featuredArticle)}
                    alt={featuredArticle.image?.alt || featuredArticle.title}
                    fill
                    className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700"
                    sizes="60vw"
                    priority
                  />
                )}
                {/* Bottom-left category */}
                {featuredArticle.category && (
                  <div className="absolute bottom-5 left-5">
                    <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.25em] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1">
                      <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                      {featuredArticle.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Text panel */}
              <div className="flex flex-col justify-between p-10 lg:p-14 bg-[var(--background-secondary)] relative overflow-hidden">
                {/* Background number watermark */}
                <span
                  className="absolute bottom-4 right-4 font-mono select-none pointer-events-none"
                  style={{ fontSize: "clamp(5rem, 8vw, 9rem)", color: "rgba(197,160,89,0.04)", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  01
                </span>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[var(--gold)] text-black px-3 py-1 text-[8px] font-bold uppercase tracking-[0.3em]">
                      {tr("Em Destaque", "Featured", "Destacado")}
                    </span>
                    {featuredArticle.contentType === "post" && (
                      <span className="flex items-center gap-1 border border-[var(--border)] text-[var(--foreground-muted)] px-2.5 py-1 text-[8px] uppercase tracking-[0.2em]">
                        <FileText size={9} />
                        {chronicleLabel}
                      </span>
                    )}
                  </div>

                  <div className="w-10 h-px bg-[var(--gold)]/50 mb-5" />

                  <h2
                    className="font-serif text-[var(--foreground)] leading-[1.1] mb-5 group-hover:text-[var(--gold)] transition-colors duration-300"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.6rem)" }}
                  >
                    {featuredArticle.title}
                  </h2>

                  <p className="text-[var(--foreground-secondary)] text-sm font-serif italic line-clamp-3 leading-relaxed mb-6">
                    {featuredArticle.subtitle}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-4 text-[9px] text-[var(--foreground-muted)] uppercase tracking-wider mb-6">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={11} className="text-[var(--gold)]" />
                      {t.journal.technical_read}
                    </span>
                    <span className="flex items-center gap-2">
                      <ReadDots minutes={featuredArticle.estimatedReadTime} />
                      {featuredArticle.estimatedReadTime}&thinsp;{minReadLabel}
                    </span>
                  </div>
                  {featuredArticle.publishedAt && (
                    <p className="text-[9px] text-[var(--foreground-muted)] uppercase tracking-[0.2em] mb-5">
                      {formatArticleDate(featuredArticle.publishedAt, language)}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-[var(--gold)] text-[9px] uppercase tracking-[0.3em] group-hover:gap-3 transition-all duration-300 relative">
                    {t.journal.read_study}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
                  </span>
                </div>
              </div>
            </div>
          </LocalizedLink>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FILTER BAR — sticky                                                   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 bg-[var(--background)]/90 backdrop-blur-md"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 flex-wrap">

            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="bg-[var(--background-secondary)] border border-[var(--border)] pl-8 pr-7 py-1.5 text-[11px] text-[var(--foreground)] placeholder-[var(--foreground-muted)] outline-none focus:border-[var(--gold)]/40 transition-colors w-36 sm:w-44"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  aria-label={clearFiltersLabel}
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-[var(--border)] flex-shrink-0" />

            {/* All chip */}
            <button
              onClick={() => { setSelectedCategory(null); setSelectedType(null); }}
              className={`flex-shrink-0 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] transition-all border ${
                !selectedCategory && !selectedType
                  ? "bg-[var(--gold)] text-black font-bold border-[var(--gold)]"
                  : "bg-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/30"
              }`}
            >
              {allLabel}
            </button>

            {/* Category chips */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`flex-shrink-0 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] transition-all border ${
                  selectedCategory === cat
                    ? "bg-[var(--gold)] text-black font-bold border-[var(--gold)]"
                    : "bg-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/30"
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="w-px h-4 bg-[var(--border)] flex-shrink-0" />

            {/* Article type chips */}
            <button
              onClick={() => setSelectedType(selectedType === "article" ? null : "article")}
              className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] transition-all border ${
                selectedType === "article"
                  ? "bg-[var(--gold)] text-black font-bold border-[var(--gold)]"
                  : "bg-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/30"
              }`}
            >
              <Newspaper size={10} />
              {articleLabel}
            </button>
            <button
              onClick={() => setSelectedType(selectedType === "post" ? null : "post")}
              className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] transition-all border ${
                selectedType === "post"
                  ? "bg-[var(--gold)] text-black font-bold border-[var(--gold)]"
                  : "bg-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/30"
              }`}
            >
              <FileText size={10} />
              {chronicleLabel}
            </button>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(null); setSelectedType(null); }}
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-[0.15em] text-[var(--foreground-muted)] hover:text-red-400 border border-transparent hover:border-red-400/30 transition-all"
              >
                <X size={10} />
                {clearFiltersLabel}
              </button>
            )}

            {/* View toggle — pushed to right */}
            <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
              <button
                onClick={() => handleViewChange("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid" ? "bg-[var(--gold)]/15 text-[var(--gold)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
                aria-label={gridViewLabel}
                aria-pressed={viewMode === "grid"}
                title={gridViewLabel}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => handleViewChange("list")}
                className={`p-1.5 transition-colors ${
                  viewMode === "list" ? "bg-[var(--gold)]/15 text-[var(--gold)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
                aria-label={listViewLabel}
                aria-pressed={viewMode === "list"}
                title={listViewLabel}
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {/* Result count */}
          {hasFilters && (
            <p className="text-[9px] text-[var(--foreground-muted)] uppercase tracking-[0.2em] mt-2">
              {filteredArticles.length}&thinsp;{tr("artigos encontrados", "articles found", "artículos encontrados")}
            </p>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SKELETON                                                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {!isClient && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <ArticleCardSkeleton key={i} />)}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* EMPTY STATE                                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {isClient && filteredArticles.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-32 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-[var(--border)] mb-6">
            <Search size={22} className="text-[var(--foreground-muted)]/40" />
          </div>
          <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">{noResultsLabel}</h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-8 max-w-xs mx-auto">{noResultsHintLabel}</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory(null); setSelectedType(null); }}
            className="inline-flex items-center gap-2 px-5 py-2 border border-[var(--gold)]/30 text-[var(--gold)] text-[9px] uppercase tracking-[0.25em] hover:bg-[var(--gold)]/5 transition-colors"
          >
            <X size={11} />
            {clearFiltersLabel}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ARTICLES GRID / LIST                                                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {isClient && filteredArticles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">

          {/* Magazine asymmetric first row — grid, no filters, 3+ articles */}
          {viewMode === "grid" && !hasFilters && gridArticles.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
              {/* Large card */}
              <div
                className="md:col-span-3 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.1s" }}
              >
                <LocalizedLink href={`/jornal/${gridArticles[0].slug.current}`}>
                  <article className="group cursor-pointer h-full flex flex-col bg-[var(--background)] border border-[var(--border)] hover:border-[var(--gold)]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(197,160,89,0.1)]">
                    <div className="w-full aspect-[4/3] overflow-hidden relative bg-[var(--background-secondary)]">
                      {getArticleImageUrl(gridArticles[0]) ? (
                        <Image
                          src={getArticleImageUrl(gridArticles[0])}
                          alt={gridArticles[0].image?.alt || gridArticles[0].title}
                          fill
                          sizes="(max-width: 768px) 100vw, 60vw"
                          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen size={36} className="text-[var(--foreground-muted)]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <span className="absolute top-3 left-4 font-mono text-[11px] text-white/25 tracking-widest select-none">01</span>
                      {gridArticles[0].category && (
                        <div className="absolute bottom-4 left-4">
                          <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.22em] text-white/80">
                            <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                            {gridArticles[0].category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="px-6 pt-4 pb-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[var(--foreground-muted)] text-[9px] uppercase tracking-[0.2em]">
                          {formatArticleDate(gridArticles[0].publishedAt, language)}
                        </span>
                        <span className="flex items-center gap-2 text-[9px] text-[var(--foreground-muted)]">
                          <ReadDots minutes={gridArticles[0].estimatedReadTime} />
                          {gridArticles[0].estimatedReadTime}&thinsp;{minReadLabel}
                        </span>
                      </div>
                      <div className="h-px mb-4 w-0 group-hover:w-full transition-all duration-500" style={{ background: "linear-gradient(to right, rgba(197,160,89,0.6), transparent)" }} />
                      <h3 className="text-xl sm:text-2xl font-serif text-[var(--foreground)] mb-2.5 group-hover:text-[var(--gold)] transition-colors duration-300 leading-snug">
                        {gridArticles[0].title}
                      </h3>
                      <p className="text-[var(--foreground-muted)] text-xs leading-relaxed font-serif line-clamp-2 mb-4">
                        {gridArticles[0].subtitle}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[var(--gold)] text-[9px] uppercase tracking-[0.25em] relative">
                        {readLabel}
                        <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
                      </span>
                    </div>
                  </article>
                </LocalizedLink>
              </div>

              {/* Two stacked small cards */}
              <div className="md:col-span-2 flex flex-col gap-5">
                {gridArticles.slice(1, 3).map((article, i) => (
                  <div
                    key={article._id}
                    className="flex-1 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${(i + 1) * 0.08 + 0.1}s` }}
                  >
                    <LocalizedLink href={`/jornal/${article.slug.current}`}>
                      <article className="group cursor-pointer h-full flex flex-row bg-[var(--background)] border border-[var(--border)] hover:border-[var(--gold)]/30 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                        <div className="w-32 sm:w-36 flex-shrink-0 overflow-hidden relative bg-[var(--background-secondary)]">
                          {getArticleImageUrl(article) ? (
                            <Image
                              src={getArticleImageUrl(article)}
                              alt={article.image?.alt || article.title}
                              fill
                              sizes="144px"
                              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <BookOpen size={18} className="text-[var(--foreground-muted)]/20" />
                            </div>
                          )}
                          <span className="absolute top-2 left-2 font-mono text-[10px] text-white/20 tracking-widest select-none">
                            {String(i + 2).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="p-4 flex flex-col justify-center flex-1 min-w-0">
                          {article.category && (
                            <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.2em] text-[var(--gold)] mb-2">
                              <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                              {article.category}
                            </span>
                          )}
                          <div className="h-px mb-2.5 w-0 group-hover:w-8 transition-all duration-400" style={{ background: "rgba(197,160,89,0.5)" }} />
                          <h3 className="text-sm font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors duration-300 leading-snug line-clamp-2 mb-1.5">
                            {article.title}
                          </h3>
                          <span className="text-[9px] text-[var(--foreground-muted)] flex items-center gap-1.5">
                            <ReadDots minutes={article.estimatedReadTime} max={60} />
                            {article.estimatedReadTime}&thinsp;{minReadLabel}
                          </span>
                        </div>
                      </article>
                    </LocalizedLink>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section header for remaining articles */}
          {viewMode === "grid" && !hasFilters && gridArticles.length >= 3 && (
            <div
              className="flex items-center gap-4 mb-6 mt-2 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-4 h-px bg-[var(--gold)]/50" />
              <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--foreground-muted)]">
                {tr("Arquivo Completo", "Full Archive", "Archivo Completo")}
              </span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>
          )}

          {/* Grid or list */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "border-t border-[var(--border)]"}>
            {(() => {
              const articlesToRender = hasFilters
                ? filteredArticles
                : viewMode === "grid" && gridArticles.length >= 3
                  ? gridArticles.slice(3)
                  : gridArticles;

              return articlesToRender.map((article, index) => (
                <div
                  key={article._id}
                  className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.06 + 0.1}s` }}
                >
                  {viewMode === "grid" ? (
                    <ArticleCard
                      article={article}
                      index={hasFilters ? index : index + (gridArticles.length >= 3 ? 3 : 0)}
                      minReadLabel={minReadLabel}
                      readLabel={readLabel}
                      chronicleLabel={chronicleLabel}
                      language={language}
                    />
                  ) : (
                    <ArticleListItem
                      article={article}
                      index={index}
                      minReadLabel={minReadLabel}
                      chronicleLabel={chronicleLabel}
                      language={language}
                    />
                  )}
                </div>
              ));
            })()}
          </div>
        </div>
      )}

    </main>
  );
}

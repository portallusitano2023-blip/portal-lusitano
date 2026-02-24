"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { urlFor } from "@/lib/sanity-image";
import type { SanityArticle } from "@/lib/sanity-queries";

interface JornalListClientProps {
  articles: SanityArticle[];
  articlesEN?: SanityArticle[];
}

function getImageUrl(article: SanityArticle): string {
  if (article.image?.asset?.url) return article.image.asset.url;
  if (article.image?.asset?._ref) {
    try {
      return urlFor(article.image).width(800).quality(80).url();
    } catch {
      return "";
    }
  }
  return "";
}

function formatDate(dateStr: string, lang: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "pt" ? "pt-PT" : lang === "es" ? "es-ES" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Skeleton card para o estado de loading
function ArticleCardSkeleton() {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface-hover)] overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-[var(--background-secondary)]" />
      <div className="p-8 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-24 bg-[var(--background-secondary)] rounded" />
          <div className="h-3 w-12 bg-[var(--background-secondary)] rounded" />
        </div>
        <div className="h-6 w-4/5 bg-[var(--background-secondary)] rounded" />
        <div className="h-4 w-full bg-[var(--background-secondary)] rounded" />
        <div className="h-4 w-3/4 bg-[var(--background-secondary)] rounded" />
        <div className="h-4 w-2/3 bg-[var(--background-secondary)] rounded" />
        <div className="border-t border-[var(--border)] pt-4 mt-2">
          <div className="h-3 w-28 bg-[var(--background-secondary)] rounded" />
        </div>
      </div>
    </div>
  );
}

export default function JornalListClient({ articles, articlesEN }: JornalListClientProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  // Usar artigos EN quando disponíveis e idioma é inglês
  const displayArticles = useMemo(() => {
    if (language === "en" && articlesEN && articlesEN.length > 0) {
      // Se os artigos vêm do Sanity (têm titleEn), usar campos EN dos mesmos artigos
      if (articles[0]?.titleEn) {
        return articles.map((a) => ({
          ...a,
          title: a.titleEn || a.title,
          subtitle: a.subtitleEn || a.subtitle,
          category: a.categoryEn || a.category,
        }));
      }
      // Senão usar o array EN separado (fallback local)
      return articlesEN;
    }
    return articles;
  }, [articles, articlesEN, language]);

  // Estado de filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard: must detect client in effect
    setIsClient(true);
    const saved = localStorage.getItem("jornal-view-mode");
    if (saved === "grid" || saved === "list") setViewMode(saved);
  }, []);

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("jornal-view-mode", mode);
  };

  // Categorias únicas
  const categories = useMemo(() => {
    const cats = new Set<string>();
    displayArticles.forEach((a) => {
      if (a.category) cats.add(a.category);
    });
    return Array.from(cats);
  }, [displayArticles]);

  // Filtrar artigos
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

  // Artigo em destaque
  const featuredArticle = displayArticles.find((a) => a.featured) || displayArticles[0];
  const gridArticles = filteredArticles.filter((a) => a._id !== featuredArticle?._id);

  // Texto traduzido para min de leitura
  const minReadLabel = tr("min de leitura", "min read", "min de lectura");
  const allLabel = tr("Todos", "All", "Todos");
  const searchPlaceholder = tr("Pesquisar artigos...", "Search articles...", "Buscar artículos...");
  const noResultsLabel = tr(
    "Nenhum artigo encontrado.",
    "No articles found.",
    "No se encontraron artículos."
  );
  const noResultsHintLabel = tr(
    "Tente um termo diferente ou limpe os filtros.",
    "Try a different term or clear the filters.",
    "Pruebe un término diferente o borre los filtros."
  );
  const clearFiltersLabel = tr("Limpar filtros", "Clear filters", "Borrar filtros");
  const articleLabel = tr("Artigo", "Article", "Artículo");
  const chronicleLabel = tr("Crónica", "Chronicle", "Crónica");
  const gridViewLabel = tr("Vista grelha", "Grid view", "Vista cuadrícula");
  const listViewLabel = tr("Vista lista", "List view", "Vista lista");
  const readLabel = tr("Ler", "Read", "Leer");

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20">
      {/* ================================================================= */}
      {/* HERO EDITORIAL — tipografia dramática */}
      {/* ================================================================= */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Linha dourada decorativa lateral */}
        <div className="absolute left-0 top-32 bottom-20 w-px bg-gradient-to-b from-transparent via-[var(--gold)]/40 to-transparent hidden md:block" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Bloco de título */}
            <div className="max-w-3xl opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
              <span
                className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)] block mb-5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.2s" }}
              >
                {t.journal.archive}
              </span>

              {/* Linha dourada horizontal sobre o título */}
              <div
                className="w-16 h-px bg-[var(--gold)] mb-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.25s" }}
              />

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[var(--foreground)] leading-[0.9] tracking-tight">
                <TextSplit text={t.journal.title} baseDelay={0.1} wordDelay={0.06} />
              </h1>
            </div>

            {/* Subtítulo editorial à direita */}
            <p
              className="text-[var(--foreground-secondary)] font-serif italic text-base md:text-lg max-w-xs opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards] md:text-right"
              style={{ animationDelay: "0.25s" }}
            >
              &ldquo;{t.journal.subtitle}&rdquo;
            </p>
          </div>

          {/* Linha separadora decorativa */}
          <div
            className="mt-10 flex items-center gap-4 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[var(--gold)] text-[10px] uppercase tracking-[0.3em]">
              {displayArticles.length}&nbsp;
              {tr("estudos", "studies", "estudios")}
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* ARTIGO EM DESTAQUE — hero card grande */}
      {/* ================================================================= */}
      {featuredArticle && !hasFilters && (
        <div
          className="max-w-7xl mx-auto px-6 mb-20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.4s" }}
        >
          <Link href={`/jornal/${featuredArticle.slug.current}`}>
            {/* Mobile: overlay layout */}
            <div className="group md:hidden relative w-full h-[400px] overflow-hidden border border-[var(--border)] hover:border-[var(--gold)]/40 transition-colors duration-500 cursor-pointer">
              {getImageUrl(featuredArticle) && (
                <Image
                  src={getImageUrl(featuredArticle)}
                  alt={featuredArticle.image?.alt || featuredArticle.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  sizes="100vw"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="inline-block bg-[var(--gold)] text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em]">
                  {tr("Em Destaque", "Featured", "Destacado")}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="border border-[var(--gold)]/50 text-[var(--gold)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em]">
                    {featuredArticle.category}
                  </span>
                </div>
                <h2 className="text-2xl font-serif text-white mb-3 leading-tight">
                  {featuredArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-[10px] text-[var(--foreground-secondary)] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} className="text-[var(--gold)]" />
                    {featuredArticle.estimatedReadTime}&nbsp;{minReadLabel}
                  </span>
                  {featuredArticle.publishedAt && (
                    <span>{formatDate(featuredArticle.publishedAt, language)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop: editorial split layout */}
            <div className="group hidden md:grid md:grid-cols-5 overflow-hidden border border-[var(--border)] hover:border-[var(--gold)]/40 transition-colors duration-500 cursor-pointer">
              {/* Imagem — 3/5 */}
              <div className="col-span-3 relative aspect-[3/2] overflow-hidden">
                {getImageUrl(featuredArticle) && (
                  <Image
                    src={getImageUrl(featuredArticle)}
                    alt={featuredArticle.image?.alt || featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="60vw"
                    priority
                  />
                )}
              </div>

              {/* Texto — 2/5 */}
              <div className="col-span-2 flex flex-col justify-center p-10 lg:p-14 bg-[var(--surface-hover)]">
                <span className="inline-block bg-[var(--gold)] text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] self-start mb-6">
                  {tr("Em Destaque", "Featured", "Destacado")}
                </span>

                <div className="flex items-center gap-2 mb-5">
                  <span className="border border-[var(--gold)]/50 text-[var(--gold)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em]">
                    {featuredArticle.category}
                  </span>
                  {featuredArticle.contentType === "post" && (
                    <span className="inline-flex items-center gap-1.5 border border-[var(--foreground-muted)]/30 text-[var(--foreground-muted)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em]">
                      <FileText size={10} />
                      {chronicleLabel}
                    </span>
                  )}
                </div>

                <div className="w-12 h-px bg-[var(--gold)]/50 mb-5" />

                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-[var(--foreground)] mb-4 leading-tight group-hover:text-[var(--gold)] transition-colors duration-300">
                  {featuredArticle.title}
                </h2>

                <p className="text-[var(--foreground-secondary)] text-base mb-6 font-serif italic line-clamp-3">
                  {featuredArticle.subtitle}
                </p>

                <div className="flex items-center gap-5 text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider mb-6">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={12} className="text-[var(--gold)]" />
                    {t.journal.technical_read}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[var(--gold)]" />
                    {featuredArticle.estimatedReadTime}&nbsp;{minReadLabel}
                  </span>
                </div>

                {featuredArticle.publishedAt && (
                  <span className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider mb-6 block">
                    {formatDate(featuredArticle.publishedAt, language)}
                  </span>
                )}

                <div className="inline-flex items-center gap-2 text-[var(--gold)] text-xs uppercase tracking-[0.2em] group-hover:gap-3 transition-all duration-300 relative">
                  {t.journal.read_study}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ================================================================= */}
      {/* BARRA DE FILTROS — pesquisa + categorias + tipo + vista */}
      {/* ================================================================= */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-col gap-4">
          {/* Linha 1: pesquisa + vista */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-[var(--surface-hover)] border border-[var(--border)] pl-9 pr-4 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] outline-none focus:border-[var(--gold)]/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  aria-label={clearFiltersLabel}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Toggle vista */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => handleViewChange("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-[var(--gold)]/15 text-[var(--gold)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
                aria-label={gridViewLabel}
                aria-pressed={viewMode === "grid"}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => handleViewChange("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-[var(--gold)]/15 text-[var(--gold)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
                aria-label={listViewLabel}
                aria-pressed={viewMode === "list"}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Linha 2: categorias + tipo */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Chip "Todos" */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedType(null);
              }}
              className={`whitespace-nowrap px-3 py-1.5 text-[10px] uppercase tracking-wider transition-all border ${
                !selectedCategory && !selectedType
                  ? "bg-[var(--gold)] text-black font-bold border-[var(--gold)]"
                  : "bg-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/40"
              }`}
            >
              {allLabel}
            </button>

            {/* Separador visual */}
            <div className="w-px h-4 bg-[var(--border)]" />

            {/* Chips de categorias */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`whitespace-nowrap px-3 py-1.5 text-[10px] uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? "bg-[var(--gold)] text-black font-bold border-[var(--gold)]"
                    : "bg-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/40"
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Separador visual */}
            <div className="w-px h-4 bg-[var(--border)]" />

            {/* Chip Artigo */}
            <button
              onClick={() => setSelectedType(selectedType === "article" ? null : "article")}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[10px] uppercase tracking-wider transition-all border ${
                selectedType === "article"
                  ? "bg-[var(--gold)] text-black font-bold border-[var(--gold)]"
                  : "bg-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/40"
              }`}
            >
              <Newspaper size={11} />
              {articleLabel}
            </button>

            {/* Chip Crónica */}
            <button
              onClick={() => setSelectedType(selectedType === "post" ? null : "post")}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[10px] uppercase tracking-wider transition-all border ${
                selectedType === "post"
                  ? "bg-[var(--gold)] text-black font-bold border-[var(--gold)]"
                  : "bg-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/40"
              }`}
            >
              <FileText size={11} />
              {chronicleLabel}
            </button>

            {/* Botão limpar filtros */}
            {hasFilters && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setSelectedType(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] hover:text-red-400 border border-transparent hover:border-red-400/30 rounded-full transition-all"
              >
                <X size={11} />
                {clearFiltersLabel}
              </button>
            )}
          </div>

          {/* Contagem de resultados */}
          {hasFilters && (
            <p className="text-xs text-[var(--foreground-muted)]">
              {filteredArticles.length}&nbsp;
              {tr("artigos encontrados", "articles found", "artículos encontrados")}
            </p>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* SKELETON — enquanto não é client-side */}
      {/* ================================================================= */}
      {!isClient && (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ================================================================= */}
      {/* EMPTY STATE — sem resultados elegante */}
      {/* ================================================================= */}
      {isClient && filteredArticles.length === 0 && (
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          {/* Ícone decorativo */}
          <div className="inline-flex items-center justify-center w-16 h-16 border border-[var(--border)] rounded-sm mb-6 mx-auto">
            <Search size={24} className="text-[var(--foreground-muted)]" />
          </div>
          <h3 className="text-2xl font-serif text-[var(--foreground)] mb-3">{noResultsLabel}</h3>
          <p className="text-sm text-[var(--foreground-muted)] mb-8 max-w-xs mx-auto">
            {noResultsHintLabel}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
              setSelectedType(null);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-[var(--gold)]/30 text-[var(--gold)] text-xs uppercase tracking-wider hover:bg-[var(--gold)]/5 transition-colors"
          >
            <X size={12} />
            {clearFiltersLabel}
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* GRELHA DE ARTIGOS */}
      {/* ================================================================= */}
      {isClient && filteredArticles.length > 0 && (
        <div className="max-w-7xl mx-auto px-6">
          {/* MAGAZINE ROW — primeira fila assimétrica (só grid view sem filtros, 3+ artigos) */}
          {viewMode === "grid" && !hasFilters && gridArticles.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {/* Card grande — esquerda */}
              <div
                className="md:col-span-3 md:row-span-2 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: "0.15s" }}
              >
                <Link href={`/jornal/${gridArticles[0].slug.current}`}>
                  <article className="group cursor-pointer h-full flex flex-col border border-[var(--border)] border-t-2 border-t-transparent hover:border-[var(--gold)]/40 hover:border-t-[var(--gold)] transition-all duration-500 bg-[var(--surface-hover)] hover:shadow-[0_0_40px_rgba(197,160,89,0.08)]">
                    <div className="w-full aspect-[4/3] md:flex-1 overflow-hidden relative">
                      {getImageUrl(gridArticles[0]) ? (
                        <Image
                          src={getImageUrl(gridArticles[0])}
                          alt={gridArticles[0].image?.alt || gridArticles[0].title}
                          fill
                          sizes="(max-width: 768px) 100vw, 60vw"
                          className="object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[var(--background-secondary)] flex items-center justify-center">
                          <BookOpen size={40} className="text-[var(--foreground-muted)]" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {gridArticles[0].contentType === "post" && (
                          <span className="bg-white/15 backdrop-blur-sm px-2 py-0.5 text-[9px] uppercase text-white tracking-widest">
                            {chronicleLabel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="px-7 pt-5 pb-0 flex items-center justify-between text-[10px] uppercase tracking-widest">
                      <span className="flex items-center gap-2 text-[var(--gold)]">
                        {gridArticles[0].category && (
                          <>
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                            {gridArticles[0].category}
                          </>
                        )}
                      </span>
                      <span className="flex items-center gap-3 text-[var(--foreground-muted)]">
                        <span>{formatDate(gridArticles[0].publishedAt, language)}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {gridArticles[0].estimatedReadTime}&nbsp;{minReadLabel}
                        </span>
                      </span>
                    </div>
                    <div className="px-7 pt-4 pb-7">
                      <h3 className="text-2xl font-serif text-[var(--foreground)] mb-3 group-hover:text-[var(--gold)] transition-colors duration-300 leading-snug">
                        {gridArticles[0].title}
                      </h3>
                      <p className="text-[var(--foreground-muted)] text-sm leading-relaxed font-serif line-clamp-3 mb-4">
                        {gridArticles[0].subtitle}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[var(--foreground)] text-xs uppercase tracking-widest relative">
                        {readLabel}
                        <ArrowRight
                          size={13}
                          className="text-[var(--gold)] group-hover:translate-x-1 transition-transform duration-300"
                        />
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
                      </span>
                    </div>
                  </article>
                </Link>
              </div>

              {/* Cards pequenos — direita, empilhados */}
              {gridArticles.slice(1, 3).map((article, i) => (
                <div
                  key={article._id}
                  className="md:col-span-2 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${(i + 1) * 0.08 + 0.15}s` }}
                >
                  <Link href={`/jornal/${article.slug.current}`}>
                    <article className="group cursor-pointer h-full flex flex-row md:flex-row border border-[var(--border)] border-t-2 border-t-transparent hover:border-[var(--gold)]/40 hover:border-t-[var(--gold)] transition-all duration-500 bg-[var(--surface-hover)] hover:shadow-[0_0_40px_rgba(197,160,89,0.08)]">
                      <div className="w-36 md:w-40 flex-shrink-0 overflow-hidden relative">
                        {getImageUrl(article) ? (
                          <Image
                            src={getImageUrl(article)}
                            alt={article.image?.alt || article.title}
                            fill
                            sizes="160px"
                            className="object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[var(--background-secondary)] flex items-center justify-center">
                            <BookOpen size={20} className="text-[var(--foreground-muted)]" />
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col justify-center flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest">
                          <span className="flex items-center gap-1.5 text-[var(--gold)]">
                            {article.category && (
                              <>
                                <span className="inline-block w-1 h-1 rounded-full bg-[var(--gold)]" />
                                {article.category}
                              </>
                            )}
                          </span>
                          <span className="text-[var(--foreground-muted)] flex items-center gap-1">
                            <Clock size={9} />
                            {article.estimatedReadTime}&nbsp;{minReadLabel}
                          </span>
                        </div>
                        <h3 className="text-base font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors duration-300 leading-snug line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-[var(--foreground-muted)] text-xs leading-relaxed font-serif line-clamp-2 hidden sm:block">
                          {article.subtitle}
                        </p>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* GRID REGULAR — restantes artigos */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "flex flex-col"
            }
          >
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
                  style={{ animationDelay: `${index * 0.08 + 0.15}s` }}
                >
                  {viewMode === "grid" ? (
                    <Link href={`/jornal/${article.slug.current}`}>
                      <article
                        className="group cursor-pointer h-full flex flex-col border border-[var(--border)] border-t-2 border-t-transparent hover:border-[var(--gold)]/40 hover:border-t-[var(--gold)] transition-all duration-500 bg-[var(--surface-hover)] hover:shadow-[0_0_40px_rgba(197,160,89,0.08)]"
                        aria-label={article.title}
                      >
                        {/* Imagem com zoom no hover */}
                        <div className="w-full aspect-[16/10] overflow-hidden relative">
                          {getImageUrl(article) ? (
                            <Image
                              src={getImageUrl(article)}
                              alt={article.image?.alt || article.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-[var(--background-secondary)] flex items-center justify-center">
                              <BookOpen size={32} className="text-[var(--foreground-muted)]" />
                            </div>
                          )}
                          {/* Badges sobrepostos à imagem */}
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            {article.contentType === "post" && (
                              <span className="bg-white/15 backdrop-blur-sm px-2 py-0.5 text-[9px] uppercase text-white tracking-widest">
                                {chronicleLabel}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Meta bar entre imagem e conteúdo */}
                        <div className="px-7 pt-5 pb-0 flex items-center justify-between text-[10px] uppercase tracking-widest">
                          <span className="flex items-center gap-2 text-[var(--gold)]">
                            {article.category && (
                              <>
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                                {article.category}
                              </>
                            )}
                          </span>
                          <span className="flex items-center gap-3 text-[var(--foreground-muted)]">
                            <span>{formatDate(article.publishedAt, language)}</span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {article.estimatedReadTime}&nbsp;{minReadLabel}
                            </span>
                          </span>
                        </div>

                        <div className="px-7 pt-4 pb-7 flex flex-col flex-grow">
                          {/* Título */}
                          <h3 className="text-xl font-serif text-[var(--foreground)] mb-3 group-hover:text-[var(--gold)] transition-colors duration-300 leading-snug">
                            {article.title}
                          </h3>

                          {/* Excerpt com line-clamp-3 */}
                          <p className="text-[var(--foreground-muted)] text-sm leading-relaxed mb-6 flex-grow font-serif line-clamp-3">
                            {article.subtitle}
                          </p>

                          {/* CTA com underline animado */}
                          <div className="mt-auto">
                            <span className="inline-flex items-center gap-2 text-[var(--foreground)] text-xs uppercase tracking-widest relative">
                              {readLabel}
                              <ArrowRight
                                size={13}
                                className="text-[var(--gold)] group-hover:translate-x-1 transition-transform duration-300"
                              />
                              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ) : (
                    /* VISTA LISTA */
                    <Link href={`/jornal/${article.slug.current}`}>
                      <article
                        className="group cursor-pointer flex gap-5 border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-all duration-300 py-5 px-4"
                        aria-label={article.title}
                      >
                        {/* Número editorial */}
                        <span className="hidden sm:flex items-center justify-center w-8 text-[var(--foreground-muted)]/30 text-xs font-mono tabular-nums flex-shrink-0 pt-1">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Thumbnail */}
                        <div className="w-40 h-28 flex-shrink-0 overflow-hidden relative">
                          {getImageUrl(article) ? (
                            <Image
                              src={getImageUrl(article)}
                              alt={article.image?.alt || article.title}
                              fill
                              sizes="160px"
                              className="object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-[var(--background-secondary)] flex items-center justify-center">
                              <BookOpen size={20} className="text-[var(--foreground-muted)]" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col justify-center flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {article.category && (
                              <span className="flex items-center gap-1.5 text-[var(--gold)] text-[10px] uppercase tracking-widest">
                                <span className="inline-block w-1 h-1 rounded-full bg-[var(--gold)]" />
                                {article.category}
                              </span>
                            )}
                            <span className="text-[var(--foreground-muted)] text-[10px]">
                              {formatDate(article.publishedAt, language)}
                            </span>
                            <span className="flex items-center gap-1 text-[var(--foreground-muted)] text-[10px]">
                              <Clock size={10} />
                              {article.estimatedReadTime}&nbsp;{minReadLabel}
                            </span>
                          </div>
                          <h3 className="text-lg font-serif text-[var(--foreground)] mb-1.5 group-hover:text-[var(--gold)] transition-colors duration-300 truncate">
                            {article.title}
                          </h3>
                          <p className="text-[var(--foreground-muted)] text-sm line-clamp-2 font-serif leading-relaxed">
                            {article.subtitle}
                          </p>
                        </div>
                        <ArrowRight
                          size={15}
                          className="text-[var(--foreground-muted)] group-hover:text-[var(--gold)] self-center flex-shrink-0 transition-all duration-300 group-hover:translate-x-1"
                        />
                      </article>
                    </Link>
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

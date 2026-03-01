"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUp, Clock, Calendar, Newspaper, FileText } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { SanityArticle } from "@/lib/sanity-queries";
import { getArticleImageUrl, formatArticleDate, legacyIdToSlug } from "@/lib/journal-utils";
import { articlesListPT, articlesListEN, articlesListES } from "@/data/articlesList";
import PortableTextRenderer from "@/components/journal/PortableTextComponents";
import ReadingProgressBar from "@/components/journal/ReadingProgressBar";
import FloatingTOC from "@/components/journal/FloatingTOC";
import LocalFloatingTOC from "@/components/journal/LocalFloatingTOC";
import RelatedArticles from "@/components/journal/RelatedArticles";
import LocalRelatedArticles from "@/components/journal/LocalRelatedArticles";
import SourcesList from "@/components/journal/SourcesList";
import Newsletter from "@/components/Newsletter";

// Fallback para dados locais
import { articlesDataPT, articlesDataEN } from "@/data/articlesData";

interface ArticlePageClientProps {
  slug: string;
  legacyId?: string;
  article: SanityArticle | null;
  relatedArticles: SanityArticle[];
}

function PrevNextNav({ currentId, language }: { currentId: string; language: string }) {
  const tr = createTranslator(language);
  const list =
    language === "es" ? articlesListES : language === "en" ? articlesListEN : articlesListPT;
  const idx = list.findIndex((a) => a.id === currentId);
  if (idx === -1) return null;
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx < list.length - 1 ? list[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <nav
      className="max-w-4xl mx-auto px-8 mt-16"
      aria-label={tr("Navegação entre artigos", "Article navigation", "Navegación entre artículos")}
      data-no-print
    >
      <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-8">
        {prev ? (
          <Link href={`/jornal/${legacyIdToSlug[prev.id] || prev.id}`} className="group text-left">
            <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
              ← {tr("Anterior", "Previous", "Anterior")}
            </span>
            <p className="text-sm font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors mt-1 line-clamp-2">
              {prev.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link
            href={`/jornal/${legacyIdToSlug[next.id] || next.id}`}
            className="group text-right col-start-2"
          >
            <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
              {tr("Seguinte", "Next", "Siguiente")} →
            </span>
            <p className="text-sm font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors mt-1 line-clamp-2">
              {next.title}
            </p>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function ArticlePageClient({
  legacyId,
  article,
  relatedArticles,
}: ArticlePageClientProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fallback para dados locais se artigo Sanity não existe
  if (!article && legacyId) {
    const articlesData = language === "pt" ? articlesDataPT : articlesDataEN;
    const localArticle = articlesData[legacyId];

    if (!localArticle) {
      return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)]">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif">{t.journal.unavailable}</h1>
            <p className="text-[var(--foreground-muted)]">{t.journal.unavailable_text}</p>
            <Link
              href="/jornal"
              className="text-[var(--gold)] border-b border-[var(--gold)] pb-1 uppercase text-xs tracking-widest"
            >
              {t.journal.back}
            </Link>
          </div>
        </div>
      );
    }

    // Renderizar artigo local (sem Portable Text, com JSX directo)
    return (
      <article className="min-h-screen bg-[var(--background)] pb-40">
        <ReadingProgressBar language={language} />
        {/* BREADCRUMB VISUAL */}
        <nav
          aria-label="Breadcrumb"
          className="relative z-20 px-6 md:px-12 pt-24 pb-3 bg-[var(--background)]"
        >
          <ol className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
            <li>
              <Link href="/" className="hover:text-[var(--gold)] transition-colors">
                {tr("Início", "Home", "Inicio")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-[var(--gold)]/40">
              /
            </li>
            <li>
              <Link href="/jornal" className="hover:text-[var(--gold)] transition-colors">
                {tr("Jornal", "Journal", "Revista")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-[var(--gold)]/40">
              /
            </li>
            <li className="text-[var(--foreground-secondary)] truncate max-w-[200px] sm:max-w-xs">
              {localArticle.title}
            </li>
          </ol>
        </nav>
        <header className="relative h-[65vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={localArticle.image}
              alt={localArticle.title}
              fill
              className="object-cover scale-105"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/60" aria-hidden />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/10"
              aria-hidden
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-24 z-10">
            <div className="max-w-7xl mx-auto space-y-8">
              <Link
                href="/jornal"
                className="inline-flex items-center text-white/60 hover:text-[var(--gold)] transition-colors text-xs uppercase tracking-[0.2em] gap-2 mb-4"
              >
                <ArrowLeft size={16} /> {t.journal.back_archive}
              </Link>
              <div className="flex items-center gap-6 text-white/60 text-xs">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-[var(--gold)]" /> {localArticle.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-[var(--gold)]" /> {localArticle.readTime}
                </span>
              </div>
              <span className="inline-block text-[var(--gold)] text-[9px] uppercase tracking-[0.4em] font-bold border border-[var(--gold)]/30 px-4 py-2">
                {localArticle.category}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white max-w-5xl leading-none tracking-tight">
                {localArticle.title}
              </h1>
              <p className="text-lg md:text-xl text-[var(--foreground-secondary)] max-w-3xl font-light italic">
                {localArticle.subtitle}
              </p>
            </div>
          </div>
        </header>
        {/* CORPO DO ARTIGO */}
        <div className="max-w-7xl mx-auto px-8 pt-20 pb-24 relative">
          <div className="xl:grid xl:grid-cols-[1fr_250px] xl:gap-12">
            <div className="max-w-4xl">
              <div data-no-print>
                <ShareButtons title={localArticle.title} />
              </div>
              <div className="prose prose-invert prose-lg max-w-none article-body">
                {localArticle.content}
              </div>
              {localArticle.sources && localArticle.sources.length > 0 && (
                <SourcesList sources={localArticle.sources} language={language} />
              )}
              {/* SHARE (bottom) */}
              <div className="mt-16 pt-8 border-t border-[var(--border)]" data-no-print>
                <ShareButtons title={localArticle.title} />
              </div>
            </div>

            {/* FLOATING TOC - sidebar */}
            <aside className="hidden xl:block">
              <LocalFloatingTOC language={language} />
            </aside>
          </div>
        </div>

        {/* NAVEGAÇÃO ANTERIOR/SEGUINTE */}
        {legacyId && <PrevNextNav currentId={legacyId} language={language} />}

        {/* ARTIGOS RELACIONADOS */}
        {localArticle.relatedSlugs && localArticle.relatedSlugs.length > 0 && (
          <LocalRelatedArticles slugs={localArticle.relatedSlugs} language={language} />
        )}

        {/* INTERNAL LINKING — explorar o portal */}
        <div className="max-w-4xl mx-auto px-8 mt-16 mb-8">
          <div className="border-t border-[var(--border)] pt-10">
            <p className="text-[var(--foreground-muted)] text-xs uppercase tracking-widest mb-6">
              {tr("Explorar o Portal", "Explore the Portal", "Explorar el Portal")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/comprar"
                className="flex flex-col gap-1 p-4 border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group"
              >
                <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] group-hover:text-[var(--gold)]/60">
                  Marketplace
                </span>
                <span className="text-sm font-serif">
                  {tr("Cavalos à Venda", "Horses for Sale", "Caballos en Venta")}
                </span>
              </Link>
              <Link
                href="/directorio"
                className="flex flex-col gap-1 p-4 border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group"
              >
                <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] group-hover:text-[var(--gold)]/60">
                  {tr("Directório", "Directory", "Directorio")}
                </span>
                <span className="text-sm font-serif">
                  {tr("Coudelarias", "Stud Farms", "Haras")}
                </span>
              </Link>
              <Link
                href="/cavalos-famosos"
                className="flex flex-col gap-1 p-4 border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group"
              >
                <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] group-hover:text-[var(--gold)]/60">
                  {tr("Arquivo", "Archive", "Archivo")}
                </span>
                <span className="text-sm font-serif">
                  {tr("Lusitanos Famosos", "Famous Lusitanos", "Lusitanos Famosos")}
                </span>
              </Link>
              <Link
                href="/linhagens"
                className="flex flex-col gap-1 p-4 border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group"
              >
                <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] group-hover:text-[var(--gold)]/60">
                  {tr("Genealogia", "Genealogy", "Genealogía")}
                </span>
                <span className="text-sm font-serif">
                  {tr("Linhagens", "Bloodlines", "Linajes")}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="max-w-4xl mx-auto px-8 mt-8" data-no-print>
          <Newsletter />
        </div>

        {/* BOTÃO VOLTAR AO TOPO */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-8 right-8 z-40 w-11 h-11 flex items-center justify-center border border-[var(--gold)]/40 bg-[var(--background)]/90 backdrop-blur-sm text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-300 ${
            showBackToTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          aria-label={tr("Voltar ao topo", "Back to top", "Volver arriba")}
        >
          <ArrowUp size={16} />
        </button>
      </article>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)]">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif">{t.journal.unavailable}</h1>
          <p className="text-[var(--foreground-muted)]">{t.journal.unavailable_text}</p>
          <Link
            href="/jornal"
            className="text-[var(--gold)] border-b border-[var(--gold)] pb-1 uppercase text-xs tracking-widest"
          >
            {t.journal.back}
          </Link>
        </div>
      </div>
    );
  }

  // Artigo do Sanity com Portable Text
  const imageUrl = getArticleImageUrl(article, 1920);
  const title = language === "en" ? article.titleEn || article.title : article.title;
  const subtitle = language === "en" ? article.subtitleEn || article.subtitle : article.subtitle;
  const category = language === "en" ? article.categoryEn || article.category : article.category;
  const body = language === "en" ? article.bodyEn || article.body : article.body;
  const isPost = article.contentType === "post";

  return (
    <article className="min-h-screen bg-[var(--background)] pb-20">
      <ReadingProgressBar language={language} />

      {/* BREADCRUMB VISUAL — acessibilidade + UX */}
      <nav
        aria-label="Breadcrumb"
        className="relative z-20 px-6 md:px-12 pt-24 pb-3 bg-[var(--background)]"
      >
        <ol className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
          <li>
            <Link href="/" className="hover:text-[var(--gold)] transition-colors">
              {tr("Início", "Home", "Inicio")}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[var(--gold)]/40">
            /
          </li>
          <li>
            <Link href="/jornal" className="hover:text-[var(--gold)] transition-colors">
              {tr("Jornal", "Journal", "Revista")}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[var(--gold)]/40">
            /
          </li>
          <li className="text-[var(--foreground-secondary)] truncate max-w-[200px] sm:max-w-xs">
            {title}
          </li>
        </ol>
      </nav>

      {/* HERO */}
      <header className="relative h-[65vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={article.image?.alt || title}
              fill
              className="object-cover scale-105"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/60" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/10"
            aria-hidden
          />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 z-10">
          <div className="max-w-7xl mx-auto space-y-5">
            <div className="flex items-center gap-3">
              <span className="inline-block text-[var(--gold)] text-[9px] uppercase tracking-[0.4em] font-bold border border-[var(--gold)]/30 px-4 py-2">
                {category}
              </span>
              {isPost ? (
                <span className="inline-flex items-center gap-1.5 text-white/60 text-[9px] uppercase tracking-[0.3em] border border-white/20 px-3 py-2">
                  <FileText size={12} /> {tr("Crónica", "Chronicle", "Crónica")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-white/60 text-[9px] uppercase tracking-[0.3em] border border-white/20 px-3 py-2">
                  <Newspaper size={12} /> {tr("Artigo", "Article", "Artículo")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-6 text-white/60 text-xs">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-[var(--gold)]" />
                {formatArticleDate(article.publishedAt, language)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-[var(--gold)]" />
                {article.estimatedReadTime} min
              </span>
              {article.author?.name && (
                <span className="text-white/40">
                  {tr("por", "by", "por")} {article.author.name}
                </span>
              )}
            </div>

            {/* Linha decorativa dourada */}
            <div className="w-16 h-px bg-[var(--gold)]/60" />

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white max-w-5xl leading-[0.95] tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-lg md:text-xl text-[var(--foreground-secondary)] max-w-3xl font-light italic leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* CORPO DO ARTIGO */}
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-24 relative">
        <div className="xl:grid xl:grid-cols-[1fr_250px] xl:gap-12">
          <div className="max-w-4xl">
            <div data-no-print>
              <ShareButtons title={title} />
            </div>

            {body && body.length > 0 ? (
              <div className="mt-8">
                <PortableTextRenderer value={body} language={language} />
              </div>
            ) : (
              <div className="mt-8 text-[var(--foreground-muted)] italic">
                {tr(
                  "Conteúdo em preparação...",
                  "Content in preparation...",
                  "Contenido en preparación..."
                )}
              </div>
            )}

            {/* FONTES */}
            {article.sources && article.sources.length > 0 && (
              <SourcesList sources={article.sources} language={language} />
            )}

            {/* SHARE (bottom) */}
            <div className="mt-16 pt-8 border-t border-[var(--border)]" data-no-print>
              <ShareButtons title={title} />
            </div>
          </div>

          {/* FLOATING TOC - sidebar */}
          {body && body.length > 0 && (
            <aside className="hidden xl:block">
              <FloatingTOC body={body} language={language} />
            </aside>
          )}
        </div>
      </div>

      {/* SECÇÃO DE AUTOR */}
      {article.author?.name && (
        <div className="max-w-4xl mx-auto px-8 mb-16">
          <div className="border-t border-b border-[var(--border)] py-10 flex items-center gap-6">
            {/* Avatar com iniciais */}
            <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--gold)] font-serif text-xl font-bold">
                {article.author.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] mb-1">
                {tr("Escrito por", "Written by", "Escrito por")}
              </p>
              <p className="text-lg font-serif text-[var(--foreground)]">{article.author.name}</p>
              {(article.author as { bio?: string }).bio && (
                <p className="text-sm text-[var(--foreground-muted)] mt-1 leading-relaxed">
                  {(article.author as { bio?: string }).bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVEGAÇÃO ANTERIOR/SEGUINTE */}
      {legacyId && <PrevNextNav currentId={legacyId} language={language} />}

      {/* ARTIGOS RELACIONADOS */}
      {relatedArticles.length > 0 && (
        <RelatedArticles articles={relatedArticles} language={language} />
      )}

      {/* INTERNAL LINKING — explorar o portal */}
      <div className="max-w-4xl mx-auto px-8 mt-16 mb-8">
        <div className="border-t border-[var(--border)] pt-10">
          <p className="text-[var(--foreground-muted)] text-xs uppercase tracking-widest mb-6">
            {tr("Explorar o Portal", "Explore the Portal", "Explorar el Portal")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/comprar"
              className="flex flex-col gap-1 p-4 border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group"
            >
              <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] group-hover:text-[var(--gold)]/60">
                Marketplace
              </span>
              <span className="text-sm font-serif">
                {tr("Cavalos à Venda", "Horses for Sale", "Caballos en Venta")}
              </span>
            </Link>
            <Link
              href="/directorio"
              className="flex flex-col gap-1 p-4 border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group"
            >
              <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] group-hover:text-[var(--gold)]/60">
                {tr("Directório", "Directory", "Directorio")}
              </span>
              <span className="text-sm font-serif">{tr("Coudelarias", "Stud Farms", "Haras")}</span>
            </Link>
            <Link
              href="/cavalos-famosos"
              className="flex flex-col gap-1 p-4 border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group"
            >
              <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] group-hover:text-[var(--gold)]/60">
                {tr("Arquivo", "Archive", "Archivo")}
              </span>
              <span className="text-sm font-serif">
                {tr("Lusitanos Famosos", "Famous Lusitanos", "Lusitanos Famosos")}
              </span>
            </Link>
            <Link
              href="/linhagens"
              className="flex flex-col gap-1 p-4 border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group"
            >
              <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] group-hover:text-[var(--gold)]/60">
                {tr("Genealogia", "Genealogy", "Genealogía")}
              </span>
              <span className="text-sm font-serif">{tr("Linhagens", "Bloodlines", "Linajes")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="max-w-4xl mx-auto px-8 mt-8" data-no-print>
        <Newsletter />
      </div>

      {/* BOTÃO VOLTAR AO TOPO */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-40 w-11 h-11 flex items-center justify-center border border-[var(--gold)]/40 bg-[var(--background)]/90 backdrop-blur-sm text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-300 ${
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label={tr("Voltar ao topo", "Back to top", "Volver arriba")}
      >
        <ArrowUp size={16} />
      </button>
    </article>
  );
}

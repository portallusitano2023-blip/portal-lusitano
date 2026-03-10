"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LocalizedLink from "@/components/LocalizedLink";
import { ArrowLeft, ArrowUp, Clock, Calendar, Newspaper, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const ShareButtons = dynamic(() => import("@/components/ShareButtons"), {
  ssr: false,
  loading: () => null,
});
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
import AdUnit from "@/components/ads/AdUnit";

// Fallback para dados locais
import { articlesDataPT, articlesDataEN } from "@/data/articlesData";
import "../journal.css";

interface ArticlePageClientProps {
  legacyId?: string;
  localImageUrl?: string;
  article: SanityArticle | null;
  relatedArticles: SanityArticle[];
  prevArticle?: { slug: string; title: string; category?: string } | null;
  nextArticle?: { slug: string; title: string; category?: string } | null;
}

type NavItem = { slug: string; title: string; category?: string };

/* ── PREV / NEXT NAV ───────────────────────────────────────────── */
function PrevNextNav({
  prev,
  next,
  language,
}: {
  prev: NavItem | null;
  next: NavItem | null;
  language: string;
}) {
  const tr = createTranslator(language);
  if (!prev && !next) return null;

  return (
    <nav
      className="max-w-4xl mx-auto px-4 sm:px-8 mt-16"
      aria-label={tr("Navegação entre artigos", "Article navigation", "Navegación entre artículos")}
      data-no-print
    >
      <div
        className="grid grid-cols-2 gap-px"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* PREV */}
        {prev ? (
          <LocalizedLink
            href={`/jornal/${prev.slug}`}
            className="group flex items-center gap-4 p-5 sm:p-7 hover:bg-[var(--gold)]/[0.04] transition-colors duration-300"
            style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex-shrink-0 w-8 h-8 border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--gold)]/40 group-hover:text-[var(--gold)] transition-colors duration-300">
              <ChevronLeft size={14} className="text-[var(--foreground-muted)] group-hover:text-[var(--gold)]" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.35em] text-[var(--foreground-muted)] mb-1">
                {tr("Anterior", "Previous", "Anterior")}
              </p>
              {prev.category && (
                <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)]/60 mb-1.5">
                  {prev.category}
                </p>
              )}
              <p className="text-sm font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors duration-300 line-clamp-2 leading-snug">
                {prev.title}
              </p>
            </div>
          </LocalizedLink>
        ) : (
          <div />
        )}

        {/* NEXT */}
        {next ? (
          <LocalizedLink
            href={`/jornal/${next.slug}`}
            className="group flex items-center justify-end gap-4 p-5 sm:p-7 hover:bg-[var(--gold)]/[0.04] transition-colors duration-300 text-right"
          >
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.35em] text-[var(--foreground-muted)] mb-1">
                {tr("Seguinte", "Next", "Siguiente")}
              </p>
              {next.category && (
                <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)]/60 mb-1.5">
                  {next.category}
                </p>
              )}
              <p className="text-sm font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors duration-300 line-clamp-2 leading-snug">
                {next.title}
              </p>
            </div>
            <div className="flex-shrink-0 w-8 h-8 border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--gold)]/40 transition-colors duration-300">
              <ChevronRight size={14} className="text-[var(--foreground-muted)] group-hover:text-[var(--gold)]" />
            </div>
          </LocalizedLink>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}

/* ── PORTAL LINKS ──────────────────────────────────────────────── */
function PortalLinks({ language }: { language: string }) {
  const tr = createTranslator(language);
  const links = [
    {
      href: "/comprar",
      label: "Marketplace",
      name: tr("Cavalos à Venda", "Horses for Sale", "Caballos en Venta"),
    },
    {
      href: "/directorio",
      label: tr("Directório", "Directory", "Directorio"),
      name: tr("Coudelarias & Haras", "Stud Farms", "Haras y Coudelarias"),
    },
    {
      href: "/cavalos-famosos",
      label: tr("Arquivo", "Archive", "Archivo"),
      name: tr("Lusitanos Famosos", "Famous Lusitanos", "Lusitanos Famosos"),
    },
    {
      href: "/linhagens",
      label: tr("Genealogia", "Genealogy", "Genealogía"),
      name: tr("Linhagens", "Bloodlines", "Linajes"),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-14 mb-8">
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} className="pt-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-3 h-px bg-[var(--gold)]" />
          <p className="text-[8px] uppercase tracking-[0.42em] text-[var(--foreground-muted)]">
            {tr("Explorar o Portal", "Explore the Portal", "Explorar el Portal")}
          </p>
        </div>
        <div
          className="grid grid-cols-2 sm:grid-cols-4"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {links.map((link, i) => (
            <LocalizedLink
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-1 p-4 sm:p-5 hover:bg-[var(--gold)]/[0.05] transition-colors duration-300"
              style={i < links.length - 1 ? { borderRight: "1px solid rgba(255,255,255,0.06)" } : {}}
            >
              <span className="text-[8px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] group-hover:text-[var(--gold)]/70 transition-colors duration-300">
                {link.label}
              </span>
              <span className="text-[11px] sm:text-xs font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors duration-300 leading-snug">
                {link.name}
              </span>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── AUTHOR SECTION ────────────────────────────────────────────── */
function AuthorSection({ author, language }: { author: { name: string; bio?: string }; language: string }) {
  const tr = createTranslator(language);
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 mb-14">
      <div
        className="py-7 flex items-start gap-5"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Initials mark */}
        <div className="flex-shrink-0 w-10 h-10 border border-[var(--gold)]/25 flex items-center justify-center bg-[var(--gold)]/[0.06]">
          <span className="text-[var(--gold)] font-serif text-sm font-medium">{initials}</span>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-[0.38em] text-[var(--foreground-muted)] mb-1">
            {tr("Escrito por", "Written by", "Escrito por")}
          </p>
          <p className="text-base font-serif text-[var(--foreground)]">{author.name}</p>
          {author.bio && (
            <p className="text-xs text-[var(--foreground-muted)] mt-1.5 leading-relaxed max-w-lg">
              {author.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── ARTICLE HERO ──────────────────────────────────────────────── */
interface HeroProps {
  imageUrl?: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  category?: string;
  date?: string;
  readTime?: number | string;
  author?: string;
  isPost?: boolean;
  language: string;
  backLabel: string;
}

function ArticleHero({
  imageUrl, imageAlt, title, subtitle, category, date, readTime, author, isPost, language, backLabel,
}: HeroProps) {
  const tr = createTranslator(language);

  return (
    <header className="relative w-full overflow-hidden" style={{ minHeight: "68vh" }}>
      {/* Image */}
      <div className="absolute inset-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover"
            style={{ transform: "scale(1.04)" }}
            sizes="100vw"
            priority
          />
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.55) 45%, rgba(5,5,5,0.08) 100%)" }}
          aria-hidden
        />
        {/* Grain texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" aria-hidden>
          <filter id="hero-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-grain)" />
        </svg>
      </div>

      {/* Breadcrumb — top overlay */}
      <nav
        aria-label="Breadcrumb"
        className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8 md:px-12 pt-24 pb-0"
      >
        <ol className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/40">
          <li>
            <LocalizedLink href="/" className="hover:text-[var(--gold)] transition-colors">
              {tr("Início", "Home", "Inicio")}
            </LocalizedLink>
          </li>
          <li aria-hidden="true" className="text-[var(--gold)]/30">/</li>
          <li>
            <LocalizedLink href="/jornal" className="hover:text-[var(--gold)] transition-colors">
              {tr("Jornal", "Journal", "Revista")}
            </LocalizedLink>
          </li>
          {category && (
            <>
              <li aria-hidden="true" className="text-[var(--gold)]/30">/</li>
              <li className="text-white/50 truncate max-w-[120px] sm:max-w-[200px]">{category}</li>
            </>
          )}
        </ol>
      </nav>

      {/* Content — bottom of hero */}
      <div className="absolute bottom-0 left-0 w-full px-4 sm:px-8 md:px-12 pb-10 sm:pb-14 z-10">
        <div className="max-w-5xl">

          {/* Back link */}
          <LocalizedLink
            href="/jornal"
            className="inline-flex items-center text-white/45 hover:text-[var(--gold)] transition-colors text-[9px] uppercase tracking-[0.3em] gap-1.5 mb-6"
          >
            <ArrowLeft size={12} /> {backLabel}
          </LocalizedLink>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {category && (
              <span className="inline-block text-[var(--gold)] text-[8px] uppercase tracking-[0.4em] border border-[var(--gold)]/30 px-3 py-1.5">
                {category}
              </span>
            )}
            {isPost !== undefined && (
              <span className="inline-flex items-center gap-1.5 text-white/45 text-[8px] uppercase tracking-[0.3em] border border-white/15 px-3 py-1.5">
                {isPost
                  ? <><FileText size={10} /> {tr("Crónica", "Chronicle", "Crónica")}</>
                  : <><Newspaper size={10} /> {tr("Artigo", "Article", "Artículo")}</>
                }
              </span>
            )}
          </div>

          {/* Metadata */}
          {(date || readTime || author) && (
            <div className="flex items-center gap-5 text-white/45 text-[10px] mb-5">
              {date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-[var(--gold)]/70" />
                  {date}
                </span>
              )}
              {readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={11} className="text-[var(--gold)]/70" />
                  {readTime} min
                </span>
              )}
              {author && (
                <span>{tr("por", "by", "por")} {author}</span>
              )}
            </div>
          )}

          {/* Gold hairline */}
          <div
            className="h-px w-12 mb-5"
            style={{ background: "linear-gradient(to right, rgba(197,160,89,0.8), transparent)" }}
          />

          {/* Title */}
          <h1
            className="font-serif text-white leading-[0.95] tracking-tight max-w-4xl mb-4"
            style={{ fontSize: "clamp(1.8rem, 5vw, 4.5rem)" }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-base sm:text-lg text-white/55 max-w-2xl font-light italic leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Scroll cue */}
          <div className="mt-7 flex items-center gap-2 text-white/20" aria-hidden>
            <div className="w-px h-6 bg-white/15 animate-[hero-scroll-cue_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

    </header>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════ */
export default function ArticlePageClient({
  legacyId,
  localImageUrl,
  article,
  relatedArticles,
  prevArticle,
  nextArticle,
}: ArticlePageClientProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShowBackToTop(window.scrollY > 500);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const backLabel = t.journal.back_archive;

  // Compute prev/next from legacy local data (fallback when server doesn't supply them)
  const getLocalNav = (id: string) => {
    const list =
      language === "es" ? articlesListES : language === "en" ? articlesListEN : articlesListPT;
    const idx = list.findIndex((a) => a.id === id);
    const prevItem = idx > 0 ? list[idx - 1] : null;
    const nextItem = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
    return {
      prev: prevItem ? { slug: legacyIdToSlug[prevItem.id] || prevItem.id, title: prevItem.title, category: prevItem.category } : null,
      next: nextItem ? { slug: legacyIdToSlug[nextItem.id] || nextItem.id, title: nextItem.title, category: nextItem.category } : null,
    };
  };

  // Resolve prev/next: prefer server-supplied props, fall back to local list for legacy articles
  const navItems = (() => {
    if (prevArticle !== undefined || nextArticle !== undefined) {
      return { prev: prevArticle ?? null, next: nextArticle ?? null };
    }
    if (legacyId) return getLocalNav(legacyId);
    return { prev: null as NavItem | null, next: null as NavItem | null };
  })();

  /* ── LOCAL ARTICLE FALLBACK ──────────────────────────────────── */
  if (!article && legacyId) {
    const articlesData = language === "pt" ? articlesDataPT : articlesDataEN;
    const localArticle = articlesData[legacyId];

    if (!localArticle) {
      return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)]">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif">{t.journal.unavailable}</h1>
            <p className="text-[var(--foreground-muted)]">{t.journal.unavailable_text}</p>
            <LocalizedLink
              href="/jornal"
              className="text-[var(--gold)] border-b border-[var(--gold)] pb-1 uppercase text-xs tracking-widest"
            >
              {t.journal.back}
            </LocalizedLink>
          </div>
        </div>
      );
    }

    return (
      <article className="min-h-screen bg-[var(--background)] pb-40">
        <ReadingProgressBar language={language} />

        <ArticleHero
          imageUrl={localImageUrl || localArticle.image}
          imageAlt={localArticle.title}
          title={localArticle.title}
          subtitle={localArticle.subtitle}
          category={localArticle.category}
          date={localArticle.date}
          readTime={localArticle.readTime}
          language={language}
          backLabel={backLabel}
        />

        {/* BODY */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-16 relative">
          <div className="xl:grid xl:grid-cols-[1fr_250px] xl:gap-12">
            <div className="max-w-4xl">
              <div data-no-print>
                <ShareButtons title={localArticle.title} />
              </div>
              <div className="prose prose-invert prose-lg max-w-none article-body mt-8">
                {localArticle.content}
              </div>
              {localArticle.sources && localArticle.sources.length > 0 && (
                <SourcesList sources={localArticle.sources} language={language} />
              )}
              <div className="mt-14 pt-7 border-t border-[var(--border)]/50" data-no-print>
                <ShareButtons title={localArticle.title} />
              </div>
            </div>

            <aside className="hidden xl:block">
              <LocalFloatingTOC language={language} />
              <AdUnit format="rectangle" className="mt-8 sticky top-[320px]" />
            </aside>
          </div>
        </div>

        {(navItems.prev || navItems.next) && (
          <PrevNextNav prev={navItems.prev} next={navItems.next} language={language} />
        )}

        {localArticle.relatedSlugs && localArticle.relatedSlugs.length > 0 && (
          <LocalRelatedArticles slugs={localArticle.relatedSlugs} language={language} />
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-10" data-no-print>
          <AdUnit format="horizontal" />
        </div>

        <PortalLinks language={language} />

        <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-6" data-no-print>
          <Newsletter />
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-8 right-8 z-40 w-10 h-10 flex items-center justify-center border border-[var(--gold)]/35 bg-[var(--background)]/90 backdrop-blur-sm text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-300 ${
            showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          aria-label={tr("Voltar ao topo", "Back to top", "Volver arriba")}
        >
          <ArrowUp size={14} />
        </button>
      </article>
    );
  }

  /* ── NOT FOUND ───────────────────────────────────────────────── */
  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)]">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif">{t.journal.unavailable}</h1>
          <p className="text-[var(--foreground-muted)]">{t.journal.unavailable_text}</p>
          <LocalizedLink
            href="/jornal"
            className="text-[var(--gold)] border-b border-[var(--gold)] pb-1 uppercase text-xs tracking-widest"
          >
            {t.journal.back}
          </LocalizedLink>
        </div>
      </div>
    );
  }

  /* ── SANITY ARTICLE ──────────────────────────────────────────── */
  const imageUrl = getArticleImageUrl(article, 1920);
  const title = language === "en" ? article.titleEn || article.title : article.title;
  const subtitle = language === "en" ? article.subtitleEn || article.subtitle : article.subtitle;
  const category = language === "en" ? article.categoryEn || article.category : article.category;
  const body = language === "en" ? article.bodyEn || article.body : article.body;
  const isPost = article.contentType === "post";

  return (
    <article className="min-h-screen bg-[var(--background)] pb-20">
      <ReadingProgressBar language={language} />

      <ArticleHero
        imageUrl={imageUrl}
        imageAlt={article.image?.alt || title}
        title={title}
        subtitle={subtitle}
        category={category}
        date={formatArticleDate(article.publishedAt, language)}
        readTime={article.estimatedReadTime}
        author={article.author?.name}
        isPost={isPost}
        language={language}
        backLabel={backLabel}
      />

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-16 relative">
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
              <div className="mt-8 text-[var(--foreground-muted)] italic text-sm">
                {tr(
                  "Conteúdo em preparação...",
                  "Content in preparation...",
                  "Contenido en preparación..."
                )}
              </div>
            )}

            {article.sources && article.sources.length > 0 && (
              <SourcesList sources={article.sources} language={language} />
            )}

            <div className="mt-14 pt-7 border-t border-[var(--border)]/50" data-no-print>
              <ShareButtons title={title} />
            </div>
          </div>

          {body && body.length > 0 && (
            <aside className="hidden xl:block">
              <FloatingTOC body={body} language={language} />
              <AdUnit format="rectangle" className="mt-8 sticky top-[320px]" />
            </aside>
          )}
        </div>
      </div>

      {/* AUTHOR */}
      {article.author?.name && (
        <AuthorSection
          author={article.author as { name: string; bio?: string }}
          language={language}
        />
      )}

      {/* PREV / NEXT */}
      {(navItems.prev || navItems.next) && (
        <PrevNextNav prev={navItems.prev} next={navItems.next} language={language} />
      )}

      {/* RELATED */}
      {relatedArticles.length > 0 && (
        <RelatedArticles articles={relatedArticles} language={language} />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-10" data-no-print>
        <AdUnit format="horizontal" />
      </div>

      <PortalLinks language={language} />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-6" data-no-print>
        <Newsletter />
      </div>

      {/* BACK TO TOP */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-40 w-10 h-10 flex items-center justify-center border border-[var(--gold)]/35 bg-[var(--background)]/90 backdrop-blur-sm text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-300 ${
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label={tr("Voltar ao topo", "Back to top", "Volver arriba")}
      >
        <ArrowUp size={14} />
      </button>
    </article>
  );
}

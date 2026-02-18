"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Newspaper, FileText } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { useLanguage } from "@/context/LanguageContext";
import { urlFor } from "@/lib/sanity-image";
import type { SanityArticle } from "@/lib/sanity-queries";
import PortableTextRenderer from "@/components/journal/PortableTextComponents";
import ReadingProgressBar from "@/components/journal/ReadingProgressBar";
import FloatingTOC from "@/components/journal/FloatingTOC";
import RelatedArticles from "@/components/journal/RelatedArticles";
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

function getImageUrl(article: SanityArticle): string {
  if (article.image?.asset?.url) return article.image.asset.url;
  if (article.image?.asset?._ref) {
    try {
      return urlFor(article.image).width(1920).quality(85).url();
    } catch {
      return "";
    }
  }
  return "";
}

function formatDate(dateStr: string, lang: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "pt" ? "pt-PT" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ArticlePageClient({
  legacyId,
  article,
  relatedArticles,
}: ArticlePageClientProps) {
  const { t, language } = useLanguage();

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
        <ReadingProgressBar />
        <header className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={localArticle.image}
              alt={localArticle.title}
              fill
              className="object-cover scale-105"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/70" aria-hidden />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"
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
              <h1 className="text-5xl md:text-7xl font-serif text-white max-w-5xl leading-none tracking-tight">
                {localArticle.title}
              </h1>
              <p className="text-lg md:text-xl text-[var(--foreground-secondary)] max-w-3xl font-light italic">
                {localArticle.subtitle}
              </p>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-8 py-24 relative">
          <ShareButtons title={localArticle.title} />
          <div className="prose prose-invert prose-lg max-w-none article-body">
            {localArticle.content}
          </div>
        </div>
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
  const imageUrl = getImageUrl(article);
  const title = language === "en" ? article.titleEn || article.title : article.title;
  const subtitle = language === "en" ? article.subtitleEn || article.subtitle : article.subtitle;
  const category = language === "en" ? article.categoryEn || article.category : article.category;
  const body = language === "en" ? article.bodyEn || article.body : article.body;
  const isPost = article.contentType === "post";

  return (
    <article className="min-h-screen bg-[var(--background)] pb-20">
      <ReadingProgressBar />

      {/* HERO */}
      <header className="relative h-screen w-full overflow-hidden">
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
          <div className="absolute inset-0 bg-black/70" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"
            aria-hidden
          />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-24 z-10">
          <div className="max-w-7xl mx-auto space-y-6">
            <Link
              href="/jornal"
              className="inline-flex items-center text-white/60 hover:text-[var(--gold)] transition-colors text-xs uppercase tracking-[0.2em] gap-2"
            >
              <ArrowLeft size={16} /> {t.journal.back_archive}
            </Link>

            <div className="flex items-center gap-3">
              <span className="inline-block text-[var(--gold)] text-[9px] uppercase tracking-[0.4em] font-bold border border-[var(--gold)]/30 px-4 py-2">
                {category}
              </span>
              {isPost ? (
                <span className="inline-flex items-center gap-1.5 text-white/60 text-[9px] uppercase tracking-[0.3em] border border-white/20 px-3 py-2">
                  <FileText size={12} /> {language === "pt" ? "Crónica" : "Chronicle"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-white/60 text-[9px] uppercase tracking-[0.3em] border border-white/20 px-3 py-2">
                  <Newspaper size={12} /> {language === "pt" ? "Artigo" : "Article"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-6 text-white/60 text-xs">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-[var(--gold)]" />
                {formatDate(article.publishedAt, language)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-[var(--gold)]" />
                {article.estimatedReadTime} min
              </span>
              {article.author?.name && (
                <span className="text-white/40">
                  {language === "pt" ? "por" : "by"} {article.author.name}
                </span>
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-serif text-white max-w-5xl leading-none tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-lg md:text-xl text-[var(--foreground-secondary)] max-w-3xl font-light italic">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* CORPO DO ARTIGO */}
      <div className="max-w-7xl mx-auto px-8 py-24 relative">
        <div className="xl:grid xl:grid-cols-[1fr_250px] xl:gap-12">
          <div className="max-w-4xl">
            <ShareButtons title={title} />

            {body && body.length > 0 ? (
              <div className="mt-8">
                <PortableTextRenderer value={body} language={language} />
              </div>
            ) : (
              <div className="mt-8 text-[var(--foreground-muted)] italic">
                {language === "pt" ? "Conteúdo em preparação..." : "Content in preparation..."}
              </div>
            )}

            {/* FONTES */}
            {article.sources && article.sources.length > 0 && (
              <SourcesList sources={article.sources} language={language} />
            )}

            {/* SHARE (bottom) */}
            <div className="mt-16 pt-8 border-t border-[var(--border)]">
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

      {/* ARTIGOS RELACIONADOS */}
      {relatedArticles.length > 0 && (
        <RelatedArticles articles={relatedArticles} language={language} />
      )}

      {/* NEWSLETTER */}
      <div className="max-w-4xl mx-auto px-8 mt-8">
        <Newsletter />
      </div>
    </article>
  );
}

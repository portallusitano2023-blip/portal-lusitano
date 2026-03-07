"use client";

import Image from "next/image";
import LocalizedLink from "@/components/LocalizedLink";
import { ArrowRight, Clock } from "lucide-react";
import type { SanityArticle } from "@/lib/sanity-queries";
import { getArticleImageUrl, formatArticleDate } from "@/lib/journal-utils";
import { useLanguage } from "@/context/LanguageContext";

interface RelatedArticlesProps {
  articles: SanityArticle[];
  language?: "pt" | "en" | "es";
}

export default function RelatedArticles({ articles, language = "pt" }: RelatedArticlesProps) {
  const { t } = useLanguage();
  if (!articles || articles.length === 0) return null;

  const readLabel = language === "pt" ? "Ler" : language === "es" ? "Leer" : "Read";
  const sectionLabel = t.journal.related_articles;

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-8 py-12"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-3 h-px bg-[var(--gold)]" />
        <h3 className="text-[8px] uppercase tracking-[0.42em] text-[var(--foreground-muted)]">
          {sectionLabel}
        </h3>
        <div
          className="flex-1 h-px"
          style={{ background: "linear-gradient(to right, rgba(255,255,255,0.05), transparent)" }}
        />
        <span className="text-[8px] font-mono text-[var(--foreground-muted)]/30 tabular-nums">
          {String(articles.length).padStart(2, "0")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((article, i) => {
          const title =
            language === "en"
              ? article.titleEn || article.title
              : article.title;
          const subtitle =
            language === "en"
              ? article.subtitleEn || article.subtitle
              : article.subtitle;
          const category =
            language === "en"
              ? article.categoryEn || article.category
              : article.category;
          const imgUrl = getArticleImageUrl(article, 600);
          const num = String(i + 1).padStart(2, "0");

          return (
            <LocalizedLink key={article._id} href={`/jornal/${article.slug.current}`}>
              <article className="group cursor-pointer h-full flex flex-col bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--gold)]/25 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35),0_0_30px_rgba(197,160,89,0.06)] transition-all duration-400">
                {/* Image */}
                <div className="w-full aspect-[3/2] overflow-hidden relative">
                  {imgUrl && (
                    <Image
                      src={imgUrl}
                      alt={article.image?.alt || title}
                      fill
                      className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  {/* Editorial number watermark */}
                  <span
                    className="absolute bottom-2 right-3 font-mono text-white/[0.12] select-none pointer-events-none leading-none"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
                    aria-hidden
                  >
                    {num}
                  </span>
                  {/* Category pill */}
                  {category && (
                    <span className="absolute top-3 left-3 text-[7px] uppercase tracking-[0.35em] text-[var(--gold)] border border-[var(--gold)]/25 bg-black/60 backdrop-blur-sm px-2 py-1">
                      {category}
                    </span>
                  )}
                  {/* Gold hairline */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: "rgba(197,160,89,0.5)" }}
                    aria-hidden
                  />
                </div>

                {/* Info */}
                <div className="px-4 pt-3.5 pb-0 flex items-center justify-between text-[9px] uppercase tracking-[0.25em]">
                  <span className="text-[var(--foreground-muted)]/50">
                    {formatArticleDate(article.publishedAt, language, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 text-[var(--foreground-muted)]/40">
                    <Clock size={9} className="flex-shrink-0" />
                    {article.estimatedReadTime} min
                  </span>
                </div>

                {/* Content */}
                <div className="px-4 pt-2.5 pb-5 flex flex-col flex-grow">
                  <h4 className="text-sm font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors duration-300 leading-snug line-clamp-2">
                    {title}
                  </h4>
                  {subtitle && (
                    <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed flex-grow font-serif line-clamp-2 mb-3">
                      {subtitle}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-[var(--foreground-muted)] text-[9px] uppercase tracking-[0.3em] group-hover:text-[var(--gold)] transition-colors duration-300 mt-auto">
                    {readLabel}
                    <ArrowRight
                      size={10}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </span>
                </div>
              </article>
            </LocalizedLink>
          );
        })}
      </div>
    </section>
  );
}

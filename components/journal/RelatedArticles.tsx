"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { SanityArticle } from "@/lib/sanity-queries";
import { getArticleImageUrl, formatArticleDate } from "@/lib/journal-utils";

interface RelatedArticlesProps {
  articles: SanityArticle[];
  language?: "pt" | "en" | "es";
}

export default function RelatedArticles({ articles, language = "pt" }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  const readLabel = language === "pt" ? "Ler" : language === "es" ? "Leer" : "Read";

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 border-t border-[var(--border)]">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-px bg-[var(--gold)]/50" />
        <h3 className="text-2xl font-serif text-[var(--foreground)]">
          {language === "pt"
            ? "Artigos Relacionados"
            : language === "es"
              ? "Artículos Relacionados"
              : "Related Articles"}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => {
          const title =
            language === "en"
              ? article.titleEn || article.title
              : language === "es"
                ? article.titleEn || article.title
                : article.title;
          const subtitle =
            language === "en"
              ? article.subtitleEn || article.subtitle
              : language === "es"
                ? article.subtitleEn || article.subtitle
                : article.subtitle;
          const category =
            language === "en"
              ? article.categoryEn || article.category
              : language === "es"
                ? article.categoryEn || article.category
                : article.category;

          return (
            <Link key={article._id} href={`/jornal/${article.slug.current}`}>
              <article className="group cursor-pointer h-full flex flex-col border border-[var(--border)] border-t-2 border-t-transparent hover:border-[var(--gold)]/30 hover:border-t-[var(--gold)] transition-all duration-500 bg-[var(--surface-hover)] hover:shadow-[0_0_40px_rgba(197,160,89,0.08)]">
                <div className="w-full aspect-[16/10] overflow-hidden relative">
                  {getArticleImageUrl(article, 600) && (
                    <Image
                      src={getArticleImageUrl(article, 600)}
                      alt={article.image?.alt || title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
                <div className="px-6 pt-4 pb-0 flex items-center justify-between text-[10px] uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 text-[var(--gold)]">
                    {category && (
                      <>
                        <span className="inline-block w-1 h-1 rounded-full bg-[var(--gold)]" />
                        {category}
                      </>
                    )}
                  </span>
                  <span className="flex items-center gap-3 text-[var(--foreground-muted)]">
                    <span>
                      {formatArticleDate(article.publishedAt, language, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {article.estimatedReadTime} min
                    </span>
                  </span>
                </div>
                <div className="px-6 pt-3 pb-6 flex flex-col flex-grow">
                  <h4 className="text-lg font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors duration-300 leading-tight">
                    {title}
                  </h4>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed flex-grow font-serif line-clamp-2">
                    {subtitle}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 text-[var(--foreground)] text-xs uppercase tracking-widest relative">
                      {readLabel}
                      <ArrowRight
                        size={12}
                        className="text-[var(--gold)] group-hover:translate-x-1 transition-transform duration-300"
                      />
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

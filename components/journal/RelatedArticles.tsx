"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { urlFor } from "@/lib/client";
import type { SanityArticle } from "@/lib/sanity-queries";

interface RelatedArticlesProps {
  articles: SanityArticle[];
  language?: "pt" | "en" | "es";
}

function getImageUrl(article: SanityArticle): string {
  if (article.image?.asset?.url) return article.image.asset.url;
  if (article.image?.asset?._ref) {
    try {
      return urlFor(article.image).width(600).quality(80).url();
    } catch {
      return "";
    }
  }
  return "";
}

function formatDate(dateStr: string, lang: string): string {
  try {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString(lang === "pt" ? "pt-PT" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  } catch {
    return dateStr;
  }
}

export default function RelatedArticles({ articles, language = "pt" }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 border-t border-[var(--border)]">
      <h3 className="text-2xl font-serif text-[var(--foreground)] mb-8">
        {language === "pt" ? "Artigos Relacionados" : "Related Articles"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => {
          const title = language === "en" ? article.titleEn || article.title : article.title;
          const subtitle =
            language === "en" ? article.subtitleEn || article.subtitle : article.subtitle;
          const category =
            language === "en" ? article.categoryEn || article.category : article.category;

          return (
            <Link key={article._id} href={`/jornal/${article.slug.current}`}>
              <article className="group cursor-pointer h-full flex flex-col border border-[var(--border)] hover:border-[var(--gold)]/30 transition-colors bg-[var(--surface-hover)]">
                <div className="w-full h-48 overflow-hidden relative">
                  {getImageUrl(article) && (
                    <Image
                      src={getImageUrl(article)}
                      alt={article.image?.alt || title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  {category && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[9px] uppercase text-white tracking-widest border border-[var(--border)]">
                      {category}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3 text-[var(--gold)] text-[10px] uppercase tracking-widest flex justify-between">
                    <span>{formatDate(article.publishedAt, language)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {article.estimatedReadTime} min
                    </span>
                  </div>
                  <h4 className="text-lg font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors leading-tight">
                    {title}
                  </h4>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed flex-grow font-serif line-clamp-2">
                    {subtitle}
                  </p>
                  <div className="border-t border-[var(--border)] pt-3 mt-4">
                    <span className="flex items-center gap-2 text-[var(--foreground)] text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                      {language === "pt" ? "Ler" : "Read"}{" "}
                      <ArrowRight size={12} className="text-[var(--gold)]" />
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

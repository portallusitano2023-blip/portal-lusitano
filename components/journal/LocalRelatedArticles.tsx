"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import {
  articlesListPT,
  articlesListEN,
  articlesListES,
  slugToArticleId,
} from "@/data/articlesList";

interface LocalRelatedArticlesProps {
  slugs: string[];
  language?: "pt" | "en" | "es";
}

export default function LocalRelatedArticles({
  slugs,
  language = "pt",
}: LocalRelatedArticlesProps) {
  if (!slugs || slugs.length === 0) return null;

  const articlesList =
    language === "en" ? articlesListEN : language === "es" ? articlesListES : articlesListPT;
  const readLabel = language === "pt" ? "Ler" : language === "es" ? "Leer" : "Read";
  const sectionTitle =
    language === "pt"
      ? "Artigos Relacionados"
      : language === "es"
        ? "Artículos Relacionados"
        : "Related Articles";

  const articles = slugs
    .map((slug) => {
      const id = slugToArticleId[slug];
      if (!id) return null;
      const meta = articlesList.find((a) => a.id === id);
      if (!meta) return null;
      return { ...meta, slug };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  if (articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 border-t border-[var(--border)]">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-px bg-[var(--gold)]/50" />
        <h3 className="text-2xl font-serif text-[var(--foreground)]">{sectionTitle}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link key={article.slug} href={`/jornal/${article.slug}`}>
            <article className="group cursor-pointer h-full flex flex-col border border-[var(--border)] border-t-2 border-t-transparent hover:border-[var(--gold)]/30 hover:border-t-[var(--gold)] transition-all duration-500 bg-[var(--surface-hover)] hover:shadow-[0_0_40px_rgba(197,160,89,0.08)]">
              <div className="w-full aspect-[16/10] overflow-hidden relative">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="px-6 pt-4 pb-0 flex items-center justify-between text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-[var(--gold)]">
                  <span className="inline-block w-1 h-1 rounded-full bg-[var(--gold)]" />
                  {article.category}
                </span>
                <span className="flex items-center gap-3 text-[var(--foreground-muted)]">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {article.readTime}
                  </span>
                </span>
              </div>
              <div className="px-6 pt-3 pb-6 flex flex-col flex-grow">
                <h4 className="text-lg font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors duration-300 leading-tight">
                  {article.title}
                </h4>
                <p className="text-[var(--foreground-muted)] text-sm leading-relaxed flex-grow font-serif line-clamp-2">
                  {article.subtitle}
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
        ))}
      </div>
    </section>
  );
}

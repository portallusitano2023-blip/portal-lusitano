"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useParams } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";
import { useLanguage } from "@/context/LanguageContext";
import { articlesDataPT, articlesDataEN } from "@/data/articlesData";

export default function ArticlePageClient() {
  const { t, language } = useLanguage();
  const params = useParams();
  const id = params.id as string;

  const articlesData = language === "pt" ? articlesDataPT : articlesDataEN;
  const article = articlesData[id];

  if (!article) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif">{t.journal.unavailable}</h1>
          <p className="text-zinc-500">{t.journal.unavailable_text}</p>
          <Link
            href="/jornal"
            className="text-[#C5A059] border-b border-[#C5A059] pb-1 uppercase text-xs tracking-widest"
          >
            {t.journal.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#050505] pb-40">
      {/* HEADER */}
      <header className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={article.image}
            alt={article.title}
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
              className="inline-flex items-center text-white/60 hover:text-[#C5A059] transition-colors text-xs uppercase tracking-[0.2em] gap-2 mb-4"
            >
              <ArrowLeft size={16} /> {t.journal.back_archive}
            </Link>

            <div className="flex items-center gap-6 text-white/60 text-xs">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-[#C5A059]" /> {article.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-[#C5A059]" /> {article.readTime}
              </span>
            </div>

            <span className="inline-block text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold border border-[#C5A059]/30 px-4 py-2">
              {article.category}
            </span>

            <h1 className="text-5xl md:text-7xl font-serif text-white max-w-5xl leading-none tracking-tight">
              {article.title}
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-3xl font-light italic">
              {article.subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* CORPO DO ARTIGO */}
      <div className="max-w-4xl mx-auto px-8 py-24 relative">
        <ShareButtons title={article.title} />
        <div className="prose prose-invert prose-lg max-w-none">
          {article.content}
        </div>
      </div>
    </article>
  );
}

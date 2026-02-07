"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Search, LayoutGrid, List, FileText, Newspaper } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import TextSplit from "@/components/TextSplit";
import { urlFor } from "@/lib/client";
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
    return date.toLocaleDateString(lang === "pt" ? "pt-PT" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).toUpperCase();
  } catch {
    return dateStr;
  }
}

export default function JornalListClient({ articles, articlesEN }: JornalListClientProps) {
  const { t, language } = useLanguage();

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

  // Ler preferência de vista do localStorage
  useEffect(() => {
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
      const matchesSearch = !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesType = !selectedType || article.contentType === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [displayArticles, searchQuery, selectedCategory, selectedType]);

  // Artigo em destaque
  const featuredArticle = displayArticles.find((a) => a.featured) || displayArticles[0];
  const gridArticles = filteredArticles.filter((a) => a._id !== featuredArticle?._id);

  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInViewOnce(gridRef);

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      {/* HEADER */}
      <div className="text-center mb-16 max-w-4xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
        <span
          className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          {t.journal.archive}
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
          <TextSplit text={t.journal.title} baseDelay={0.3} wordDelay={0.1} />
        </h1>
        <p
          className="text-zinc-400 font-serif italic text-lg opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.5s" }}
        >
          &ldquo;{t.journal.subtitle}&rdquo;
        </p>
      </div>

      {/* DESTAQUE */}
      {featuredArticle && !searchQuery && !selectedCategory && !selectedType && (
        <div
          className="max-w-7xl mx-auto mb-20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.4s" }}
        >
          <Link href={`/jornal/${featuredArticle.slug.current}`}>
            <div className="group relative w-full h-[600px] overflow-hidden border border-white/10 rounded-sm cursor-pointer">
              {getImageUrl(featuredArticle) && (
                <Image
                  src={getImageUrl(featuredArticle)}
                  alt={featuredArticle.image?.alt || featuredArticle.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:grayscale-0 grayscale-[30%] transition-all duration-700"
                  sizes="100vw"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block bg-[#C5A059] text-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {featuredArticle.category}
                  </span>
                  {featuredArticle.contentType === "post" && (
                    <span className="inline-block bg-white/10 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                      {language === "pt" ? "Crónica" : "Chronicle"}
                    </span>
                  )}
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-4 leading-tight">
                  {featuredArticle.title}
                </h2>
                <p className="text-zinc-300 text-lg mb-6 font-serif italic">
                  {featuredArticle.subtitle}
                </p>
                <div className="flex items-center gap-6 text-xs text-zinc-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} /> {t.journal.technical_read}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} /> {featuredArticle.estimatedReadTime} min
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* BARRA DE FILTROS */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Pesquisa */}
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "pt" ? "Pesquisar artigos..." : "Search articles..."}
              className="w-full bg-white/5 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#C5A059]/50 transition-colors"
            />
          </div>

          {/* Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-4 py-2 text-xs uppercase tracking-wider rounded-sm transition-all ${
                !selectedCategory
                  ? "bg-[#C5A059] text-black font-bold"
                  : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              {language === "pt" ? "Todos" : "All"}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`whitespace-nowrap px-4 py-2 text-xs uppercase tracking-wider rounded-sm transition-all ${
                  selectedCategory === cat
                    ? "bg-[#C5A059] text-black font-bold"
                    : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tipo de conteúdo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedType(selectedType === "article" ? null : "article")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider rounded-sm transition-all ${
                selectedType === "article"
                  ? "bg-[#C5A059] text-black font-bold"
                  : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              <Newspaper size={12} /> {language === "pt" ? "Artigo" : "Article"}
            </button>
            <button
              onClick={() => setSelectedType(selectedType === "post" ? null : "post")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider rounded-sm transition-all ${
                selectedType === "post"
                  ? "bg-[#C5A059] text-black font-bold"
                  : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              <FileText size={12} /> {language === "pt" ? "Crónica" : "Chronicle"}
            </button>
          </div>

          {/* Toggle vista */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => handleViewChange("grid")}
              className={`p-2 rounded-sm transition-colors ${viewMode === "grid" ? "bg-[#C5A059]/20 text-[#C5A059]" : "text-zinc-500 hover:text-white"}`}
              aria-label={language === "pt" ? "Vista grelha" : "Grid view"}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => handleViewChange("list")}
              className={`p-2 rounded-sm transition-colors ${viewMode === "list" ? "bg-[#C5A059]/20 text-[#C5A059]" : "text-zinc-500 hover:text-white"}`}
              aria-label={language === "pt" ? "Vista lista" : "List view"}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* SEM RESULTADOS */}
      {filteredArticles.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-zinc-500 text-lg">
            {language === "pt" ? "Nenhum artigo encontrado." : "No articles found."}
          </p>
        </div>
      )}

      {/* GRELHA DE ARTIGOS */}
      <div
        ref={gridRef}
        className={`max-w-7xl mx-auto ${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex flex-col gap-4"
        }`}
      >
        {(searchQuery || selectedCategory || selectedType ? filteredArticles : gridArticles).map((article, index) => (
          <div
            key={article._id}
            className={`transition-all duration-500 ${gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${index * 0.08 + 0.15}s` }}
          >
            {viewMode === "grid" ? (
              <Link href={`/jornal/${article.slug.current}`}>
                <article className="group cursor-pointer h-full flex flex-col border border-white/5 hover:border-[#C5A059]/30 transition-colors bg-white/[0.02]">
                  <div className="w-full h-64 overflow-hidden relative">
                    {getImageUrl(article) && (
                      <img
                        src={getImageUrl(article)}
                        alt={article.image?.alt || article.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {article.contentType === "post" && (
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[9px] uppercase text-white tracking-widest">
                          {language === "pt" ? "Crónica" : "Chronicle"}
                        </span>
                      )}
                      <span className="bg-black/60 backdrop-blur-sm px-3 py-1 text-[10px] uppercase text-white tracking-widest border border-white/10">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="mb-4 text-[#C5A059] text-[10px] uppercase tracking-widest flex justify-between">
                      <span>{formatDate(article.publishedAt, language)}</span>
                      <span>{article.estimatedReadTime} min</span>
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#C5A059] transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow font-serif">
                      {article.subtitle}
                    </p>
                    <div className="border-t border-white/10 pt-4 mt-auto">
                      <span className="flex items-center gap-2 text-white text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                        {t.journal.read_study} <ArrowRight size={14} className="text-[#C5A059]" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ) : (
              <Link href={`/jornal/${article.slug.current}`}>
                <article className="group cursor-pointer flex gap-6 border border-white/5 hover:border-[#C5A059]/30 transition-colors bg-white/[0.02] p-4">
                  <div className="w-32 h-32 flex-shrink-0 overflow-hidden relative">
                    {getImageUrl(article) && (
                      <img
                        src={getImageUrl(article)}
                        alt={article.image?.alt || article.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#C5A059] text-[10px] uppercase tracking-widest">
                        {article.category}
                      </span>
                      <span className="text-zinc-600 text-[10px]">
                        {formatDate(article.publishedAt, language)}
                      </span>
                      <span className="text-zinc-600 text-[10px]">
                        {article.estimatedReadTime} min
                      </span>
                    </div>
                    <h3 className="text-xl font-serif text-white mb-1 group-hover:text-[#C5A059] transition-colors truncate">
                      {article.title}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-1 font-serif">
                      {article.subtitle}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-zinc-600 group-hover:text-[#C5A059] self-center flex-shrink-0 transition-colors" />
                </article>
              </Link>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

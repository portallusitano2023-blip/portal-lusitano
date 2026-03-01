"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Star, ThumbsUp, MessageSquare, ArrowUpDown, Clock, Award } from "lucide-react";
import dynamic from "next/dynamic";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { Review, ReviewStats } from "@/types/review";
import { toolSlugs, getToolSlugToName } from "@/app/ferramentas/tools-data";

const ToolReviewForm = dynamic(() => import("@/components/ToolReviewForm"));

type SortMode = "recent" | "best";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-amber-500/20 text-amber-400",
    "bg-blue-500/20 text-blue-400",
    "bg-rose-500/20 text-rose-400",
    "bg-emerald-500/20 text-emerald-400",
    "bg-purple-500/20 text-purple-400",
    "bg-cyan-500/20 text-cyan-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function useRelativeDate(language: string) {
  return useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return language === "pt" ? "Hoje" : language === "es" ? "Hoy" : "Today";
      }
      if (diffDays === 1) {
        return language === "pt" ? "Ontem" : language === "es" ? "Ayer" : "Yesterday";
      }
      if (diffDays < 7) {
        const label =
          language === "pt" ? "dias atrás" : language === "es" ? "días atrás" : "days ago";
        return `${diffDays} ${label}`;
      }
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        if (weeks === 1) {
          return language === "pt"
            ? "1 semana atrás"
            : language === "es"
              ? "hace 1 semana"
              : "1 week ago";
        }
        const label =
          language === "pt" ? "semanas atrás" : language === "es" ? "semanas atrás" : "weeks ago";
        return `${weeks} ${label}`;
      }
      const locale = language === "pt" ? "pt-PT" : language === "es" ? "es-ES" : "en-GB";
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    [language]
  );
}

export default function ReviewsSection() {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const toolSlugToName = getToolSlugToName(tr);
  const formatRelativeDate = useRelativeDate(language);

  const [filterSlug, setFilterSlug] = useState<string>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [formSlug, setFormSlug] = useState<string>(toolSlugs[0]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, media: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchReviews = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const slug = filterSlug || "all";
        const res = await fetch(`/api/reviews?ferramenta_slug=${slug}`, { signal });
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
          setStats(data.stats || { total: 0, media: 0 });
        }
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
      } finally {
        setLoading(false);
      }
    },
    [filterSlug]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchReviews(controller.signal);
    return () => controller.abort();
  }, [fetchReviews, refreshKey]);

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortMode === "best") {
      sorted.sort(
        (a, b) =>
          b.avaliacao - a.avaliacao ||
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return sorted;
  }, [reviews, sortMode]);

  return (
    <section className="px-6 pb-32" id="avaliacoes">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] block mb-4">
            {t.ferramentas.reviews_badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
            {t.ferramentas.reviews_title}
          </h2>
          <p className="text-[var(--foreground-secondary)] max-w-lg mx-auto">
            {t.ferramentas.reviews_subtitle}
          </p>
        </AnimateOnScroll>

        {/* Tool filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button
            onClick={() => setFilterSlug("all")}
            className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition ${
              filterSlug === "all"
                ? "bg-[var(--gold)] text-black"
                : "bg-[var(--background-card)] text-[var(--foreground-secondary)] hover:bg-zinc-700 hover:text-[var(--foreground)]"
            }`}
            aria-pressed={filterSlug === "all"}
          >
            {t.ferramentas.reviews_all}
          </button>
          {toolSlugs.map((slug) => (
            <button
              key={slug}
              onClick={() => setFilterSlug(slug)}
              className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition ${
                filterSlug === slug
                  ? "bg-[var(--gold)] text-black"
                  : "bg-[var(--background-card)] text-[var(--foreground-secondary)] hover:bg-zinc-700 hover:text-[var(--foreground)]"
              }`}
              aria-pressed={filterSlug === slug}
            >
              {toolSlugToName[slug]}
            </button>
          ))}
        </div>

        {/* Sort toggle */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <ArrowUpDown size={14} className="text-[var(--foreground-muted)]" />
          <button
            onClick={() => setSortMode("recent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              sortMode === "recent"
                ? "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
            }`}
          >
            <Clock size={12} className="inline mr-1" />
            {tr("Mais recentes", "Most recent", "Más recientes")}
          </button>
          <button
            onClick={() => setSortMode("best")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              sortMode === "best"
                ? "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
            }`}
          >
            <Award size={12} className="inline mr-1" />
            {tr("Melhor classificadas", "Highest rated", "Mejor clasificadas")}
          </button>
        </div>

        {/* Stats summary */}
        {stats.total > 0 && (
          <div className="flex items-center justify-center gap-6 mb-10 p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/10 rounded-xl">
            <div className="text-center">
              <p className="text-3xl font-serif text-[var(--gold)]">{stats.media}</p>
              <div
                className="flex gap-0.5 justify-center mt-1"
                role="img"
                aria-label={`${stats.media} / 5`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    aria-hidden="true"
                    className={
                      star <= Math.round(stats.media)
                        ? "text-[var(--gold)]"
                        : "text-[var(--foreground-muted)]"
                    }
                    fill={star <= Math.round(stats.media) ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            <div className="border-l border-[var(--gold)]/20 pl-6">
              <p className="text-sm text-[var(--foreground-secondary)]">
                {t.ferramentas.reviews_based_on}{" "}
                <span className="font-semibold text-[var(--foreground)]">{stats.total}</span>{" "}
                {stats.total === 1 ? t.ferramentas.reviews_single : t.ferramentas.reviews_plural}
              </p>
            </div>
          </div>
        )}

        {/* Reviews list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6"
              >
                <div className="flex gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--background-card)]" />
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--background-card)] rounded w-1/4 mb-2" />
                    <div className="h-3 bg-[var(--background-card)] rounded w-1/3" />
                  </div>
                </div>
                <div className="h-16 bg-[var(--background-card)] rounded" />
              </div>
            ))}
          </div>
        ) : sortedReviews.length === 0 ? (
          <div className="text-center py-12 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl mb-10">
            <MessageSquare className="mx-auto text-[var(--foreground-muted)] mb-4" size={40} />
            <p className="text-[var(--foreground-muted)]">{t.ferramentas.reviews_none}</p>
            <p className="text-[var(--foreground-muted)] text-sm mt-1">
              {t.ferramentas.reviews_be_first}
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6 hover:border-[var(--gold)]/20 transition"
              >
                <div className="flex gap-3 mb-3">
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(review.autor_nome)}`}
                  >
                    {getInitials(review.autor_nome)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {review.autor_nome}
                        </span>
                        {review.ferramenta_slug && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                            <Award size={10} />
                            {tr("Verificado", "Verified", "Verificado")}
                          </span>
                        )}
                        {review.ferramenta_slug && filterSlug === "all" && (
                          <span className="text-xs px-2 py-0.5 bg-[var(--background-card)] text-[var(--foreground-secondary)] rounded-full">
                            {toolSlugToName[review.ferramenta_slug] || review.ferramenta_slug}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--foreground-muted)] sm:flex-shrink-0">
                        {formatRelativeDate(review.created_at)}
                      </span>
                    </div>
                    <div
                      className="flex gap-0.5 mt-1"
                      role="img"
                      aria-label={`${review.avaliacao} / 5`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          aria-hidden="true"
                          className={
                            star <= review.avaliacao
                              ? "text-[var(--gold)]"
                              : "text-[var(--foreground-muted)]"
                          }
                          fill={star <= review.avaliacao ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3 pl-12">
                  {review.comentario}
                </p>

                {review.recomenda && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-500 pl-12">
                    <ThumbsUp size={12} />
                    {t.ferramentas.recommends}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Review form */}
        <div className="bg-[var(--background-secondary)]/80 border border-[var(--border)] rounded-2xl p-5 sm:p-8">
          <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">
            {t.ferramentas.reviews_leave}
          </h3>
          <p className="text-[var(--foreground-muted)] text-sm mb-6">
            {t.ferramentas.reviews_share}
          </p>

          {/* Tool selector dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
              {t.ferramentas.reviews_tool}
            </label>
            <select
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--background-card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition"
            >
              {toolSlugs.map((slug) => (
                <option key={slug} value={slug}>
                  {toolSlugToName[slug]}
                </option>
              ))}
            </select>
          </div>

          <ToolReviewForm
            key={formSlug}
            ferramentaSlug={formSlug}
            ferramentaNome={toolSlugToName[formSlug]}
            onSuccess={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </div>
    </section>
  );
}

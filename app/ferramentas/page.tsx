"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calculator,
  BarChart3,
  Heart,
  UserCheck,
  Crown,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Shield,
  Download,
  History,
  Share2,
  Zap,
  Star,
  ThumbsUp,
  User,
  MessageSquare,
  Loader2,
  CheckCircle,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "@/components/auth/AuthProvider";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import { Review, ReviewStats } from "@/types/review";

// Lazy-load review form — only shown when user opens a review modal
const ToolReviewForm = dynamic(() => import("@/components/ToolReviewForm"));
import { getFaqItems } from "./faq-data";
import { createTranslator } from "@/lib/tr";
import { useToolAccess } from "@/hooks/useToolAccess";
import ToolsHero from "@/components/ferramentas/ToolsHero";
import ToolsGrid from "@/components/ferramentas/ToolsGrid";
import FAQSection from "@/components/ferramentas/FAQSection";

// ============================================
// DATA
// ============================================

function getTools(tr: ReturnType<typeof createTranslator>) {
  return [
    {
      title: tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor"),
      href: "/calculadora-valor",
      icon: Calculator,
      description: tr(
        "Estimativa profissional do valor do seu Lusitano",
        "Professional estimate of your Lusitano's value",
        "Estimación profesional del valor de su Lusitano"
      ),
      features: [
        tr(
          "Algoritmo com 20+ variáveis",
          "Algorithm with 20+ variables",
          "Algoritmo con 20+ variables"
        ),
        tr(
          "Análise de mercado em tempo real",
          "Real-time market analysis",
          "Análisis de mercado en tiempo real"
        ),
        tr(
          "Relatório detalhado por categoria",
          "Detailed report by category",
          "Informe detallado por categoría"
        ),
      ],
      color: "from-amber-500/20 to-amber-600/5",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      badge: tr("Mais popular", "Most popular", "Más popular"),
      badgeColor: "bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black",
      freeUses: 1,
    },
    {
      title: tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"),
      href: "/comparador-cavalos",
      icon: BarChart3,
      description: tr(
        "Compare até 4 cavalos lado a lado",
        "Compare up to 4 horses side by side",
        "Compare hasta 4 caballos uno al lado del otro"
      ),
      features: [
        tr(
          "Comparação visual interactiva",
          "Interactive visual comparison",
          "Comparación visual interactiva"
        ),
        tr("Gráficos radar de aptidões", "Aptitude radar charts", "Gráficos radar de aptitudes"),
        tr(
          "Análise de pontos fortes e fracos",
          "Analysis of strengths and weaknesses",
          "Análisis de fortalezas y debilidades"
        ),
      ],
      color: "from-blue-500/20 to-blue-600/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      badge: null,
      badgeColor: null,
      freeUses: 1,
    },
    {
      title: tr(
        "Verificador de Compatibilidade",
        "Compatibility Checker",
        "Verificador de Compatibilidad"
      ),
      href: "/verificador-compatibilidade",
      icon: Heart,
      description: tr(
        "Análise genética de cruzamentos",
        "Genetic analysis of crossings",
        "Análisis genético de cruzamientos"
      ),
      features: [
        tr(
          "Score de compatibilidade genética",
          "Genetic compatibility score",
          "Puntuación de compatibilidad genética"
        ),
        tr("Previsão de características", "Trait prediction", "Previsión de características"),
        tr("Alerta de consanguinidade", "Inbreeding alert", "Alerta de consanguinidad"),
      ],
      color: "from-rose-500/20 to-rose-600/5",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
      badge: null,
      badgeColor: null,
      freeUses: 1,
    },
    {
      title: tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil"),
      href: "/analise-perfil",
      icon: UserCheck,
      description: tr(
        "Descubra o seu perfil de cavaleiro",
        "Discover your rider profile",
        "Descubra su perfil de jinete"
      ),
      features: [
        tr(
          "Questionário personalizado",
          "Personalised questionnaire",
          "Cuestionario personalizado"
        ),
        tr(
          "Recomendação de raças e disciplinas",
          "Breed and discipline recommendations",
          "Recomendación de razas y disciplinas"
        ),
        tr(
          "Perfil partilhável nas redes",
          "Shareable profile on networks",
          "Perfil compartible en redes"
        ),
      ],
      color: "from-emerald-500/20 to-emerald-600/5",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      badge: tr("Recomendado", "Recommended", "Recomendado"),
      badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      freeUses: 1,
    },
  ];
}

function getFreeTierFeatures(tr: ReturnType<typeof createTranslator>) {
  return [
    {
      text: tr(
        "1 uso gratuito por ferramenta",
        "1 free use per tool",
        "1 uso gratuito por herramienta"
      ),
      included: true,
    },
    { text: tr("Resultados básicos", "Basic results", "Resultados básicos"), included: true },
    {
      text: tr(
        "Acesso a todas as ferramentas",
        "Access to all tools",
        "Acceso a todas las herramientas"
      ),
      included: true,
    },
    { text: tr("Exportar PDF", "Export PDF", "Exportar PDF"), included: false },
    { text: tr("Guardar histórico", "Save history", "Guardar historial"), included: false },
    { text: tr("Partilhar resultados", "Share results", "Compartir resultados"), included: false },
    { text: tr("Usos ilimitados", "Unlimited uses", "Usos ilimitados"), included: false },
  ];
}

function getProTierFeatures(tr: ReturnType<typeof createTranslator>) {
  return [
    {
      text: tr(
        "Usos ilimitados em todas as ferramentas",
        "Unlimited uses on all tools",
        "Usos ilimitados en todas las herramientas"
      ),
      included: true,
    },
    {
      text: tr(
        "Resultados detalhados e avançados",
        "Detailed and advanced results",
        "Resultados detallados y avanzados"
      ),
      included: true,
    },
    {
      text: tr(
        "Acesso a todas as ferramentas",
        "Access to all tools",
        "Acceso a todas las herramientas"
      ),
      included: true,
    },
    {
      text: tr("Exportar relatórios em PDF", "Export reports in PDF", "Exportar informes en PDF"),
      included: true,
    },
    {
      text: tr("Guardar histórico completo", "Save complete history", "Guardar historial completo"),
      included: true,
    },
    {
      text: tr(
        "Partilhar resultados com link",
        "Share results with link",
        "Compartir resultados con enlace"
      ),
      included: true,
    },
    { text: tr("Suporte prioritário", "Priority support", "Soporte prioritario"), included: true },
  ];
}

// ============================================
// STATS COUNTERS
// ============================================

interface ToolStats {
  totalAnalyses: number;
  totalUsers: number;
  avgRating: number;
  reviewCount: number;
}

function useAnimatedCounter(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) return;
    startRef.current = null;
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

function StatCounter({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: React.ElementType;
}) {
  const animated = useAnimatedCounter(value);
  return (
    <div className="flex flex-col items-center gap-2 p-4 sm:p-6">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--gold)]/10 rounded-xl flex items-center justify-center mb-1">
        <Icon size={20} className="text-[var(--gold)]" />
      </div>
      <p className="text-2xl sm:text-3xl font-serif text-[var(--foreground)]">
        {animated.toLocaleString("pt-PT")}
      </p>
      <p className="text-xs text-[var(--foreground-muted)] text-center">{label}</p>
    </div>
  );
}

function StatsSection() {
  const [stats, setStats] = useState<ToolStats | null>(null);
  const { language } = useLanguage();
  const tr = createTranslator(language);

  useEffect(() => {
    fetch("/api/tools/stats")
      .then((r) => r.json())
      .then((data: ToolStats) => {
        if (data.totalAnalyses > 0) setStats(data);
      })
      .catch(() => {});
  }, []);

  if (!stats || stats.totalAnalyses === 0) return null;

  return (
    <AnimateOnScroll>
      <div className="max-w-3xl mx-auto mb-16 px-6">
        <div className="bg-[var(--background-secondary)]/60 border border-[var(--gold)]/15 rounded-2xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
          <StatCounter
            value={stats.totalAnalyses}
            label={tr("análises realizadas", "analyses done", "análisis realizados")}
            icon={Activity}
          />
          <StatCounter
            value={stats.totalUsers}
            label={tr("utilizadores activos", "active users", "usuarios activos")}
            icon={Users}
          />
          <StatCounter
            value={stats.reviewCount}
            label={tr(
              `avaliações (${stats.avgRating}★)`,
              `reviews (${stats.avgRating}★)`,
              `valoraciones (${stats.avgRating}★)`
            )}
            icon={TrendingUp}
          />
        </div>
      </div>
    </AnimateOnScroll>
  );
}

const toolSlugs = [
  "calculadora-valor",
  "comparador-cavalos",
  "verificador-compatibilidade",
  "analise-perfil",
];

// ============================================
// COMPONENTS
// ============================================

function PricingFeature({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-center gap-3">
      {included ? (
        <Check size={16} className="text-[var(--gold)] flex-shrink-0" />
      ) : (
        <X size={16} className="text-[var(--foreground-muted)] flex-shrink-0" />
      )}
      <span
        className={
          included
            ? "text-[var(--foreground-secondary)] text-sm"
            : "text-[var(--foreground-muted)] text-sm"
        }
      >
        {text}
      </span>
    </li>
  );
}

function ProSubscribeButton({ className }: { className?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/registar?redirect=/ferramentas");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tools/create-checkout", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={
        className ||
        "block w-full py-3 text-center bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black text-sm font-bold rounded-lg hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all hover:shadow-lg hover:shadow-[var(--gold)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          {tr("A processar...", "Processing...", "Procesando...")}
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2">
          <Crown size={16} />
          {tr("Subscrever PRO", "Subscribe PRO", "Suscribir PRO")}
          <ArrowRight size={16} />
        </span>
      )}
    </button>
  );
}

function CheckoutFeedback() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const isSuccess = searchParams.get("success") === "true";
  const isCancelled = searchParams.get("cancelled") === "true";
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isSuccess || isCancelled) {
      const timer = setTimeout(() => setDismissed(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isCancelled]);

  const visible = (isSuccess || isCancelled) && !dismissed;

  if (!visible) return null;

  if (isSuccess) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm sm:w-auto animate-[fadeSlideIn_0.3s_ease-out_forwards]">
        <div className="flex items-center gap-3 px-4 py-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl backdrop-blur-sm shadow-lg">
          <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-300 font-medium text-sm flex-1">
            {tr(
              "Subscrição PRO activada com sucesso!",
              "PRO subscription activated!",
              "¡Suscripción PRO activada!"
            )}
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-emerald-400 hover:text-emerald-300 ml-2 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm sm:w-auto animate-[fadeSlideIn_0.3s_ease-out_forwards]">
        <div className="flex items-center gap-3 px-4 py-4 bg-[var(--background-card)]/90 border border-[var(--border)] rounded-xl backdrop-blur-sm shadow-lg">
          <X size={20} className="text-[var(--foreground-secondary)] flex-shrink-0" />
          <span className="text-[var(--foreground-secondary)] font-medium text-sm flex-1">
            {tr(
              "Pagamento cancelado. Pode subscrever a qualquer momento.",
              "Payment cancelled. You can subscribe at any time.",
              "Pago cancelado. Puede suscribirse en cualquier momento."
            )}
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-[var(--foreground-secondary)] hover:text-[var(--foreground-secondary)] ml-2 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function ToolReviewsSection() {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const toolSlugToName: Record<string, string> = {
    "calculadora-valor": tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor"),
    "comparador-cavalos": tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"),
    "verificador-compatibilidade": tr(
      "Verificador de Compatibilidade",
      "Compatibility Checker",
      "Verificador de Compatibilidad"
    ),
    "analise-perfil": tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil"),
  };

  const [filterSlug, setFilterSlug] = useState<string>("all");
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

  const formatDate = (dateString: string) => {
    const locale = language === "pt" ? "pt-PT" : language === "es" ? "es-ES" : "en-GB";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <div className="flex flex-wrap gap-2 justify-center mb-10">
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

        {/* Stats summary */}
        {stats.total > 0 && (
          <div className="flex items-center justify-center gap-6 mb-10 p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/10 rounded-xl">
            <div className="text-center">
              <p className="text-3xl font-serif text-[var(--gold)]">{stats.media}</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
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
                <div className="h-4 bg-[var(--background-card)] rounded w-1/4 mb-3" />
                <div className="h-3 bg-[var(--background-card)] rounded w-1/3 mb-4" />
                <div className="h-16 bg-[var(--background-card)] rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl mb-10">
            <MessageSquare className="mx-auto text-[var(--foreground-muted)] mb-4" size={40} />
            <p className="text-[var(--foreground-muted)]">{t.ferramentas.reviews_none}</p>
            <p className="text-[var(--foreground-muted)] text-sm mt-1">
              {t.ferramentas.reviews_be_first}
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border)] transition"
              >
                <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= review.avaliacao
                                ? "text-[var(--gold)]"
                                : "text-[var(--foreground-muted)]"
                            }
                            fill={star <= review.avaliacao ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      {review.ferramenta_slug && filterSlug === "all" && (
                        <span className="text-xs px-2 py-0.5 bg-[var(--background-card)] text-[var(--foreground-secondary)] rounded-full">
                          {toolSlugToName[review.ferramenta_slug] || review.ferramenta_slug}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                      <User size={14} />
                      <span>{review.autor_nome}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)] sm:flex-shrink-0">
                    {formatDate(review.created_at)}
                  </span>
                </div>

                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-3">
                  {review.comentario}
                </p>

                {review.recomenda && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-500">
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

// ============================================
// MAIN PAGE
// ============================================

function ProBannerSection() {
  const { isSubscribed, isLoading } = useToolAccess("calculadora");
  const { language } = useLanguage();
  const tr = createTranslator(language);

  if (isLoading || !isSubscribed) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6">
      <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#C5A059]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Crown size={16} className="text-[#C5A059]" />
          </div>
          <div>
            <p className="text-[#C5A059] font-semibold text-sm">
              {tr("PRO Activo", "PRO Active", "PRO Activo")}
            </p>
            <p className="text-[var(--foreground-muted)] text-xs">
              {tr(
                "Acesso ilimitado a todas as ferramentas",
                "Unlimited access to all tools",
                "Acceso ilimitado a todas las herramientas"
              )}
            </p>
          </div>
        </div>
        <Link
          href="/ferramentas/historico"
          className="flex-shrink-0 flex items-center gap-1.5 text-sm text-[#C5A059] hover:text-[#D4B068] transition-colors"
        >
          <History size={14} />
          <span className="hidden sm:inline">
            {tr("Ver histórico", "View history", "Ver historial")}
          </span>
          <span className="sm:hidden">{tr("Histórico", "History", "Historial")}</span>
        </Link>
      </div>
    </div>
  );
}

export default function FerramentasPage() {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const tools = getTools(tr);
  const freeTierFeatures = getFreeTierFeatures(tr);
  const proTierFeatures = getProTierFeatures(tr);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Suspense fallback={null}>
        <CheckoutFeedback />
      </Suspense>
      <ProBannerSection />

      {/* ===== HERO SECTION ===== */}
      <ToolsHero />

      {/* ===== TOOL CARDS SECTION ===== */}
      <ToolsGrid tools={tools} sectionLabel={t.ferramentas.available} />

      {/* ===== STATS COUNTERS ===== */}
      <StatsSection />

      {/* ===== KEY BENEFITS STRIP ===== */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                label: t.ferramentas.data_secure,
                text: t.ferramentas.data_secure_desc,
              },
              {
                icon: Zap,
                label: t.ferramentas.instant_results,
                text: t.ferramentas.instant_results_desc,
              },
              {
                icon: Download,
                label: t.ferramentas.export_pdf,
                text: t.ferramentas.export_pdf_desc,
              },
              {
                icon: Crown,
                label: t.ferramentas.for_lusitanos,
                text: t.ferramentas.for_lusitanos_desc,
              },
            ].map((benefit, i) => (
              <AnimateOnScroll key={benefit.label} delay={i * 80}>
                <div className="flex items-center gap-4 p-4 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl">
                  <div className="w-10 h-10 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon size={20} className="text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-[var(--foreground)] text-sm font-medium">{benefit.label}</p>
                    <p className="text-[var(--foreground-muted)] text-xs">{benefit.text}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA SECTION ===== */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] block mb-4">
              {tr("Simples e rápido", "Simple and fast", "Simple y rápido")}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr("Como funciona", "How it works", "Cómo funciona")}
            </h2>
            <p className="text-[var(--foreground-secondary)] max-w-lg mx-auto text-sm">
              {tr(
                "Resultados profissionais em menos de 2 minutos, sem necessidade de conta.",
                "Professional results in under 2 minutes, no account needed.",
                "Resultados profesionales en menos de 2 minutos, sin necesidad de cuenta."
              )}
            </p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

            {[
              {
                step: "01",
                title: tr("Escolhe a ferramenta", "Choose the tool", "Elige la herramienta"),
                desc: tr(
                  "Selecciona a ferramenta adequada ao que precisas: avaliação de valor, comparação, compatibilidade ou perfil de cavaleiro.",
                  "Select the tool that suits your needs: value assessment, comparison, compatibility or rider profile.",
                  "Selecciona la herramienta adecuada a lo que necesitas: evaluación de valor, comparación, compatibilidad o perfil de jinete."
                ),
                icon: Sparkles,
              },
              {
                step: "02",
                title: tr(
                  "Preenches os dados do cavalo",
                  "Enter the horse's data",
                  "Introduce los datos del caballo"
                ),
                desc: tr(
                  "Introduz as características do teu Lusitano. O formulário é intuitivo e guia-te em cada passo.",
                  "Enter your Lusitano's characteristics. The form is intuitive and guides you at every step.",
                  "Introduce las características de tu Lusitano. El formulario es intuitivo y te guía en cada paso."
                ),
                icon: UserCheck,
              },
              {
                step: "03",
                title: tr(
                  "Recebes a análise instantânea",
                  "Receive the instant analysis",
                  "Recibes el análisis instantáneo"
                ),
                desc: tr(
                  "O resultado aparece de imediato. Com PRO, exportas em PDF e guardas o histórico completo.",
                  "The result appears immediately. With PRO, export as PDF and save your complete history.",
                  "El resultado aparece de inmediato. Con PRO, exporta en PDF y guarda el historial completo."
                ),
                icon: Zap,
              },
            ].map((item, i) => (
              <AnimateOnScroll key={item.step} delay={i * 120}>
                <div className="relative flex flex-col items-center text-center p-6">
                  {/* Step number circle */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-[var(--background-secondary)] border border-[var(--gold)]/30 flex items-center justify-center shadow-lg shadow-[var(--gold)]/5">
                      <item.icon size={28} className="text-[var(--gold)]" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center">
                      {item.step.replace("0", "")}
                    </span>
                  </div>

                  <h3 className="text-base font-serif text-[var(--foreground)] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Mini CTA below steps */}
          <AnimateOnScroll className="text-center mt-10">
            <Link
              href="/calculadora-valor"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] text-sm font-medium rounded-full hover:bg-[var(--gold)]/20 transition-colors"
            >
              <Sparkles size={15} />
              {tr(
                "Experimentar agora — é grátis",
                "Try it now — it's free",
                "Probar ahora — es gratis"
              )}
              <ArrowRight size={15} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="px-6 pb-24" id="precos">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <AnimateOnScroll className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] block mb-4">
              {t.ferramentas.plans_title}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
              {t.ferramentas.choose_plan}
            </h2>
            <p className="text-[var(--foreground-secondary)] max-w-lg mx-auto">
              {t.ferramentas.plans_subtitle}
            </p>
          </AnimateOnScroll>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="bg-[var(--background-secondary)]/80 border border-[var(--border)] rounded-2xl p-5 sm:p-8">
              <div className="mb-8">
                <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">
                  {t.ferramentas.free}
                </h3>
                <p className="text-[var(--foreground-muted)] text-sm mb-6">
                  {t.ferramentas.free_subtitle}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif text-[var(--foreground)]">0</span>
                  <span className="text-[var(--foreground-muted)] text-lg">EUR</span>
                </div>
                <p className="text-[var(--foreground-muted)] text-xs mt-1">
                  {tr(
                    "1 uso gratuito por ferramenta",
                    "1 free use per tool",
                    "1 uso gratuito por herramienta"
                  )}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {freeTierFeatures.map((feature, i) => (
                  <PricingFeature key={i} text={feature.text} included={feature.included} />
                ))}
              </ul>

              <Link
                href="/registar"
                className="block w-full py-3 min-h-[44px] text-center border border-[var(--border)] text-[var(--foreground)] text-sm font-medium rounded-lg hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-center"
              >
                {t.ferramentas.create_free}
              </Link>
            </div>

            {/* PRO Tier */}
            <div className="relative bg-[var(--background-secondary)]/80 border-2 border-[var(--gold)]/60 rounded-2xl p-5 sm:p-8 shadow-lg shadow-[var(--gold)]/5">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-[var(--gold)] to-[#E8D5A3] text-black text-xs font-bold uppercase tracking-[0.15em] rounded-full">
                  <Crown size={12} />
                  {t.ferramentas.most_popular}
                </span>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">
                  {t.ferramentas.pro}
                </h3>
                <p className="text-[var(--foreground-muted)] text-sm mb-6">
                  {t.ferramentas.pro_subtitle}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif bg-gradient-to-r from-[var(--gold)] to-[#E8D5A3] bg-clip-text text-transparent">
                    4,99
                  </span>
                  <span className="text-[var(--foreground-muted)] text-lg">
                    {t.ferramentas.per_month}
                  </span>
                </div>
                <p className="text-emerald-400 text-sm font-semibold mt-1 flex items-center gap-1.5 justify-center">
                  <Check size={14} />
                  {t.ferramentas.cancel_anytime} •{" "}
                  {tr("Sem fidelização", "No lock-in", "Sin fidelización")}
                </p>

                {/* Savings callout */}
                <div className="mt-4 px-4 py-2.5 bg-[var(--gold)]/8 border border-[var(--gold)]/20 rounded-lg text-center">
                  <p className="text-xs text-[var(--gold)] font-semibold">
                    {tr(
                      "Poupa €200+ vs. avaliação profissional",
                      "Save €200+ vs. professional assessment",
                      "Ahorra €200+ vs. evaluación profesional"
                    )}
                  </p>
                  <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">
                    {tr(
                      "Uma avaliação presencial custa €150–200. Aqui tens análises ilimitadas.",
                      "An in-person assessment costs €150–200. Here you get unlimited analyses.",
                      "Una evaluación presencial cuesta €150–200. Aquí tienes análisis ilimitados."
                    )}
                  </p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {proTierFeatures.map((feature, i) => (
                  <PricingFeature key={i} text={feature.text} included={feature.included} />
                ))}
              </ul>

              {/* Social proof nudge */}
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <div className="flex -space-x-1.5">
                  {["A", "M", "R"].map((initial) => (
                    <div
                      key={initial}
                      className="w-6 h-6 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/30 text-[var(--gold)] text-[9px] font-bold flex items-center justify-center"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[var(--foreground-muted)]">
                  {tr("Juntaram-se esta semana", "Joined this week", "Se unieron esta semana")}
                </p>
              </div>

              <ProSubscribeButton className="block w-full py-4 text-center bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black text-sm font-bold rounded-lg hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all hover:shadow-xl hover:shadow-[var(--gold)]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>

          {/* ROI Comparison */}
          <div className="mt-12 p-4 sm:p-6 bg-[var(--background-secondary)]/50 border border-[var(--gold)]/20 rounded-xl max-w-2xl mx-auto">
            <h4 className="text-sm font-serif text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Calculator size={16} className="text-[var(--gold)]" />
              {tr(
                "Compare: PRO vs. Serviços Tradicionais",
                "Compare: PRO vs. Traditional Services",
                "Compare: PRO vs. Servicios Tradicionales"
              )}
            </h4>
            <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-xs">
              <div className="space-y-2">
                <p className="text-[var(--foreground-muted)]">
                  {tr(
                    "Avaliação veterinária profissional:",
                    "Professional veterinary assessment:",
                    "Evaluación veterinaria profesional:"
                  )}
                </p>
                <p className="text-[var(--foreground-muted)]">
                  {tr(
                    "Relatório de pedigree (APSL):",
                    "Pedigree report (APSL):",
                    "Informe de pedigree (APSL):"
                  )}
                </p>
                <p className="text-[var(--foreground-muted)]">
                  {tr(
                    "Consultor de compra (1 cavalo):",
                    "Purchase consultant (1 horse):",
                    "Consultor de compra (1 caballo):"
                  )}
                </p>
                <p className="font-semibold text-[var(--foreground-secondary)] pt-2 border-t border-[var(--border)]">
                  Total:
                </p>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-red-400">150€+</p>
                <p className="text-red-400">80€</p>
                <p className="text-red-400">200€+</p>
                <p className="font-semibold text-red-400 pt-2 border-t border-[var(--border)]">
                  430€+
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-xs text-emerald-400 font-semibold">
                {tr(
                  "Portal Lusitano PRO: 4,99€/mês =",
                  "Portal Lusitano PRO: €4.99/month =",
                  "Portal Lusitano PRO: 4,99€/mes ="
                )}{" "}
                <span className="text-lg">{tr("59,88€/ano", "€59.88/year", "59,88€/año")}</span>
              </p>
              <p className="text-[10px] text-emerald-400/70 mt-1">
                {tr(
                  "Economiza até 370€ vs. serviços tradicionais",
                  "Save up to €370 vs. traditional services",
                  "Ahorra hasta 370€ vs. servicios tradicionales"
                )}
              </p>
            </div>
          </div>

          {/* Trust note */}
          <p className="text-center text-[var(--foreground-muted)] text-xs mt-8">
            {t.ferramentas.payment_note}
          </p>
        </div>
      </section>

      {/* ===== PRO FEATURES DETAIL ===== */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[var(--gold)]/5 to-transparent border border-[var(--gold)]/10 rounded-2xl p-5 sm:p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Text */}
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] block mb-4">
                  {t.ferramentas.pro_advantages}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-[var(--foreground)] mb-6">
                  {t.ferramentas.pro_title}
                </h2>
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-8">
                  {t.ferramentas.pro_desc}
                </p>
                <ProSubscribeButton className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black text-sm font-bold rounded-lg hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
              </div>

              {/* Right: Feature grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  {
                    icon: Zap,
                    title: t.ferramentas.unlimited,
                    desc: t.ferramentas.unlimited_desc,
                  },
                  {
                    icon: Download,
                    title: t.ferramentas.pdf_export,
                    desc: t.ferramentas.pdf_export_desc,
                  },
                  {
                    icon: History,
                    title: t.ferramentas.history,
                    desc: t.ferramentas.history_desc,
                  },
                  {
                    icon: Share2,
                    title: t.ferramentas.share,
                    desc: t.ferramentas.share_desc,
                  },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className="p-4 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl"
                  >
                    <feat.icon size={20} className="text-[var(--gold)] mb-3" />
                    <p className="text-[var(--foreground)] text-sm font-medium mb-1">
                      {feat.title}
                    </p>
                    <p className="text-[var(--foreground-muted)] text-xs">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <FAQSection items={getFaqItems(language)} />

      {/* ===== REVIEWS SECTION ===== */}
      <ToolReviewsSection />
    </main>
  );
}

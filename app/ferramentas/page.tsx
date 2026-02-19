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
import { useAuth } from "@/components/auth/AuthProvider";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import ToolReviewForm from "@/components/ToolReviewForm";
import { Review, ReviewStats } from "@/types/review";
import { faqItems } from "./faq-data";
import { useToolAccess } from "@/hooks/useToolAccess";
import ToolsHero from "@/components/ferramentas/ToolsHero";
import ToolsGrid from "@/components/ferramentas/ToolsGrid";
import FAQSection from "@/components/ferramentas/FAQSection";

// ============================================
// DATA
// ============================================

const tools = [
  {
    title: "Calculadora de Valor",
    href: "/calculadora-valor",
    icon: Calculator,
    description: "Estimativa profissional do valor do seu Lusitano",
    features: [
      "Algoritmo com 20+ variáveis",
      "Análise de mercado em tempo real",
      "Relatório detalhado por categoria",
    ],
    color: "from-amber-500/20 to-amber-600/5",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badge: "Mais popular",
    badgeColor: "bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black",
    freeUses: 1,
  },
  {
    title: "Comparador de Cavalos",
    href: "/comparador-cavalos",
    icon: BarChart3,
    description: "Compare até 4 cavalos lado a lado",
    features: [
      "Comparação visual interactiva",
      "Gráficos radar de aptidões",
      "Análise de pontos fortes e fracos",
    ],
    color: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badge: null,
    badgeColor: null,
    freeUses: 1,
  },
  {
    title: "Verificador de Compatibilidade",
    href: "/verificador-compatibilidade",
    icon: Heart,
    description: "Análise genética de cruzamentos",
    features: [
      "Score de compatibilidade genética",
      "Previsão de características",
      "Alerta de consanguinidade",
    ],
    color: "from-rose-500/20 to-rose-600/5",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    badge: null,
    badgeColor: null,
    freeUses: 1,
  },
  {
    title: "Análise de Perfil",
    href: "/analise-perfil",
    icon: UserCheck,
    description: "Descubra o seu perfil de cavaleiro",
    features: [
      "Questionário personalizado",
      "Recomendação de raças e disciplinas",
      "Perfil partilhável nas redes",
    ],
    color: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badge: "Recomendado",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    freeUses: 1,
  },
];

const freeTierFeatures = [
  { text: "1 uso gratuito por ferramenta", included: true },
  { text: "Resultados básicos", included: true },
  { text: "Acesso a todas as ferramentas", included: true },
  { text: "Exportar PDF", included: false },
  { text: "Guardar histórico", included: false },
  { text: "Partilhar resultados", included: false },
  { text: "Usos ilimitados", included: false },
];

const proTierFeatures = [
  { text: "Usos ilimitados em todas as ferramentas", included: true },
  { text: "Resultados detalhados e avançados", included: true },
  { text: "Acesso a todas as ferramentas", included: true },
  { text: "Exportar relatórios em PDF", included: true },
  { text: "Guardar histórico completo", included: true },
  { text: "Partilhar resultados com link", included: true },
  { text: "Suporte prioritário", included: true },
];

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
    <div className="flex flex-col items-center gap-2 p-6">
      <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-xl flex items-center justify-center mb-1">
        <Icon size={22} className="text-[var(--gold)]" />
      </div>
      <p className="text-3xl font-serif text-[var(--foreground)]">
        {animated.toLocaleString("pt-PT")}
      </p>
      <p className="text-xs text-[var(--foreground-muted)] text-center">{label}</p>
    </div>
  );
}

function StatsSection() {
  const [stats, setStats] = useState<ToolStats | null>(null);

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
        <div className="bg-[var(--background-secondary)]/60 border border-[var(--gold)]/15 rounded-2xl grid grid-cols-3 divide-x divide-[var(--border)]">
          <StatCounter value={stats.totalAnalyses} label="análises realizadas" icon={Activity} />
          <StatCounter value={stats.totalUsers} label="utilizadores activos" icon={Users} />
          <StatCounter
            value={stats.reviewCount}
            label={`avaliações (${stats.avgRating}★)`}
            icon={TrendingUp}
          />
        </div>
      </div>
    </AnimateOnScroll>
  );
}

const toolSlugToName: Record<string, string> = {
  "calculadora-valor": "Calculadora de Valor",
  "comparador-cavalos": "Comparador de Cavalos",
  "verificador-compatibilidade": "Verificador de Compatibilidade",
  "analise-perfil": "Análise de Perfil",
};

const toolSlugs = Object.keys(toolSlugToName);

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
          <Loader2 size={16} className="animate-spin" />A processar...
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2">
          <Crown size={16} />
          Subscrever PRO
          <ArrowRight size={16} />
        </span>
      )}
    </button>
  );
}

function CheckoutFeedback() {
  const searchParams = useSearchParams();
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
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
        <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl backdrop-blur-sm shadow-lg">
          <CheckCircle size={20} className="text-emerald-400" />
          <span className="text-emerald-300 font-medium text-sm">
            Subscricao PRO activada com sucesso!
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-emerald-400 hover:text-emerald-300 ml-2"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
        <div className="flex items-center gap-3 px-6 py-4 bg-[var(--background-card)]/90 border border-[var(--border)] rounded-xl backdrop-blur-sm shadow-lg">
          <X size={20} className="text-[var(--foreground-secondary)]" />
          <span className="text-[var(--foreground-secondary)] font-medium text-sm">
            Pagamento cancelado. Pode subscrever a qualquer momento.
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-[var(--foreground-secondary)] hover:text-[var(--foreground-secondary)] ml-2"
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
  const { t } = useLanguage();
  const [filterSlug, setFilterSlug] = useState<string>("all");
  const [formSlug, setFormSlug] = useState<string>(toolSlugs[0]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, media: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const slug = filterSlug || "all";
      const res = await fetch(`/api/reviews?ferramenta_slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setStats(data.stats || { total: 0, media: 0 });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [filterSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshKey]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
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
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
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
                  <span className="text-xs text-[var(--foreground-muted)]">
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
        <div className="bg-[var(--background-secondary)]/80 border border-[var(--border)] rounded-2xl p-8">
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

  if (isLoading || !isSubscribed) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6">
      <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#C5A059]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Crown size={16} className="text-[#C5A059]" />
          </div>
          <div>
            <p className="text-[#C5A059] font-semibold text-sm">PRO Activo</p>
            <p className="text-[var(--foreground-muted)] text-xs">
              Acesso ilimitado a todas as ferramentas
            </p>
          </div>
        </div>
        <Link
          href="/ferramentas/historico"
          className="flex-shrink-0 flex items-center gap-1.5 text-sm text-[#C5A059] hover:text-[#D4B068] transition-colors"
        >
          <History size={14} />
          <span className="hidden sm:inline">Ver histórico</span>
          <span className="sm:hidden">Histórico</span>
        </Link>
      </div>
    </div>
  );
}

export default function FerramentasPage() {
  const { t } = useLanguage();

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
              Simples e rápido
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
              Como funciona
            </h2>
            <p className="text-[var(--foreground-secondary)] max-w-lg mx-auto text-sm">
              Resultados profissionais em menos de 2 minutos, sem necessidade de conta.
            </p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

            {[
              {
                step: "01",
                title: "Escolhe a ferramenta",
                desc: "Selecciona a ferramenta adequada ao que precisas: avaliação de valor, comparação, compatibilidade ou perfil de cavaleiro.",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "Preenches os dados do cavalo",
                desc: "Introduz as características do teu Lusitano. O formulário é intuitivo e guia-te em cada passo.",
                icon: UserCheck,
              },
              {
                step: "03",
                title: "Recebes a análise instantânea",
                desc: "O resultado aparece de imediato. Com PRO, exportas em PDF e guardas o histórico completo.",
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] text-sm font-medium rounded-full hover:bg-[var(--gold)]/20 transition-colors"
            >
              <Sparkles size={15} />
              Experimentar agora — é grátis
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
            <div className="bg-[var(--background-secondary)]/80 border border-[var(--border)] rounded-2xl p-8">
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
                  1 uso gratuito por ferramenta
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {freeTierFeatures.map((feature, i) => (
                  <PricingFeature key={i} text={feature.text} included={feature.included} />
                ))}
              </ul>

              <Link
                href="/registar"
                className="block w-full py-3 text-center border border-[var(--border)] text-[var(--foreground)] text-sm font-medium rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
              >
                {t.ferramentas.create_free}
              </Link>
            </div>

            {/* PRO Tier */}
            <div className="relative bg-[var(--background-secondary)]/80 border-2 border-[var(--gold)]/60 rounded-2xl p-8 shadow-lg shadow-[var(--gold)]/5">
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
                  {t.ferramentas.cancel_anytime} • Sem fidelização
                </p>

                {/* Savings callout */}
                <div className="mt-4 px-4 py-2.5 bg-[var(--gold)]/8 border border-[var(--gold)]/20 rounded-lg text-center">
                  <p className="text-xs text-[var(--gold)] font-semibold">
                    Poupa €200+ vs. avaliação profissional
                  </p>
                  <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">
                    Uma avaliação presencial custa €150–200. Aqui tens análises ilimitadas.
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
                  Juntaram-se esta semana
                </p>
              </div>

              <ProSubscribeButton className="block w-full py-4 text-center bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black text-sm font-bold rounded-lg hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all hover:shadow-xl hover:shadow-[var(--gold)]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>

          {/* ROI Comparison */}
          <div className="mt-12 p-6 bg-[var(--background-secondary)]/50 border border-[var(--gold)]/20 rounded-xl max-w-2xl mx-auto">
            <h4 className="text-sm font-serif text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Calculator size={16} className="text-[var(--gold)]" />
              Compare: PRO vs. Serviços Tradicionais
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p className="text-[var(--foreground-muted)]">
                  Avaliação veterinária profissional:
                </p>
                <p className="text-[var(--foreground-muted)]">Relatório de pedigree (APSL):</p>
                <p className="text-[var(--foreground-muted)]">Consultor de compra (1 cavalo):</p>
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
                Portal Lusitano PRO: 4,99€/mês = <span className="text-lg">59,88€/ano</span>
              </p>
              <p className="text-[10px] text-emerald-400/70 mt-1">
                Economiza até 370€ vs. serviços tradicionais
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
          <div className="bg-gradient-to-br from-[var(--gold)]/5 to-transparent border border-[var(--gold)]/10 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
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
              <div className="grid grid-cols-2 gap-4">
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
      <FAQSection items={faqItems} />

      {/* ===== REVIEWS SECTION ===== */}
      <ToolReviewsSection />
    </main>
  );
}

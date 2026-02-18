"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calculator,
  BarChart3,
  Heart,
  UserCheck,
  ChevronDown,
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
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import ToolReviewForm from "@/components/ToolReviewForm";
import { Review, ReviewStats } from "@/types/review";
import { faqItems } from "./faq-data";

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

interface FAQItem {
  question: string;
  answer: string;
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

function ToolCard({ tool, index }: { tool: (typeof tools)[number]; index: number }) {
  const { t } = useLanguage();
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className="group relative bg-[var(--background-secondary)]/80 border border-[var(--border)] rounded-2xl p-8 transition-all duration-300 hover:border-[var(--gold)]/50 hover:shadow-lg hover:shadow-[var(--gold)]/5 hover:-translate-y-1 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      {/* Gradient background on hover */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={tool.iconColor} size={28} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif text-[var(--foreground)] mb-3 group-hover:text-[var(--gold)] transition-colors">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-6">
          {tool.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {tool.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-[var(--foreground-muted)] text-xs">
              <Check size={14} className="text-[var(--gold)] flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--gold)] group-hover:gap-3 transition-all">
          <span>{t.ferramentas.try}</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function FAQAccordion({
  item,
  isOpen,
  onClick,
}: {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.question.slice(0, 20).replace(/\s/g, "-")}`}
      >
        <span className="text-lg font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors pr-8">
          {item.question}
        </span>
        <div
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown
            className={`${isOpen ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"} transition-colors`}
            size={20}
          />
        </div>
      </button>

      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-[var(--foreground-secondary)] leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

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

export default function FerramentasPage() {
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Suspense fallback={null}>
        <CheckoutFeedback />
      </Suspense>
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--gold)]/3 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-full mb-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <Sparkles size={14} className="text-[var(--gold)]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium">
              {t.ferramentas.badge}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[var(--foreground)] mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            {t.ferramentas.title}{" "}
            <span className="bg-gradient-to-r from-[var(--gold)] to-[#E8D5A3] bg-clip-text text-transparent">
              {t.ferramentas.title_accent}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-[var(--foreground-secondary)] max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            {t.ferramentas.subtitle}
          </p>

          <p
            className="text-sm text-[var(--foreground-muted)] max-w-xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          >
            {t.ferramentas.subtitle_detail}
          </p>
        </div>
      </section>

      {/* ===== TOOL CARDS SECTION ===== */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
              {t.ferramentas.available}
            </span>
          </div>

          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <ToolCard key={tool.href} tool={tool} index={index} />
            ))}
          </div>
        </div>
      </section>

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
              </div>

              <ul className="space-y-4 mb-8">
                {proTierFeatures.map((feature, i) => (
                  <PricingFeature key={i} text={feature.text} included={feature.included} />
                ))}
              </ul>

              <ProSubscribeButton />
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
      <section className="px-6 pb-32" id="faq">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <AnimateOnScroll className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] block mb-4">
              {t.ferramentas.faq_badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
              {t.ferramentas.faq_title}
            </h2>
            <p className="text-[var(--foreground-secondary)] max-w-lg mx-auto">
              {t.ferramentas.faq_subtitle}
            </p>
          </AnimateOnScroll>

          {/* FAQ items */}
          <div>
            {faqItems.map((item, index) => (
              <FAQAccordion
                key={index}
                item={item}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center p-8 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl">
            <p className="text-[var(--foreground-secondary)] mb-4 text-sm">
              {t.ferramentas.faq_not_found}
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-[var(--gold)] text-sm font-medium hover:underline"
            >
              {t.ferramentas.faq_see_all}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS SECTION ===== */}
      <ToolReviewsSection />
    </main>
  );
}

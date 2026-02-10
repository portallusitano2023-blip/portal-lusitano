"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import ToolReviewForm from "@/components/ToolReviewForm";
import { Review, ReviewStats } from "@/types/review";

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

const faqItems: FAQItem[] = [
  {
    question: "As ferramentas são gratuitas?",
    answer:
      "Sim, cada ferramenta oferece 1 utilização gratuita para que possa experimentar sem compromisso. Para utilizações ilimitadas, exportação de PDF e funcionalidades avançadas, pode subscrever o plano PRO por apenas 4,99 euros por mês.",
  },
  {
    question: "Como funciona a Calculadora de Valor?",
    answer:
      "A nossa calculadora utiliza um algoritmo proprietário com mais de 20 variáveis, incluindo linhagem, morfologia, andamentos, treino, resultados em competição e tendências de mercado. O resultado é uma estimativa fundamentada que reflecte o valor real do seu Lusitano no mercado actual.",
  },
  {
    question: "O Verificador de Compatibilidade substitui a opinião de um veterinário?",
    answer:
      "Não. O Verificador de Compatibilidade é uma ferramenta de apoio à decisão que analisa dados genéticos e morfológicos para sugerir cruzamentos promissores. Recomendamos sempre consultar um veterinário especializado em reprodução equina antes de tomar decisões definitivas.",
  },
  {
    question: "Posso cancelar a subscrição PRO a qualquer momento?",
    answer:
      "Sim, pode cancelar a sua subscrição PRO a qualquer momento, sem compromissos ou taxas adicionais. Continuará a ter acesso às funcionalidades PRO até ao final do período de facturação em curso.",
  },
  {
    question: "Os meus dados e resultados ficam guardados?",
    answer:
      "No plano gratuito, os resultados são apresentados apenas durante a sessão. No plano PRO, todo o seu histórico de análises fica guardado na sua conta, podendo consultá-lo, exportá-lo ou partilhá-lo a qualquer momento.",
  },
  {
    question: "As ferramentas funcionam para cavalos de outras raças?",
    answer:
      "As nossas ferramentas foram concebidas e optimizadas especificamente para o Cavalo Lusitano, com dados, parâmetros e referências ajustados à raça. Embora possam ser usadas com outras raças ibéricas, os resultados serão mais precisos para Lusitanos registados na APSL.",
  },
];

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
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className="group relative bg-zinc-900/80 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-[#C5A059]/50 hover:shadow-lg hover:shadow-[#C5A059]/5 hover:-translate-y-1 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
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
        <h3 className="text-xl font-serif text-white mb-3 group-hover:text-[#C5A059] transition-colors">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">{tool.description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {tool.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-zinc-500 text-xs">
              <Check size={14} className="text-[#C5A059] flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-medium text-[#C5A059] group-hover:gap-3 transition-all">
          <span>Experimentar</span>
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
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-serif text-white group-hover:text-[#C5A059] transition-colors pr-8">
          {item.question}
        </span>
        <div
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown
            className={`${isOpen ? "text-[#C5A059]" : "text-zinc-500"} transition-colors`}
            size={20}
          />
        </div>
      </button>

      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-zinc-400 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

function PricingFeature({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-center gap-3">
      {included ? (
        <Check size={16} className="text-[#C5A059] flex-shrink-0" />
      ) : (
        <X size={16} className="text-zinc-600 flex-shrink-0" />
      )}
      <span className={included ? "text-zinc-300 text-sm" : "text-zinc-600 text-sm"}>{text}</span>
    </li>
  );
}

function ToolReviewsSection() {
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
    } catch (err) {
      console.error("Erro ao carregar reviews:", err);
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
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] block mb-4">
            Avaliações dos Utilizadores
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            O que dizem os nossos utilizadores
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Avaliações reais de quem já utilizou as nossas ferramentas
          </p>
        </AnimateOnScroll>

        {/* Tool filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setFilterSlug("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filterSlug === "all"
                ? "bg-[#C5A059] text-black"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            Todas
          </button>
          {toolSlugs.map((slug) => (
            <button
              key={slug}
              onClick={() => setFilterSlug(slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filterSlug === slug
                  ? "bg-[#C5A059] text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {toolSlugToName[slug]}
            </button>
          ))}
        </div>

        {/* Stats summary */}
        {stats.total > 0 && (
          <div className="flex items-center justify-center gap-6 mb-10 p-4 bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-xl">
            <div className="text-center">
              <p className="text-3xl font-serif text-[#C5A059]">{stats.media}</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= Math.round(stats.media) ? "text-[#C5A059]" : "text-zinc-600"}
                    fill={star <= Math.round(stats.media) ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            <div className="border-l border-[#C5A059]/20 pl-6">
              <p className="text-sm text-zinc-400">
                Baseado em <span className="font-semibold text-white">{stats.total}</span>{" "}
                {stats.total === 1 ? "avaliação" : "avaliações"}
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
                className="animate-pulse bg-zinc-900/50 border border-white/5 rounded-xl p-6"
              >
                <div className="h-4 bg-zinc-800 rounded w-1/4 mb-3" />
                <div className="h-3 bg-zinc-800 rounded w-1/3 mb-4" />
                <div className="h-16 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 border border-white/5 rounded-xl mb-10">
            <MessageSquare className="mx-auto text-zinc-600 mb-4" size={40} />
            <p className="text-zinc-500">Ainda sem avaliações aprovadas</p>
            <p className="text-zinc-600 text-sm mt-1">Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-white/10 transition"
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
                              star <= review.avaliacao ? "text-[#C5A059]" : "text-zinc-600"
                            }
                            fill={star <= review.avaliacao ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      {review.ferramenta_slug && filterSlug === "all" && (
                        <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">
                          {toolSlugToName[review.ferramenta_slug] || review.ferramenta_slug}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <User size={14} />
                      <span>{review.autor_nome}</span>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-600">{formatDate(review.created_at)}</span>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed mb-3">{review.comentario}</p>

                {review.recomenda && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-500">
                    <ThumbsUp size={12} />
                    Recomenda
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Review form */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-serif text-white mb-2">Deixe a sua avaliação</h3>
          <p className="text-zinc-500 text-sm mb-6">
            Partilhe a sua experiência com as nossas ferramentas
          </p>

          {/* Tool selector dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-300 mb-2">Ferramenta</label>
            <select
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition"
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
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#C5A059]/3 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full mb-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <Sparkles size={14} className="text-[#C5A059]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-medium">
              Ferramentas Profissionais
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            Ferramentas{" "}
            <span className="bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] bg-clip-text text-transparent">
              Premium
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            Ferramentas profissionais concebidas para proprietários, criadores e apaixonados pelo
            Cavalo Lusitano
          </p>

          <p
            className="text-sm text-zinc-500 max-w-xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          >
            Avalie, compare, analise e descubra tudo sobre o seu Lusitano com algoritmos
            desenvolvidos por especialistas da raça.
          </p>
        </div>
      </section>

      {/* ===== TOOL CARDS SECTION ===== */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059]">
              4 Ferramentas Disponíveis
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
              { icon: Shield, label: "Dados Seguros", text: "Encriptação de ponta a ponta" },
              { icon: Zap, label: "Resultados Instantâneos", text: "Análises em tempo real" },
              { icon: Download, label: "Exportar PDF", text: "Relatórios profissionais" },
              { icon: Crown, label: "Feito para Lusitanos", text: "Optimizado para a raça" },
            ].map((benefit, i) => (
              <AnimateOnScroll key={benefit.label} delay={i * 80}>
                <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="w-10 h-10 bg-[#C5A059]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon size={20} className="text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{benefit.label}</p>
                    <p className="text-zinc-500 text-xs">{benefit.text}</p>
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
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] block mb-4">
              Planos e Preços
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Escolha o plano ideal
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Comece gratuitamente e faça upgrade quando precisar de mais
            </p>
          </AnimateOnScroll>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-8">
              <div className="mb-8">
                <h3 className="text-xl font-serif text-white mb-2">Gratuito</h3>
                <p className="text-zinc-500 text-sm mb-6">Experimente sem compromisso</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif text-white">0</span>
                  <span className="text-zinc-500 text-lg">EUR</span>
                </div>
                <p className="text-zinc-600 text-xs mt-1">1 uso gratuito por ferramenta</p>
              </div>

              <ul className="space-y-4 mb-8">
                {freeTierFeatures.map((feature, i) => (
                  <PricingFeature key={i} text={feature.text} included={feature.included} />
                ))}
              </ul>

              <Link
                href="/registar"
                className="block w-full py-3 text-center border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                Criar Conta Gratuita
              </Link>
            </div>

            {/* PRO Tier */}
            <div className="relative bg-zinc-900/80 border-2 border-[#C5A059]/60 rounded-2xl p-8 shadow-lg shadow-[#C5A059]/5">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] text-black text-xs font-bold uppercase tracking-[0.15em] rounded-full">
                  <Crown size={12} />
                  Mais Popular
                </span>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-serif text-white mb-2">PRO</h3>
                <p className="text-zinc-500 text-sm mb-6">Para profissionais e criadores</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] bg-clip-text text-transparent">
                    4,99
                  </span>
                  <span className="text-zinc-500 text-lg">EUR/mês</span>
                </div>
                <p className="text-zinc-600 text-xs mt-1">Cancele a qualquer momento</p>
              </div>

              <ul className="space-y-4 mb-8">
                {proTierFeatures.map((feature, i) => (
                  <PricingFeature key={i} text={feature.text} included={feature.included} />
                ))}
              </ul>

              <Link
                href="/registar"
                className="block w-full py-3 text-center bg-gradient-to-r from-[#C5A059] to-[#D4B068] text-black text-sm font-bold rounded-lg hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all hover:shadow-lg hover:shadow-[#C5A059]/20"
              >
                Subscrever PRO
              </Link>
            </div>
          </div>

          {/* Trust note */}
          <p className="text-center text-zinc-600 text-xs mt-8">
            Pagamento seguro via Stripe. Sem compromissos. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* ===== PRO FEATURES DETAIL ===== */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#C5A059]/5 to-transparent border border-[#C5A059]/10 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] block mb-4">
                  Vantagens PRO
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-6">
                  Tudo o que precisa para decisões informadas
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  O plano PRO desbloqueia o potencial completo de cada ferramenta, permitindo-lhe
                  tomar decisões de compra, venda e criação com dados profissionais e relatórios
                  detalhados.
                </p>
                <Link
                  href="/registar"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#D4B068] text-black text-sm font-bold rounded-lg hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all"
                >
                  Começar Agora
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Right: Feature grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Zap,
                    title: "Ilimitado",
                    desc: "Sem limites de utilizações",
                  },
                  {
                    icon: Download,
                    title: "PDF Export",
                    desc: "Relatórios profissionais",
                  },
                  {
                    icon: History,
                    title: "Histórico",
                    desc: "Todas as análises guardadas",
                  },
                  {
                    icon: Share2,
                    title: "Partilhar",
                    desc: "Links partilháveis",
                  },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className="p-4 bg-white/[0.03] border border-white/5 rounded-xl"
                  >
                    <feat.icon size={20} className="text-[#C5A059] mb-3" />
                    <p className="text-white text-sm font-medium mb-1">{feat.title}</p>
                    <p className="text-zinc-500 text-xs">{feat.desc}</p>
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
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] block mb-4">
              Perguntas Frequentes
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Dúvidas Comuns</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Tudo o que precisa de saber sobre as nossas ferramentas
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
          <div className="mt-12 text-center p-8 bg-white/[0.02] border border-white/5 rounded-xl">
            <p className="text-zinc-400 mb-4 text-sm">Não encontrou a resposta que procurava?</p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-[#C5A059] text-sm font-medium hover:underline"
            >
              Ver todas as perguntas frequentes
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

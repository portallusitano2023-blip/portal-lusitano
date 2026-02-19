"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Crown,
  Calculator,
  BarChart3,
  Heart,
  UserCheck,
  ArrowRight,
  Shield,
  Download,
  History,
  Share2,
  Zap,
  Store,
  Loader2,
  CreditCard,
  RefreshCcw,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { getFaqItems } from "@/app/ferramentas/faq-data";

// ─── BOTÃO DE CHECKOUT ───────────────────────────────────

function CheckoutButton({ className }: { className?: string }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/precos";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/tools/create-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // fail silently — user retries
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={
        className ??
        "w-full bg-[var(--gold)] text-black py-4 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-white transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
      }
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" />{" "}
          {tr("A redirecionar...", "Redirecting...", "Redireccionando...")}
        </>
      ) : (
        <>
          {user
            ? tr("Activar Pro Agora", "Activate Pro Now", "Activar Pro Ahora")
            : tr(
                "Começar — Registo Gratuito",
                "Start — Free Registration",
                "Comenzar — Registro Gratuito"
              )}
          <ArrowRight size={14} />
        </>
      )}
    </button>
  );
}

// ─── FAQ COM ANIMAÇÃO ─────────────────────────────────────

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onToggle: (i: number) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM measurement requires effect
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        className="w-full text-left py-5 flex items-center justify-between gap-4 text-[var(--foreground)] hover:text-[var(--gold)] transition-colors group"
      >
        <span className="font-serif text-base">{item.question}</span>
        <span
          className={`text-[var(--gold)] text-xl leading-none shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      <div style={{ height, overflow: "hidden", transition: "height 280ms ease" }}>
        <div ref={contentRef}>
          <p className="pb-5 text-sm text-[var(--foreground-secondary)] leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const { language } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const faqItems = getFaqItems(language);

  const handleToggle = (i: number) => {
    setOpen((prev) => (prev === i ? null : i));
  };

  return (
    <div>
      {faqItems.map((item, i) => (
        <FAQItem key={i} item={item} index={i} isOpen={open === i} onToggle={handleToggle} />
      ))}
    </div>
  );
}

// ─── PÁGINA ──────────────────────────────────────────────

export default function PrecosPage() {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  const freeFeatures = [
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
        "Acesso a todas as 4 ferramentas",
        "Access to all 4 tools",
        "Acceso a las 4 herramientas"
      ),
      included: true,
    },
    {
      text: tr("Sem registo obrigatório", "No registration required", "Sin registro obligatorio"),
      included: true,
    },
    {
      text: tr("Exportar relatório PDF", "Export PDF report", "Exportar informe PDF"),
      included: false,
    },
    {
      text: tr(
        "Guardar histórico de análises",
        "Save analysis history",
        "Guardar historial de análisis"
      ),
      included: false,
    },
    {
      text: tr(
        "Partilhar resultados com link",
        "Share results with link",
        "Compartir resultados con enlace"
      ),
      included: false,
    },
    { text: tr("Usos ilimitados", "Unlimited uses", "Usos ilimitados"), included: false },
    { text: tr("Suporte prioritário", "Priority support", "Soporte prioritario"), included: false },
  ];

  const proFeatures = [
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
        "Acesso a todas as 4 ferramentas",
        "Access to all 4 tools",
        "Acceso a las 4 herramientas"
      ),
      included: true,
    },
    {
      text: tr(
        "Registo com conta segura",
        "Registration with secure account",
        "Registro con cuenta segura"
      ),
      included: true,
    },
    {
      text: tr("Exportar relatórios em PDF", "Export reports in PDF", "Exportar informes en PDF"),
      included: true,
    },
    {
      text: tr(
        "Histórico completo de análises",
        "Complete analysis history",
        "Historial completo de análisis"
      ),
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
    {
      text: tr(
        "Suporte prioritário por email",
        "Priority support by email",
        "Soporte prioritario por email"
      ),
      included: true,
    },
  ];

  const comparisonRows = [
    {
      feature: tr("Usos por ferramenta", "Uses per tool", "Usos por herramienta"),
      free: tr("1 gratuito", "1 free", "1 gratuito"),
      pro: tr("Ilimitado", "Unlimited", "Ilimitado"),
    },
    {
      feature: tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor"),
      free: tr("Básica", "Basic", "Básica"),
      pro: tr("Avançada", "Advanced", "Avanzada"),
    },
    {
      feature: tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"),
      free: tr("Básico", "Basic", "Básico"),
      pro: tr("Avançado", "Advanced", "Avanzado"),
    },
    {
      feature: tr(
        "Verificador de Compatibilidade",
        "Compatibility Checker",
        "Verificador de Compatibilidad"
      ),
      free: tr("Básico", "Basic", "Básico"),
      pro: tr("Avançado", "Advanced", "Avanzado"),
    },
    {
      feature: tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil"),
      free: tr("Básica", "Basic", "Básica"),
      pro: tr("Avançada", "Advanced", "Avanzada"),
    },
    { feature: tr("Exportar PDF", "Export PDF", "Exportar PDF"), free: false, pro: true },
    {
      feature: tr("Histórico de análises", "Analysis history", "Historial de análisis"),
      free: false,
      pro: true,
    },
    {
      feature: tr("Partilhar resultados", "Share results", "Compartir resultados"),
      free: false,
      pro: true,
    },
    {
      feature: tr("Suporte prioritário", "Priority support", "Soporte prioritario"),
      free: false,
      pro: true,
    },
  ];

  const tools = [
    {
      title: tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor"),
      href: "/calculadora-valor",
      icon: Calculator,
      description: tr(
        "Estimativa fundamentada com 20+ variáveis de mercado",
        "Reasoned estimate with 20+ market variables",
        "Estimación razonada con 20+ variables de mercado"
      ),
    },
    {
      title: tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"),
      href: "/comparador-cavalos",
      icon: BarChart3,
      description: tr(
        "Compare até 4 cavalos lado a lado com gráficos radar",
        "Compare up to 4 horses side by side with radar charts",
        "Compare hasta 4 caballos con gráficos radar"
      ),
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
        "Score genético e alerta de consanguinidade",
        "Genetic score and inbreeding alert",
        "Puntuación genética y alerta de consanguinidad"
      ),
    },
    {
      title: tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil"),
      href: "/analise-perfil",
      icon: UserCheck,
      description: tr(
        "Descubra o seu perfil de cavaleiro ideal",
        "Discover your ideal rider profile",
        "Descubra su perfil de jinete ideal"
      ),
    },
  ];

  const marketplaceFeatures = [
    tr(
      "Anúncio activo durante 30 dias",
      "Active listing for 30 days",
      "Anuncio activo durante 30 días"
    ),
    tr("Verificação APSL incluída", "APSL verification included", "Verificación APSL incluida"),
    tr("Fotos ilimitadas + vídeo", "Unlimited photos + video", "Fotos ilimitadas + vídeo"),
    tr(
      "Contacto directo com compradores",
      "Direct contact with buyers",
      "Contacto directo con compradores"
    ),
    tr(
      "Destaque no topo por 7 dias (+29€)",
      "Featured at top for 7 days (+€29)",
      "Destacado en el top 7 días (+29€)"
    ),
    tr("Aprovação em até 24 horas", "Approval within 24 hours", "Aprobación en hasta 24 horas"),
  ];

  const proBenefits = [
    {
      icon: Zap,
      title: tr("Usos Ilimitados", "Unlimited Uses", "Usos Ilimitados"),
      desc: tr(
        "Analise quantos cavalos precisar, sem restrições.",
        "Analyse as many horses as you need, without restrictions.",
        "Analice cuántos caballos necesite, sin restricciones."
      ),
    },
    {
      icon: Download,
      title: tr("Relatórios PDF", "PDF Reports", "Informes PDF"),
      desc: tr(
        "Exporte análises profissionais para partilhar com clientes.",
        "Export professional analyses to share with clients.",
        "Exporte análisis profesionales para compartir con clientes."
      ),
    },
    {
      icon: History,
      title: tr("Histórico Completo", "Complete History", "Historial Completo"),
      desc: tr(
        "Aceda a todas as suas análises anteriores a qualquer momento.",
        "Access all your previous analyses at any time.",
        "Acceda a todos sus análisis anteriores en cualquier momento."
      ),
    },
    {
      icon: Share2,
      title: tr("Partilhar Resultados", "Share Results", "Compartir Resultados"),
      desc: tr(
        "Partilhe análises com link directo para compradores ou veterinários.",
        "Share analyses with a direct link for buyers or vets.",
        "Comparta análisis con enlace directo para compradores o veterinarios."
      ),
    },
    {
      icon: Shield,
      title: tr("Suporte Prioritário", "Priority Support", "Soporte Prioritario"),
      desc: tr(
        "Resposta em menos de 24h por email.",
        "Response within 24h by email.",
        "Respuesta en menos de 24h por email."
      ),
    },
    {
      icon: Store,
      title: tr("Acesso Antecipado", "Early Access", "Acceso Anticipado"),
      desc: tr(
        "Seja o primeiro a experimentar novas ferramentas.",
        "Be the first to try new tools.",
        "Sea el primero en probar nuevas herramientas."
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="px-6 md:px-12 pt-28 pb-4">
        <ol className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
          <li>
            <Link href="/" className="hover:text-[var(--gold)] transition-colors">
              {tr("Início", "Home", "Inicio")}
            </Link>
          </li>
          <li aria-hidden className="text-[var(--gold)]/40">
            /
          </li>
          <li className="text-[var(--foreground-secondary)]">
            {tr("Preços", "Pricing", "Precios")}
          </li>
        </ol>
      </nav>

      {/* HERO */}
      <section className="px-6 md:px-12 pt-12 pb-20 max-w-5xl mx-auto text-center">
        <span className="inline-block text-[var(--gold)] text-[9px] uppercase tracking-[0.4em] font-bold border border-[var(--gold)]/30 px-4 py-2 mb-8">
          {tr("Planos e Preços", "Plans & Pricing", "Planes y Precios")}
        </span>
        <h1 className="text-5xl md:text-7xl font-serif leading-none tracking-tight mb-6">
          {tr("Ferramentas Profissionais", "Professional Tools", "Herramientas Profesionales")}
          <br />
          <em className="text-[var(--gold)]">
            {tr("para o Mercado Lusitano", "for the Lusitano Market", "para el Mercado Lusitano")}
          </em>
        </h1>
        <p className="text-[var(--foreground-secondary)] text-lg max-w-2xl mx-auto font-light mb-8">
          {tr(
            "Comece gratuitamente. Actualize para Pro quando precisar de mais. Sem contratos, sem surpresas.",
            "Start for free. Upgrade to Pro when you need more. No contracts, no surprises.",
            "Empiece gratis. Actualice a Pro cuando necesite más. Sin contratos, sin sorpresas."
          )}
        </p>
        {/* Trust micro-copy */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--foreground-muted)]">
          <span className="flex items-center gap-1.5">
            <CreditCard size={11} className="text-[var(--gold)]" />
            {tr(
              "Sem cartão de crédito para o plano Grátis",
              "No credit card for the Free plan",
              "Sin tarjeta de crédito para el plan Gratis"
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <RefreshCcw size={11} className="text-[var(--gold)]" />
            {tr("Cancele a qualquer momento", "Cancel at any time", "Cancele en cualquier momento")}
          </span>
          <span className="flex items-center gap-1.5">
            <Shield size={11} className="text-[var(--gold)]" />
            {tr(
              "Pagamento seguro via Stripe",
              "Secure payment via Stripe",
              "Pago seguro vía Stripe"
            )}
          </span>
        </div>
      </section>

      {/* PLANOS */}
      <section className="px-6 md:px-12 pb-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-0 border border-[var(--border)]">
          {/* FREE */}
          <div className="p-8 border-r border-[var(--border)] flex flex-col group hover:bg-[var(--background-secondary)]/40 transition-colors duration-300">
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] mb-3">
                {tr("Explorador", "Explorer", "Explorador")}
              </p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-serif">{tr("Grátis", "Free", "Gratis")}</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                {tr(
                  "Para sempre · Sem cartão de crédito",
                  "Forever · No credit card",
                  "Para siempre · Sin tarjeta de crédito"
                )}
              </p>
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  {f.included ? (
                    <Check size={14} className="text-[var(--gold)] mt-0.5 shrink-0" />
                  ) : (
                    <X size={14} className="text-[var(--foreground-muted)] mt-0.5 shrink-0" />
                  )}
                  <span
                    className={
                      f.included
                        ? "text-[var(--foreground-secondary)]"
                        : "text-[var(--foreground-muted)]"
                    }
                  >
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/ferramentas"
              className="w-full border border-[var(--border)] text-[var(--foreground-muted)] py-4 text-[11px] uppercase font-bold tracking-[0.3em] hover:border-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] transition-all text-center block"
            >
              {tr("Experimentar Grátis", "Try for Free", "Probar Gratis")}
            </Link>
          </div>

          {/* PRO — destacado */}
          <div className="p-8 border-r border-[var(--border)] flex flex-col relative bg-[var(--gold)]/5">
            {/* Borda de destaque superior */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--gold)]" />
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="flex items-center gap-1 bg-[var(--gold)] text-black text-[9px] uppercase tracking-wider font-bold px-3 py-1.5 whitespace-nowrap">
                <Crown size={10} /> {tr("Mais popular", "Most popular", "Más popular")}
              </span>
            </div>

            <div className="mb-8 pt-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-3">Pro</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-serif">4,99 €</span>
                <span className="text-[var(--foreground-muted)] text-sm mb-1">
                  {tr("/mês", "/month", "/mes")}
                </span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                {tr(
                  "Cancele a qualquer momento · Sem compromisso",
                  "Cancel anytime · No commitment",
                  "Cancele en cualquier momento · Sin compromiso"
                )}
              </p>
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check size={14} className="text-[var(--gold)] mt-0.5 shrink-0" />
                  <span className="text-[var(--foreground-secondary)]">{f.text}</span>
                </li>
              ))}
            </ul>

            <CheckoutButton />
          </div>

          {/* MARKETPLACE */}
          <div className="p-8 flex flex-col group hover:bg-[var(--background-secondary)]/40 transition-colors duration-300">
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] mb-3">
                Marketplace
              </p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-serif">49 €</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                {tr(
                  "Por anúncio · pagamento único · +29€ destaque opcional",
                  "Per listing · one-time payment · +€29 optional highlight",
                  "Por anuncio · pago único · +29€ destacado opcional"
                )}
              </p>
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {marketplaceFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check size={14} className="text-[var(--gold)] mt-0.5 shrink-0" />
                  <span className="text-[var(--foreground-secondary)]">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/vender-cavalo"
              className="w-full border border-[var(--gold)] text-[var(--gold)] py-4 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-[var(--gold)] hover:text-black transition-all text-center flex items-center justify-center gap-2"
            >
              {tr("Anunciar Cavalo", "List a Horse", "Anunciar Caballo")}
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[var(--foreground-muted)]">
          <span className="flex items-center gap-1.5">
            <Shield size={12} className="text-[var(--gold)]" />
            {tr(
              "Pagamento seguro via Stripe",
              "Secure payment via Stripe",
              "Pago seguro vía Stripe"
            )}
          </span>
          <span className="text-[var(--border)]">·</span>
          <span>{tr("Sem taxas ocultas", "No hidden fees", "Sin cargos ocultos")}</span>
          <span className="text-[var(--border)]">·</span>
          <span>
            {tr("Cancele quando quiser", "Cancel whenever you want", "Cancele cuando quiera")}
          </span>
        </div>
      </section>

      {/* TABELA DE COMPARAÇÃO */}
      <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-[var(--foreground-muted)] mb-8 text-center">
          {tr("Comparação detalhada", "Detailed comparison", "Comparación detallada")}
        </h2>
        <div className="border border-[var(--border)]">
          <div className="grid grid-cols-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
            <div className="p-4 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
              {tr("Funcionalidade", "Feature", "Funcionalidad")}
            </div>
            <div className="p-4 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] text-center border-l border-[var(--border)]">
              {tr("Grátis", "Free", "Gratis")}
            </div>
            <div className="p-4 text-[10px] uppercase tracking-widest text-[var(--gold)] text-center border-l border-[var(--border)]">
              Pro
            </div>
          </div>
          {comparisonRows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--background-secondary)]/30 transition-colors"
            >
              <div className="p-4 text-sm text-[var(--foreground-secondary)]">{row.feature}</div>
              <div className="p-4 text-center border-l border-[var(--border)] flex items-center justify-center">
                {typeof row.free === "boolean" ? (
                  row.free ? (
                    <Check size={14} className="text-[var(--gold)]" />
                  ) : (
                    <X size={14} className="text-[var(--foreground-muted)]" />
                  )
                ) : (
                  <span className="text-xs text-[var(--foreground-secondary)]">{row.free}</span>
                )}
              </div>
              <div className="p-4 text-center border-l border-[var(--border)] flex items-center justify-center">
                {typeof row.pro === "boolean" ? (
                  row.pro ? (
                    <Check size={14} className="text-[var(--gold)]" />
                  ) : (
                    <X size={14} className="text-[var(--foreground-muted)]" />
                  )
                ) : (
                  <span className="text-xs text-[var(--gold)] font-medium">{row.pro}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FERRAMENTAS */}
      <section className="px-6 md:px-12 pb-24 max-w-5xl mx-auto">
        <div className="border-t border-[var(--border)] pt-16">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-[var(--foreground-muted)] mb-10 text-center">
            {tr("O que está incluído", "What's included", "Qué está incluido")}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)]">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="bg-[var(--background)] p-6 hover:bg-[var(--background-secondary)] transition-colors group"
                >
                  <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center mb-4 group-hover:border-[var(--gold)] transition-colors">
                    <Icon size={18} className="text-[var(--gold)]" />
                  </div>
                  <h3 className="font-serif text-base mb-2 group-hover:text-[var(--gold)] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRO FEATURES VISUAIS */}
      <section className="px-6 md:px-12 pb-24 max-w-5xl mx-auto">
        <div className="border border-[var(--border)] p-10 md:p-16 bg-[var(--gold)]/5 relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
          <h2 className="font-serif text-3xl md:text-4xl mb-10 text-center">
            {tr("O que ganha com o", "What you get with", "Lo que gana con el")}{" "}
            <em className="text-[var(--gold)]">Pro</em>
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            {proBenefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 border border-[var(--gold)]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-[var(--gold)]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <CheckoutButton />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 pb-24 max-w-3xl mx-auto">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-[var(--foreground-muted)] mb-8 text-center">
          {tr("Perguntas frequentes", "Frequently asked questions", "Preguntas frecuentes")}
        </h2>
        <FAQ />
      </section>

      {/* CTA FINAL */}
      <section className="px-6 md:px-12 pb-32 max-w-3xl mx-auto text-center">
        <div className="border-t border-[var(--border)] pt-16">
          <p className="text-[var(--foreground-muted)] text-xs uppercase tracking-widest mb-6">
            {tr("Pronto para começar?", "Ready to start?", "¿Listo para empezar?")}
          </p>
          <h2 className="font-serif text-4xl mb-4">
            {tr("Experimente gratuitamente.", "Try it for free.", "Pruébelo gratis.")}
            <br />
            <em className="text-[var(--gold)]">
              {tr("Decida depois.", "Decide later.", "Decida después.")}
            </em>
          </h2>
          <p className="text-[var(--foreground-secondary)] text-sm mb-10 max-w-md mx-auto">
            {tr(
              "Cada ferramenta tem 1 uso gratuito. Sem cartão de crédito. Sem compromisso.",
              "Each tool has 1 free use. No credit card. No commitment.",
              "Cada herramienta tiene 1 uso gratuito. Sin tarjeta de crédito. Sin compromiso."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ferramentas"
              className="border border-[var(--border)] text-[var(--foreground-muted)] px-10 py-4 text-[11px] uppercase font-bold tracking-[0.3em] hover:border-[var(--foreground-muted)] transition-all"
            >
              {tr("Explorar ferramentas", "Explore tools", "Explorar herramientas")}
            </Link>
            <CheckoutButton className="bg-[var(--gold)] text-black px-10 py-4 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-white transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2" />
          </div>
        </div>
      </section>
    </main>
  );
}

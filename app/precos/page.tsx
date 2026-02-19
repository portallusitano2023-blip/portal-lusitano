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
import { faqItems } from "@/app/ferramentas/faq-data";

// ─── DADOS ───────────────────────────────────────────────

const freeFeatures = [
  { text: "1 uso gratuito por ferramenta", included: true },
  { text: "Resultados básicos", included: true },
  { text: "Acesso a todas as 4 ferramentas", included: true },
  { text: "Sem registo obrigatório", included: true },
  { text: "Exportar relatório PDF", included: false },
  { text: "Guardar histórico de análises", included: false },
  { text: "Partilhar resultados com link", included: false },
  { text: "Usos ilimitados", included: false },
  { text: "Suporte prioritário", included: false },
];

const proFeatures = [
  { text: "Usos ilimitados em todas as ferramentas", included: true },
  { text: "Resultados detalhados e avançados", included: true },
  { text: "Acesso a todas as 4 ferramentas", included: true },
  { text: "Registo com conta segura", included: true },
  { text: "Exportar relatórios em PDF", included: true },
  { text: "Histórico completo de análises", included: true },
  { text: "Partilhar resultados com link", included: true },
  { text: "Suporte prioritário por email", included: true },
];

const comparisonRows = [
  { feature: "Usos por ferramenta", free: "1 gratuito", pro: "Ilimitado" },
  { feature: "Calculadora de Valor", free: "Básica", pro: "Avançada" },
  { feature: "Comparador de Cavalos", free: "Básico", pro: "Avançado" },
  {
    feature: "Verificador de Compatibilidade",
    free: "Básico",
    pro: "Avançado",
  },
  { feature: "Análise de Perfil", free: "Básica", pro: "Avançada" },
  { feature: "Exportar PDF", free: false, pro: true },
  { feature: "Histórico de análises", free: false, pro: true },
  { feature: "Partilhar resultados", free: false, pro: true },
  { feature: "Suporte prioritário", free: false, pro: true },
];

const tools = [
  {
    title: "Calculadora de Valor",
    href: "/calculadora-valor",
    icon: Calculator,
    description: "Estimativa fundamentada com 20+ variáveis de mercado",
  },
  {
    title: "Comparador de Cavalos",
    href: "/comparador-cavalos",
    icon: BarChart3,
    description: "Compare até 4 cavalos lado a lado com gráficos radar",
  },
  {
    title: "Verificador de Compatibilidade",
    href: "/verificador-compatibilidade",
    icon: Heart,
    description: "Score genético e alerta de consanguinidade",
  },
  {
    title: "Análise de Perfil",
    href: "/analise-perfil",
    icon: UserCheck,
    description: "Descubra o seu perfil de cavaleiro ideal",
  },
];

// ─── BOTÃO DE CHECKOUT ───────────────────────────────────

function CheckoutButton({ className }: { className?: string }) {
  const { user } = useAuth();
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
          <Loader2 size={14} className="animate-spin" /> A redirecionar...
        </>
      ) : (
        <>
          {user ? "Activar Pro Agora" : "Começar — Registo Gratuito"}
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
  const [open, setOpen] = useState<number | null>(null);

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
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="px-6 md:px-12 pt-28 pb-4">
        <ol className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
          <li>
            <Link href="/" className="hover:text-[var(--gold)] transition-colors">
              Início
            </Link>
          </li>
          <li aria-hidden className="text-[var(--gold)]/40">
            /
          </li>
          <li className="text-[var(--foreground-secondary)]">Preços</li>
        </ol>
      </nav>

      {/* HERO */}
      <section className="px-6 md:px-12 pt-12 pb-20 max-w-5xl mx-auto text-center">
        <span className="inline-block text-[var(--gold)] text-[9px] uppercase tracking-[0.4em] font-bold border border-[var(--gold)]/30 px-4 py-2 mb-8">
          Planos e Preços
        </span>
        <h1 className="text-5xl md:text-7xl font-serif leading-none tracking-tight mb-6">
          Ferramentas Profissionais
          <br />
          <em className="text-[var(--gold)]">para o Mercado Lusitano</em>
        </h1>
        <p className="text-[var(--foreground-secondary)] text-lg max-w-2xl mx-auto font-light mb-8">
          Comece gratuitamente. Actualize para Pro quando precisar de mais. Sem contratos, sem
          surpresas.
        </p>
        {/* Trust micro-copy */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--foreground-muted)]">
          <span className="flex items-center gap-1.5">
            <CreditCard size={11} className="text-[var(--gold)]" />
            Sem cartão de crédito para o plano Grátis
          </span>
          <span className="flex items-center gap-1.5">
            <RefreshCcw size={11} className="text-[var(--gold)]" />
            Cancele a qualquer momento
          </span>
          <span className="flex items-center gap-1.5">
            <Shield size={11} className="text-[var(--gold)]" />
            Pagamento seguro via Stripe
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
                Explorador
              </p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-serif">Grátis</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                Para sempre · Sem cartão de crédito
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
              Experimentar Grátis
            </Link>
          </div>

          {/* PRO — destacado */}
          <div className="p-8 border-r border-[var(--border)] flex flex-col relative bg-[var(--gold)]/5">
            {/* Borda de destaque superior */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--gold)]" />
            {/* Badge "Mais popular" */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="flex items-center gap-1 bg-[var(--gold)] text-black text-[9px] uppercase tracking-wider font-bold px-3 py-1.5 whitespace-nowrap">
                <Crown size={10} /> Mais popular
              </span>
            </div>

            <div className="mb-8 pt-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-3">Pro</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-serif">4,99 €</span>
                <span className="text-[var(--foreground-muted)] text-sm mb-1">/mês</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)]">
                Cancele a qualquer momento · Sem compromisso
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
                Por anúncio · pagamento único · +29€ destaque opcional
              </p>
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {[
                "Anúncio activo durante 30 dias",
                "Verificação APSL incluída",
                "Fotos ilimitadas + vídeo",
                "Contacto directo com compradores",
                "Destaque no topo por 7 dias (+29€)",
                "Aprovação em até 24 horas",
              ].map((f, i) => (
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
              Anunciar Cavalo
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[var(--foreground-muted)]">
          <span className="flex items-center gap-1.5">
            <Shield size={12} className="text-[var(--gold)]" />
            Pagamento seguro via Stripe
          </span>
          <span className="text-[var(--border)]">·</span>
          <span>Sem taxas ocultas</span>
          <span className="text-[var(--border)]">·</span>
          <span>Cancele quando quiser</span>
        </div>
      </section>

      {/* TABELA DE COMPARAÇÃO */}
      <section className="px-6 md:px-12 pb-24 max-w-4xl mx-auto">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-[var(--foreground-muted)] mb-8 text-center">
          Comparação detalhada
        </h2>
        <div className="border border-[var(--border)]">
          <div className="grid grid-cols-3 border-b border-[var(--border)] bg-[var(--background-secondary)]">
            <div className="p-4 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
              Funcionalidade
            </div>
            <div className="p-4 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] text-center border-l border-[var(--border)]">
              Grátis
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
            O que está incluído
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
            O que ganha com o <em className="text-[var(--gold)]">Pro</em>
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Zap,
                title: "Usos Ilimitados",
                desc: "Analise quantos cavalos precisar, sem restrições.",
              },
              {
                icon: Download,
                title: "Relatórios PDF",
                desc: "Exporte análises profissionais para partilhar com clientes.",
              },
              {
                icon: History,
                title: "Histórico Completo",
                desc: "Aceda a todas as suas análises anteriores a qualquer momento.",
              },
              {
                icon: Share2,
                title: "Partilhar Resultados",
                desc: "Partilhe análises com link directo para compradores ou veterinários.",
              },
              {
                icon: Shield,
                title: "Suporte Prioritário",
                desc: "Resposta em menos de 24h por email.",
              },
              {
                icon: Store,
                title: "Acesso Antecipado",
                desc: "Seja o primeiro a experimentar novas ferramentas.",
              },
            ].map((item, i) => {
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
          Perguntas frequentes
        </h2>
        <FAQ />
      </section>

      {/* CTA FINAL */}
      <section className="px-6 md:px-12 pb-32 max-w-3xl mx-auto text-center">
        <div className="border-t border-[var(--border)] pt-16">
          <p className="text-[var(--foreground-muted)] text-xs uppercase tracking-widest mb-6">
            Pronto para começar?
          </p>
          <h2 className="font-serif text-4xl mb-4">
            Experimente gratuitamente.
            <br />
            <em className="text-[var(--gold)]">Decida depois.</em>
          </h2>
          <p className="text-[var(--foreground-secondary)] text-sm mb-10 max-w-md mx-auto">
            Cada ferramenta tem 1 uso gratuito. Sem cartão de crédito. Sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ferramentas"
              className="border border-[var(--border)] text-[var(--foreground-muted)] px-10 py-4 text-[11px] uppercase font-bold tracking-[0.3em] hover:border-[var(--foreground-muted)] transition-all"
            >
              Explorar ferramentas
            </Link>
            <CheckoutButton className="bg-[var(--gold)] text-black px-10 py-4 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-white transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2" />
          </div>
        </div>
      </section>
    </main>
  );
}

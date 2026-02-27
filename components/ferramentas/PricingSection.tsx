"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Crown,
  Check,
  X,
  ArrowRight,
  Download,
  History,
  Share2,
  Zap,
  Loader2,
  CheckCircle,
  Calculator,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { useToolAccess } from "@/hooks/useToolAccess";
import { getFreeTierFeatures, getProTierFeatures } from "@/app/ferramentas/pricing-data";

type BillingPeriod = "monthly" | "annual";

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

function BillingToggle({
  billing,
  onChange,
  tr,
}: {
  billing: BillingPeriod;
  onChange: (b: BillingPeriod) => void;
  tr: ReturnType<typeof createTranslator>;
}) {
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      <span
        className={`text-sm font-medium transition-colors ${
          billing === "monthly" ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"
        }`}
      >
        {tr("Mensal", "Monthly", "Mensual")}
      </span>
      <button
        onClick={() => onChange(billing === "monthly" ? "annual" : "monthly")}
        className="relative w-14 h-7 rounded-full bg-[var(--background-card)] border border-[var(--border)] transition-colors hover:border-[var(--gold)]/40"
        aria-label={tr("Alternar período", "Toggle period", "Alternar período")}
      >
        <div
          className={`absolute top-0.5 w-6 h-6 rounded-full bg-[var(--gold)] transition-transform ${
            billing === "annual" ? "translate-x-7" : "translate-x-0.5"
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${
          billing === "annual" ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"
        }`}
      >
        {tr("Anual", "Annual", "Anual")}
      </span>
      {billing === "annual" && (
        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
          {tr("-17%", "-17%", "-17%")}
        </span>
      )}
    </div>
  );
}

function ProSubscribeButton({
  className,
  billing = "monthly",
}: {
  className?: string;
  billing?: BillingPeriod;
}) {
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
      const res = await fetch("/api/tools/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing }),
      });
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

function CheckoutFeedbackInner() {
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

export function CheckoutFeedback() {
  return (
    <Suspense fallback={null}>
      <CheckoutFeedbackInner />
    </Suspense>
  );
}

export function ProBannerSection() {
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

export default function PricingSection() {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const freeTierFeatures = getFreeTierFeatures(tr);
  const proTierFeatures = getProTierFeatures(tr);
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  const price = billing === "annual" ? "4,16" : "4,99";
  const priceLabel = billing === "annual" ? tr("49,90€/ano", "€49.90/year", "49,90€/año") : null;

  return (
    <>
      <section className="px-6 pb-24" id="precos">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <AnimateOnScroll className="text-center mb-8">
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

          {/* Billing toggle */}
          <BillingToggle billing={billing} onChange={setBilling} tr={tr} />

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
                    {price}
                  </span>
                  <span className="text-[var(--foreground-muted)] text-lg">
                    {t.ferramentas.per_month}
                  </span>
                </div>
                {priceLabel && (
                  <p className="text-[var(--foreground-muted)] text-xs mt-0.5">
                    {tr("Facturado como", "Billed as", "Facturado como")} {priceLabel}
                  </p>
                )}
                <p className="text-emerald-400 text-sm font-semibold mt-1 flex items-center gap-1.5 justify-center">
                  <Check size={14} />
                  {t.ferramentas.cancel_anytime} •{" "}
                  {tr("Sem fidelização", "No lock-in", "Sin fidelización")}
                </p>

                {/* Savings callout */}
                <div className="mt-4 px-4 py-2.5 bg-[var(--gold)]/8 border border-[var(--gold)]/20 rounded-lg text-center">
                  <p className="text-xs text-[var(--gold)] font-semibold">
                    {billing === "annual"
                      ? tr(
                          "Poupa 10€ por ano + €200 vs. avaliação profissional",
                          "Save €10 per year + €200 vs. professional assessment",
                          "Ahorra 10€ al año + €200 vs. evaluación profesional"
                        )
                      : tr(
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

              <ProSubscribeButton
                billing={billing}
                className="block w-full py-4 text-center bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black text-sm font-bold rounded-lg hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all hover:shadow-xl hover:shadow-[var(--gold)]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              />
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
                {billing === "annual"
                  ? tr(
                      "Portal Lusitano PRO: 49,90€/ano",
                      "Portal Lusitano PRO: €49.90/year",
                      "Portal Lusitano PRO: 49,90€/año"
                    )
                  : tr(
                      "Portal Lusitano PRO: 4,99€/mês = 59,88€/ano",
                      "Portal Lusitano PRO: €4.99/month = €59.88/year",
                      "Portal Lusitano PRO: 4,99€/mes = 59,88€/año"
                    )}
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
                <ProSubscribeButton
                  billing={billing}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black text-sm font-bold rounded-lg hover:from-[#D4B068] hover:to-[#E8D5A3] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
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
    </>
  );
}

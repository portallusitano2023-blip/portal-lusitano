"use client";

import { useMemo } from "react";
import {
  Star,
  Check,
  GitBranch,
  Activity,
  TrendingUp,
  TrendingDown,
  FileCheck,
  Users,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import Tooltip from "@/components/tools/Tooltip";
import { MERCADOS } from "./data";
import type { FormData, StepProps } from "./types";

export default function StepReproducaoMercado({ form, update }: StepProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const trendOptions = useMemo(
    () => [
      { value: "alta", label: t.calculadora.trend_up, icon: TrendingUp, desc: "+12%" },
      { value: "estavel", label: t.calculadora.trend_stable, icon: Activity, desc: "\u00B10%" },
      { value: "baixa", label: t.calculadora.trend_down, icon: TrendingDown, desc: "-12%" },
    ],
    [t]
  );

  return (
    <section className="space-y-6">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium rounded-full mb-3">
          <Star size={12} />
          {t.calculadora.step5_badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif">{t.calculadora.step5_title}</h2>
        <p className="text-[var(--foreground-muted)] text-sm mt-2">{t.calculadora.step5_desc}</p>
      </div>

      <div className="space-y-6">
        {form.sexo !== "castrado" && (
          <div className="p-5 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="text-[var(--gold)]" size={20} />
              <h3 className="text-sm font-medium text-[var(--foreground-secondary)]">
                {t.calculadora.repro_value}
              </h3>
            </div>

            <button
              onClick={() => update("reproducao", !form.reproducao)}
              className={`w-full py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 mb-4 ${
                form.reproducao
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
              }`}
            >
              {form.reproducao && <Check size={16} />}
              {form.sexo === "garanhao"
                ? t.calculadora.approved_stallion
                : t.calculadora.approved_mare}
            </button>

            {form.reproducao && (
              <div className="grid grid-cols-2 gap-4 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
                <div>
                  <label className="block text-xs text-[var(--foreground-muted)] mb-2">
                    {t.calculadora.label_registered_offspring}
                  </label>
                  <input
                    type="number"
                    value={form.descendentes}
                    onChange={(e) => update("descendentes", Math.max(0, Number(e.target.value)))}
                    min={0}
                    className="w-full bg-transparent border border-[var(--border)] rounded-lg py-2 px-3 focus:border-[var(--gold)] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--foreground-muted)] mb-2">
                    {t.calculadora.label_approved_offspring}
                  </label>
                  <input
                    type="number"
                    value={form.descendentesAprovados}
                    onChange={(e) =>
                      update("descendentesAprovados", Math.max(0, Number(e.target.value)))
                    }
                    min={0}
                    className="w-full bg-transparent border border-[var(--border)] rounded-lg py-2 px-3 focus:border-[var(--gold)] outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_target_market}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {MERCADOS.map((m) => {
              const pct = Math.round((m.mult - 1) * 100);
              const badgeLabel = pct > 0 ? `+${pct}%` : pct < 0 ? `${pct}%` : "base";
              const badgeType = pct > 0 ? "pos" : pct < 0 ? "neg" : "base";
              return (
                <button
                  key={m.value}
                  onClick={() => update("mercado", m.value)}
                  className={`py-2 px-2 rounded-lg border text-xs sm:text-sm transition-all min-h-[44px] leading-tight flex flex-col items-center gap-0.5 ${
                    form.mercado === m.value
                      ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                      : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
                  }`}
                >
                  <span>{m.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      badgeType === "pos"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : badgeType === "neg"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-white/10 text-white/50"
                    }`}
                  >
                    {badgeLabel}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">
            {t.calculadora.market_influence}
          </p>
        </div>

        <div>
          <label className="block text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
            {t.calculadora.label_market_trend}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {trendOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("tendencia", opt.value as FormData["tendencia"])}
                className={`py-4 px-4 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                  form.tendencia === opt.value
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
                }`}
              >
                <opt.icon size={20} />
                <span>{opt.label}</span>
                <span className="text-xs text-[var(--foreground-muted)]">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-[var(--background-secondary)] grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Certificado de exportação */}
          <div className="p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="text-[var(--gold)]" size={18} />
              <h3 className="text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider">
                {tr(
                  "Certificado de Exportação",
                  "Export Certificate",
                  "Certificado de Exportación"
                )}
              </h3>
              <Tooltip
                text={tr(
                  "Documento que permite a exportação legal do cavalo. Facilita vendas internacionais e valoriza o cavalo em mercados estrangeiros.",
                  "Document that enables legal export of the horse. Facilitates international sales and increases value in foreign markets.",
                  "Documento que permite la exportación legal del caballo. Facilita ventas internacionales y valoriza el caballo en mercados extranjeros."
                )}
                position="top"
              />
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400">
                +6%
              </span>
            </div>
            <button
              onClick={() =>
                update("certificadoExportacao", !(form.certificadoExportacao ?? false))
              }
              className={`w-full py-2.5 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                form.certificadoExportacao
                  ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground-secondary)]"
              }`}
            >
              {form.certificadoExportacao && <Check size={14} />}
              {form.certificadoExportacao
                ? tr("Com certificado", "With certificate", "Con certificado")
                : tr("Sem certificado", "Without certificate", "Sin certificado")}
            </button>
            <p className="text-xs text-[var(--foreground-muted)] mt-2">
              {tr(
                "+6% — facilita venda internacional",
                "+6% — facilitates international sales",
                "+6% — facilita venta internacional"
              )}
            </p>
          </div>

          {/* Proprietários anteriores */}
          <div className="p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Users className="text-[var(--gold)]" size={18} />
              <h3 className="text-xs font-medium text-[var(--foreground-secondary)] uppercase tracking-wider">
                {tr("Proprietários Anteriores", "Previous Owners", "Propietarios Anteriores")}
              </h3>
              <Tooltip
                text={tr(
                  "Número de proprietários anteriores. Menos proprietários sugere estabilidade e valoriza o cavalo.",
                  "Number of previous owners. Fewer owners suggests stability and increases value.",
                  "Número de propietarios anteriores. Menos propietarios sugiere estabilidad y valoriza el caballo."
                )}
                position="top"
              />
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[0, 1, 2, 3].map((n) => {
                const ownerBadge = n === 0 ? "+5%" : n === 1 ? "base" : n === 2 ? "−5%" : "−12%";
                const ownerType = n === 0 ? "pos" : n === 1 ? "base" : "neg";
                return (
                  <button
                    key={n}
                    onClick={() => update("proprietariosAnteriores", n)}
                    className={`py-2 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-0.5 ${
                      (form.proprietariosAnteriores ?? 0) === n
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                        : "border-[var(--border)] text-[var(--foreground-secondary)]"
                    }`}
                  >
                    <span>{n === 3 ? "3+" : n}</span>
                    <span
                      className={`text-[9px] px-1 py-0.5 rounded-full font-medium ${
                        ownerType === "pos"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : ownerType === "neg"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-white/10 text-white/50"
                      }`}
                    >
                      {ownerBadge}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-2">
              {tr(
                "0 prop. = +5% | 3+ prop. = −12%",
                "0 owners = +5% | 3+ owners = −12%",
                "0 prop. = +5% | 3+ prop. = −12%"
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

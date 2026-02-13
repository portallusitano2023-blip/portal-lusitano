"use client";

import { useLanguage } from "@/context/LanguageContext";
import type {
  Cavalo,
  ResultadoCompatibilidade,
} from "@/components/verificador-compatibilidade/types";

interface PhysicalMatchProps {
  garanhao: Cavalo;
  egua: Cavalo;
  resultado: ResultadoCompatibilidade;
}

// ── Helpers ────────────────────────────────────────────────────────────

interface BarData {
  labelKey: "physical_match_height" | "physical_match_conformation" | "physical_match_gaits";
  value: number; // 0-100
  detail: string; // e.g. "3 cm"
  classKey: string; // translation key for classification
  color: string; // tailwind-safe hex
}

function computeBars(garanhao: Cavalo, egua: Cavalo, v: Record<string, string>): BarData[] {
  const heightDiff = Math.abs(garanhao.altura - egua.altura);
  const heightScore = heightDiff <= 5 ? 100 : heightDiff <= 10 ? 70 : 40;
  const heightClass =
    heightDiff <= 5
      ? v.physical_match_ideal
      : heightDiff <= 10
        ? v.physical_match_acceptable
        : v.physical_match_divergent;
  const heightColor = heightDiff <= 5 ? "#22c55e" : heightDiff <= 10 ? "#f59e0b" : "#ef4444";

  const confAvg = (garanhao.conformacao + egua.conformacao) / 2;
  const confScore = Math.round((confAvg / 10) * 100);
  const confClass =
    confAvg >= 8
      ? v.physical_match_excellent
      : confAvg >= 6
        ? v.physical_match_good
        : v.physical_match_moderate;
  const confColor = confAvg >= 8 ? "#22c55e" : confAvg >= 6 ? "#f59e0b" : "#ef4444";

  const gaitsAvg = (garanhao.andamentos + egua.andamentos) / 2;
  const gaitsScore = Math.round((gaitsAvg / 10) * 100);
  const gaitsClass =
    gaitsAvg >= 8
      ? v.physical_match_excellent
      : gaitsAvg >= 6
        ? v.physical_match_good
        : v.physical_match_moderate;
  const gaitsColor = gaitsAvg >= 8 ? "#22c55e" : gaitsAvg >= 6 ? "#f59e0b" : "#ef4444";

  return [
    {
      labelKey: "physical_match_height",
      value: heightScore,
      detail: `${heightDiff} cm`,
      classKey: heightClass,
      color: heightColor,
    },
    {
      labelKey: "physical_match_conformation",
      value: confScore,
      detail: `${confAvg.toFixed(1)}/10`,
      classKey: confClass,
      color: confColor,
    },
    {
      labelKey: "physical_match_gaits",
      value: gaitsScore,
      detail: `${gaitsAvg.toFixed(1)}/10`,
      classKey: gaitsClass,
      color: gaitsColor,
    },
  ];
}

// ── Component ──────────────────────────────────────────────────────────

export default function PhysicalMatch({ garanhao, egua }: PhysicalMatchProps) {
  const { t } = useLanguage();
  const v = t.verificador as Record<string, string>;
  const bars = computeBars(garanhao, egua, v);

  return (
    <div
      className="rounded-xl border border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--background-card,#111)] p-5 space-y-5"
      role="region"
      aria-label={v.physical_match_title}
    >
      <h3 className="text-base font-serif font-semibold text-[var(--foreground,#ededed)]">
        {v.physical_match_title}
      </h3>

      <div className="space-y-4">
        {bars.map((bar) => (
          <div key={bar.labelKey} className="space-y-1.5">
            {/* Label row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--foreground-secondary,#a1a1aa)]">
                  {v[bar.labelKey]}
                </span>
                <span className="text-xs tabular-nums text-[var(--foreground-muted,#71717a)]">
                  ({bar.detail})
                </span>
              </div>
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  color: bar.color,
                  backgroundColor: `${bar.color}18`,
                }}
              >
                {bar.classKey}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${bar.value}%`,
                  backgroundColor: bar.color,
                  boxShadow: `0 0 8px ${bar.color}40`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

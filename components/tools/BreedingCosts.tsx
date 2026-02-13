"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Cavalo } from "@/components/verificador-compatibilidade/types";

interface BreedingCostsProps {
  garanhao: Cavalo;
  egua: Cavalo;
}

// ── Stud fee lookup ───────────────────────────────────────────────────

const STUD_FEES: Record<string, number> = {
  desconhecida: 500,
  comum: 800,
  registada: 1200,
  certificada: 1800,
  premium: 2500,
  elite: 3000,
};

// ── Icon paths (simple SVG) ───────────────────────────────────────────

const ICON_PATHS: Record<string, string> = {
  heart:
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  stethoscope:
    "M6 12a4 4 0 004 4h0a4 4 0 004-4V4M6 4v1a2 2 0 002 2h0a2 2 0 002-2V4M18 16v2a4 4 0 01-4 4h0a4 4 0 01-4-4M18 12a2 2 0 100-4 2 2 0 000 4z",
  baby: "M12 2a4 4 0 014 4v1a4 4 0 01-8 0V6a4 4 0 014-4zM5 20a7 7 0 0114 0",
  calendar:
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
};

function PhaseIcon({ type, size = 20 }: { type: string; size?: number }) {
  const d = ICON_PATHS[type] || ICON_PATHS.heart;
  const isFilled = type === "heart" || type === "baby";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

// ── Currency formatter ────────────────────────────────────────────────

function formatEUR(value: number): string {
  return value.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

// ── Main component ────────────────────────────────────────────────────

export default function BreedingCosts({ garanhao }: BreedingCostsProps) {
  const { t } = useLanguage();
  const v = t.verificador;

  const studFee = STUD_FEES[garanhao.linhagem.toLowerCase()] ?? 1500;

  const phases = [
    { nameKey: "breeding_costs_stud_fee" as const, cost: studFee, icon: "heart" },
    { nameKey: "breeding_costs_vet" as const, cost: 1500, icon: "stethoscope" },
    { nameKey: "breeding_costs_birth" as const, cost: 800, icon: "baby" },
    { nameKey: "breeding_costs_first_6m" as const, cost: 3000, icon: "calendar" },
    { nameKey: "breeding_costs_6_12m" as const, cost: 2500, icon: "trending" },
  ];

  const total = phases.reduce((sum, p) => sum + p.cost, 0);

  // Cumulative costs at each step
  let cumulative = 0;
  const phasesWithCumulative = phases.map((p) => {
    cumulative += p.cost;
    return { ...p, cumulative };
  });

  return (
    <div
      className="rounded-xl border border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--background-card,#111)] p-5 space-y-5"
      role="region"
      aria-label={v.breeding_costs_title}
    >
      <h3 className="text-base font-serif font-semibold text-[var(--foreground,#ededed)]">
        {v.breeding_costs_title}
      </h3>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical connector line */}
        <div
          className="absolute left-[15px] top-3 bottom-3 w-px"
          style={{ background: "var(--border, rgba(255,255,255,0.1))" }}
        />

        <div className="space-y-0">
          {phasesWithCumulative.map((phase) => (
            <div key={phase.nameKey} className="relative flex items-start gap-4 pb-5 last:pb-0">
              {/* Icon circle */}
              <div
                className="absolute -left-8 top-0.5 w-[30px] h-[30px] rounded-full flex items-center justify-center z-10 shrink-0"
                style={{
                  background: "var(--background-card, #111)",
                  border: "2px solid var(--border, rgba(255,255,255,0.15))",
                  color: "var(--gold, #C5A059)",
                }}
              >
                <PhaseIcon type={phase.icon} size={14} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-[var(--foreground-secondary,#a1a1aa)]">
                    {(v as Record<string, string>)[phase.nameKey]}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-[var(--foreground,#ededed)]">
                    {formatEUR(phase.cost)}
                  </span>
                </div>

                {/* Cumulative bar */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(phase.cumulative / total) * 100}%`,
                        background:
                          "linear-gradient(90deg, var(--gold, #C5A059)80, var(--gold, #C5A059))",
                      }}
                    />
                  </div>
                  <span className="text-[10px] tabular-nums text-[var(--foreground-muted,#71717a)] whitespace-nowrap">
                    {v.breeding_costs_cumulative}: {formatEUR(phase.cumulative)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-lg"
        style={{
          background: "rgba(197,160,89,0.08)",
          border: "1px solid rgba(197,160,89,0.2)",
        }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--gold, #C5A059)" }}>
          {v.breeding_costs_total}
        </span>
        <span
          className="text-lg font-serif font-bold tabular-nums"
          style={{ color: "var(--gold, #C5A059)" }}
        >
          {formatEUR(total)}
        </span>
      </div>
    </div>
  );
}

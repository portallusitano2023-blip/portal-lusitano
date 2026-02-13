"use client";

import { useLanguage } from "@/context/LanguageContext";
import type {
  Cavalo,
  ResultadoCompatibilidade,
} from "@/components/verificador-compatibilidade/types";

interface MatingScenariosProps {
  garanhao: Cavalo;
  egua: Cavalo;
  resultado: ResultadoCompatibilidade;
}

// ── Scenario ring (small SVG) ─────────────────────────────────────────

function ScenarioRing({
  value,
  size = 64,
  accentColor,
}: {
  value: number;
  size?: number;
  accentColor: string;
}) {
  const sw = 5;
  const r = (size - sw) / 2 - 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(value, 100) / 100);

  return (
    <svg width={size} height={size} className="block mx-auto">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={sw}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={accentColor}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          transition: "stroke-dashoffset 1s ease",
          filter: `drop-shadow(0 0 6px ${accentColor}40)`,
        }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={size * 0.26}
        fontWeight={700}
        fontFamily="system-ui, sans-serif"
      >
        {Math.round(value)}
      </text>
    </svg>
  );
}

// ── Delta badge ───────────────────────────────────────────────────────

function DeltaBadge({ delta, vsLabel }: { delta: number; vsLabel: string }) {
  if (delta === 0) return null;
  const isPositive = delta > 0;
  const color = isPositive ? "#22c55e" : "#ef4444";

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: `${color}15` }}
    >
      {isPositive ? "+" : ""}
      {delta} {vsLabel}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────

export default function MatingScenarios({ garanhao, egua, resultado }: MatingScenariosProps) {
  const { t } = useLanguage();
  const v = t.verificador;

  // Scenario 1: Current
  const score1 = resultado.score;

  // Scenario 2: If COI were 3%
  const coiDelta = resultado.coi - 3;
  const scoreBonus2 = coiDelta > 0 ? Math.round(coiDelta * 3) : 0;
  const score2 = Math.min(100, resultado.score + scoreBonus2);

  // Scenario 3: If both APSL approved
  const approvalBonus = (!garanhao.aprovado ? 8 : 0) + (!egua.aprovado ? 8 : 0);
  const score3 = Math.min(100, resultado.score + approvalBonus);

  const scenarios = [
    {
      name: v.scenarios_current,
      score: score1,
      delta: 0,
      color: "#a1a1aa",
      factors: [`COI: ${resultado.coi.toFixed(1)}%`, `BLUP: ${resultado.blup}`],
    },
    {
      name: v.scenarios_low_coi,
      score: score2,
      delta: score2 - score1,
      color: score2 > score1 ? "#22c55e" : "#a1a1aa",
      factors: ["COI: 3.0%", `BLUP: ${resultado.blup}`],
    },
    {
      name: v.scenarios_both_approved,
      score: score3,
      delta: score3 - score1,
      color: score3 > score1 ? "#60a5fa" : "#a1a1aa",
      factors: [`COI: ${resultado.coi.toFixed(1)}%`, "APSL: 2/2"],
    },
  ];

  return (
    <div
      className="rounded-xl border border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--background-card,#111)] p-5 space-y-5"
      role="region"
      aria-label={v.scenarios_title}
    >
      <h3 className="text-base font-serif font-semibold text-[var(--foreground,#ededed)]">
        {v.scenarios_title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scenarios.map((sc, i) => (
          <div
            key={i}
            className="rounded-lg p-4 flex flex-col items-center gap-3 border"
            style={{
              borderColor: i === 0 ? "var(--border, rgba(255,255,255,0.1))" : `${sc.color}30`,
              background: i === 0 ? "var(--background-secondary, #0a0a0a)" : `${sc.color}08`,
            }}
          >
            {/* Scenario name */}
            <span className="text-xs font-semibold text-[var(--foreground-secondary,#a1a1aa)] uppercase tracking-wider text-center">
              {sc.name}
            </span>

            {/* Ring */}
            <ScenarioRing value={sc.score} accentColor={sc.color} />

            {/* Key factors */}
            <div className="flex flex-col items-center gap-1 text-[11px] text-[var(--foreground-muted,#71717a)]">
              {sc.factors.map((f, fi) => (
                <span key={fi} className="tabular-nums">
                  {f}
                </span>
              ))}
            </div>

            {/* Delta badge */}
            <DeltaBadge delta={sc.delta} vsLabel={v.scenarios_vs_current} />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useLanguage } from "@/context/LanguageContext";
import type {
  Cavalo,
  ResultadoCompatibilidade,
} from "@/components/verificador-compatibilidade/types";

interface GeneticSummaryProps {
  garanhao: Cavalo;
  egua: Cavalo;
  resultado: ResultadoCompatibilidade;
}

// ── Small score ring (SVG) ────────────────────────────────────────────

function MiniRing({ value, size = 52 }: { value: number; size?: number }) {
  const sw = 4;
  const r = (size - sw) / 2 - 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  const color =
    value >= 70 ? "#22c55e" : value >= 50 ? "#C5A059" : value >= 30 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} className="block">
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
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={size * 0.28}
        fontWeight={700}
        fontFamily="system-ui, sans-serif"
      >
        {Math.round(value)}
      </text>
    </svg>
  );
}

// ── Horse card (left / right) ──────────────────────────────────────────

function HorseCard({
  cavalo,
  approvedLabel,
  notApprovedLabel,
}: {
  cavalo: Cavalo;
  approvedLabel: string;
  notApprovedLabel: string;
}) {
  return (
    <div className="bg-[var(--background-card,#111)]/50 rounded-lg p-4 border border-[var(--border,rgba(255,255,255,0.1))] flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg" aria-hidden="true">
          {cavalo.sexo === "Garanhão" ? "\u2642" : "\u2640"}
        </span>
        <span className="text-sm font-serif font-semibold text-[var(--foreground,#ededed)] truncate">
          {cavalo.nome}
        </span>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-[var(--foreground-muted,#71717a)]">BLUP</span>
          <span className="font-semibold tabular-nums text-[var(--foreground,#ededed)]">
            {cavalo.blup}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--foreground-muted,#71717a)]">COI</span>
          <span className="font-semibold tabular-nums text-[var(--foreground,#ededed)]">
            {cavalo.coi.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--foreground-muted,#71717a)]">Pelagem</span>
          <span className="font-medium text-[var(--foreground-secondary,#a1a1aa)]">
            {cavalo.pelagem}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-2">
        <span
          className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            cavalo.aprovado
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-white/[0.06] text-[var(--foreground-muted,#71717a)]"
          }`}
        >
          {cavalo.aprovado ? approvedLabel : notApprovedLabel}
        </span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────

export default function GeneticSummary({ garanhao, egua, resultado }: GeneticSummaryProps) {
  const { t } = useLanguage();
  const v = t.verificador;

  const topCoat =
    resultado.pelagens.length > 0
      ? resultado.pelagens.reduce((a, b) => (b.prob > a.prob ? b : a))
      : null;

  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="text-base font-serif font-semibold text-[var(--foreground,#ededed)]">
        {v.genetic_summary_title}
      </h3>

      {/* 3-card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Stallion */}
        <HorseCard
          cavalo={garanhao}
          approvedLabel={v.genetic_summary_approved}
          notApprovedLabel={v.genetic_summary_not_approved}
        />

        {/* Center: Crossing */}
        <div
          className="relative rounded-lg p-4 flex flex-col items-center justify-center gap-3 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(236,72,153,0.08) 100%)",
            border: "1px solid rgba(168,85,247,0.25)",
          }}
        >
          {/* Decorative arrows */}
          <div className="flex items-center gap-2 text-[var(--foreground-muted,#71717a)] text-xs">
            <span aria-hidden="true">&larr;</span>
            <span className="uppercase tracking-widest font-semibold text-[10px] text-purple-400/80">
              {v.genetic_summary_crossing}
            </span>
            <span aria-hidden="true">&rarr;</span>
          </div>

          {/* Score ring */}
          <MiniRing value={resultado.score} size={56} />

          {/* Predicted stats */}
          <div className="space-y-1.5 text-xs w-full">
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted,#71717a)]">
                {v.genetic_summary_predicted_blup}
              </span>
              <span className="font-semibold tabular-nums text-[var(--foreground,#ededed)]">
                {resultado.blup}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted,#71717a)]">
                {v.genetic_summary_predicted_coi}
              </span>
              <span className="font-semibold tabular-nums text-[var(--foreground,#ededed)]">
                {resultado.coi.toFixed(1)}%
              </span>
            </div>
            {topCoat && (
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted,#71717a)]">
                  {v.genetic_summary_dominant_coat}
                </span>
                <span className="font-medium text-[var(--foreground-secondary,#a1a1aa)]">
                  {topCoat.cor} ({Math.round(topCoat.prob)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mare */}
        <HorseCard
          cavalo={egua}
          approvedLabel={v.genetic_summary_approved}
          notApprovedLabel={v.genetic_summary_not_approved}
        />
      </div>
    </div>
  );
}

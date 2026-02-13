"use client";

import { useMemo } from "react";
import { CalendarRange, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Result } from "@/components/analise-perfil/types";

interface FirstYearSimTabProps {
  result: Result;
}

interface Milestone {
  months: number[];
  title: string;
  description: string;
  extra: number;
}

function formatEUR(value: number): string {
  return value.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function FirstYearSimTab({ result }: FirstYearSimTabProps) {
  const { t } = useLanguage();

  const baseMonthlyCost = useMemo(() => {
    if (result.profile === "competidor") return 1800;
    if (result.profile === "criador") return 1200;
    if (result.profile === "tradicional") return 1000;
    return 800;
  }, [result.profile]);

  const milestones: Milestone[] = useMemo(
    () => [
      {
        months: [1],
        title: "Adaptacao",
        description: "Periodo de adaptacao ao novo ambiente",
        extra: 500,
      },
      {
        months: [2],
        title: "Veterinario Inicial",
        description: "Check-up completo, vacinacoes",
        extra: 800,
      },
      {
        months: [3],
        title: "Inicio de Treino",
        description: "Estabelecer rotina de trabalho",
        extra: 200,
      },
      {
        months: [4, 5, 6],
        title: "Desenvolvimento",
        description: "Treino regular, progresso constante",
        extra: 0,
      },
      {
        months: [7],
        title: "Avaliacao",
        description: "Revisao do progresso com treinador",
        extra: 300,
      },
      {
        months: [8, 9],
        title: "Consolidacao",
        description: "Solidificar o trabalho desenvolvido",
        extra: 0,
      },
      { months: [10], title: "Ferrador", description: "Avaliacao semestral de cascos", extra: 150 },
      {
        months: [11, 12],
        title: "Maturacao",
        description: "Preparacao para objectivos do ano seguinte",
        extra: 0,
      },
    ],
    []
  );

  // Build cumulative costs per milestone
  const cumulativeData = useMemo(() => {
    let running = 0;
    return milestones.map((m) => {
      const monthCount = m.months.length;
      const milestoneCost = baseMonthlyCost * monthCount + m.extra;
      running += milestoneCost;
      return {
        ...m,
        milestoneCost,
        cumulative: running,
      };
    });
  }, [milestones, baseMonthlyCost]);

  const totalYear =
    cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].cumulative : 0;

  // SVG area chart data
  const chartWidth = 560;
  const chartHeight = 140;
  const paddingLeft = 50;
  const paddingRight = 16;
  const paddingTop = 10;
  const paddingBottom = 8;
  const usableW = chartWidth - paddingLeft - paddingRight;
  const usableH = chartHeight - paddingTop - paddingBottom;

  const barPoints = useMemo(() => {
    if (cumulativeData.length === 0) return [];
    const max = totalYear * 1.1;
    const barW = usableW / cumulativeData.length;

    return cumulativeData.map((d, i) => ({
      x: paddingLeft + barW * i + barW / 2,
      y: paddingTop + usableH - (d.cumulative / max) * usableH,
      barX: paddingLeft + barW * i + barW * 0.15,
      barW: barW * 0.7,
      barH: (d.cumulative / max) * usableH,
      label:
        d.months.length > 1
          ? `M${d.months[0]}-${d.months[d.months.length - 1]}`
          : `M${d.months[0]}`,
      cumulative: d.cumulative,
    }));
  }, [cumulativeData, totalYear, usableW, usableH]);

  const monthLabel = (months: number[]): string =>
    months.length > 1 ? `Mes ${months[0]}-${months[months.length - 1]}` : `Mes ${months[0]}`;

  return (
    <div className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* Header summary */}
      <div className="bg-gradient-to-b from-[var(--gold)]/10 to-transparent border border-[var(--gold)]/20 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-2">
          <CalendarRange className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.firstyear_title}
        </h3>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Simulacao de custos para os primeiros 12 meses com o perfil {result.title}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)]">
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
              Custo Base Mensal
            </p>
            <p className="text-2xl font-serif font-bold text-[var(--foreground)]">
              {formatEUR(baseMonthlyCost)}
            </p>
          </div>
          <div className="text-center p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)]">
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
              Total 1.o Ano
            </p>
            <p className="text-2xl font-serif font-bold text-[var(--gold)]">
              {formatEUR(totalYear)}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[38px] top-0 bottom-0 w-px"
            style={{ backgroundColor: "var(--border)" }}
            aria-hidden="true"
          />

          <div className="space-y-4">
            {cumulativeData.map((milestone, i) => (
              <div
                key={milestone.title}
                className="relative flex items-start gap-5 pl-2 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Month indicator */}
                <div className="flex-shrink-0 w-[52px] flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center z-10">
                    <span className="text-xs font-bold text-[var(--gold)]">
                      {milestone.months.length > 1
                        ? `${milestone.months[0]}-${milestone.months[milestone.months.length - 1]}`
                        : milestone.months[0]}
                    </span>
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 p-4 bg-[var(--background-card)]/30 border border-[var(--border)]">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <h4 className="text-sm font-medium text-[var(--foreground)]">
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                        {monthLabel(milestone.months)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-serif font-bold text-[var(--foreground)]">
                        {formatEUR(milestone.milestoneCost)}
                      </p>
                      {milestone.extra > 0 && (
                        <p className="text-[10px] text-[var(--foreground-muted)]">
                          (extra: {formatEUR(milestone.extra)})
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--foreground-secondary)]">
                    {milestone.description}
                  </p>
                  <div className="mt-2 pt-2 border-t border-[var(--border)]">
                    <p className="text-xs text-[var(--foreground-muted)]">
                      Acumulado:{" "}
                      <span className="font-medium text-[var(--gold)]">
                        {formatEUR(milestone.cumulative)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cumulative bar chart */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] mb-4">
          <TrendingUp className="text-[var(--gold)]" size={16} />
          Custo Acumulado ao Longo do Ano
        </h3>
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full min-w-[360px]"
            role="img"
            aria-label="Grafico de custo acumulado do primeiro ano"
          >
            <defs>
              <linearGradient id="firstyear-bar-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Bars */}
            {barPoints.map((p, i) => (
              <g key={`bar-${i}`}>
                <rect
                  x={p.barX}
                  y={paddingTop + usableH - p.barH}
                  width={p.barW}
                  height={p.barH}
                  rx={3}
                  fill="url(#firstyear-bar-grad)"
                  style={{
                    opacity: 1,
                    transition: `height 0.6s ease-out ${i * 60}ms, y 0.6s ease-out ${i * 60}ms`,
                  }}
                />
                <text
                  x={p.x}
                  y={chartHeight - 1}
                  textAnchor="middle"
                  className="text-[8px]"
                  fill="var(--foreground-muted)"
                >
                  {p.label}
                </text>
              </g>
            ))}

            {/* End label */}
            {barPoints.length > 0 && (
              <text
                x={barPoints[barPoints.length - 1].x}
                y={barPoints[barPoints.length - 1].y - 6}
                textAnchor="middle"
                className="text-[10px] font-semibold"
                fill="var(--gold)"
              >
                {formatEUR(totalYear)}
              </text>
            )}
          </svg>
        </div>
      </div>

      <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed text-center">
        Valores estimados. Os custos reais variam conforme a regiao, prestador de servicos e
        necessidades do cavalo.
      </p>
    </div>
  );
}

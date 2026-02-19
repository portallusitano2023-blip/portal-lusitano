"use client";

import { useMemo } from "react";

interface HorseSilhouetteProps {
  zones: {
    cabeca?: number;
    pescoco?: number;
    espadua?: number;
    dorso?: number;
    garupa?: number;
    membros?: number;
  };
  size?: number;
  labels?: {
    cabeca?: string;
    pescoco?: string;
    espadua?: string;
    dorso?: string;
    garupa?: string;
    membros?: string;
  };
}

const ZONE_KEYS = ["cabeca", "pescoco", "espadua", "dorso", "garupa", "membros"] as const;
type ZoneKey = (typeof ZONE_KEYS)[number];

const getScoreColor = (score: number): string => {
  if (score >= 8) return "#22c55e";
  if (score >= 6) return "#C5A059";
  if (score >= 4) return "#f59e0b";
  return "#ef4444";
};

const getOverallGrade = (avg: number): { label: string; color: string } => {
  if (avg >= 8.5) return { label: "Excelente", color: "#22c55e" };
  if (avg >= 7) return { label: "Muito Bom", color: "#4ade80" };
  if (avg >= 5.5) return { label: "Bom", color: "#C5A059" };
  if (avg >= 4) return { label: "Regular", color: "#f59e0b" };
  return { label: "Insuficiente", color: "#ef4444" };
};

// Arc geometry for individual ring gauges
const ARC_RADIUS = 32;
const ARC_STROKE = 3;

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function ScoreRing({
  score,
  label,
  cx,
  cy,
}: {
  score: number;
  label: string;
  cx: number;
  cy: number;
}) {
  const color = getScoreColor(score);
  const angle = (score / 10) * 270; // 270° max sweep
  const startAngle = -135; // start from bottom-left

  return (
    <g>
      {/* Background track */}
      <path
        d={describeArc(cx, cy, ARC_RADIUS, startAngle, startAngle + 270)}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={ARC_STROKE}
        strokeLinecap="round"
      />
      {/* Score arc */}
      {score > 0 && (
        <path
          d={describeArc(cx, cy, ARC_RADIUS, startAngle, startAngle + angle)}
          fill="none"
          stroke={color}
          strokeWidth={ARC_STROKE}
          strokeLinecap="round"
          strokeOpacity={0.8}
        />
      )}
      {/* Score number */}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize={16}
        fontWeight="300"
        fontFamily="Georgia, serif"
      >
        {score}
      </text>
      {/* Zone label */}
      <text
        x={cx}
        y={cy + ARC_RADIUS + 16}
        textAnchor="middle"
        fill="rgba(255,255,255,0.45)"
        fontSize={10}
        fontFamily="Georgia, serif"
        letterSpacing="0.03em"
      >
        {label}
      </text>
    </g>
  );
}

export default function HorseSilhouette({ zones, size = 380, labels = {} }: HorseSilhouetteProps) {
  const zoneLabels: Record<ZoneKey, string> = {
    cabeca: labels.cabeca || "Cabeça",
    pescoco: labels.pescoco || "Pescoço",
    espadua: labels.espadua || "Espádua",
    dorso: labels.dorso || "Dorso",
    garupa: labels.garupa || "Garupa",
    membros: labels.membros || "Membros",
  };

  const scores = useMemo<Record<ZoneKey, number>>(
    () => ({
      cabeca: zones.cabeca ?? 5,
      pescoco: zones.pescoco ?? zones.cabeca ?? 5,
      espadua: zones.espadua ?? 5,
      dorso: zones.dorso ?? 5,
      garupa: zones.garupa ?? 5,
      membros: zones.membros ?? 5,
    }),
    [zones.cabeca, zones.pescoco, zones.espadua, zones.dorso, zones.garupa, zones.membros]
  );

  const avg = useMemo(() => {
    const vals = ZONE_KEYS.map((k) => scores[k]);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [scores]);

  const grade = getOverallGrade(avg);

  // Grid layout: 3 columns × 2 rows of rings
  const cols = 3;
  const cellW = 100;
  const cellH = 100;
  const gridW = cols * cellW;
  const gridTop = 80; // space for overall score at top
  const totalH = gridTop + 2 * cellH + 30;
  const totalW = gridW;

  const ringPositions = ZONE_KEYS.map((key, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = col * cellW + cellW / 2;
    const cy = gridTop + row * cellH + cellH / 2 - 6;
    return { key, cx, cy };
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size * (totalH / totalW)}
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="select-none w-full max-w-[380px]"
        style={{ height: "auto" }}
      >
        {/* Overall score */}
        <text
          x={totalW / 2}
          y={24}
          textAnchor="middle"
          fill={grade.color}
          fontSize={28}
          fontWeight="300"
          fontFamily="Georgia, serif"
        >
          {avg.toFixed(1)}
        </text>
        <text
          x={totalW / 2}
          y={44}
          textAnchor="middle"
          fill={grade.color}
          fillOpacity={0.6}
          fontSize={9}
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.15em"
        >
          {grade.label.toUpperCase()}
        </text>

        {/* Thin separator line */}
        <line
          x1={totalW / 2 - 40}
          y1={58}
          x2={totalW / 2 + 40}
          y2={58}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={0.5}
        />

        {/* Score rings */}
        {ringPositions.map(({ key, cx, cy }) => (
          <ScoreRing key={key} score={scores[key]} label={zoneLabels[key]} cx={cx} cy={cy} />
        ))}
      </svg>
    </div>
  );
}

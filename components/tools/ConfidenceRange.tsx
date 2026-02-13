"use client";

import { useLanguage } from "@/context/LanguageContext";

interface ConfidenceRangeProps {
  value: number;
  min: number;
  max: number;
  confidence: number;
  unit?: string;
  label?: string;
  explanation?: string;
}

export default function ConfidenceRange({
  value,
  min,
  max,
  confidence,
  unit = "€",
  label,
  explanation,
}: ConfidenceRangeProps) {
  const { t } = useLanguage();
  const common = t.common as Record<string, string>;

  const range = max - min;
  if (range <= 0) return null;

  const valuePos = ((value - min) / range) * 100;
  // Central zone: confidence determines width of "strong" band
  const bandHalf = (confidence / 100) * 40; // max 40% each side
  const bandLeft = Math.max(valuePos - bandHalf, 0);
  const bandRight = Math.min(valuePos + bandHalf, 100);

  const confColor =
    confidence >= 70 ? "bg-emerald-500" : confidence >= 40 ? "bg-[var(--gold)]" : "bg-amber-500";

  const confLabel = common?.confidence_range_label ?? "Intervalo de confiança";

  const fmt = (n: number) =>
    unit === "€" ? n.toLocaleString("pt-PT") + unit : n.toLocaleString("pt-PT") + (unit || "");

  return (
    <div className="space-y-2">
      {label && <p className="text-xs text-[var(--foreground-muted)] font-medium">{label}</p>}

      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        {/* Full range bar (light) */}
        <div className="absolute inset-0 bg-white/[0.03] rounded-full" />

        {/* Confidence band */}
        <div
          className={`absolute top-0 h-full ${confColor}/30 rounded-full`}
          style={{ left: `${bandLeft}%`, width: `${bandRight - bandLeft}%` }}
        />

        {/* Value marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-lg"
          style={{
            left: `${valuePos}%`,
            transform: `translate(-50%, -50%)`,
            backgroundColor: "var(--gold)",
          }}
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex items-center justify-between text-[10px] text-[var(--foreground-muted)]/60">
        <span>{fmt(min)}</span>
        <span className="text-[var(--foreground-secondary)] font-medium">{fmt(value)}</span>
        <span>{fmt(max)}</span>
      </div>

      {/* Confidence line */}
      <p className="text-[10px] text-[var(--foreground-muted)] leading-relaxed">
        {confLabel}: {confidence}%{explanation && <span> — {explanation}</span>}
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";

type SourceType = "APSL" | "FEI" | "mercado" | "veterinário" | "modelo";

interface SourceBadgeProps {
  source: SourceType;
  tooltip?: string;
}

const styles: Record<SourceType, { bg: string; text: string }> = {
  APSL: { bg: "bg-[var(--gold)]/15", text: "text-[var(--gold)]" },
  FEI: { bg: "bg-blue-500/15", text: "text-blue-400" },
  mercado: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  modelo: { bg: "bg-purple-500/15", text: "text-purple-400" },
  veterinário: { bg: "bg-rose-500/15", text: "text-rose-400" },
};

export default function SourceBadge({ source, tooltip }: SourceBadgeProps) {
  const [visible, setVisible] = useState(false);
  const s = styles[source];

  return (
    <span className="relative inline-flex items-center">
      <span
        className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded cursor-default ${s.bg} ${s.text}`}
        onMouseEnter={() => tooltip && setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        role={tooltip ? "button" : undefined}
        tabIndex={tooltip ? 0 : undefined}
        onFocus={() => tooltip && setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {source}
      </span>
      {visible && tooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 pointer-events-none">
          <span className="block bg-[var(--background-card)] border border-[var(--border)] text-[var(--foreground-secondary)] text-[10px] px-2.5 py-1.5 rounded-lg shadow-lg max-w-[240px] whitespace-normal leading-relaxed">
            {tooltip}
          </span>
        </span>
      )}
    </span>
  );
}

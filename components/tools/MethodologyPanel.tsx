"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, AlertCircle, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MethodologyFactor {
  name: string;
  weight: string;
  description: string;
  standard?: string;
}

interface MethodologyPanelProps {
  title: string;
  factors: MethodologyFactor[];
  limitations: string[];
  version: string;
  references: string[];
}

const standardColors: Record<string, { bg: string; text: string }> = {
  APSL: { bg: "bg-[var(--gold)]/15", text: "text-[var(--gold)]" },
  FEI: { bg: "bg-blue-500/15", text: "text-blue-400" },
  mercado: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  modelo: { bg: "bg-purple-500/15", text: "text-purple-400" },
  veterinário: { bg: "bg-rose-500/15", text: "text-rose-400" },
};

export default function MethodologyPanel({
  title,
  factors,
  limitations,
  version,
  references,
}: MethodologyPanelProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const common = t.common as Record<string, string>;
  const howLabel = common?.methodology_how ?? "Como calculámos?";
  const limLabel = common?.methodology_limitations ?? "Limitações";
  const refLabel = common?.methodology_references ?? "Referências";

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-[var(--background-secondary)]/50 hover:bg-[var(--background-secondary)]/80 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--foreground-secondary)]">
          <BookOpen size={16} className="text-[var(--gold)]" />
          {howLabel}
        </span>
        <ChevronDown
          size={16}
          className={`text-[var(--foreground-muted)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 py-5 space-y-5 border-t border-[var(--border)]">
            {/* Title */}
            <h4 className="text-sm font-serif text-[var(--foreground)]">{title}</h4>

            {/* Factors table */}
            <div className="space-y-2">
              {factors.map((f) => (
                <div
                  key={f.name}
                  className="flex items-start gap-3 py-2 border-b border-[var(--border)]/30 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-[110px]">
                    <span className="text-xs font-semibold text-[var(--gold)] tabular-nums w-[38px] text-right">
                      {f.weight}
                    </span>
                    <span className="text-xs font-medium text-[var(--foreground)]">{f.name}</span>
                  </div>
                  <span className="text-[11px] text-[var(--foreground-muted)] leading-relaxed flex-1">
                    {f.description}
                  </span>
                  {f.standard && standardColors[f.standard] && (
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${standardColors[f.standard].bg} ${standardColors[f.standard].text} flex-shrink-0`}
                    >
                      {f.standard}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Limitations */}
            {limitations.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-[var(--foreground-secondary)] flex items-center gap-1.5 mb-2">
                  <AlertCircle size={12} className="text-amber-400" />
                  {limLabel}
                </h5>
                <ul className="space-y-1">
                  {limitations.map((lim, i) => (
                    <li
                      key={i}
                      className="text-[11px] text-[var(--foreground-muted)] leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--foreground-muted)]/40"
                    >
                      {lim}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* References + Version */}
            <div className="flex items-start justify-between gap-4 pt-2 border-t border-[var(--border)]/30">
              <div className="flex-1">
                <h5 className="text-[10px] font-medium text-[var(--foreground-muted)] flex items-center gap-1 mb-1">
                  <FileText size={10} />
                  {refLabel}
                </h5>
                <p className="text-[10px] text-[var(--foreground-muted)]/60 leading-relaxed">
                  {references.join(" · ")}
                </p>
              </div>
              <span className="text-[9px] text-[var(--foreground-muted)]/40 font-mono flex-shrink-0">
                {version}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

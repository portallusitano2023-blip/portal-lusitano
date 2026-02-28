"use client";

import { Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { type ToolUsageRecord, type FilterKey, getToolConfig, getFilterLabels } from "./types";

// ---------------------------------------------------------------------------
// Stats Bar
// ---------------------------------------------------------------------------

interface StatsBarProps {
  records: ToolUsageRecord[];
}

export function StatsBar({ records }: StatsBarProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const toolConfig = getToolConfig(tr);
  const filterLabels = getFilterLabels(tr);

  const total = records.length;

  // Count by tool
  const toolCounts: Record<string, number> = {};
  for (const r of records) {
    const key = toolConfig[r.tool_name]?.filterKey ?? r.tool_name;
    toolCounts[key] = (toolCounts[key] ?? 0) + 1;
  }

  // Most used tool
  let mostUsedKey = "";
  let mostUsedCount = 0;
  for (const [key, count] of Object.entries(toolCounts)) {
    if (count > mostUsedCount) {
      mostUsedKey = key;
      mostUsedCount = count;
    }
  }
  const mostUsed = mostUsedKey ? (filterLabels[mostUsedKey as FilterKey] ?? mostUsedKey) : null;

  // Average compatibility score (verificador)
  const verRecords = records.filter(
    (r) =>
      (r.tool_name === "verificador" || r.tool_name === "compatibilidade") &&
      typeof r.result_data?.compatibilityScore === "number"
  );
  const avgScore =
    verRecords.length > 0
      ? Math.round(
          verRecords.reduce((s, r) => s + (r.result_data?.compatibilityScore as number), 0) /
            verRecords.length
        )
      : null;

  const stats = { total, mostUsed, avgScore };

  return (
    <div className="mt-6 mb-4 grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-[#C5A059]/15 bg-[#C5A059]/5 px-4 py-3 text-center">
        <p className="text-xl font-bold text-[#C5A059]">{stats.total}</p>
        <p className="text-[10px] text-white/40 mt-0.5">
          {tr("análises guardadas", "saved analyses", "análisis guardados")}
        </p>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-center">
        <p className="text-sm font-semibold text-white/80 truncate">{stats.mostUsed ?? "\u2014"}</p>
        <p className="text-[10px] text-white/40 mt-0.5">
          {tr("mais utilizada", "most used", "más utilizada")}
        </p>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-center">
        {stats.avgScore !== null ? (
          <>
            <p className="text-xl font-bold text-white/80">{stats.avgScore}%</p>
            <p className="text-[10px] text-white/40 mt-0.5">
              {tr("score médio compat.", "avg compat. score", "score medio compat.")}
            </p>
          </>
        ) : (
          <>
            <p className="text-xl font-bold text-white/30">{"\u2014"}</p>
            <p className="text-[10px] text-white/40 mt-0.5">
              {tr("score médio compat.", "avg compat. score", "score medio compat.")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter Tabs
// ---------------------------------------------------------------------------

interface FilterTabsProps {
  records: ToolUsageRecord[];
  active: FilterKey;
  onChange: (k: FilterKey) => void;
}

export function FilterTabs({ records, active, onChange }: FilterTabsProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const toolConfig = getToolConfig(tr);
  const filterLabels = getFilterLabels(tr);

  const counts: Record<string, number> = { all: records.length };
  for (const r of records) {
    const key = toolConfig[r.tool_name]?.filterKey;
    if (key) counts[key] = (counts[key] ?? 0) + 1;
  }

  const filters: FilterKey[] = ["all", "calculadora", "comparador", "verificador", "perfil"];
  const available = filters.filter((f) => f === "all" || (counts[f] ?? 0) > 0);

  if (available.length <= 1) return null;

  return (
    <div
      className="flex flex-wrap gap-2 mb-4"
      role="group"
      aria-label={tr("Filtrar por ferramenta", "Filter by tool", "Filtrar por herramienta")}
    >
      {available.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          aria-pressed={active === f}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50 ${
            active === f
              ? "bg-[#C5A059] text-black"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
        >
          <Filter className="h-2.5 w-2.5" aria-hidden="true" />
          {filterLabels[f]}
          {counts[f] !== undefined && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                active === f ? "bg-black/20 text-black" : "bg-white/10 text-white/40"
              }`}
            >
              {counts[f]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton Card
// ---------------------------------------------------------------------------

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[#C5A059]/10 bg-[#111111] p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-full bg-white/5 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-40 rounded bg-white/5" />
          <div className="h-3 w-28 rounded bg-white/5" />
          <div className="h-3 w-52 rounded bg-white/5" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-24 rounded-lg bg-white/5" />
        <div className="h-8 w-28 rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

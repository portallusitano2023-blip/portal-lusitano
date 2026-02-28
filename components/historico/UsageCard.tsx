"use client";

import Link from "next/link";
import { Clock, ChevronRight, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import {
  type ToolUsageRecord,
  type ToolConfigItem,
  getToolConfig,
  extractTopMetric,
  formatDate,
  langToLocale,
  FALLBACK_CONFIG,
} from "./types";

interface UsageCardProps {
  record: ToolUsageRecord;
  onViewDetails: (r: ToolUsageRecord) => void;
}

export default function UsageCard({ record, onViewDetails }: UsageCardProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const locale = langToLocale(language);
  const toolConfig = getToolConfig(tr);

  const config: ToolConfigItem = toolConfig[record.tool_name] ?? {
    label: record.tool_name,
    ...FALLBACK_CONFIG,
  };

  const { Icon } = config;
  const metric = extractTopMetric(toolConfig, record.tool_name, record.result_data, locale);
  const dateStr = formatDate(record.created_at, locale);

  return (
    <article
      className="rounded-xl border border-[#C5A059]/20 bg-[#111111] p-5
                 hover:border-[#C5A059]/50 transition-all duration-200
                 focus-within:border-[#C5A059]/50"
    >
      <div className="flex items-start gap-4">
        {/* Tool icon */}
        <div
          aria-hidden="true"
          className={`flex-shrink-0 h-11 w-11 rounded-full ${config.iconBg} flex items-center justify-center`}
        >
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{config.label}</h3>

          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/40">
            <Clock className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            <time dateTime={record.created_at}>{dateStr}</time>
          </p>

          {metric && (
            <p className="mt-2 text-xs text-white/60">
              <span className="text-white/40">{metric.label}:</span>{" "}
              <span className="text-[#C5A059] font-medium">{metric.value}</span>
            </p>
          )}

          {!metric && (
            <p className="mt-2 text-xs text-white/30 italic">
              {tr(
                "Dados de resultado não disponíveis",
                "Result data not available",
                "Datos de resultado no disponibles"
              )}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(record)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10
                     bg-white/5 px-3 py-1.5 text-xs text-white/60
                     hover:bg-white/10 hover:text-white/80 transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50"
          aria-label={`${tr("Ver detalhes de", "View details of", "Ver detalles de")} ${config.label} ${tr("de", "from", "de")} ${dateStr}`}
        >
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          {tr("Ver detalhes", "View details", "Ver detalles")}
        </button>

        <Link
          href={config.href}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#C5A059]/25
                     bg-[#C5A059]/5 px-3 py-1.5 text-xs text-[#C5A059]
                     hover:bg-[#C5A059]/15 hover:border-[#C5A059]/50 transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50"
          aria-label={`${tr("Repetir análise", "Repeat analysis", "Repetir análisis")}: ${config.label}`}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          {tr("Repetir análise", "Repeat analysis", "Repetir análisis")}
        </Link>
      </div>
    </article>
  );
}

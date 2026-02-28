import { Calculator, BarChart3, Heart, UserCheck } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToolUsageRecord {
  id: string;
  user_id: string;
  tool_name: string;
  form_data: Record<string, unknown> | null;
  result_data: Record<string, unknown> | null;
  created_at: string;
}

export type FilterKey = "all" | "calculadora" | "comparador" | "verificador" | "perfil";

export interface ToolConfigItem {
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  metricKey: string | null;
  metricLabel: string | null;
  metricSuffix: string;
  filterKey: FilterKey;
}

type Tr = (pt: string, en: string, es: string) => string;

// ---------------------------------------------------------------------------
// Tool configuration (i18n)
// ---------------------------------------------------------------------------

export function getToolConfig(tr: Tr): Record<string, ToolConfigItem> {
  const config: Record<string, ToolConfigItem> = {
    calculadora: {
      label: tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor"),
      href: "/calculadora-valor",
      Icon: Calculator,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      metricKey: "estimatedValue",
      metricLabel: tr("Valor estimado", "Estimated value", "Valor estimado"),
      metricSuffix: " \u20AC",
      filterKey: "calculadora",
    },
    comparador: {
      label: tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"),
      href: "/comparador-cavalos",
      Icon: BarChart3,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      metricKey: "winner",
      metricLabel: tr("Melhor cavalo", "Best horse", "Mejor caballo"),
      metricSuffix: "",
      filterKey: "comparador",
    },
    verificador: {
      label: tr(
        "Verificador de Compatibilidade",
        "Compatibility Checker",
        "Verificador de Compatibilidad"
      ),
      href: "/verificador-compatibilidade",
      Icon: Heart,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
      metricKey: "compatibilityScore",
      metricLabel: tr("Score de compatibilidade", "Compatibility score", "Score de compatibilidad"),
      metricSuffix: "%",
      filterKey: "verificador",
    },
    perfil: {
      label: tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil"),
      href: "/analise-perfil",
      Icon: UserCheck,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      metricKey: "profileType",
      metricLabel: tr("Perfil identificado", "Identified profile", "Perfil identificado"),
      metricSuffix: "",
      filterKey: "perfil",
    },
  };
  // Legacy alias for records stored as "compatibilidade"
  config.compatibilidade = config.verificador;
  return config;
}

export function getFilterLabels(tr: Tr): Record<FilterKey, string> {
  return {
    all: tr("Todas", "All", "Todas"),
    calculadora: tr("Calculadora", "Calculator", "Calculadora"),
    comparador: tr("Comparador", "Comparator", "Comparador"),
    verificador: tr("Compatibilidade", "Compatibility", "Compatibilidad"),
    perfil: tr("Perfil", "Profile", "Perfil"),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function langToLocale(language: string): string {
  if (language === "es") return "es-ES";
  if (language === "en") return "en-GB";
  return "pt-PT";
}

export function formatDate(isoString: string, locale: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

export function formatTime(isoString: string, locale: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

export function extractTopMetric(
  toolConfig: Record<string, ToolConfigItem>,
  toolName: string,
  resultData: Record<string, unknown> | null,
  locale: string
): { label: string; value: string } | null {
  if (!resultData) return null;
  const config = toolConfig[toolName];
  if (!config || !config.metricKey) return null;

  const raw = resultData[config.metricKey];
  if (raw === undefined || raw === null) return null;

  let valueStr: string;
  if (typeof raw === "number") {
    valueStr = toolName === "calculadora" ? raw.toLocaleString(locale) : String(Math.round(raw));
  } else {
    valueStr = String(raw);
  }

  return {
    label: config.metricLabel ?? "",
    value: `${valueStr}${config.metricSuffix}`,
  };
}

/** Fallback config for unknown tool names */
export const FALLBACK_CONFIG: Omit<ToolConfigItem, "label"> = {
  href: "/ferramentas",
  Icon: Calculator,
  iconBg: "bg-white/5",
  iconColor: "text-white/50",
  metricKey: null,
  metricLabel: null,
  metricSuffix: "",
  filterKey: "all" as FilterKey,
};

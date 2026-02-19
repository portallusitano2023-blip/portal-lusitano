"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Crown,
  ArrowLeft,
  Calculator,
  BarChart3,
  Heart,
  UserCheck,
  Clock,
  ChevronRight,
  RefreshCw,
  Inbox,
  Loader2,
  Lock,
  X,
  Activity,
  TrendingUp,
  Filter,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ToolUsageRecord {
  id: string;
  user_id: string;
  tool_name: string;
  form_data: Record<string, unknown> | null;
  result_data: Record<string, unknown> | null;
  created_at: string;
}

type FilterKey = "all" | "calculadora" | "comparador" | "verificador" | "perfil";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOOL_CONFIG: Record<
  string,
  {
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
> = {
  calculadora: {
    label: "Calculadora de Valor",
    href: "/calculadora-valor",
    Icon: Calculator,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    metricKey: "estimatedValue",
    metricLabel: "Valor estimado",
    metricSuffix: " €",
    filterKey: "calculadora",
  },
  comparador: {
    label: "Comparador de Cavalos",
    href: "/comparador-cavalos",
    Icon: BarChart3,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    metricKey: "winner",
    metricLabel: "Melhor cavalo",
    metricSuffix: "",
    filterKey: "comparador",
  },
  verificador: {
    label: "Verificador de Compatibilidade",
    href: "/verificador-compatibilidade",
    Icon: Heart,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    metricKey: "compatibilityScore",
    metricLabel: "Score de compatibilidade",
    metricSuffix: "%",
    filterKey: "verificador",
  },
  compatibilidade: {
    label: "Verificador de Compatibilidade",
    href: "/verificador-compatibilidade",
    Icon: Heart,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    metricKey: "compatibilityScore",
    metricLabel: "Score de compatibilidade",
    metricSuffix: "%",
    filterKey: "verificador",
  },
  perfil: {
    label: "Análise de Perfil",
    href: "/analise-perfil",
    Icon: UserCheck,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    metricKey: "profileType",
    metricLabel: "Perfil identificado",
    metricSuffix: "",
    filterKey: "perfil",
  },
};

const FILTER_LABELS: Record<FilterKey, string> = {
  all: "Todas",
  calculadora: "Calculadora",
  comparador: "Comparador",
  verificador: "Compatibilidade",
  perfil: "Perfil",
};

const MONTH_NAMES_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDatePT(isoString: string): string {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = MONTH_NAMES_PT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

function formatTimePT(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

function extractTopMetric(
  toolName: string,
  resultData: Record<string, unknown> | null
): { label: string; value: string } | null {
  if (!resultData) return null;

  const config = TOOL_CONFIG[toolName];
  if (!config || !config.metricKey) return null;

  const raw = resultData[config.metricKey];
  if (raw === undefined || raw === null) return null;

  let valueStr: string;
  if (typeof raw === "number") {
    valueStr = toolName === "calculadora" ? raw.toLocaleString("pt-PT") : String(Math.round(raw));
  } else {
    valueStr = String(raw);
  }

  return {
    label: config.metricLabel ?? "",
    value: `${valueStr}${config.metricSuffix}`,
  };
}

// ---------------------------------------------------------------------------
// Lazy Supabase singleton
// ---------------------------------------------------------------------------

let supabasePromise: Promise<typeof import("@/lib/supabase-browser")> | null = null;

function getSupabase() {
  if (!supabasePromise) supabasePromise = import("@/lib/supabase-browser");
  return supabasePromise;
}

// ---------------------------------------------------------------------------
// Detail Modal
// ---------------------------------------------------------------------------

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/40 flex-shrink-0">{label}</span>
      <span className="text-xs text-white/80 text-right font-medium">{value}</span>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] uppercase tracking-widest text-[#C5A059]/60 mb-2">{title}</p>
      <div className="bg-white/3 rounded-xl px-4 py-1 border border-white/5">{children}</div>
    </div>
  );
}

function renderCalculadoraDetails(record: ToolUsageRecord) {
  const r = (record.result_data ?? {}) as Record<string, unknown>;
  const f = (record.form_data ?? {}) as Record<string, unknown>;

  const valorFinal = r.valorFinal ?? r.estimatedValue;
  const valorMin = r.valorMin ?? (r.range as Record<string, unknown>)?.min;
  const valorMax = r.valorMax ?? (r.range as Record<string, unknown>)?.max;
  const multiplicador = r.multiplicador;

  return (
    <>
      {!!(f.nome || f.idade || f.sexo) && (
        <DetailSection title="Cavalo Avaliado">
          {!!f.nome && <DetailRow label="Nome" value={String(f.nome)} />}
          {!!f.idade && <DetailRow label="Idade" value={`${f.idade} anos`} />}
          {!!f.sexo && <DetailRow label="Sexo" value={String(f.sexo)} />}
          {!!f.pelagem && <DetailRow label="Pelagem" value={String(f.pelagem)} />}
        </DetailSection>
      )}
      <DetailSection title="Resultado da Avaliação">
        {!!valorFinal && (
          <DetailRow
            label="Valor estimado"
            value={`${Number(valorFinal).toLocaleString("pt-PT")} €`}
          />
        )}
        {!!(valorMin && valorMax) && (
          <DetailRow
            label="Intervalo de confiança"
            value={`${Number(valorMin).toLocaleString("pt-PT")} € — ${Number(valorMax).toLocaleString("pt-PT")} €`}
          />
        )}
        {!!multiplicador && (
          <DetailRow label="Multiplicador de mercado" value={`×${multiplicador}`} />
        )}
      </DetailSection>
    </>
  );
}

function renderVerificadorDetails(record: ToolUsageRecord) {
  const r = (record.result_data ?? {}) as Record<string, unknown>;
  const f = (record.form_data ?? {}) as Record<string, unknown>;

  const score = r.compatibilityScore ?? r.score;
  const garanhaoNome = (f.garanhao as Record<string, unknown>)?.nome ?? f.garanhaoNome;
  const eguaNome = (f.egua as Record<string, unknown>)?.nome ?? f.eguaNome;
  const coi = r.coi ?? r.consanguinidade;

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excelente compatibilidade";
    if (s >= 65) return "Boa compatibilidade";
    if (s >= 50) return "Compatibilidade moderada";
    return "Compatibilidade baixa";
  };

  return (
    <>
      {!!(garanhaoNome || eguaNome) && (
        <DetailSection title="Par Analisado">
          {!!garanhaoNome && <DetailRow label="Garanhão" value={String(garanhaoNome)} />}
          {!!eguaNome && <DetailRow label="Égua" value={String(eguaNome)} />}
        </DetailSection>
      )}
      <DetailSection title="Resultado de Compatibilidade">
        {score !== undefined && score !== null && (
          <>
            <DetailRow label="Score de compatibilidade" value={`${Math.round(Number(score))}%`} />
            <DetailRow label="Classificação" value={getScoreLabel(Number(score))} />
          </>
        )}
        {coi !== undefined && coi !== null && (
          <DetailRow label="Coeficiente de consanguinidade" value={`${Number(coi).toFixed(2)}%`} />
        )}
      </DetailSection>
    </>
  );
}

function renderComparadorDetails(record: ToolUsageRecord) {
  const r = record.result_data ?? {};
  const winner = r.winner;
  const scores = r.scores as Record<string, number> | undefined;

  return (
    <>
      {winner && (
        <DetailSection title="Resultado">
          <DetailRow label="Cavalo vencedor" value={String(winner)} />
        </DetailSection>
      )}
      {scores && Object.keys(scores).length > 0 && (
        <DetailSection title="Pontuações">
          {Object.entries(scores).map(([nome, score]) => (
            <DetailRow key={nome} label={nome} value={String(Math.round(score))} />
          ))}
        </DetailSection>
      )}
    </>
  );
}

function renderPerfilDetails(record: ToolUsageRecord) {
  const r = record.result_data ?? {};
  const profileType = r.profileType ?? r.profile;

  const profileLabels: Record<string, string> = {
    competidor: "Competidor de Elite",
    tradicional: "Cavaleiro Tradicional",
    criador: "Criador & Investidor Genético",
    amador: "Cavaleiro de Lazer",
  };

  const profileLabel = profileType
    ? (profileLabels[String(profileType).toLowerCase()] ?? String(profileType))
    : null;

  return (
    <>
      {profileLabel && (
        <DetailSection title="Perfil Identificado">
          <DetailRow label="Tipo de perfil" value={profileLabel} />
        </DetailSection>
      )}
    </>
  );
}

function DetailModal({ record, onClose }: { record: ToolUsageRecord; onClose: () => void }) {
  const config = TOOL_CONFIG[record.tool_name] ?? {
    label: record.tool_name,
    href: "/ferramentas",
    Icon: Calculator,
    iconBg: "bg-white/5",
    iconColor: "text-white/50",
    filterKey: "all" as FilterKey,
  };

  const { Icon } = config;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const renderDetails = () => {
    const tool = record.tool_name;
    if (tool === "calculadora") return renderCalculadoraDetails(record);
    if (tool === "verificador" || tool === "compatibilidade")
      return renderVerificadorDetails(record);
    if (tool === "comparador") return renderComparadorDetails(record);
    if (tool === "perfil") return renderPerfilDetails(record);

    // Generic fallback
    const r = record.result_data;
    if (!r || Object.keys(r).length === 0)
      return (
        <p className="text-xs text-white/30 italic text-center py-4">
          Sem dados de resultado disponíveis para esta análise.
        </p>
      );
    return (
      <DetailSection title="Dados do Resultado">
        {Object.entries(r)
          .slice(0, 8)
          .map(([key, val]) => (
            <DetailRow key={key} label={key} value={String(val)} />
          ))}
      </DetailSection>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes: ${config.label}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[#111111] border border-[#C5A059]/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div
            className={`flex-shrink-0 h-9 w-9 rounded-full ${config.iconBg} flex items-center justify-center`}
          >
            <Icon className={`h-4 w-4 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{config.label}</p>
            <p className="text-xs text-white/40">
              {formatDatePT(record.created_at)} às {formatTimePT(record.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50"
            aria-label="Fechar"
          >
            <X className="h-4 w-4 text-white/50" />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-5 pt-5 pb-2 max-h-[60vh] overflow-y-auto">{renderDetails()}</div>

        {/* Modal footer */}
        <div className="px-5 py-4 border-t border-white/5 flex gap-3">
          <Link
            href={config.href}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl
                       bg-gradient-to-r from-[#C5A059] to-[#D4B068]
                       px-4 py-2.5 text-sm font-bold text-black
                       hover:opacity-90 transition-opacity"
            onClick={onClose}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Repetir análise
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/50
                       hover:bg-white/5 hover:text-white/70 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats Bar
// ---------------------------------------------------------------------------

function StatsBar({ records }: { records: ToolUsageRecord[] }) {
  const stats = useMemo(() => {
    const total = records.length;

    // Count by tool
    const counts: Record<string, number> = {};
    for (const r of records) {
      const key = TOOL_CONFIG[r.tool_name]?.filterKey ?? r.tool_name;
      counts[key] = (counts[key] ?? 0) + 1;
    }

    // Most used tool
    let mostUsedKey = "";
    let mostUsedCount = 0;
    for (const [key, count] of Object.entries(counts)) {
      if (count > mostUsedCount) {
        mostUsedKey = key;
        mostUsedCount = count;
      }
    }
    const mostUsed = mostUsedKey ? (FILTER_LABELS[mostUsedKey as FilterKey] ?? mostUsedKey) : null;

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

    return { total, mostUsed, avgScore, counts };
  }, [records]);

  return (
    <div className="mt-6 mb-4 grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-[#C5A059]/15 bg-[#C5A059]/5 px-4 py-3 text-center">
        <p className="text-xl font-bold text-[#C5A059]">{stats.total}</p>
        <p className="text-[10px] text-white/40 mt-0.5">análises guardadas</p>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-center">
        <p className="text-sm font-semibold text-white/80 truncate">{stats.mostUsed ?? "—"}</p>
        <p className="text-[10px] text-white/40 mt-0.5">mais utilizada</p>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-center">
        {stats.avgScore !== null ? (
          <>
            <p className="text-xl font-bold text-white/80">{stats.avgScore}%</p>
            <p className="text-[10px] text-white/40 mt-0.5">score médio compat.</p>
          </>
        ) : (
          <>
            <p className="text-xl font-bold text-white/30">—</p>
            <p className="text-[10px] text-white/40 mt-0.5">score médio compat.</p>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter Tabs
// ---------------------------------------------------------------------------

function FilterTabs({
  records,
  active,
  onChange,
}: {
  records: ToolUsageRecord[];
  active: FilterKey;
  onChange: (k: FilterKey) => void;
}) {
  // Count per filter
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: records.length };
    for (const r of records) {
      const key = TOOL_CONFIG[r.tool_name]?.filterKey;
      if (key) c[key] = (c[key] ?? 0) + 1;
    }
    return c;
  }, [records]);

  const filters: FilterKey[] = ["all", "calculadora", "comparador", "verificador", "perfil"];
  const available = filters.filter((f) => f === "all" || (counts[f] ?? 0) > 0);

  if (available.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrar por ferramenta">
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
          {FILTER_LABELS[f]}
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
// UsageCard
// ---------------------------------------------------------------------------

function UsageCard({
  record,
  onViewDetails,
}: {
  record: ToolUsageRecord;
  onViewDetails: (r: ToolUsageRecord) => void;
}) {
  const config = TOOL_CONFIG[record.tool_name] ?? {
    label: record.tool_name,
    href: "/ferramentas",
    Icon: Calculator,
    iconBg: "bg-white/5",
    iconColor: "text-white/50",
    filterKey: "all" as FilterKey,
  };

  const { Icon } = config;
  const metric = extractTopMetric(record.tool_name, record.result_data);
  const dateStr = formatDatePT(record.created_at);

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
            <p className="mt-2 text-xs text-white/30 italic">Dados de resultado não disponíveis</p>
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
          aria-label={`Ver detalhes de ${config.label} de ${dateStr}`}
        >
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          Ver detalhes
        </button>

        <Link
          href={config.href}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#C5A059]/25
                     bg-[#C5A059]/5 px-3 py-1.5 text-xs text-[#C5A059]
                     hover:bg-[#C5A059]/15 hover:border-[#C5A059]/50 transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50"
          aria-label={`Repetir análise: ${config.label}`}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Repetir análise
        </Link>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function SkeletonCard() {
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HistoricoPage() {
  const { user, isLoading: authLoading } = useAuth();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [records, setRecords] = useState<ToolUsageRecord[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [detailRecord, setDetailRecord] = useState<ToolUsageRecord | null>(null);

  // Check subscription and load history once auth resolves
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setAccessChecked(true);
      return;
    }

    const run = async () => {
      setIsFetching(true);
      setFetchError(null);

      try {
        const { createSupabaseBrowserClient } = await getSupabase();
        const supabase = createSupabaseBrowserClient();

        // 1. Check subscription
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("tools_subscription_status")
          .eq("id", user.id)
          .single();

        const subscribed = profile?.tools_subscription_status === "active";
        setIsSubscribed(subscribed);

        // 2. Fetch history only for subscribers
        if (subscribed) {
          const { data, error } = await supabase
            .from("tool_usage")
            .select("id, user_id, tool_name, form_data, result_data, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50);

          if (error) {
            setFetchError("Não foi possível carregar o histórico. Tente novamente.");
          } else {
            setRecords((data as ToolUsageRecord[]) ?? []);
          }
        }
      } catch {
        setFetchError("Ocorreu um erro inesperado. Tente novamente.");
      } finally {
        setIsFetching(false);
        setAccessChecked(true);
      }
    };

    run();
  }, [user, authLoading]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    if (activeFilter === "all") return records;
    return records.filter((r) => TOOL_CONFIG[r.tool_name]?.filterKey === activeFilter);
  }, [records, activeFilter]);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  const showLoadingSkeletons = authLoading || (user && !accessChecked) || isFetching;

  if (showLoadingSkeletons) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <PageHeader />
          <section aria-label="A carregar histórico" className="mt-8 space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not authenticated
  // ---------------------------------------------------------------------------

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <PageHeader />
          <NotSubscribedCard reason="auth" />
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not subscribed
  // ---------------------------------------------------------------------------

  if (!isSubscribed) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <PageHeader />
          <NotSubscribedCard reason="not-subscribed" />
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Subscribed — show history
  // ---------------------------------------------------------------------------

  return (
    <>
      <main className="min-h-screen bg-[#050505] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <PageHeader />

          {/* Error banner */}
          {fetchError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400"
            >
              {fetchError}
            </div>
          )}

          {/* Stats bar */}
          {!fetchError && records.length > 0 && <StatsBar records={records} />}

          {/* Empty state */}
          {!fetchError && records.length === 0 && (
            <div className="mt-10 flex flex-col items-center gap-4 py-16 text-center">
              <div
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5"
              >
                <Inbox className="h-8 w-8 text-[#C5A059]/50" />
              </div>
              <h2 className="text-base font-semibold text-white/70">
                Ainda não tem análises guardadas
              </h2>
              <p className="max-w-xs text-sm text-white/40">
                Use as ferramentas para começar — cada resultado fica aqui guardado automaticamente.
              </p>
              <Link
                href="/ferramentas"
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#C5A059] px-5 py-2.5
                           text-sm font-semibold text-black hover:bg-[#D4B068] transition-colors
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
              >
                Ir para as ferramentas
              </Link>
            </div>
          )}

          {/* Records */}
          {!fetchError && records.length > 0 && (
            <>
              {/* Filter tabs */}
              <FilterTabs records={records} active={activeFilter} onChange={setActiveFilter} />

              {/* Count label */}
              <p className="mb-4 text-xs text-white/30">
                {filteredRecords.length === 0
                  ? "Nenhum resultado para este filtro"
                  : filteredRecords.length === 1
                    ? "1 resultado"
                    : `${filteredRecords.length} resultados`}
                {records.length >= 50 && activeFilter === "all" && " (máximo 50)"}
              </p>

              {/* Records list */}
              {filteredRecords.length > 0 && (
                <ul className="space-y-4" aria-label="Histórico de análises">
                  {filteredRecords.map((record) => (
                    <li key={record.id}>
                      <UsageCard record={record} onViewDetails={setDetailRecord} />
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-8 text-center text-xs text-white/20">
                Os resultados são guardados automaticamente após cada análise
              </p>
            </>
          )}
        </div>
      </main>

      {/* Detail modal */}
      {detailRecord && <DetailModal record={detailRecord} onClose={() => setDetailRecord(null)} />}
    </>
  );
}

// ---------------------------------------------------------------------------
// Shared header component
// ---------------------------------------------------------------------------

function PageHeader() {
  return (
    <header>
      <Link
        href="/ferramentas"
        className="inline-flex items-center gap-2 text-sm text-white/40
                   hover:text-[#C5A059] transition-colors mb-8
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50 rounded"
        aria-label="Voltar para Ferramentas"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Ferramentas
      </Link>

      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A059]/10"
        >
          <Crown className="h-5 w-5 text-[#C5A059]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">O Meu Histórico PRO</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Todas as suas análises e cálculos guardados
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-6 h-px bg-gradient-to-r from-[#C5A059]/30 via-[#C5A059]/10 to-transparent"
      />
    </header>
  );
}

// ---------------------------------------------------------------------------
// Not subscribed / not authenticated upgrade card
// ---------------------------------------------------------------------------

function NotSubscribedCard({ reason }: { reason: "auth" | "not-subscribed" }) {
  const isAuthWall = reason === "auth";

  return (
    <div className="mt-10 rounded-2xl border border-[#C5A059]/20 bg-[#111111] p-8 text-center">
      <div
        aria-hidden="true"
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#C5A059]/10"
      >
        {isAuthWall ? (
          <Lock className="h-8 w-8 text-[#C5A059]" />
        ) : (
          <Crown className="h-8 w-8 text-[#C5A059]" />
        )}
      </div>

      <h2 className="text-xl font-bold text-white">
        {isAuthWall ? "Inicie sessão para aceder ao histórico" : "Funcionalidade PRO"}
      </h2>

      <p className="mt-3 text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
        {isAuthWall
          ? "O histórico de análises está disponível para utilizadores com subscrição PRO activa. Inicie sessão para continuar."
          : "O histórico de análises e cálculos guardados está disponível exclusivamente para subscritores PRO. Desbloqueie acesso ilimitado a todas as ferramentas."}
      </p>

      {!isAuthWall && (
        <ul aria-label="Benefícios PRO" className="mt-6 mb-8 space-y-2 text-left inline-block">
          {[
            "Histórico completo de todas as análises",
            "Acesso ilimitado às 4 ferramentas",
            "Relatórios em PDF exportáveis",
            "Resultados guardados automaticamente",
          ].map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5 text-sm text-white/60">
              <span
                aria-hidden="true"
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C5A059]/15"
              >
                <Crown className="h-2.5 w-2.5 text-[#C5A059]" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center">
        {isAuthWall ? (
          <Link
            href="/ferramentas"
            className="inline-flex items-center justify-center gap-2 rounded-xl
                       bg-gradient-to-r from-[#C5A059] to-[#D4B068]
                       px-6 py-3 text-sm font-bold text-black
                       hover:opacity-90 transition-opacity
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
          >
            <Crown className="h-4 w-4" aria-hidden="true" />
            Iniciar sessão e subscrever PRO
          </Link>
        ) : (
          <>
            <Link
              href="/ferramentas"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         bg-gradient-to-r from-[#C5A059] to-[#D4B068]
                         px-6 py-3 text-sm font-bold text-black
                         hover:opacity-90 transition-opacity
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
            >
              <Crown className="h-4 w-4" aria-hidden="true" />
              Subscrever PRO
            </Link>
            <Link
              href="/ferramentas"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         border border-white/10 bg-white/5
                         px-6 py-3 text-sm font-medium text-white/60
                         hover:bg-white/10 hover:text-white/80 transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              Ver ferramentas gratuitas
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

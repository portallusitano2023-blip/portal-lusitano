"use client";

import { useState, useEffect } from "react";
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
  },
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

function extractTopMetric(
  toolName: string,
  resultData: Record<string, unknown> | null
): { label: string; value: string } | null {
  if (!resultData) return null;

  const config = TOOL_CONFIG[toolName];
  if (!config || !config.metricKey) return null;

  const raw = resultData[config.metricKey];
  if (raw === undefined || raw === null) return null;

  const valueStr = typeof raw === "number" ? raw.toLocaleString("pt-PT") : String(raw);

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
// Sub-components
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

function ToastMessage({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-[#C5A059]/30 bg-[#1a1a1a] px-5 py-3 text-sm text-[#C5A059] shadow-xl"
    >
      {message}
    </div>
  );
}

function UsageCard({ record }: { record: ToolUsageRecord }) {
  const [toastVisible, setToastVisible] = useState(false);

  const config = TOOL_CONFIG[record.tool_name] ?? {
    label: record.tool_name,
    href: "/ferramentas",
    Icon: Calculator,
    iconBg: "bg-white/5",
    iconColor: "text-white/50",
    metricKey: null,
    metricLabel: null,
    metricSuffix: "",
  };

  const { Icon } = config;
  const metric = extractTopMetric(record.tool_name, record.result_data);
  const dateStr = formatDatePT(record.created_at);

  function handleVerDetalhes() {
    setToastVisible(true);
  }

  return (
    <>
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
                Dados de resultado não disponíveis
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleVerDetalhes}
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

      {toastVisible && (
        <ToastMessage
          message="Detalhe completo em breve — estamos a trabalhar nisso!"
          onClose={() => setToastVisible(false)}
        />
      )}
    </>
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
            .limit(20);

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

  // ---------------------------------------------------------------------------
  // Loading state — auth or initial fetch in progress
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
  // Authenticated but not subscribed
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

        {/* Records list */}
        {!fetchError && records.length > 0 && (
          <>
            <p className="mt-6 mb-4 text-xs text-white/30">
              {records.length === 20
                ? "A mostrar os últimos 20 resultados"
                : `${records.length} ${records.length === 1 ? "resultado guardado" : "resultados guardados"}`}
            </p>

            <ul className="space-y-4" aria-label="Histórico de análises">
              {records.map((record) => (
                <li key={record.id}>
                  <UsageCard record={record} />
                </li>
              ))}
            </ul>

            <p className="mt-8 text-center text-xs text-white/20">
              Apenas os últimos 20 resultados são apresentados
            </p>
          </>
        )}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Shared header component
// ---------------------------------------------------------------------------

function PageHeader() {
  return (
    <header>
      {/* Back link */}
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

      {/* Title */}
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
            Todos os seus cálculos e análises guardados
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

      {/* Feature list */}
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

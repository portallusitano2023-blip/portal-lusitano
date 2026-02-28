"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Inbox, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { type ToolUsageRecord, type FilterKey, getToolConfig } from "@/components/historico/types";
import { StatsBar, FilterTabs, SkeletonCard } from "@/components/historico/HistoricoUI";
import { PageHeader, NotSubscribedCard } from "@/components/historico/PageHeader";
import UsageCard from "@/components/historico/UsageCard";

const DetailModal = dynamic(() => import("@/components/historico/DetailModal"), { ssr: false });

// ---------------------------------------------------------------------------
// Lazy Supabase singleton
// ---------------------------------------------------------------------------

let supabasePromise: Promise<typeof import("@/lib/supabase-browser")> | null = null;

function getSupabase() {
  if (!supabasePromise) supabasePromise = import("@/lib/supabase-browser");
  return supabasePromise;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const PAGE_SIZE = 50;

export default function HistoricoPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const toolConfig = getToolConfig(tr);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [records, setRecords] = useState<ToolUsageRecord[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
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
            .range(0, PAGE_SIZE - 1);

          if (error) {
            setFetchError(
              tr(
                "Não foi possível carregar o histórico. Tente novamente.",
                "Could not load history. Try again.",
                "No fue posible cargar el historial. Intente nuevamente."
              )
            );
          } else {
            const fetched = (data as ToolUsageRecord[]) ?? [];
            setRecords(fetched);
            setHasMore(fetched.length === PAGE_SIZE);
          }
        }
      } catch {
        setFetchError(
          tr(
            "Ocorreu um erro inesperado. Tente novamente.",
            "An unexpected error occurred. Try again.",
            "Ocurrió un error inesperado. Intente nuevamente."
          )
        );
      } finally {
        setIsFetching(false);
        setAccessChecked(true);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const loadMore = async () => {
    if (!user || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const { createSupabaseBrowserClient } = await getSupabase();
      const supabase = createSupabaseBrowserClient();
      const from = records.length;
      const { data, error } = await supabase
        .from("tool_usage")
        .select("id, user_id, tool_name, form_data, result_data, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (!error && data) {
        const fetched = data as ToolUsageRecord[];
        setRecords((prev) => [...prev, ...fetched]);
        setHasMore(fetched.length === PAGE_SIZE);
      }
    } catch {
      // Silent — user can retry
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    if (activeFilter === "all") return records;
    return records.filter((r) => toolConfig[r.tool_name]?.filterKey === activeFilter);
  }, [records, activeFilter, toolConfig]);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  const showLoadingSkeletons = authLoading || (user && !accessChecked) || isFetching;

  if (showLoadingSkeletons) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <PageHeader />
          <section
            aria-label={tr("A carregar histórico", "Loading history", "Cargando historial")}
            className="mt-8 space-y-4"
          >
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

  const resultCountLabel =
    filteredRecords.length === 0
      ? tr(
          "Nenhum resultado para este filtro",
          "No results for this filter",
          "Ningún resultado para este filtro"
        )
      : filteredRecords.length === 1
        ? tr("1 resultado", "1 result", "1 resultado")
        : `${filteredRecords.length} ${tr("resultados", "results", "resultados")}`;

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
                {tr(
                  "Ainda não tem análises guardadas",
                  "No saved analyses yet",
                  "Aún no tiene análisis guardados"
                )}
              </h2>
              <p className="max-w-xs text-sm text-white/40">
                {tr(
                  "Use as ferramentas para começar — cada resultado fica aqui guardado automaticamente.",
                  "Use the tools to start — every result is automatically saved here.",
                  "Use las herramientas para empezar — cada resultado se guarda aquí automáticamente."
                )}
              </p>
              <Link
                href="/ferramentas"
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#C5A059] px-5 py-2.5
                           text-sm font-semibold text-black hover:bg-[#D4B068] transition-colors
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
              >
                {tr("Ir para as ferramentas", "Go to tools", "Ir a las herramientas")}
              </Link>
            </div>
          )}

          {/* Records */}
          {!fetchError && records.length > 0 && (
            <>
              {/* Filter tabs */}
              <FilterTabs records={records} active={activeFilter} onChange={setActiveFilter} />

              {/* Count label */}
              <p className="mb-4 text-xs text-white/30">{resultCountLabel}</p>

              {/* Records list */}
              {filteredRecords.length > 0 && (
                <ul
                  className="space-y-4"
                  aria-label={tr(
                    "Histórico de análises",
                    "Analysis history",
                    "Historial de análisis"
                  )}
                >
                  {filteredRecords.map((record) => (
                    <li key={record.id}>
                      <UsageCard record={record} onViewDetails={setDetailRecord} />
                    </li>
                  ))}
                </ul>
              )}

              {/* Load more */}
              {hasMore && activeFilter === "all" && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {isLoadingMore
                      ? tr("A carregar\u2026", "Loading\u2026", "Cargando\u2026")
                      : tr("Carregar mais", "Load more", "Cargar más")}
                  </button>
                </div>
              )}

              <p className="mt-8 text-center text-xs text-white/20">
                {tr(
                  "Os resultados são guardados automaticamente após cada análise",
                  "Results are saved automatically after each analysis",
                  "Los resultados se guardan automáticamente después de cada análisis"
                )}
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

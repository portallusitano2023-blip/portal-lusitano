import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { getServerTranslations } from "@/lib/server-i18n";
import { logger } from "@/lib/logger";
import MarketplaceGrid from "@/components/MarketplaceGrid";

// ISR: Revalidate marketplace every hour (cavalos can be added/updated)
export const revalidate = 3600;

export default async function ComprarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";
  const t = await getServerTranslations();

  const { data: cavalos, error } = await supabase
    .from("cavalos_venda")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("[ComprarPage] Supabase error:", error);
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 sm:pt-32 md:pt-48 px-4 sm:px-6 md:px-12 lg:px-20 pb-24 sm:pb-32">
        <div className="text-center py-20 sm:py-32 md:py-40 px-4">
          <p className="text-[var(--foreground-muted)] font-serif italic text-base sm:text-lg md:text-xl font-light">
            {t.comprar_page.error_loading}
          </p>
        </div>
      </main>
    );
  }

  // Pass filter translations as a plain object to the client component
  const filterTranslations = {
    filter_sex: t.comprar_page.filter_sex,
    filter_price: t.comprar_page.filter_price,
    filter_discipline: t.comprar_page.filter_discipline,
    filter_sort: t.comprar_page.filter_sort,
    filter_all: t.comprar_page.filter_all,
    filter_male: t.comprar_page.filter_male,
    filter_female: t.comprar_page.filter_female,
    filter_castrated: t.comprar_page.filter_castrated,
    filter_price_under10: t.comprar_page.filter_price_under10,
    filter_price_10to25: t.comprar_page.filter_price_10to25,
    filter_price_25to50: t.comprar_page.filter_price_25to50,
    filter_price_over50: t.comprar_page.filter_price_over50,
    sort_recent: t.comprar_page.sort_recent,
    sort_price_asc: t.comprar_page.sort_price_asc,
    sort_price_desc: t.comprar_page.sort_price_desc,
    results_count: t.comprar_page.results_count,
    results_count_plural: t.comprar_page.results_count_plural,
    clear_filters: t.comprar_page.clear_filters,
    no_results: t.comprar_page.no_results,
    no_results_hint: t.comprar_page.no_results_hint,
    horses_available: t.comprar_page.horses_available,
    horse_available: t.comprar_page.horse_available,
  };

  const totalCount = cavalos?.length ?? 0;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 sm:pt-32 md:pt-48 px-4 sm:px-6 md:px-12 lg:px-20 pb-24 sm:pb-32">
      {/* Header */}
      <header className="mb-8 sm:mb-12 md:mb-24 text-center">
        <span className="text-[var(--gold)] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[9px] sm:text-[10px] font-bold block mb-2 sm:mb-4">
          {t.comprar_page.prestige_marketplace}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-[var(--foreground)] mb-4 sm:mb-8">
          {t.comprar_page.buy_specimen}
        </h1>
        <div className="w-16 sm:w-24 h-[1px] bg-[var(--gold)] mx-auto opacity-40" />

        {/* Total count badge */}
        {totalCount > 0 && (
          <p className="mt-4 sm:mt-6 text-[var(--foreground-muted)] text-sm">
            {totalCount}{" "}
            {totalCount === 1 ? t.comprar_page.horse_available : t.comprar_page.horses_available}
          </p>
        )}
      </header>

      {/* Sell CTA Banner */}
      <div className="mb-8 sm:mb-12 bg-gradient-to-r from-[var(--gold)]/20 via-[var(--gold)]/10 to-transparent border border-[var(--gold)]/30 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-serif mb-1">{t.comprar_page.want_sell}</h2>
            <p className="text-sm text-[var(--foreground-secondary)]">{t.comprar_page.sell_desc}</p>
          </div>
          <Link
            href="/vender-cavalo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--gold)] text-black font-semibold rounded-lg hover:bg-[var(--gold-hover)] transition-colors touch-manipulation whitespace-nowrap"
          >
            {t.comprar_page.sell_horse}
          </Link>
        </div>
      </div>

      {/* Client component handles filters + sorting + grid */}
      {cavalos && cavalos.length > 0 ? (
        <MarketplaceGrid horses={cavalos} isDev={isDev} t={filterTranslations} />
      ) : (
        <div className="text-center py-20 sm:py-32 md:py-40 px-4">
          <p className="text-[var(--foreground-muted)] font-serif italic text-base sm:text-lg md:text-xl font-light">
            {t.comprar_page.no_specimens}
          </p>
        </div>
      )}
    </main>
  );
}

import { supabase } from "@/lib/supabase";
import HorseCard from "@/components/HorseCard";
import Link from "next/link";
import { getServerTranslations } from "@/lib/server-i18n";

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
    console.error("[ComprarPage] Supabase error:", error.message);
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

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 sm:pt-32 md:pt-48 px-4 sm:px-6 md:px-12 lg:px-20 pb-24 sm:pb-32">
      {/* Header - Responsive */}
      <header className="mb-8 sm:mb-12 md:mb-24 text-center">
        <span className="text-[var(--gold)] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[9px] sm:text-[10px] font-bold block mb-2 sm:mb-4">
          {t.comprar_page.prestige_marketplace}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-[var(--foreground)] mb-4 sm:mb-8">
          {t.comprar_page.buy_specimen}
        </h1>
        <div className="w-16 sm:w-24 h-[1px] bg-[var(--gold)] mx-auto opacity-40"></div>

        {/* Count badge */}
        {cavalos && cavalos.length > 0 && (
          <p className="mt-4 sm:mt-6 text-[var(--foreground-muted)] text-sm">
            {cavalos.length}{" "}
            {cavalos.length === 1
              ? t.comprar_page.horse_available
              : t.comprar_page.horses_available}
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

      {/* Grid - Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols */}
      {cavalos && cavalos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {cavalos.map((c) => (
            <HorseCard key={c.id} horse={c} href={`/comprar/${c.id}${isDev ? "?dev=true" : ""}`} />
          ))}
        </div>
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

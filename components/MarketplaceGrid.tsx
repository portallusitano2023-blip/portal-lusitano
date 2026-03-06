"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import HorseCard from "@/components/HorseCard";

// Shape of a horse row from cavalos_venda table
export interface MarketplaceHorse {
  id: string;
  nome_cavalo: string;
  preco: number;
  image_url?: string;
  slug?: string;
  localizacao?: string;
  idade?: number;
  raca?: string;
  sexo?: string;
  disciplinas?: string[] | string | null;
  nivel?: string;
  destaque?: boolean;
  created_at?: string;
}

type SortOption = "recent" | "price_asc" | "price_desc";
type PriceRange = "all" | "under10" | "10to25" | "25to50" | "over50";
type SexFilter = "all" | "macho" | "femea" | "castrado";

interface Translations {
  filter_sex: string;
  filter_price: string;
  filter_discipline: string;
  filter_sort: string;
  filter_all: string;
  filter_male: string;
  filter_female: string;
  filter_castrated: string;
  filter_price_under10: string;
  filter_price_10to25: string;
  filter_price_25to50: string;
  filter_price_over50: string;
  sort_recent: string;
  sort_price_asc: string;
  sort_price_desc: string;
  results_count: string;
  results_count_plural: string;
  clear_filters: string;
  no_results: string;
  no_results_hint: string;
  horses_available: string;
  horse_available: string;
}

interface MarketplaceGridProps {
  horses: MarketplaceHorse[];
  isDev: boolean;
  t: Translations;
}

function getDisciplines(horse: MarketplaceHorse): string[] {
  if (!horse.disciplinas) return [];
  if (Array.isArray(horse.disciplinas)) return horse.disciplinas;
  // handle comma-separated string fallback
  if (typeof horse.disciplinas === "string") {
    return horse.disciplinas
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
  }
  return [];
}

function priceInRange(preco: number, range: PriceRange): boolean {
  if (range === "all") return true;
  if (range === "under10") return preco < 10000;
  if (range === "10to25") return preco >= 10000 && preco < 25000;
  if (range === "25to50") return preco >= 25000 && preco < 50000;
  if (range === "over50") return preco >= 50000;
  return true;
}

export default function MarketplaceGrid({ horses, isDev, t }: MarketplaceGridProps) {
  const [sexFilter, setSexFilter] = useState<SexFilter>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Derive unique disciplines from all horses
  const allDisciplines = useMemo(() => {
    const set = new Set<string>();
    horses.forEach((h) => getDisciplines(h).forEach((d) => set.add(d)));
    return Array.from(set).sort();
  }, [horses]);

  const hasActiveFilters =
    sexFilter !== "all" || priceRange !== "all" || disciplineFilter !== "all";

  const filteredAndSortedRaw = useMemo(() => {
    let result = horses.filter((h) => {
      // Sex filter
      if (sexFilter !== "all") {
        const horseSex = (h.sexo || "").toLowerCase().trim();
        if (horseSex !== sexFilter) return false;
      }

      // Price range filter
      if (!priceInRange(h.preco || 0, priceRange)) return false;

      // Discipline filter
      if (disciplineFilter !== "all") {
        const disciplines = getDisciplines(h);
        if (!disciplines.includes(disciplineFilter)) return false;
      }

      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      if (sortOption === "recent") {
        // Preserve server order (already newest first) — use created_at if present
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortOption === "price_asc") return (a.preco || 0) - (b.preco || 0);
      if (sortOption === "price_desc") return (b.preco || 0) - (a.preco || 0);
      return 0;
    });

    return result;
  }, [horses, sexFilter, priceRange, disciplineFilter, sortOption]);

  // Defer grid re-render so filter dropdowns stay responsive
  const filteredAndSorted = useDeferredValue(filteredAndSortedRaw);

  const clearFilters = () => {
    setSexFilter("all");
    setPriceRange("all");
    setDisciplineFilter("all");
  };

  const resultCount = filteredAndSorted.length;
  const countLabel =
    resultCount === 1 ? `1 ${t.results_count}` : `${resultCount} ${t.results_count_plural}`;

  const selectBase =
    "appearance-none bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] text-xs tracking-wide rounded-none px-3 py-2 pr-7 cursor-pointer focus:outline-none focus:border-[var(--gold)] transition-colors hover:border-[var(--gold)]/50 min-w-0";

  return (
    <div>
      {/* ── Mobile Filter Bottom Sheet ── */}
      {filtersOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)] border-t border-[var(--border)] rounded-t-2xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Handle */}
            <div className="flex items-center justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-[var(--border)] rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]/50">
              <span className="text-sm font-medium uppercase tracking-widest text-[var(--foreground-secondary)]">
                Filtros
              </span>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="Fechar filtros"
              >
                <X size={20} />
              </button>
            </div>
            {/* Filter options */}
            <div className="px-5 py-5 space-y-5">
              {/* Sex */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-2 font-medium">
                  {t.filter_sex}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: t.filter_all },
                    { value: "macho", label: t.filter_male },
                    { value: "femea", label: t.filter_female },
                    { value: "castrado", label: t.filter_castrated },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSexFilter(opt.value as SexFilter)}
                      className={`px-4 py-2 text-sm rounded-xl border transition-all touch-manipulation ${sexFilter === opt.value ? "bg-[var(--gold)] border-[var(--gold)] text-black font-medium" : "border-[var(--border)] text-[var(--foreground-secondary)] bg-[var(--surface)]"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-2 font-medium">
                  {t.filter_price}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: t.filter_all },
                    { value: "under10", label: t.filter_price_under10 },
                    { value: "10to25", label: t.filter_price_10to25 },
                    { value: "25to50", label: t.filter_price_25to50 },
                    { value: "over50", label: t.filter_price_over50 },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPriceRange(opt.value as PriceRange)}
                      className={`px-4 py-2 text-sm rounded-xl border transition-all touch-manipulation ${priceRange === opt.value ? "bg-[var(--gold)] border-[var(--gold)] text-black font-medium" : "border-[var(--border)] text-[var(--foreground-secondary)] bg-[var(--surface)]"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Discipline */}
              {allDisciplines.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-2 font-medium">
                    {t.filter_discipline}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[{ value: "all", label: t.filter_all }, ...allDisciplines.map((d) => ({ value: d, label: d }))].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDisciplineFilter(opt.value)}
                        className={`px-4 py-2 text-sm rounded-xl border transition-all touch-manipulation ${disciplineFilter === opt.value ? "bg-[var(--gold)] border-[var(--gold)] text-black font-medium" : "border-[var(--border)] text-[var(--foreground-secondary)] bg-[var(--surface)]"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Apply + Clear */}
              <div className="flex gap-3 pt-2">
                {hasActiveFilters && (
                  <button
                    onClick={() => { clearFilters(); setFiltersOpen(false); }}
                    className="flex-1 py-3 border border-[var(--border)] text-sm text-[var(--foreground-secondary)] rounded-xl touch-manipulation"
                  >
                    {t.clear_filters}
                  </button>
                )}
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="flex-1 py-3 bg-[var(--gold)] text-black text-sm font-bold rounded-xl touch-manipulation"
                >
                  Ver {countLabel}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Filter Bar */}
      <div className="mb-6 sm:mb-8">
        {/* Mobile: trigger button row */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:hidden">
          <button
            onClick={() => setFiltersOpen(true)}
            className={`flex items-center gap-2 text-sm rounded-xl px-4 py-2.5 border transition-colors touch-manipulation ${hasActiveFilters ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10" : "border-[var(--border)] text-[var(--foreground-secondary)] bg-[var(--surface)]"}`}
            aria-haspopup="dialog"
          >
            <SlidersHorizontal size={15} />
            Filtros
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-[var(--gold)] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {[sexFilter !== "all", priceRange !== "all", disciplineFilter !== "all"].filter(Boolean).length}
              </span>
            )}
          </button>
          <span className="text-[11px] text-[var(--foreground-muted)] uppercase tracking-widest">
            {countLabel}
          </span>
        </div>

        {/* Desktop filter row */}
        <div
          id="filter-panel"
          className="hidden sm:flex flex-row sm:items-center gap-3 sm:gap-4 flex-wrap"
        >
          {/* Sex filter */}
          <div className="relative flex items-center">
            <label className="sr-only">{t.filter_sex}</label>
            <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mr-2 whitespace-nowrap hidden sm:inline">
              {t.filter_sex}
            </span>
            <div className="relative">
              <select
                value={sexFilter}
                onChange={(e) => setSexFilter(e.target.value as SexFilter)}
                className={selectBase}
                aria-label={t.filter_sex}
              >
                <option value="all">
                  {t.filter_sex}: {t.filter_all}
                </option>
                <option value="macho">{t.filter_male}</option>
                <option value="femea">{t.filter_female}</option>
                <option value="castrado">{t.filter_castrated}</option>
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Price range filter */}
          <div className="relative flex items-center">
            <label className="sr-only">{t.filter_price}</label>
            <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mr-2 whitespace-nowrap hidden sm:inline">
              {t.filter_price}
            </span>
            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as PriceRange)}
                className={selectBase}
                aria-label={t.filter_price}
              >
                <option value="all">
                  {t.filter_price}: {t.filter_all}
                </option>
                <option value="under10">{t.filter_price_under10}</option>
                <option value="10to25">{t.filter_price_10to25}</option>
                <option value="25to50">{t.filter_price_25to50}</option>
                <option value="over50">{t.filter_price_over50}</option>
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Discipline filter — only render if disciplines exist */}
          {allDisciplines.length > 0 && (
            <div className="relative flex items-center">
              <label className="sr-only">{t.filter_discipline}</label>
              <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mr-2 whitespace-nowrap hidden sm:inline">
                {t.filter_discipline}
              </span>
              <div className="relative">
                <select
                  value={disciplineFilter}
                  onChange={(e) => setDisciplineFilter(e.target.value)}
                  className={selectBase}
                  aria-label={t.filter_discipline}
                >
                  <option value="all">
                    {t.filter_discipline}: {t.filter_all}
                  </option>
                  {allDisciplines.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                    <path
                      d="M1 1l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Spacer pushes sort to the right on desktop */}
          <div className="flex-1 hidden sm:block" />

          {/* Sort + result count row */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Result count — desktop only */}
            <span className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest hidden sm:block">
              {countLabel}
            </span>

            {/* Divider */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[10px] uppercase tracking-widest text-[var(--gold)] hover:text-[var(--gold-hover)] items-center gap-1 transition-colors hidden sm:flex"
              >
                <X size={11} />
                {t.clear_filters}
              </button>
            )}

            {/* Sort select */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className={selectBase}
                aria-label={t.filter_sort}
              >
                <option value="recent">{t.sort_recent}</option>
                <option value="price_asc">{t.sort_price_asc}</option>
                <option value="price_desc">{t.sort_price_desc}</option>
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Gold separator line */}
        <div className="mt-4 h-[1px] bg-[var(--border)]" />
      </div>

      {/* Grid or empty state */}
      {filteredAndSorted.length > 0 ? (
        <div className="grid stagger-grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {filteredAndSorted.map((horse, index) => (
            <HorseCard
              key={horse.id}
              horse={horse}
              href={`/comprar/${horse.id}${isDev ? "?dev=true" : ""}`}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        /* Empty state when filters yield no results */
        <div className="text-center py-20 sm:py-28 px-4">
          <div className="w-12 h-[1px] bg-[var(--gold)] mx-auto opacity-40 mb-8" />
          <p className="text-[var(--foreground)] font-serif italic text-lg sm:text-xl mb-3">
            {t.no_results}
          </p>
          <p className="text-[var(--foreground-muted)] text-sm mb-8">{t.no_results_hint}</p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] border border-[var(--gold)]/30 px-6 py-3 hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
          >
            <X size={12} />
            {t.clear_filters}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
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

  const filteredAndSorted = useMemo(() => {
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
      {/* Filter Bar */}
      <div className="mb-6 sm:mb-8">
        {/* Mobile: toggle filters button */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:hidden">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--foreground-secondary)] border border-[var(--border)] px-4 py-2 hover:border-[var(--gold)]/50 transition-colors"
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
          >
            <SlidersHorizontal size={14} />
            {t.filter_sort
              .replace("Ordenar", "Filtros")
              .replace("Sort", "Filters")
              .replace("Ordenar", "Filtros")}
          </button>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[10px] uppercase tracking-widest text-[var(--gold)] hover:text-[var(--gold-hover)] flex items-center gap-1 transition-colors"
              >
                <X size={11} />
                {t.clear_filters}
              </button>
            )}
            <span className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest">
              {countLabel}
            </span>
          </div>
        </div>

        {/* Desktop filter row / Mobile collapsible panel */}
        <div
          id="filter-panel"
          className={`${filtersOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap`}
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
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

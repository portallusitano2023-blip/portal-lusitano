"use client";

import { useState, useEffect, useRef, memo, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  ChevronDown,
  Star,
  Award,
  Phone,
  Mail,
  X,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import TextSplit from "@/components/TextSplit";
import { useCountUp } from "@/hooks/useCountUp";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useTilt3D } from "@/hooks/useTilt3D";
import { Cavalo } from "@/types/cavalo";
import Pagination from "@/components/ui/Pagination";
import { useLanguage } from "@/context/LanguageContext";

const regioesValues = [
  "Todas",
  "Ribatejo",
  "Alentejo",
  "Lisboa",
  "Porto",
  "Minho",
  "Douro",
  "Centro",
];

// Placeholder images
const placeholderHorses = [
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800",
  "https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=800",
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800",
];

const ITENS_POR_PAGINA = 20;

export default function MarketplacePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const sexoOptions = useMemo(
    () => [
      { value: "todos", label: t.marketplace_page.sex_all },
      { value: "macho", label: t.marketplace_page.sex_stallions },
      { value: "femea", label: t.marketplace_page.sex_mares },
      { value: "castrado", label: t.marketplace_page.sex_geldings },
    ],
    [t]
  );

  const nivelOptions = useMemo(
    () => [
      { value: "todos", label: t.marketplace_page.level_all },
      { value: "desbastado", label: t.marketplace_page.level_broken },
      { value: "iniciado", label: t.marketplace_page.level_started },
      { value: "avancado", label: t.marketplace_page.level_advanced },
      { value: "competicao", label: t.marketplace_page.level_competition },
    ],
    [t]
  );

  const disciplinaOptions = useMemo(
    () => [
      { value: "todas", label: t.marketplace_page.discipline_all },
      { value: "dressage", label: t.marketplace_page.discipline_dressage },
      { value: "alta_escola", label: t.marketplace_page.discipline_alta_escola },
      { value: "toureio", label: t.marketplace_page.discipline_toureio },
      { value: "trabalho", label: t.marketplace_page.discipline_trabalho },
      { value: "lazer", label: t.marketplace_page.discipline_leisure },
      { value: "reproducao", label: t.marketplace_page.discipline_breeding },
    ],
    [t]
  );

  const regioes = useMemo(() => {
    const r = [...regioesValues];
    r[0] = t.marketplace_page.region_all;
    return r;
  }, [t]);

  const [cavalos, setCavalos] = useState<Cavalo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    sexo: "todos",
    regiao: "Todas",
    nivel: "todos",
    disciplina: "todas",
    precoMin: "",
    precoMax: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCavalo, setSelectedCavalo] = useState<Cavalo | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    async function fetchCavalos() {
      try {
        const params = new URLSearchParams();
        if (filters.sexo !== "todos") params.set("sexo", filters.sexo);
        if (filters.regiao !== "Todas") params.set("regiao", filters.regiao);
        if (filters.nivel !== "todos") params.set("nivel", filters.nivel);
        if (filters.disciplina !== "todas") params.set("disciplina", filters.disciplina);
        if (filters.precoMin) params.set("precoMin", filters.precoMin);
        if (filters.precoMax) params.set("precoMax", filters.precoMax);
        if (debouncedSearch) params.set("search", debouncedSearch);

        const res = await fetch(`/api/cavalos?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setCavalos(data.cavalos || []);
        }
      } catch (error) {
        void error;
      } finally {
        setLoading(false);
      }
    }
    fetchCavalos();
  }, [filters, debouncedSearch]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const formatPrice = useCallback(
    function formatPrice(cavalo: Cavalo) {
      if (cavalo.preco_sob_consulta) return t.marketplace_page.on_request;
      if (!cavalo.preco) return t.marketplace_page.to_define;
      return `€${cavalo.preco.toLocaleString("pt-PT")}${cavalo.preco_negociavel ? ` (${t.marketplace_page.negotiable})` : ""}`;
    },
    [t]
  );

  const getSexoLabel = useCallback(
    function getSexoLabel(sexo: string) {
      const labels: Record<string, string> = {
        macho: t.marketplace_page.sex_stallion,
        femea: t.marketplace_page.sex_mare,
        castrado: t.marketplace_page.sex_gelding,
      };
      return labels[sexo] || sexo;
    },
    [t]
  );

  const getNivelLabel = useCallback(
    function getNivelLabel(nivel: string) {
      const labels: Record<string, string> = {
        desbastado: t.marketplace_page.level_broken,
        iniciado: t.marketplace_page.level_started,
        avancado: t.marketplace_page.level_advanced,
        competicao: t.marketplace_page.level_competition,
      };
      return labels[nivel] || nivel;
    },
    [t]
  );

  const cavalosDestaque = cavalos.filter((c) => c.destaque);
  const outrosCavalos = cavalos.filter((c) => !c.destaque);

  // Paginação para "Outros Cavalos"
  const totalPaginas = Math.ceil(outrosCavalos.length / ITENS_POR_PAGINA);
  const inicio = (currentPage - 1) * ITENS_POR_PAGINA;
  const outrosCavalosPaginados = outrosCavalos.slice(inicio, inicio + ITENS_POR_PAGINA);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Contadores animados
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInViewOnce(statsRef);
  const countCavalos = useCountUp(cavalos.length, statsInView);
  const countDestaque = useCountUp(cavalosDestaque.length, statsInView);
  const countPercent = useCountUp(100, statsInView);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] block mb-4">
              {t.marketplace_page.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] mb-6">
              <TextSplit text={t.marketplace_page.title} baseDelay={0.2} wordDelay={0.1} />
            </h1>
            <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto text-lg">
              {t.marketplace_page.subtitle}
            </p>
          </div>

          {/* Stats — contadores animados */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="text-center p-4 bg-[var(--surface-hover)] border border-[var(--border)]">
              <div className="text-3xl font-serif text-[var(--gold)]">{countCavalos}</div>
              <div className="text-sm text-[var(--foreground-muted)]">
                {t.marketplace_page.stat_horses}
              </div>
            </div>
            <div className="text-center p-4 bg-[var(--surface-hover)] border border-[var(--border)]">
              <div className="text-3xl font-serif text-[var(--gold)]">{countDestaque}</div>
              <div className="text-sm text-[var(--foreground-muted)]">
                {t.marketplace_page.stat_featured}
              </div>
            </div>
            <div className="text-center p-4 bg-[var(--surface-hover)] border border-[var(--border)]">
              <div className="text-3xl font-serif text-[var(--gold)]">{countPercent}%</div>
              <div className="text-sm text-[var(--foreground-muted)]">
                {t.marketplace_page.stat_lusitanos}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Pesquisa e Filtros */}
        <div
          className="mb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Pesquisa */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                size={20}
              />
              <input
                type="text"
                placeholder={t.marketplace_page.search_placeholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[var(--background-secondary)]/50 border border-[var(--border)] pl-12 pr-4 py-4 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none transition-colors"
              />
            </div>
            {/* Toggle Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-4 border transition-colors ${
                showFilters
                  ? "bg-[var(--gold)] text-black border-[var(--gold)]"
                  : "bg-[var(--background-secondary)]/50 text-[var(--foreground-secondary)] border-[var(--border)] hover:border-[var(--gold)]/50"
              }`}
            >
              <Filter size={20} />
              {t.marketplace_page.filters}
              <ChevronDown
                size={16}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Painel de Filtros */}
          {showFilters && (
            <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] p-6 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Sexo */}
                <div>
                  <label className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider block mb-2">
                    {t.marketplace_page.label_sex}
                  </label>
                  <select
                    value={filters.sexo}
                    onChange={(e) => setFilters({ ...filters, sexo: e.target.value })}
                    className="w-full bg-[var(--background-elevated)] border border-[var(--border)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none"
                  >
                    {sexoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Região */}
                <div>
                  <label className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider block mb-2">
                    {t.marketplace_page.label_region}
                  </label>
                  <select
                    value={filters.regiao}
                    onChange={(e) => setFilters({ ...filters, regiao: e.target.value })}
                    className="w-full bg-[var(--background-elevated)] border border-[var(--border)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none"
                  >
                    {regioes.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nível */}
                <div>
                  <label className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider block mb-2">
                    {t.marketplace_page.label_level}
                  </label>
                  <select
                    value={filters.nivel}
                    onChange={(e) => setFilters({ ...filters, nivel: e.target.value })}
                    className="w-full bg-[var(--background-elevated)] border border-[var(--border)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none"
                  >
                    {nivelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Disciplina */}
                <div>
                  <label className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider block mb-2">
                    {t.marketplace_page.label_discipline}
                  </label>
                  <select
                    value={filters.disciplina}
                    onChange={(e) => setFilters({ ...filters, disciplina: e.target.value })}
                    className="w-full bg-[var(--background-elevated)] border border-[var(--border)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none"
                  >
                    {disciplinaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preço Min */}
                <div>
                  <label className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider block mb-2">
                    {t.marketplace_page.label_price_min}
                  </label>
                  <input
                    type="number"
                    placeholder={t.marketplace_page.placeholder_min}
                    value={filters.precoMin}
                    onChange={(e) => setFilters({ ...filters, precoMin: e.target.value })}
                    className="w-full bg-[var(--background-elevated)] border border-[var(--border)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none"
                  />
                </div>

                {/* Preço Max */}
                <div>
                  <label className="text-[var(--foreground-muted)] text-xs uppercase tracking-wider block mb-2">
                    {t.marketplace_page.label_price_max}
                  </label>
                  <input
                    type="number"
                    placeholder={t.marketplace_page.placeholder_max}
                    value={filters.precoMax}
                    onChange={(e) => setFilters({ ...filters, precoMax: e.target.value })}
                    className="w-full bg-[var(--background-elevated)] border border-[var(--border)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-[var(--gold)]">{t.marketplace_page.loading}</div>
          </div>
        ) : cavalos.length === 0 ? (
          <div className="text-center py-20">
            <Search className="mx-auto text-[var(--foreground-secondary)] mb-4" size={48} />
            <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">
              {t.marketplace_page.no_results}
            </h3>
            <p className="text-[var(--foreground-muted)]">{t.marketplace_page.no_results_hint}</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Cavalos em Destaque */}
            {cavalosDestaque.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Star className="text-[var(--gold)]" size={24} />
                  <h2 className="text-2xl font-serif text-[var(--foreground)]">
                    {t.marketplace_page.featured_horses}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cavalosDestaque.map((cavalo, index) => (
                    <CavaloCard
                      key={cavalo.id}
                      cavalo={cavalo}
                      index={index}
                      onSelect={() => setSelectedCavalo(cavalo)}
                      isFavorite={favorites.includes(cavalo.id)}
                      onToggleFavorite={() => toggleFavorite(cavalo.id)}
                      formatPrice={formatPrice}
                      getSexoLabel={getSexoLabel}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Outros Cavalos */}
            {outrosCavalos.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif text-[var(--foreground)]">
                    {t.marketplace_page.all_horses}
                    <span className="text-[var(--foreground-secondary)] text-lg ml-3">
                      ({outrosCavalos.length}{" "}
                      {outrosCavalos.length === 1
                        ? t.marketplace_page.horse_singular
                        : t.marketplace_page.horse_plural}
                      )
                    </span>
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {outrosCavalosPaginados.map((cavalo, index) => (
                    <CavaloCard
                      key={cavalo.id}
                      cavalo={cavalo}
                      index={index}
                      onSelect={() => setSelectedCavalo(cavalo)}
                      isFavorite={favorites.includes(cavalo.id)}
                      onToggleFavorite={() => toggleFavorite(cavalo.id)}
                      formatPrice={formatPrice}
                      getSexoLabel={getSexoLabel}
                    />
                  ))}
                </div>

                {/* Paginação */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPaginas}
                  onPageChange={handlePageChange}
                  className="mt-12"
                />
              </section>
            )}
          </div>
        )}

        {/* Modal de Cavalo */}
        {selectedCavalo && (
          <CavaloModal
            cavalo={selectedCavalo}
            onClose={() => setSelectedCavalo(null)}
            formatPrice={formatPrice}
            getSexoLabel={getSexoLabel}
            getNivelLabel={getNivelLabel}
            isFavorite={favorites.includes(selectedCavalo.id)}
            onToggleFavorite={() => toggleFavorite(selectedCavalo.id)}
          />
        )}
      </div>
    </main>
  );
}

const CavaloCard = memo(function CavaloCard({
  cavalo,
  index,
  onSelect,
  isFavorite,
  onToggleFavorite,
  formatPrice,
  getSexoLabel,
}: {
  cavalo: Cavalo;
  index: number;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  formatPrice: (c: Cavalo) => string;
  getSexoLabel: (s: string) => string;
}) {
  const { t } = useLanguage();
  const image = cavalo.foto_principal || placeholderHorses[index % placeholderHorses.length];
  const { ref: tiltRef, onMouseMove, onMouseLeave } = useTilt3D(5);

  return (
    <div
      ref={tiltRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group bg-[var(--background-secondary)]/50 border border-[var(--border)] hover:border-[var(--gold)]/50 overflow-hidden transition-all opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{
        animationDelay: `${index * 0.05}s`,
        transition: "transform 0.1s ease-out, border-color 0.3s",
      }}
    >
      {/* Imagem */}
      <div className="relative h-56 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {cavalo.destaque && (
            <span className="bg-[var(--gold)] text-black px-2 py-1 text-xs font-bold flex items-center gap-1">
              <Star size={12} /> {t.marketplace_page.featured_badge}
            </span>
          )}
          <span className="bg-black/60 text-white px-2 py-1 text-xs">
            {getSexoLabel(cavalo.sexo)}
          </span>
        </div>

        {/* Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 transition-colors"
        >
          <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : "text-white"} />
        </button>

        {/* Preço */}
        <div className="absolute bottom-3 right-3 bg-[var(--gold)] text-black px-3 py-1 font-bold">
          {formatPrice(cavalo)}
        </div>
      </div>

      {/* Conteúdo */}
      <button onClick={onSelect} className="w-full text-left p-5">
        <h3 className="text-lg font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors mb-2">
          {cavalo.nome}
        </h3>

        <div className="flex flex-wrap gap-2 text-[var(--foreground-muted)] text-sm mb-3">
          {cavalo.idade && (
            <span>
              {cavalo.idade} {t.marketplace_page.years}
            </span>
          )}
          {cavalo.cor && <span>• {cavalo.cor}</span>}
          {cavalo.altura && <span>• {cavalo.altura}m</span>}
        </div>

        {cavalo.linhagem && (
          <p className="text-[var(--gold)] text-sm mb-2">
            {t.marketplace_page.lineage_label} {cavalo.linhagem}
          </p>
        )}

        <div className="flex items-center gap-1 text-[var(--foreground-muted)] text-sm">
          <MapPin size={14} />
          {cavalo.localizacao}, {cavalo.regiao}
        </div>

        {cavalo.disciplinas && cavalo.disciplinas.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {cavalo.disciplinas.slice(0, 3).map((d) => (
              <span
                key={d}
                className="text-xs bg-[var(--background-elevated)] text-[var(--foreground-secondary)] px-2 py-0.5"
              >
                {d}
              </span>
            ))}
          </div>
        )}
      </button>
    </div>
  );
});

function CavaloModal({
  cavalo,
  onClose,
  formatPrice,
  getSexoLabel,
  getNivelLabel,
  isFavorite,
  onToggleFavorite,
}: {
  cavalo: Cavalo;
  onClose: () => void;
  formatPrice: (c: Cavalo) => string;
  getSexoLabel: (s: string) => string;
  getNivelLabel: (n: string) => string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const { t } = useLanguage();
  const image = cavalo.foto_principal || placeholderHorses[0];

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto animate-[fadeSlideIn_0.3s_ease-out_forwards]"
      onClick={onClose}
    >
      <div
        className="bg-[var(--background-secondary)] border border-[var(--border)] max-w-4xl w-full my-8 relative opacity-0 animate-[scaleIn_0.3s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Imagem */}
          <div className="relative h-64 md:h-auto">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />

            {cavalo.destaque && (
              <div className="absolute top-4 left-4 bg-[var(--gold)] text-black px-3 py-1 text-sm font-bold flex items-center gap-1">
                <Star size={14} /> {t.marketplace_page.featured_badge}
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-serif text-[var(--foreground)] mb-1">{cavalo.nome}</h2>
                <p className="text-[var(--foreground-muted)]">
                  {getSexoLabel(cavalo.sexo)} • {cavalo.idade} {t.marketplace_page.years} •{" "}
                  {cavalo.cor}
                </p>
              </div>
              <button
                onClick={onToggleFavorite}
                className="p-2 border border-[var(--border)] hover:border-[var(--gold)] transition-colors"
              >
                <Heart
                  size={20}
                  className={isFavorite ? "fill-red-500 text-red-500" : "text-white"}
                />
              </button>
            </div>

            <div className="text-3xl font-serif text-[var(--gold)] mb-6">{formatPrice(cavalo)}</div>

            {/* Características */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {cavalo.altura && (
                <div className="bg-[var(--background-elevated)]/50 p-3">
                  <div className="text-[var(--foreground-muted)] text-xs uppercase mb-1">
                    {t.marketplace_page.modal_height}
                  </div>
                  <div className="text-[var(--foreground)]">{cavalo.altura}m</div>
                </div>
              )}
              {cavalo.linhagem && (
                <div className="bg-[var(--background-elevated)]/50 p-3">
                  <div className="text-[var(--foreground-muted)] text-xs uppercase mb-1">
                    {t.marketplace_page.modal_lineage}
                  </div>
                  <div className="text-[var(--foreground)]">{cavalo.linhagem}</div>
                </div>
              )}
              {cavalo.nivel_treino && (
                <div className="bg-[var(--background-elevated)]/50 p-3">
                  <div className="text-[var(--foreground-muted)] text-xs uppercase mb-1">
                    {t.marketplace_page.modal_level}
                  </div>
                  <div className="text-[var(--foreground)]">
                    {getNivelLabel(cavalo.nivel_treino)}
                  </div>
                </div>
              )}
              {cavalo.registro_apsl && (
                <div className="bg-[var(--background-elevated)]/50 p-3">
                  <div className="text-[var(--foreground-muted)] text-xs uppercase mb-1">
                    {t.marketplace_page.modal_apsl}
                  </div>
                  <div className="text-[var(--foreground)]">{cavalo.registro_apsl}</div>
                </div>
              )}
            </div>

            {/* Genealogia */}
            {(cavalo.pai || cavalo.mae) && (
              <div className="mb-6">
                <h3 className="text-[var(--foreground-muted)] text-xs uppercase mb-2">
                  {t.marketplace_page.modal_genealogy}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {cavalo.pai && (
                    <div className="bg-[var(--background-elevated)]/30 p-2 text-sm">
                      <span className="text-[var(--foreground-muted)]">
                        {t.marketplace_page.modal_father}
                      </span>{" "}
                      <span className="text-[var(--foreground)]">{cavalo.pai}</span>
                    </div>
                  )}
                  {cavalo.mae && (
                    <div className="bg-[var(--background-elevated)]/30 p-2 text-sm">
                      <span className="text-[var(--foreground-muted)]">
                        {t.marketplace_page.modal_mother}
                      </span>{" "}
                      <span className="text-[var(--foreground)]">{cavalo.mae}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Descrição */}
            <p className="text-[var(--foreground-secondary)] mb-6">{cavalo.descricao}</p>

            {/* Disciplinas */}
            {cavalo.disciplinas && cavalo.disciplinas.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {cavalo.disciplinas.map((d) => (
                  <span
                    key={d}
                    className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] px-2 py-1"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}

            {/* Localização */}
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)] mb-6">
              <MapPin size={16} className="text-[var(--gold)]" />
              {cavalo.localizacao}, {cavalo.regiao}
            </div>

            {/* Vendedor */}
            {cavalo.coudelarias && (
              <Link
                href={`/directorio/${cavalo.coudelarias.slug}`}
                className="flex items-center gap-2 text-[var(--gold)] text-sm mb-6 hover:underline"
              >
                <Award size={16} />
                {cavalo.coudelarias.nome}
                <ExternalLink size={14} />
              </Link>
            )}

            {/* Contactos */}
            <div className="space-y-2">
              {cavalo.vendedor_telefone && (
                <a
                  href={`tel:${cavalo.vendedor_telefone}`}
                  className="flex items-center gap-2 w-full bg-[var(--gold)] text-black py-3 px-4 font-bold hover:bg-[var(--gold-hover)] transition-colors"
                >
                  <Phone size={18} />
                  {cavalo.vendedor_telefone}
                </a>
              )}
              {cavalo.vendedor_email && (
                <a
                  href={`mailto:${cavalo.vendedor_email}?subject=Interesse em ${cavalo.nome}`}
                  className="flex items-center gap-2 w-full border border-[var(--gold)] text-[var(--gold)] py-3 px-4 font-bold hover:bg-[var(--gold)] hover:text-black transition-colors"
                >
                  <Mail size={18} />
                  {t.marketplace_page.send_email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

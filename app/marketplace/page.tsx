"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  Euro,
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

const sexoOptions = [
  { value: "todos", label: "Todos" },
  { value: "macho", label: "Garanhões" },
  { value: "femea", label: "Éguas" },
  { value: "castrado", label: "Castrados" },
];

const nivelOptions = [
  { value: "todos", label: "Todos os níveis" },
  { value: "desbastado", label: "Desbastado" },
  { value: "iniciado", label: "Iniciado" },
  { value: "avancado", label: "Avançado" },
  { value: "competicao", label: "Competição" },
];

const disciplinaOptions = [
  { value: "todas", label: "Todas as disciplinas" },
  { value: "dressage", label: "Dressage" },
  { value: "alta_escola", label: "Alta Escola" },
  { value: "toureio", label: "Toureio" },
  { value: "trabalho", label: "Equitação de Trabalho" },
  { value: "lazer", label: "Lazer" },
  { value: "reproducao", label: "Reprodução" },
];

const regioes = ["Todas", "Ribatejo", "Alentejo", "Lisboa", "Porto", "Minho", "Douro", "Centro"];

// Placeholder images
const placeholderHorses = [
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800",
  "https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=800",
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800",
];

const ITENS_POR_PAGINA = 20;

export default function MarketplacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

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
        console.error("Erro ao carregar cavalos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCavalos();
  }, [filters, debouncedSearch]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const formatPrice = useCallback(function formatPrice(cavalo: Cavalo) {
    if (cavalo.preco_sob_consulta) return "Sob consulta";
    if (!cavalo.preco) return "A definir";
    return `€${cavalo.preco.toLocaleString("pt-PT")}${cavalo.preco_negociavel ? " (negociável)" : ""}`;
  }, []);

  const getSexoLabel = useCallback(function getSexoLabel(sexo: string) {
    const labels: Record<string, string> = {
      macho: "Garanhão",
      femea: "Égua",
      castrado: "Castrado",
    };
    return labels[sexo] || sexo;
  }, []);

  const getNivelLabel = useCallback(function getNivelLabel(nivel: string) {
    const labels: Record<string, string> = {
      desbastado: "Desbastado",
      iniciado: "Iniciado",
      avancado: "Avançado",
      competicao: "Competição",
    };
    return labels[nivel] || nivel;
  }, []);

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
    <main className="min-h-screen bg-[#050505]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
              Marketplace
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              <TextSplit text="Cavalos Lusitanos à Venda" baseDelay={0.2} wordDelay={0.1} />
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Encontre o seu próximo cavalo Lusitano. Exemplares de qualidade das melhores
              coudelarias de Portugal.
            </p>
          </div>

          {/* Stats — contadores animados */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="text-center p-4 bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-serif text-[#C5A059]">{countCavalos}</div>
              <div className="text-sm text-zinc-500">Cavalos</div>
            </div>
            <div className="text-center p-4 bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-serif text-[#C5A059]">{countDestaque}</div>
              <div className="text-sm text-zinc-500">Em Destaque</div>
            </div>
            <div className="text-center p-4 bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-serif text-[#C5A059]">{countPercent}%</div>
              <div className="text-sm text-zinc-500">Lusitanos</div>
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Pesquisar por nome, linhagem..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 pl-12 pr-4 py-4 text-white placeholder-zinc-500 focus:border-[#C5A059] focus:outline-none transition-colors"
              />
            </div>
            {/* Toggle Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-4 border transition-colors ${
                showFilters
                  ? "bg-[#C5A059] text-black border-[#C5A059]"
                  : "bg-zinc-900/50 text-zinc-400 border-white/10 hover:border-[#C5A059]/50"
              }`}
            >
              <Filter size={20} />
              Filtros
              <ChevronDown
                size={16}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Painel de Filtros */}
          {showFilters && (
            <div className="bg-zinc-900/50 border border-white/10 p-6 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Sexo */}
                <div>
                  <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
                    Sexo
                  </label>
                  <select
                    value={filters.sexo}
                    onChange={(e) => setFilters({ ...filters, sexo: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/10 px-3 py-2 text-white focus:border-[#C5A059] focus:outline-none"
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
                  <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
                    Região
                  </label>
                  <select
                    value={filters.regiao}
                    onChange={(e) => setFilters({ ...filters, regiao: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/10 px-3 py-2 text-white focus:border-[#C5A059] focus:outline-none"
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
                  <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
                    Nível
                  </label>
                  <select
                    value={filters.nivel}
                    onChange={(e) => setFilters({ ...filters, nivel: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/10 px-3 py-2 text-white focus:border-[#C5A059] focus:outline-none"
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
                  <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
                    Disciplina
                  </label>
                  <select
                    value={filters.disciplina}
                    onChange={(e) => setFilters({ ...filters, disciplina: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/10 px-3 py-2 text-white focus:border-[#C5A059] focus:outline-none"
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
                  <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
                    Preço Min
                  </label>
                  <input
                    type="number"
                    placeholder="€ Min"
                    value={filters.precoMin}
                    onChange={(e) => setFilters({ ...filters, precoMin: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/10 px-3 py-2 text-white focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                {/* Preço Max */}
                <div>
                  <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
                    Preço Max
                  </label>
                  <input
                    type="number"
                    placeholder="€ Max"
                    value={filters.precoMax}
                    onChange={(e) => setFilters({ ...filters, precoMax: e.target.value })}
                    className="w-full bg-zinc-800 border border-white/10 px-3 py-2 text-white focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-[#C5A059]">A carregar cavalos...</div>
          </div>
        ) : cavalos.length === 0 ? (
          <div className="text-center py-20">
            <Search className="mx-auto text-zinc-400 mb-4" size={48} />
            <h3 className="text-xl font-serif text-white mb-2">Nenhum cavalo encontrado</h3>
            <p className="text-zinc-500">Tente ajustar os filtros de pesquisa.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Cavalos em Destaque */}
            {cavalosDestaque.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Star className="text-[#C5A059]" size={24} />
                  <h2 className="text-2xl font-serif text-white">Cavalos em Destaque</h2>
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
                  <h2 className="text-2xl font-serif text-zinc-300">
                    Todos os Cavalos
                    <span className="text-zinc-400 text-lg ml-3">
                      ({outrosCavalos.length} {outrosCavalos.length === 1 ? "cavalo" : "cavalos"})
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
  const image = cavalo.foto_principal || placeholderHorses[index % placeholderHorses.length];
  const { ref: tiltRef, onMouseMove, onMouseLeave } = useTilt3D(5);

  return (
    <div
      ref={tiltRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group bg-zinc-900/50 border border-white/10 hover:border-[#C5A059]/50 overflow-hidden transition-all opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
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
            <span className="bg-[#C5A059] text-black px-2 py-1 text-xs font-bold flex items-center gap-1">
              <Star size={12} /> Destaque
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
        <div className="absolute bottom-3 right-3 bg-[#C5A059] text-black px-3 py-1 font-bold">
          {formatPrice(cavalo)}
        </div>
      </div>

      {/* Conteúdo */}
      <button onClick={onSelect} className="w-full text-left p-5">
        <h3 className="text-lg font-serif text-white group-hover:text-[#C5A059] transition-colors mb-2">
          {cavalo.nome}
        </h3>

        <div className="flex flex-wrap gap-2 text-zinc-500 text-sm mb-3">
          {cavalo.idade && <span>{cavalo.idade} anos</span>}
          {cavalo.cor && <span>• {cavalo.cor}</span>}
          {cavalo.altura && <span>• {cavalo.altura}m</span>}
        </div>

        {cavalo.linhagem && (
          <p className="text-[#C5A059] text-sm mb-2">Linhagem: {cavalo.linhagem}</p>
        )}

        <div className="flex items-center gap-1 text-zinc-500 text-sm">
          <MapPin size={14} />
          {cavalo.localizacao}, {cavalo.regiao}
        </div>

        {cavalo.disciplinas && cavalo.disciplinas.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {cavalo.disciplinas.slice(0, 3).map((d) => (
              <span key={d} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5">
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
  const image = cavalo.foto_principal || placeholderHorses[0];

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto animate-[fadeSlideIn_0.3s_ease-out_forwards]"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-white/10 max-w-4xl w-full my-8 relative opacity-0 animate-[scaleIn_0.3s_ease-out_forwards]"
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
              <div className="absolute top-4 left-4 bg-[#C5A059] text-black px-3 py-1 text-sm font-bold flex items-center gap-1">
                <Star size={14} /> Destaque
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-serif text-white mb-1">{cavalo.nome}</h2>
                <p className="text-zinc-500">
                  {getSexoLabel(cavalo.sexo)} • {cavalo.idade} anos • {cavalo.cor}
                </p>
              </div>
              <button
                onClick={onToggleFavorite}
                className="p-2 border border-white/10 hover:border-[#C5A059] transition-colors"
              >
                <Heart
                  size={20}
                  className={isFavorite ? "fill-red-500 text-red-500" : "text-white"}
                />
              </button>
            </div>

            <div className="text-3xl font-serif text-[#C5A059] mb-6">{formatPrice(cavalo)}</div>

            {/* Características */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {cavalo.altura && (
                <div className="bg-zinc-800/50 p-3">
                  <div className="text-zinc-500 text-xs uppercase mb-1">Altura</div>
                  <div className="text-white">{cavalo.altura}m</div>
                </div>
              )}
              {cavalo.linhagem && (
                <div className="bg-zinc-800/50 p-3">
                  <div className="text-zinc-500 text-xs uppercase mb-1">Linhagem</div>
                  <div className="text-white">{cavalo.linhagem}</div>
                </div>
              )}
              {cavalo.nivel_treino && (
                <div className="bg-zinc-800/50 p-3">
                  <div className="text-zinc-500 text-xs uppercase mb-1">Nível</div>
                  <div className="text-white">{getNivelLabel(cavalo.nivel_treino)}</div>
                </div>
              )}
              {cavalo.registro_apsl && (
                <div className="bg-zinc-800/50 p-3">
                  <div className="text-zinc-500 text-xs uppercase mb-1">APSL</div>
                  <div className="text-white">{cavalo.registro_apsl}</div>
                </div>
              )}
            </div>

            {/* Genealogia */}
            {(cavalo.pai || cavalo.mae) && (
              <div className="mb-6">
                <h3 className="text-zinc-500 text-xs uppercase mb-2">Genealogia</h3>
                <div className="grid grid-cols-2 gap-2">
                  {cavalo.pai && (
                    <div className="bg-zinc-800/30 p-2 text-sm">
                      <span className="text-zinc-500">Pai:</span>{" "}
                      <span className="text-white">{cavalo.pai}</span>
                    </div>
                  )}
                  {cavalo.mae && (
                    <div className="bg-zinc-800/30 p-2 text-sm">
                      <span className="text-zinc-500">Mãe:</span>{" "}
                      <span className="text-white">{cavalo.mae}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Descrição */}
            <p className="text-zinc-400 mb-6">{cavalo.descricao}</p>

            {/* Disciplinas */}
            {cavalo.disciplinas && cavalo.disciplinas.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {cavalo.disciplinas.map((d) => (
                  <span key={d} className="text-xs bg-[#C5A059]/10 text-[#C5A059] px-2 py-1">
                    {d}
                  </span>
                ))}
              </div>
            )}

            {/* Localização */}
            <div className="flex items-center gap-2 text-zinc-400 mb-6">
              <MapPin size={16} className="text-[#C5A059]" />
              {cavalo.localizacao}, {cavalo.regiao}
            </div>

            {/* Vendedor */}
            {cavalo.coudelarias && (
              <Link
                href={`/directorio/${cavalo.coudelarias.slug}`}
                className="flex items-center gap-2 text-[#C5A059] text-sm mb-6 hover:underline"
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
                  className="flex items-center gap-2 w-full bg-[#C5A059] text-black py-3 px-4 font-bold hover:bg-white transition-colors"
                >
                  <Phone size={18} />
                  {cavalo.vendedor_telefone}
                </a>
              )}
              {cavalo.vendedor_email && (
                <a
                  href={`mailto:${cavalo.vendedor_email}?subject=Interesse em ${cavalo.nome}`}
                  className="flex items-center gap-2 w-full border border-[#C5A059] text-[#C5A059] py-3 px-4 font-bold hover:bg-[#C5A059] hover:text-black transition-colors"
                >
                  <Mail size={18} />
                  Enviar Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

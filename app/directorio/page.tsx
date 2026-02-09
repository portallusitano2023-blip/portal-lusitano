"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Search, Filter, Crown, ArrowRight, Plus, Users, Star } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

// Tipo para coudelaria
interface Coudelaria {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  localizacao: string;
  regiao: string;
  telefone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  foto_capa?: string;
  num_cavalos?: number;
  ano_fundacao?: number;
  especialidades: string[];
  linhagens?: string[];
  premios?: string[];
  is_pro: boolean;
  destaque: boolean;
  views_count: number;
}

const regioes = ["Todas", "Ribatejo", "Alentejo", "Lisboa", "Porto", "Minho", "Douro", "Centro"];

// Placeholder images
const placeholderImages = [
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800",
  "https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=800",
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  "https://images.unsplash.com/photo-1450052590821-8bf91254a353?w=800",
];

const ITENS_POR_PAGINA = 15;

export default function DirectorioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegiao, setSelectedRegiao] = useState("Todas");
  const [coudelarias, setCoudelarias] = useState<Coudelaria[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch coudelarias
  useEffect(() => {
    async function fetchCoudelarias() {
      try {
        const params = new URLSearchParams();
        if (selectedRegiao !== "Todas") params.set("regiao", selectedRegiao);
        if (searchTerm) params.set("search", searchTerm);

        const res = await fetch(`/api/coudelarias?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setCoudelarias(data.coudelarias || []);
        }
      } catch (error) {
        console.error("Erro ao carregar coudelarias:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoudelarias();
  }, [selectedRegiao, searchTerm]);

  // Separar destaque e normais (removido sistema PRO)
  const destaqueCoudelarias = coudelarias.filter((c) => c.destaque);
  const normalCoudelarias = coudelarias.filter((c) => !c.destaque);

  // Paginação para "Outras Coudelarias"
  const totalPaginas = Math.ceil(normalCoudelarias.length / ITENS_POR_PAGINA);
  const inicio = (currentPage - 1) * ITENS_POR_PAGINA;
  const normalCoudelariasPaginadas = normalCoudelarias.slice(inicio, inicio + ITENS_POR_PAGINA);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
              Diretório Oficial
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              Coudelarias de Portugal
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Descubra as melhores coudelarias de cavalos Lusitanos em Portugal. Criadores
              verificados, linhagens de excelência e cavalos de elite.
            </p>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="text-center p-4 bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-serif text-[#C5A059]">{coudelarias.length}+</div>
              <div className="text-sm text-zinc-500">Coudelarias</div>
            </div>
            <div className="text-center p-4 bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-serif text-[#C5A059]">{regioes.length - 1}</div>
              <div className="text-sm text-zinc-500">Regiões</div>
            </div>
            <div className="text-center p-4 bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-serif text-[#C5A059]">1000+</div>
              <div className="text-sm text-zinc-500">Cavalos</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* CTA para registar */}
        <div
          className="mb-12 p-8 bg-gradient-to-r from-[#C5A059]/10 via-[#C5A059]/5 to-transparent border border-[#C5A059]/20 relative overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 blur-3xl" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C5A059] to-[#E8D5A3] rounded-2xl flex items-center justify-center">
                <Crown className="text-black" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white mb-1">Tem uma coudelaria?</h3>
                <p className="text-zinc-400">
                  Registe-se e apareça no maior diretório equestre de Portugal
                </p>
              </div>
            </div>
            <Link
              href="/directorio/registar"
              className="inline-flex items-center gap-2 bg-[#C5A059] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              Registar Coudelaria
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div
          className="mb-12 flex flex-col md:flex-row gap-4 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Pesquisa */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Pesquisar por nome ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 pl-12 pr-4 py-4 text-white placeholder-zinc-500 focus:border-[#C5A059] focus:outline-none transition-colors"
            />
          </div>

          {/* Filtro por região */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <select
              value={selectedRegiao}
              onChange={(e) => setSelectedRegiao(e.target.value)}
              className="bg-zinc-900/50 border border-white/10 pl-12 pr-8 py-4 text-white focus:border-[#C5A059] focus:outline-none transition-colors appearance-none cursor-pointer min-w-[200px]"
            >
              {regioes.map((regiao) => (
                <option key={regiao} value={regiao}>
                  {regiao}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-pulse text-[#C5A059]">A carregar coudelarias...</div>
          </div>
        )}

        {/* Resultados */}
        {!loading && (
          <div className="space-y-16">
            {/* Coudelarias em Destaque */}
            {destaqueCoudelarias.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Star className="text-[#C5A059]" size={24} />
                  <h2 className="text-2xl font-serif text-white">Coudelarias em Destaque</h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  {destaqueCoudelarias.map((coudelaria, index) => (
                    <FeaturedCard key={coudelaria.id} coudelaria={coudelaria} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Outras Coudelarias */}
            {normalCoudelarias.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="text-zinc-400" size={24} />
                    <h2 className="text-2xl font-serif text-zinc-300">
                      Outras Coudelarias
                      <span className="text-zinc-400 text-lg ml-3">
                        ({normalCoudelarias.length}{" "}
                        {normalCoudelarias.length === 1 ? "coudelaria" : "coudelarias"})
                      </span>
                    </h2>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {normalCoudelariasPaginadas.map((coudelaria, index) => (
                    <CoudelariaCard key={coudelaria.id} coudelaria={coudelaria} index={index} />
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

            {/* Sem resultados */}
            {coudelarias.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-zinc-400" size={32} />
                </div>
                <h3 className="text-xl font-serif text-white mb-2">
                  Nenhuma coudelaria encontrada
                </h3>
                <p className="text-zinc-500">Tente ajustar os filtros de pesquisa</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Featured Card (para coudelarias em destaque)
function FeaturedCard({ coudelaria, index }: { coudelaria: Coudelaria; index: number }) {
  const image = coudelaria.foto_capa || placeholderImages[index % placeholderImages.length];

  return (
    <div
      className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link
        href={`/directorio/${coudelaria.slug}`}
        className="group block relative h-[400px] overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Destaque Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] text-black px-3 py-1.5 text-xs font-bold uppercase">
          <Star size={14} />
          Destaque
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          {coudelaria.ano_fundacao && (
            <span className="text-[#C5A059] text-sm uppercase tracking-widest mb-2 block">
              Desde {coudelaria.ano_fundacao}
            </span>
          )}
          <h3 className="text-3xl font-serif text-white mb-3 group-hover:text-[#C5A059] transition-colors">
            {coudelaria.nome}
          </h3>
          <div className="flex items-center gap-4 text-zinc-300 text-sm mb-4">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-[#C5A059]" />
              {coudelaria.localizacao}, {coudelaria.regiao}
            </span>
            {coudelaria.num_cavalos && (
              <span className="flex items-center gap-1">
                <Users size={14} className="text-[#C5A059]" />
                {coudelaria.num_cavalos} cavalos
              </span>
            )}
          </div>
          <p className="text-zinc-400 line-clamp-2 mb-4">{coudelaria.descricao}</p>
          <div className="flex items-center gap-2 text-[#C5A059] text-sm font-medium">
            Ver coudelaria
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
}

// Card para coudelarias
function CoudelariaCard({ coudelaria, index }: { coudelaria: Coudelaria; index: number }) {
  const image = coudelaria.foto_capa || placeholderImages[index % placeholderImages.length];

  return (
    <div
      className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link
        href={`/directorio/${coudelaria.slug}`}
        className="group block bg-zinc-900/50 border border-white/10 hover:border-[#C5A059]/50 overflow-hidden transition-colors"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
          {coudelaria.ano_fundacao && (
            <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 text-xs">
              Desde {coudelaria.ano_fundacao}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-serif text-white group-hover:text-[#C5A059] transition-colors mb-2">
            {coudelaria.nome}
          </h3>
          <div className="flex items-center gap-1 text-zinc-500 text-sm mb-3">
            <MapPin size={14} />
            {coudelaria.localizacao}, {coudelaria.regiao}
          </div>
          <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{coudelaria.descricao}</p>

          {/* Especialidades */}
          {coudelaria.especialidades?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {coudelaria.especialidades.slice(0, 2).map((esp) => (
                <span key={esp} className="text-xs bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5">
                  {esp}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-[#C5A059] text-sm">
            Ver detalhes
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
}

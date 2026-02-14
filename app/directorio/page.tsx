"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Search, Filter, Crown, ArrowRight, Plus, Users, Star } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";
import { useLanguage } from "@/context/LanguageContext";

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
const placeholderImages = [
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800",
  "https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=800",
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  "https://images.unsplash.com/photo-1450052590821-8bf91254a353?w=800",
];

const ITENS_POR_PAGINA = 15;

function DirectorioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { t } = useLanguage();

  const regioes = useMemo(() => {
    const r = [...regioesValues];
    r[0] = t.directorio.region_all;
    return r;
  }, [t]);

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
        void error;
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
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] block mb-4">
              {t.directorio.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] mb-6">
              {t.directorio.title}
            </h1>
            <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto text-lg">
              {t.directorio.subtitle}
            </p>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="text-center p-4 bg-[var(--surface-hover)] border border-[var(--border)]">
              <div className="text-3xl font-serif text-[var(--gold)]">{coudelarias.length}+</div>
              <div className="text-sm text-[var(--foreground-muted)]">
                {t.directorio.coudelarias}
              </div>
            </div>
            <div className="text-center p-4 bg-[var(--surface-hover)] border border-[var(--border)]">
              <div className="text-3xl font-serif text-[var(--gold)]">
                {regioesValues.length - 1}
              </div>
              <div className="text-sm text-[var(--foreground-muted)]">{t.directorio.regioes}</div>
            </div>
            <div className="text-center p-4 bg-[var(--surface-hover)] border border-[var(--border)]">
              <div className="text-3xl font-serif text-[var(--gold)]">1000+</div>
              <div className="text-sm text-[var(--foreground-muted)]">{t.directorio.cavalos}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* CTA para registar */}
        <div
          className="mb-12 p-8 bg-gradient-to-r from-[var(--gold)]/10 via-[var(--gold)]/5 to-transparent border border-[var(--gold)]/20 relative overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold)]/10 blur-3xl" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--gold)] to-[#E8D5A3] rounded-2xl flex items-center justify-center">
                <Crown className="text-black" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-[var(--foreground)] mb-1">
                  {t.directorio.has_stud}
                </h3>
                <p className="text-[var(--foreground-secondary)]">{t.directorio.register_cta}</p>
              </div>
            </div>
            <Link
              href="/directorio/registar"
              className="inline-flex items-center gap-2 bg-[var(--gold)] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[var(--gold-hover)] transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              {t.directorio.register_btn}
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
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
              size={20}
            />
            <input
              type="text"
              placeholder={t.directorio.search_placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label={t.directorio.search_placeholder}
              className="w-full bg-[var(--background-secondary)]/50 border border-[var(--border)] pl-12 pr-4 py-4 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none transition-colors"
            />
          </div>

          {/* Filtro por região */}
          <div className="relative">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
              size={20}
            />
            <select
              value={selectedRegiao}
              onChange={(e) => setSelectedRegiao(e.target.value)}
              aria-label={t.directorio.regioes}
              className="bg-[var(--background-secondary)]/50 border border-[var(--border)] pl-12 pr-8 py-4 text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none transition-colors appearance-none cursor-pointer min-w-[200px]"
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
            <div className="animate-pulse text-[var(--gold)]">{t.directorio.loading}</div>
          </div>
        )}

        {/* Resultados */}
        {!loading && (
          <div className="space-y-16">
            {/* Coudelarias em Destaque */}
            {destaqueCoudelarias.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Star className="text-[var(--gold)]" size={24} />
                  <h2 className="text-2xl font-serif text-[var(--foreground)]">
                    {t.directorio.featured}
                  </h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  {destaqueCoudelarias.map((coudelaria, index) => (
                    <FeaturedCard key={coudelaria.id} coudelaria={coudelaria} index={index} t={t} />
                  ))}
                </div>
              </section>
            )}

            {/* Outras Coudelarias */}
            {normalCoudelarias.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="text-[var(--foreground-secondary)]" size={24} />
                    <h2 className="text-2xl font-serif text-[var(--foreground-secondary)]">
                      {t.directorio.others}
                      <span className="text-[var(--foreground-secondary)] text-lg ml-3">
                        ({normalCoudelarias.length}{" "}
                        {normalCoudelarias.length === 1
                          ? t.directorio.coudelaria_single
                          : t.directorio.coudelarias_plural}
                        )
                      </span>
                    </h2>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {normalCoudelariasPaginadas.map((coudelaria, index) => (
                    <CoudelariaCard
                      key={coudelaria.id}
                      coudelaria={coudelaria}
                      index={index}
                      t={t}
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

            {/* Sem resultados */}
            {coudelarias.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[var(--background-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-[var(--foreground-secondary)]" size={32} />
                </div>
                <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">
                  {t.directorio.no_results}
                </h3>
                <p className="text-[var(--foreground-muted)]">{t.directorio.no_results_hint}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Featured Card (para coudelarias em destaque)
function FeaturedCard({
  coudelaria,
  index,
  t,
}: {
  coudelaria: Coudelaria;
  index: number;
  t: ReturnType<typeof useLanguage>["t"];
}) {
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
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-gradient-to-r from-[var(--gold)] to-[#E8D5A3] text-black px-3 py-1.5 text-xs font-bold uppercase">
          <Star size={14} />
          {t.directorio.highlight}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          {coudelaria.ano_fundacao && (
            <span className="text-[var(--gold)] text-sm uppercase tracking-widest mb-2 block">
              {t.directorio.since} {coudelaria.ano_fundacao}
            </span>
          )}
          <h3 className="text-3xl font-serif text-[var(--foreground)] mb-3 group-hover:text-[var(--gold)] transition-colors">
            {coudelaria.nome}
          </h3>
          <div className="flex items-center gap-4 text-[var(--foreground-secondary)] text-sm mb-4">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-[var(--gold)]" />
              {coudelaria.localizacao}, {coudelaria.regiao}
            </span>
            {coudelaria.num_cavalos && (
              <span className="flex items-center gap-1">
                <Users size={14} className="text-[var(--gold)]" />
                {coudelaria.num_cavalos} {t.directorio.horses}
              </span>
            )}
          </div>
          <p className="text-[var(--foreground-secondary)] line-clamp-2 mb-4">
            {coudelaria.descricao}
          </p>
          <div className="flex items-center gap-2 text-[var(--gold)] text-sm font-medium">
            {t.directorio.view_stud}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
}

// Card para coudelarias
function CoudelariaCard({
  coudelaria,
  index,
  t,
}: {
  coudelaria: Coudelaria;
  index: number;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  const image = coudelaria.foto_capa || placeholderImages[index % placeholderImages.length];

  return (
    <div
      className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link
        href={`/directorio/${coudelaria.slug}`}
        className="group block bg-[var(--background-secondary)]/50 border border-[var(--border)] hover:border-[var(--gold)]/50 overflow-hidden transition-colors"
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
              {t.directorio.since} {coudelaria.ano_fundacao}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors mb-2">
            {coudelaria.nome}
          </h3>
          <div className="flex items-center gap-1 text-[var(--foreground-muted)] text-sm mb-3">
            <MapPin size={14} />
            {coudelaria.localizacao}, {coudelaria.regiao}
          </div>
          <p className="text-[var(--foreground-secondary)] text-sm line-clamp-2 mb-4">
            {coudelaria.descricao}
          </p>

          {/* Especialidades */}
          {coudelaria.especialidades?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {coudelaria.especialidades.slice(0, 2).map((esp) => (
                <span
                  key={esp}
                  className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] px-2 py-0.5"
                >
                  {esp}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-[var(--gold)] text-sm">
            {t.directorio.view_details}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function DirectorioPage() {
  return (
    <Suspense>
      <DirectorioContent />
    </Suspense>
  );
}

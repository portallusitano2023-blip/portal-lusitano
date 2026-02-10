"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Crown, Medal, Sparkles, History } from "lucide-react";
import { CavaloFamoso } from "./types";
import { cavalosFamosos } from "./data";
import { CavaloCard } from "@/components/cavalos-famosos/CavaloCard";
import { ModalDetalhes } from "@/components/cavalos-famosos/ModalDetalhes";
import { useLanguage } from "@/context/LanguageContext";

export default function CavalosFamososPage() {
  const { t } = useLanguage();
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos");
  const [filtroLinhagem, setFiltroLinhagem] = useState<string>("todas");
  const [cavaloSelecionado, setCavaloSelecionado] = useState<CavaloFamoso | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"info" | "genealogia" | "descendentes" | "performance">(
    "info"
  );

  // Extrair opções de filtros
  const disciplinas = useMemo(
    () => ["todos", ...Array.from(new Set(cavalosFamosos.map((c) => c.disciplina)))],
    []
  );

  const linhagens = useMemo(
    () => ["todas", ...Array.from(new Set(cavalosFamosos.map((c) => c.linhagem)))],
    []
  );

  // Filtrar cavalos (memoizado para performance)
  const cavalosFiltrados = useMemo(() => {
    return cavalosFamosos.filter((c) => {
      const matchDisciplina = filtroAtivo === "todos" || c.disciplina === filtroAtivo;
      const matchLinhagem = filtroLinhagem === "todas" || c.linhagem === filtroLinhagem;
      return matchDisciplina && matchLinhagem;
    });
  }, [filtroAtivo, filtroLinhagem]);

  // Separar cavalos em destaque e outros (memoizado)
  const cavalosDestaque = useMemo(
    () => cavalosFiltrados.filter((c) => c.destaque),
    [cavalosFiltrados]
  );

  const outrosCavalos = useMemo(
    () => cavalosFiltrados.filter((c) => !c.destaque),
    [cavalosFiltrados]
  );

  // Top influenciadores (memoizado)
  const topInfluenciadores = useMemo(() => {
    return [...cavalosFiltrados]
      .sort((a, b) => (b.influenciaGenetica || 0) - (a.influenciaGenetica || 0))
      .slice(0, 3);
  }, [cavalosFiltrados]);

  const handleOpenCavalo = (cavalo: CavaloFamoso) => {
    setCavaloSelecionado(cavalo);
    setAbaAtiva("info");
  };

  return (
    <main className="min-h-screen bg-black text-white pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-6 touch-manipulation"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">{t.cavalos_famosos.back}</span>
        </Link>

        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2">
            {t.cavalos_famosos.gallery_badge}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4">
            {t.cavalos_famosos.title}
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            {t.cavalos_famosos.subtitle}
          </p>

          {/* Citação do Mestre Nuno Oliveira */}
          {/* FONTE: https://www.equisport.pt/noticias/nuno-oliveira-100-anos */}
          <blockquote className="mt-8 max-w-3xl mx-auto relative">
            <div className="absolute -top-4 -left-2 text-[#C5A059]/30 text-6xl font-serif">
              &quot;
            </div>
            <p className="text-zinc-300 text-base sm:text-lg italic px-8 leading-relaxed">
              Amo o meu País e amo o nosso Lusitano. Ele tem o mais gentil temperamento do mundo e é
              o mais bem equilibrado. Torna simples o trabalho do cavaleiro porque aceita melhor as
              mãos e pernas.
            </p>
            <footer className="mt-4 text-[#C5A059] text-sm font-medium tracking-wide">
              — {t.cavalos_famosos.quote_author}
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Top Influenciadores */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-[#C5A059]/20 via-zinc-900 to-[#C5A059]/20 rounded-xl p-6 border border-[#C5A059]/20">
          <h2 className="text-center text-sm font-semibold text-[#C5A059] mb-4 flex items-center justify-center gap-2">
            <Crown size={16} className="fill-[#C5A059]" />
            {t.cavalos_famosos.top_influencers}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {topInfluenciadores.map((cavalo, i) => (
              <button
                key={cavalo.id}
                onClick={() => handleOpenCavalo(cavalo)}
                className="bg-zinc-900/80 border border-zinc-800 hover:border-[#C5A059]/50 rounded-lg p-4 text-center transition-all"
                aria-label={`${t.cavalos_famosos.top_influencers}: ${cavalo.nome}`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {i === 0 && <Medal className="text-yellow-400" size={20} />}
                  {i === 1 && <Medal className="text-zinc-400" size={20} />}
                  {i === 2 && <Medal className="text-amber-700" size={20} />}
                  <span className="font-serif text-lg text-white">{cavalo.nome}</span>
                </div>
                <div className="text-2xl font-bold text-[#C5A059]">
                  {cavalo.influenciaGenetica}%
                </div>
                <div className="text-xs text-zinc-500">{t.cavalos_famosos.of_current}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        <div className="flex flex-wrap justify-center gap-2">
          {disciplinas.map((disc) => (
            <button
              key={disc}
              onClick={() => setFiltroAtivo(disc)}
              className={`px-4 py-2 rounded-lg text-sm transition-all touch-manipulation ${
                filtroAtivo === disc
                  ? "bg-[#C5A059] text-black font-medium"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
              aria-label={`${t.cavalos_famosos.all_disciplines === (disc === "todos" ? t.cavalos_famosos.all_disciplines : disc) ? t.cavalos_famosos.all_disciplines : disc}`}
              aria-pressed={filtroAtivo === disc}
            >
              {disc === "todos" ? t.cavalos_famosos.all_disciplines : disc}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {linhagens.map((lin) => (
            <button
              key={lin}
              onClick={() => setFiltroLinhagem(lin)}
              className={`px-3 py-1 rounded-full text-xs transition-all touch-manipulation ${
                filtroLinhagem === lin
                  ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]"
                  : "bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800"
              }`}
              aria-pressed={filtroLinhagem === lin}
            >
              {lin === "todas"
                ? t.cavalos_famosos.all_lineages
                : `${t.cavalos_famosos.lineage_prefix} ${lin}`}
            </button>
          ))}
        </div>
      </div>

      {/* Cavalos em Destaque */}
      {cavalosDestaque.length > 0 && (
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-lg font-serif text-[#C5A059] mb-6 flex items-center gap-2">
            <Sparkles size={20} className="fill-[#C5A059]" />
            {t.cavalos_famosos.featured}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cavalosDestaque.map((cavalo) => (
              <CavaloCard
                key={cavalo.id}
                cavalo={cavalo}
                onClick={() => handleOpenCavalo(cavalo)}
                variant="destaque"
              />
            ))}
          </div>
        </section>
      )}

      {/* Outros Cavalos */}
      {outrosCavalos.length > 0 && (
        <section className="max-w-6xl mx-auto">
          <h2 className="text-lg font-serif text-zinc-400 mb-6 flex items-center gap-2">
            <History size={20} />
            {t.cavalos_famosos.others}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outrosCavalos.map((cavalo) => (
              <CavaloCard
                key={cavalo.id}
                cavalo={cavalo}
                onClick={() => handleOpenCavalo(cavalo)}
                variant="normal"
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal Detalhes */}
      {cavaloSelecionado && (
        <ModalDetalhes
          cavalo={cavaloSelecionado}
          onClose={() => setCavaloSelecionado(null)}
          abaAtiva={abaAtiva}
          setAbaAtiva={setAbaAtiva}
        />
      )}

      {/* Empty State */}
      {cavalosFiltrados.length === 0 && (
        <div className="max-w-6xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={24} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">{t.cavalos_famosos.no_results}</h3>
          <p className="text-sm text-zinc-500">{t.cavalos_famosos.no_results_hint}</p>
        </div>
      )}

      {/* Info */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">{t.cavalos_famosos.know_horse}</h3>
          <p className="text-sm text-zinc-400 mb-4">{t.cavalos_famosos.help_expand}</p>
          <button className="px-6 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-[#C5A059] hover:text-black transition-colors touch-manipulation">
            {t.cavalos_famosos.suggest}
          </button>
        </div>
      </div>
    </main>
  );
}

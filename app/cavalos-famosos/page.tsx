"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trophy, Calendar, MapPin, Star, X, ChevronLeft, ChevronRight, Award, History } from "lucide-react";

interface CavaloFamoso {
  id: string;
  nome: string;
  apelido?: string;
  anoNascimento: number;
  anoFalecimento?: number;
  coudelaria: string;
  pelagem: string;
  disciplina: string;
  cavaleiro?: string;
  conquistas: string[];
  descricao: string;
  curiosidades?: string[];
  imagens: string[];
  destaque: boolean;
  legado: string;
}

const cavalosFamosos: CavaloFamoso[] = [
  {
    id: "1",
    nome: "Novilheiro",
    apelido: "O Fenómeno",
    anoNascimento: 1974,
    anoFalecimento: 1996,
    coudelaria: "Coudelaria Nacional",
    pelagem: "Ruço",
    disciplina: "Dressage",
    cavaleiro: "Ferdi Eilberg",
    conquistas: [
      "Campeão Internacional de Dressage",
      "Vencedor de mais de 30 provas internacionais",
      "Primeiro Lusitano a competir ao mais alto nível internacional",
      "Prix St. Georges, Intermediário e Grand Prix"
    ],
    descricao: "Novilheiro revolucionou a percepção do cavalo Lusitano no mundo da dressage internacional. Demonstrou que a raça podia competir ao mais alto nível, abrindo portas para gerações futuras de Lusitanos na disciplina.",
    curiosidades: [
      "Foi o primeiro Lusitano a alcançar o Grand Prix em competição internacional",
      "Mudou-se para Inglaterra onde teve uma carreira brilhante"
    ],
    imagens: ["/cavalos/novilheiro-1.jpg"],
    destaque: true,
    legado: "Pioneiro que provou o potencial do Lusitano na dressage mundial"
  },
  {
    id: "2",
    nome: "Opus 72",
    anoNascimento: 1999,
    coudelaria: "Coudelaria Alter Real",
    pelagem: "Ruço",
    disciplina: "Dressage",
    cavaleiro: "Boaventura Freire",
    conquistas: [
      "Representou Portugal nos Jogos Olímpicos de Londres 2012",
      "Múltiplo medalhista em campeonatos ibéricos",
      "Competiu a nível Grand Prix internacional"
    ],
    descricao: "Opus 72 foi um embaixador da raça Lusitana nos Jogos Olímpicos, demonstrando a elegância e capacidade atlética do cavalo português ao mundo. A sua parceria com Boaventura Freire foi uma das mais emblemáticas do desporto equestre português.",
    imagens: ["/cavalos/opus72-1.jpg"],
    destaque: true,
    legado: "Primeiro Lusitano português a competir em Jogos Olímpicos no século XXI"
  },
  {
    id: "3",
    nome: "Icaro",
    anoNascimento: 1959,
    anoFalecimento: 1981,
    coudelaria: "Coudelaria Nacional",
    pelagem: "Castanho",
    disciplina: "Toureio a Cavalo",
    conquistas: [
      "Considerado um dos melhores cavalos de toureio de sempre",
      "Lendário na arte equestre tauromáquica",
      "Referência genética para gerações de cavalos de toureio"
    ],
    descricao: "Icaro é considerado um dos maiores cavalos de toureio da história de Portugal. A sua bravura, agilidade e inteligência tornaram-no uma lenda viva da tauromaquia portuguesa.",
    imagens: ["/cavalos/icaro-1.jpg"],
    destaque: false,
    legado: "Lenda imortal do toureio a cavalo português"
  },
  {
    id: "4",
    nome: "Oxidado",
    anoNascimento: 1979,
    coudelaria: "Coudelaria Veiga",
    pelagem: "Ruço",
    disciplina: "Dressage / Reprodução",
    conquistas: [
      "Reprodutor de exceção",
      "Pai de múltiplos campeões",
      "Linha genética presente em todo o mundo"
    ],
    descricao: "Oxidado foi um dos reprodutores mais influentes da história moderna do Lusitano. Os seus descendentes espalharam-se pelo mundo, elevando o padrão da raça em múltiplas disciplinas.",
    imagens: ["/cavalos/oxidado-1.jpg"],
    destaque: false,
    legado: "Um dos reprodutores mais influentes da raça"
  },
  {
    id: "5",
    nome: "Rubi AR",
    anoNascimento: 2004,
    coudelaria: "Coudelaria Artur Ramos",
    pelagem: "Castanho",
    disciplina: "Dressage",
    cavaleiro: "Rafael Soto (ESP)",
    conquistas: [
      "Finalista nos Jogos Olímpicos de Tóquio 2020",
      "Grand Prix vencedor internacional",
      "Um dos Lusitanos mais pontuados da história"
    ],
    descricao: "Rubi AR representa o auge moderno do Lusitano na dressage internacional. Sob a sela de Rafael Soto, alcançou pontuações históricas e competiu ao mais alto nível mundial.",
    imagens: ["/cavalos/rubi-ar-1.jpg"],
    destaque: true,
    legado: "Estrela contemporânea que mantém vivo o legado do Lusitano"
  },
  {
    id: "6",
    nome: "Quo Vadis",
    anoNascimento: 1983,
    coudelaria: "Coudelaria Nacional",
    pelagem: "Ruço",
    disciplina: "Dressage",
    cavaleiro: "Miguel Ralão Duarte",
    conquistas: [
      "Campeão Nacional de Dressage",
      "Medalhas em competições ibéricas",
      "Inspiração para cavaleiros portugueses"
    ],
    descricao: "Quo Vadis foi um dos cavalos mais carismáticos da dressage portuguesa dos anos 90. A sua elegância e movimentos expressivos encantaram públicos e juízes.",
    imagens: ["/cavalos/quo-vadis-1.jpg"],
    destaque: false,
    legado: "Símbolo da elegância lusitana na dressage nacional"
  }
];

export default function CavalosFamososPage() {
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos");
  const [cavaloSelecionado, setCavaloSelecionado] = useState<CavaloFamoso | null>(null);

  const disciplinas = ["todos", ...Array.from(new Set(cavalosFamosos.map(c => c.disciplina)))];

  const cavalosFiltrados = filtroAtivo === "todos"
    ? cavalosFamosos
    : cavalosFamosos.filter(c => c.disciplina === filtroAtivo);

  const cavalosDestaque = cavalosFiltrados.filter(c => c.destaque);
  const outrosCavalos = cavalosFiltrados.filter(c => !c.destaque);

  return (
    <main className="min-h-screen bg-black text-white pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-6 touch-manipulation"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar</span>
        </Link>

        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2">
            Galeria de Honra
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4">
            Cavalos Lusitanos Famosos
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Uma homenagem aos cavalos que marcaram a história da raça Lusitana e elevaram Portugal no panorama equestre mundial.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-6xl mx-auto mb-8">
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
            >
              {disc === "todos" ? "Todos" : disc}
            </button>
          ))}
        </div>
      </div>

      {/* Cavalos em Destaque */}
      {cavalosDestaque.length > 0 && (
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-lg font-serif text-[#C5A059] mb-6 flex items-center gap-2">
            <Star size={20} className="fill-[#C5A059]" />
            Em Destaque
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cavalosDestaque.map((cavalo) => (
              <button
                key={cavalo.id}
                onClick={() => setCavaloSelecionado(cavalo)}
                className="group bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-[#C5A059]/20 rounded-2xl overflow-hidden text-left hover:border-[#C5A059]/50 transition-all touch-manipulation"
              >
                {/* Image Placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-[#C5A059]/20 to-transparent relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-serif text-[#C5A059]/30">{cavalo.nome.charAt(0)}</span>
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-[#C5A059] rounded text-xs font-medium text-black">
                    {cavalo.disciplina}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-serif text-white mb-1 group-hover:text-[#C5A059] transition-colors">
                    {cavalo.nome}
                  </h3>
                  {cavalo.apelido && (
                    <p className="text-sm text-[#C5A059] italic mb-2">&quot;{cavalo.apelido}&quot;</p>
                  )}
                  <p className="text-xs text-zinc-500 mb-3">
                    {cavalo.anoNascimento} {cavalo.anoFalecimento ? `- ${cavalo.anoFalecimento}` : ""} • {cavalo.coudelaria}
                  </p>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{cavalo.legado}</p>
                  <div className="flex items-center gap-2">
                    <Trophy size={14} className="text-[#C5A059]" />
                    <span className="text-xs text-zinc-500">{cavalo.conquistas.length} conquistas notáveis</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Outros Cavalos */}
      {outrosCavalos.length > 0 && (
        <section className="max-w-6xl mx-auto">
          <h2 className="text-lg font-serif text-zinc-400 mb-6 flex items-center gap-2">
            <History size={20} />
            Lendas Históricas
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outrosCavalos.map((cavalo) => (
              <button
                key={cavalo.id}
                onClick={() => setCavaloSelecionado(cavalo)}
                className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-left hover:border-[#C5A059]/30 transition-all touch-manipulation"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-serif text-zinc-600">{cavalo.nome.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-[#C5A059] transition-colors truncate">
                      {cavalo.nome}
                    </h3>
                    <p className="text-xs text-zinc-500 mb-1">
                      {cavalo.anoNascimento} • {cavalo.coudelaria}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">
                      {cavalo.disciplina}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 mt-3 line-clamp-2">{cavalo.legado}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Modal Detalhes */}
      {cavaloSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setCavaloSelecionado(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="aspect-video bg-gradient-to-br from-[#C5A059]/20 to-zinc-900 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl font-serif text-[#C5A059]/20">{cavaloSelecionado.nome.charAt(0)}</span>
              </div>
              <button
                onClick={() => setCavaloSelecionado(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors touch-manipulation"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-[#C5A059] rounded-full text-sm font-medium text-black">
                  {cavaloSelecionado.disciplina}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-white mb-1">{cavaloSelecionado.nome}</h2>
              {cavaloSelecionado.apelido && (
                <p className="text-lg text-[#C5A059] italic mb-4">&quot;{cavaloSelecionado.apelido}&quot;</p>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <span className="text-xs text-zinc-500 block mb-1">Período</span>
                  <span className="text-sm text-white">
                    {cavaloSelecionado.anoNascimento}
                    {cavaloSelecionado.anoFalecimento ? ` - ${cavaloSelecionado.anoFalecimento}` : " - presente"}
                  </span>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <span className="text-xs text-zinc-500 block mb-1">Pelagem</span>
                  <span className="text-sm text-white">{cavaloSelecionado.pelagem}</span>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <span className="text-xs text-zinc-500 block mb-1">Coudelaria</span>
                  <span className="text-sm text-white">{cavaloSelecionado.coudelaria}</span>
                </div>
                {cavaloSelecionado.cavaleiro && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <span className="text-xs text-zinc-500 block mb-1">Cavaleiro</span>
                    <span className="text-sm text-white">{cavaloSelecionado.cavaleiro}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-zinc-300 mb-6">{cavaloSelecionado.descricao}</p>

              {/* Conquistas */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2">
                  <Trophy size={16} />
                  Principais Conquistas
                </h3>
                <ul className="space-y-2">
                  {cavaloSelecionado.conquistas.map((conquista, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <Award size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                      {conquista}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curiosidades */}
              {cavaloSelecionado.curiosidades && cavaloSelecionado.curiosidades.length > 0 && (
                <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#C5A059] mb-2">Curiosidades</h3>
                  <ul className="space-y-1">
                    {cavaloSelecionado.curiosidades.map((curiosidade, i) => (
                      <li key={i} className="text-sm text-zinc-400">• {curiosidade}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legado */}
              <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                <p className="text-sm text-zinc-500 italic">&quot;{cavaloSelecionado.legado}&quot;</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {cavalosFiltrados.length === 0 && (
        <div className="max-w-6xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={24} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum cavalo encontrado</h3>
          <p className="text-sm text-zinc-500">
            Não existem cavalos famosos nesta categoria
          </p>
        </div>
      )}

      {/* Info */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Conhece um cavalo Lusitano famoso?</h3>
          <p className="text-sm text-zinc-400 mb-4">
            Ajuda-nos a expandir esta galeria de honra sugerindo cavalos que marcaram a história da raça.
          </p>
          <button className="px-6 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-[#C5A059] hover:text-black transition-colors touch-manipulation">
            Sugerir Cavalo
          </button>
        </div>
      </div>
    </main>
  );
}

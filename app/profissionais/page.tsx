"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, MapPin, Phone, Mail, Star, Filter, Stethoscope, Hammer, GraduationCap, Camera, Scissors, Briefcase } from "lucide-react";

interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  categoria: string;
  foto: string;
  localizacao: string;
  distrito: string;
  telefone: string;
  email: string;
  website?: string;
  descricao: string;
  avaliacao: number;
  numAvaliacoes: number;
  servicos: string[];
  verificado: boolean;
  experiencia: number;
}

const categorias = [
  { id: "todos", label: "Todos", icon: Briefcase },
  { id: "veterinario", label: "Veterinários", icon: Stethoscope },
  { id: "ferrador", label: "Ferradores", icon: Hammer },
  { id: "treinador", label: "Treinadores", icon: GraduationCap },
  { id: "fotografo", label: "Fotógrafos", icon: Camera },
  { id: "tosquiador", label: "Tosquiadores", icon: Scissors },
];

const distritos = [
  "Todos",
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
];

// Dados de exemplo - em produção viriam da base de dados
const profissionaisExemplo: Profissional[] = [
  {
    id: "1",
    nome: "Dr. António Silva",
    especialidade: "Veterinário Equino",
    categoria: "veterinario",
    foto: "/placeholder-professional.jpg",
    localizacao: "Lisboa",
    distrito: "Lisboa",
    telefone: "+351 912 345 678",
    email: "dr.antonio@email.pt",
    website: "www.vetequino.pt",
    descricao: "Especialista em medicina equina com foco em ortopedia e medicina desportiva. Mais de 20 anos de experiência com cavalos Lusitanos.",
    avaliacao: 4.9,
    numAvaliacoes: 127,
    servicos: ["Consultas gerais", "Cirurgia", "Ortopedia", "Reprodução", "Emergências 24h"],
    verificado: true,
    experiencia: 22,
  },
  {
    id: "2",
    nome: "Manuel Ferreira",
    especialidade: "Mestre Ferrador",
    categoria: "ferrador",
    foto: "/placeholder-professional.jpg",
    localizacao: "Santarém",
    distrito: "Santarém",
    telefone: "+351 923 456 789",
    email: "manuel.ferrador@email.pt",
    descricao: "Ferrador certificado com especialização em cavalos de desporto e correção de aprumos. Trabalho personalizado.",
    avaliacao: 4.8,
    numAvaliacoes: 89,
    servicos: ["Ferração normal", "Ferração ortopédica", "Correção de aprumos", "Cascos descalços"],
    verificado: true,
    experiencia: 15,
  },
  {
    id: "3",
    nome: "Maria Santos",
    especialidade: "Treinadora de Dressage",
    categoria: "treinador",
    foto: "/placeholder-professional.jpg",
    localizacao: "Porto",
    distrito: "Porto",
    telefone: "+351 934 567 890",
    email: "maria.dressage@email.pt",
    website: "www.mariadressage.pt",
    descricao: "Cavaleira internacional de Dressage. Formação de cavalos jovens e preparação para competição até Grand Prix.",
    avaliacao: 5.0,
    numAvaliacoes: 56,
    servicos: ["Treino de cavalos", "Aulas particulares", "Preparação para competição", "Desbaste"],
    verificado: true,
    experiencia: 18,
  },
  {
    id: "4",
    nome: "João Costa",
    especialidade: "Fotógrafo Equestre",
    categoria: "fotografo",
    foto: "/placeholder-professional.jpg",
    localizacao: "Évora",
    distrito: "Évora",
    telefone: "+351 945 678 901",
    email: "joao.foto@email.pt",
    website: "www.joaocostaphoto.pt",
    descricao: "Fotografia equestre profissional. Especializado em sessões para coudelarias, competições e retratos artísticos.",
    avaliacao: 4.7,
    numAvaliacoes: 43,
    servicos: ["Sessões em coudelaria", "Competições", "Retratos", "Vídeo promocional"],
    verificado: false,
    experiencia: 10,
  },
  {
    id: "5",
    nome: "Dra. Carla Mendes",
    especialidade: "Veterinária - Reprodução",
    categoria: "veterinario",
    foto: "/placeholder-professional.jpg",
    localizacao: "Golegã",
    distrito: "Santarém",
    telefone: "+351 956 789 012",
    email: "carla.repro@email.pt",
    descricao: "Especialista em reprodução equina. Inseminação artificial, transferência de embriões e acompanhamento de gestação.",
    avaliacao: 4.9,
    numAvaliacoes: 78,
    servicos: ["Inseminação artificial", "Transferência de embriões", "Ecografia reprodutiva", "Acompanhamento gestação"],
    verificado: true,
    experiencia: 12,
  },
  {
    id: "6",
    nome: "Pedro Almeida",
    especialidade: "Treinador - Equitação de Trabalho",
    categoria: "treinador",
    foto: "/placeholder-professional.jpg",
    localizacao: "Beja",
    distrito: "Beja",
    telefone: "+351 967 890 123",
    email: "pedro.trabalho@email.pt",
    descricao: "Cavaleiro profissional de Equitação de Trabalho. Campeão nacional e preparador de conjuntos para competição.",
    avaliacao: 4.8,
    numAvaliacoes: 62,
    servicos: ["Treino específico", "Preparação para competição", "Clínicas", "Desbaste campo"],
    verificado: true,
    experiencia: 20,
  },
];

export default function ProfissionaisPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [distritoAtivo, setDistritoAtivo] = useState("Todos");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const profissionaisFiltrados = profissionaisExemplo.filter((p) => {
    const matchPesquisa =
      p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      p.especialidade.toLowerCase().includes(pesquisa.toLowerCase()) ||
      p.servicos.some((s) => s.toLowerCase().includes(pesquisa.toLowerCase()));
    const matchCategoria = categoriaAtiva === "todos" || p.categoria === categoriaAtiva;
    const matchDistrito = distritoAtivo === "Todos" || p.distrito === distritoAtivo;
    return matchPesquisa && matchCategoria && matchDistrito;
  });

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
            Comunidade Lusitano
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4">
            Diretório de Profissionais
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Encontre veterinários, ferradores, treinadores e outros profissionais especializados em cavalos Lusitanos.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto mb-8">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="Pesquisar por nome, especialidade ou serviço..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]/50 transition-colors"
          />
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-[#C5A059] transition-colors lg:hidden touch-manipulation"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Category Tabs - Desktop */}
        <div className="hidden lg:flex items-center gap-2 mb-4">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                categoriaAtiva === cat.id
                  ? "bg-[#C5A059] text-black font-medium"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile Filters */}
        {mostrarFiltros && (
          <div className="lg:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="mb-4">
              <label className="block text-xs text-zinc-400 mb-2">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaAtiva(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all touch-manipulation ${
                      categoriaAtiva === cat.id
                        ? "bg-[#C5A059] text-black font-medium"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    <cat.icon size={14} />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-2">Distrito</label>
              <select
                value={distritoAtivo}
                onChange={(e) => setDistritoAtivo(e.target.value)}
                className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
              >
                {distritos.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Desktop Distrito Filter */}
        <div className="hidden lg:flex items-center gap-4">
          <span className="text-sm text-zinc-500">Filtrar por distrito:</span>
          <select
            value={distritoAtivo}
            onChange={(e) => setDistritoAtivo(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A059]/50"
          >
            {distritos.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <span className="text-sm text-zinc-500 ml-auto">
            {profissionaisFiltrados.length} {profissionaisFiltrados.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto">
        {profissionaisFiltrados.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {profissionaisFiltrados.map((prof) => (
              <div
                key={prof.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#C5A059]/30 transition-colors group"
              >
                {/* Header */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-800 rounded-xl flex-shrink-0 overflow-hidden relative">
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-2xl font-serif">
                        {prof.nome.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{prof.nome}</h3>
                        {prof.verificado && (
                          <span className="flex-shrink-0 w-4 h-4 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#C5A059] mb-1">{prof.especialidade}</p>
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <MapPin size={12} />
                        {prof.localizacao}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-[#C5A059] fill-[#C5A059]" />
                      <span className="text-sm font-medium">{prof.avaliacao}</span>
                    </div>
                    <span className="text-xs text-zinc-500">({prof.numAvaliacoes} avaliações)</span>
                    <span className="text-xs text-zinc-500 ml-auto">{prof.experiencia} anos exp.</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 mt-3 line-clamp-2">{prof.descricao}</p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {prof.servicos.slice(0, 3).map((servico, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400"
                      >
                        {servico}
                      </span>
                    ))}
                    {prof.servicos.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-zinc-500">
                        +{prof.servicos.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-800 p-3 sm:p-4 flex items-center gap-3">
                  <a
                    href={`tel:${prof.telefone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-[#C5A059] hover:text-black transition-colors touch-manipulation"
                  >
                    <Phone size={16} />
                    Ligar
                  </a>
                  <a
                    href={`mailto:${prof.email}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-[#C5A059] hover:text-black transition-colors touch-manipulation"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum profissional encontrado</h3>
            <p className="text-sm text-zinc-500">
              Tente ajustar os filtros ou termos de pesquisa
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 rounded-xl p-6 sm:p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">É profissional do sector equestre?</h3>
            <p className="text-sm text-zinc-400">
              Junte-se ao nosso diretório e alcance criadores e proprietários em todo o país.
            </p>
          </div>
          <button className="mt-4 sm:mt-0 px-6 py-3 bg-[#C5A059] text-black font-medium rounded-lg hover:bg-[#D4AF6A] transition-colors touch-manipulation">
            Registar-se
          </button>
        </div>
      </div>
    </main>
  );
}

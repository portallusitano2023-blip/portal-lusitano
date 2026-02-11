"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Users, CalendarDays, FileText, ShieldCheck } from "lucide-react";

import type {
  CategoriaProf,
  NivelVerificacao,
  Profissional,
} from "@/components/profissionais/types";
import {
  profissionaisDB,
  eventosDB,
  artigosDB,
  calcularEstatisticas,
} from "@/components/profissionais/data";
import {
  EstatisticasCard,
  CardProfissional,
  ModalProfissional,
  EventosSection,
  SearchFilters,
  CategoriasTabs,
} from "@/components/profissionais";

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ProfissionaisPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaProf | "todos">("todos");
  const [distritoAtivo, setDistritoAtivo] = useState("Todos");
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [filtroVerificacao, setFiltroVerificacao] = useState<NivelVerificacao | "todos">("todos");
  const [abaAtiva, setAbaAtiva] = useState<"profissionais" | "eventos" | "artigos">(
    "profissionais"
  );

  const stats = useMemo(() => calcularEstatisticas(), []);

  const profissionaisFiltrados = useMemo(() => {
    return profissionaisDB
      .filter((p) => {
        const matchPesquisa =
          p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          p.especialidade.toLowerCase().includes(pesquisa.toLowerCase()) ||
          p.servicos.some((s) => s.toLowerCase().includes(pesquisa.toLowerCase()));
        const matchCategoria = categoriaAtiva === "todos" || p.categoria === categoriaAtiva;
        const matchDistrito = distritoAtivo === "Todos" || p.distrito === distritoAtivo;
        const matchVerificacao =
          filtroVerificacao === "todos" || p.nivelVerificacao === filtroVerificacao;
        return matchPesquisa && matchCategoria && matchDistrito && matchVerificacao;
      })
      .sort((a, b) => {
        const nivelOrder = { expert: 4, certificado: 3, verificado: 2, basico: 1 };
        const nivelDiff = nivelOrder[b.nivelVerificacao] - nivelOrder[a.nivelVerificacao];
        if (nivelDiff !== 0) return nivelDiff;
        return b.avaliacao - a.avaliacao;
      });
  }, [pesquisa, categoriaAtiva, distritoAtivo, filtroVerificacao]);

  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-32 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar</span>
        </Link>
        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] font-bold block mb-2">
            Comunidade Lusitana
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif italic mb-4">Rede Profissional</h1>
          <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
            A maior rede de profissionais especializados em cavalos Lusitanos em Portugal.
            Veterinários, ferradores, treinadores e mais.
          </p>
        </div>
      </div>

      {/* Estatisticas */}
      <div className="max-w-7xl mx-auto mb-8">
        <EstatisticasCard stats={stats} />
      </div>

      {/* Tabs principais */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 border-b border-zinc-800 pb-3">
          {[
            { id: "profissionais" as const, label: "Profissionais", icon: Users },
            { id: "eventos" as const, label: "Eventos", icon: CalendarDays },
            { id: "artigos" as const, label: "Artigos", icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setAbaAtiva(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${abaAtiva === t.id ? "bg-[#C5A059] text-black font-medium" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {abaAtiva === "profissionais" && (
        <>
          {/* Categorias */}
          <div className="max-w-7xl mx-auto mb-6">
            <CategoriasTabs categoriaAtiva={categoriaAtiva} onCategoriaChange={setCategoriaAtiva} />
          </div>

          {/* Filtros e Pesquisa */}
          <div className="max-w-7xl mx-auto mb-6">
            <SearchFilters
              pesquisa={pesquisa}
              onPesquisaChange={setPesquisa}
              distritoAtivo={distritoAtivo}
              onDistritoChange={setDistritoAtivo}
              filtroVerificacao={filtroVerificacao}
              onVerificacaoChange={setFiltroVerificacao}
              totalResultados={profissionaisFiltrados.length}
            />
          </div>

          {/* Grid de Profissionais */}
          <div className="max-w-7xl mx-auto" aria-live="polite" aria-atomic="true">
            {profissionaisFiltrados.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {profissionaisFiltrados.map((prof) => (
                  <CardProfissional
                    key={prof.id}
                    prof={prof}
                    onClick={() => setProfissionalSelecionado(prof)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search size={32} className="mx-auto mb-4 text-zinc-600" />
                <h3 className="text-lg font-medium mb-2">Nenhum profissional encontrado</h3>
                <p className="text-sm text-zinc-500">Tente ajustar os filtros</p>
              </div>
            )}
          </div>
        </>
      )}

      {abaAtiva === "eventos" && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Próximos Eventos</h2>
          <EventosSection eventos={eventosDB} />
        </div>
      )}

      {abaAtiva === "artigos" && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Artigos Educativos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {artigosDB.map((a) => (
              <div
                key={a.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-[#C5A059]/30 transition-colors"
              >
                <span className="text-xs text-[#C5A059]">{a.categoria}</span>
                <h3 className="font-medium text-white mt-1">{a.titulo}</h3>
                <p className="text-sm text-zinc-400 mt-2">{a.resumo}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
                  <span>{a.autor}</span>
                  <span>{a.leituras.toLocaleString()} leituras</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 rounded-xl p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">É profissional do sector equestre?</h3>
              <p className="text-sm text-zinc-400">
                Junte-se à nossa rede verificada e alcance milhares de criadores e proprietários.
              </p>
            </div>
            <button className="mt-4 sm:mt-0 px-6 py-3 bg-[#C5A059] text-black font-medium rounded-lg hover:bg-[#D4AF6A] transition-colors flex items-center gap-2">
              <ShieldCheck size={18} />
              Registar-se
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {profissionalSelecionado && (
        <ModalProfissional
          profissional={profissionalSelecionado}
          onClose={() => setProfissionalSelecionado(null)}
        />
      )}
    </main>
  );
}

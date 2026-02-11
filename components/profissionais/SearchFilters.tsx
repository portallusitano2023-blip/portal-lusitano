import { Search } from "lucide-react";
import { distritos } from "./constants";
import type { NivelVerificacao } from "./types";

interface SearchFiltersProps {
  pesquisa: string;
  onPesquisaChange: (value: string) => void;
  distritoAtivo: string;
  onDistritoChange: (value: string) => void;
  filtroVerificacao: NivelVerificacao | "todos";
  onVerificacaoChange: (value: NivelVerificacao | "todos") => void;
  totalResultados: number;
}

export function SearchFilters({
  pesquisa,
  onPesquisaChange,
  distritoAtivo,
  onDistritoChange,
  filtroVerificacao,
  onVerificacaoChange,
  totalResultados,
}: SearchFiltersProps) {
  return (
    <div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={pesquisa}
            onChange={(e) => onPesquisaChange(e.target.value)}
            placeholder="Pesquisar profissional..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A059]/50"
          />
        </div>
        <select
          value={distritoAtivo}
          onChange={(e) => onDistritoChange(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A059]/50"
        >
          {distritos.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={filtroVerificacao}
          onChange={(e) => onVerificacaoChange(e.target.value as NivelVerificacao | "todos")}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A059]/50"
        >
          <option value="todos">Todos os niveis</option>
          <option value="expert">Expert</option>
          <option value="certificado">Certificado</option>
          <option value="verificado">Verificado</option>
        </select>
      </div>
      <div className="mt-3 text-xs text-zinc-500">{totalResultados} profissionais encontrados</div>
    </div>
  );
}

"use client";

import { Trophy, Users } from "lucide-react";
import { CavaloFamoso } from "@/app/cavalos-famosos/types";

interface CavaloCardProps {
  cavalo: CavaloFamoso;
  onClick: () => void;
  variant?: "destaque" | "normal";
}

export function CavaloCard({ cavalo, onClick, variant = "destaque" }: CavaloCardProps) {
  if (variant === "destaque") {
    return (
      <button
        onClick={onClick}
        className="group bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-[#C5A059]/20 rounded-2xl overflow-hidden text-left hover:border-[#C5A059]/50 transition-all touch-manipulation w-full"
      >
        {/* Image Placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-[#C5A059]/20 to-transparent relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-serif text-[#C5A059]/30">{cavalo.nome.charAt(0)}</span>
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 bg-[#C5A059] rounded text-xs font-medium text-black">
              {cavalo.disciplina}
            </span>
            <span className="px-2 py-1 bg-zinc-900/80 rounded text-xs text-zinc-300">
              {cavalo.linhagem}
            </span>
          </div>
          {cavalo.influenciaGenetica && cavalo.influenciaGenetica > 5 && (
            <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/50 rounded-full px-2 py-1">
              <span className="text-xs text-green-400 font-mono">{cavalo.influenciaGenetica}%</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-xl font-serif text-white mb-1 group-hover:text-[#C5A059] transition-colors">
            {cavalo.nome}
          </h3>
          {cavalo.apelido && (
            <p className="text-sm text-[#C5A059] italic mb-2">&quot;{cavalo.apelido}&quot;</p>
          )}
          <p className="text-xs text-zinc-500 mb-3">
            {cavalo.anoNascimento} {cavalo.anoFalecimento ? `- ${cavalo.anoFalecimento}` : ""} •{" "}
            {cavalo.coudelaria}
          </p>
          <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{cavalo.legado}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-[#C5A059]" />
              <span className="text-xs text-zinc-500">{cavalo.conquistas.length} conquistas</span>
            </div>
            {cavalo.estatisticasDescendentes && (
              <div className="flex items-center gap-2">
                <Users size={14} className="text-zinc-500" />
                <span className="text-xs text-zinc-500">
                  {cavalo.estatisticasDescendentes.totalDescendentes} desc.
                </span>
              </div>
            )}
          </div>
        </div>
      </button>
    );
  }

  // Variante Normal (compact)
  return (
    <button
      onClick={onClick}
      className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-left hover:border-[#C5A059]/30 transition-all touch-manipulation w-full"
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
          <div className="flex gap-1">
            <span className="inline-block px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">
              {cavalo.disciplina}
            </span>
            <span className="inline-block px-2 py-0.5 bg-zinc-800/50 rounded text-xs text-zinc-500">
              {cavalo.linhagem}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-zinc-500 mt-3 line-clamp-2">{cavalo.legado}</p>
      {cavalo.influenciaGenetica && (
        <div className="mt-2 text-xs text-zinc-600">
          Influência genética: <span className="text-[#C5A059]">{cavalo.influenciaGenetica}%</span>
        </div>
      )}
    </button>
  );
}

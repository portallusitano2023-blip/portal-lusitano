"use client";

import { Star, Trophy, Award, Medal, Check, TreeDeciduous, Crown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Result } from "@/components/analise-perfil/types";

interface ProfileTabProps {
  result: Result;
}

export default function ProfileTab({ result }: ProfileTabProps) {
  const { t } = useLanguage();

  return (
    <div key="perfil" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <Star className="text-[#C5A059]" size={20} />
          {t.analise_perfil.characteristics_title}
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {result.characteristics.map((c, i) => (
            <div
              key={c}
              className="flex items-center gap-3 text-zinc-300 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-6 h-6 bg-[#C5A059]/10 rounded-full flex items-center justify-center">
                <Check className="text-[#C5A059]" size={14} />
              </div>
              {c}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <Trophy className="text-[#C5A059]" size={20} />
          {t.analise_perfil.disciplines_title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.disciplinas.map((d) => (
            <span key={d} className="bg-[#C5A059]/10 text-[#C5A059] px-4 py-2 text-sm">
              {d}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <Award className="text-[#C5A059]" size={20} />
          {t.analise_perfil.reference_horses}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {result.famousHorses.map((h, i) => (
            <div
              key={h.name}
              className="flex items-start gap-3 p-4 bg-zinc-800/30 border border-white/5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-10 h-10 bg-[#C5A059]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Medal className="text-[#C5A059]" size={18} />
              </div>
              <div>
                <h4 className="text-white font-medium">{h.name}</h4>
                <p className="text-sm text-zinc-500">{h.achievement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <TreeDeciduous className="text-[#C5A059]" size={20} />
          {t.analise_perfil.suggested_lineages}
        </h3>
        <div className="space-y-4">
          {result.linhagens.map((l, i) => (
            <div
              key={l.name}
              className="flex items-start gap-4 p-4 bg-zinc-800/30 border border-white/5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-10 h-10 bg-[#C5A059]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Crown className="text-[#C5A059]" size={18} />
              </div>
              <div>
                <h4 className="text-white font-medium">{l.name}</h4>
                <p className="text-sm text-zinc-500">{l.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

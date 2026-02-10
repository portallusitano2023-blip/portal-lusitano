import { MapPin } from "lucide-react";

export function EstudoCard({
  regiao,
  tEqui,
  bCaballi,
  fonte,
  metodo,
}: {
  regiao: string;
  tEqui: string;
  bCaballi: string;
  fonte: string;
  metodo: string;
}) {
  return (
    <div className="bg-zinc-800/40 rounded-xl p-4 sm:p-5 border border-zinc-700/30 transition-all duration-200 hover:scale-[1.02] hover:border-[#C5A059]/25">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#C5A059]" />
          <span className="text-sm font-medium text-white">{regiao}</span>
        </div>
        <span className="text-[9px] bg-zinc-700/50 text-zinc-400 px-2 py-0.5 rounded-full">
          {metodo}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/5 rounded-lg p-3 text-center">
          <span className="text-[10px] text-zinc-500 block mb-1">T. equi</span>
          <span className="text-xl font-bold text-red-400">{tEqui}</span>
        </div>
        <div className="bg-orange-500/5 rounded-lg p-3 text-center">
          <span className="text-[10px] text-zinc-500 block mb-1">B. caballi</span>
          <span className="text-xl font-bold text-orange-400">{bCaballi}</span>
        </div>
      </div>
      <p className="text-[10px] text-zinc-600 mt-3 italic">{fonte}</p>
    </div>
  );
}

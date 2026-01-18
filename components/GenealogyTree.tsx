// @ts-nocheck
"use client";

export default function GenealogyTree({ horse }) {
  return (
    <div className="w-full bg-zinc-950/50 p-12 border border-zinc-900 overflow-x-auto">
      <h3 className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] font-bold mb-16 text-center">Criptogenética: Linhagem de Sangue</h3>
      
      <div className="flex justify-center items-center gap-8 min-w-[800px]">
        
        {/* EXEMPLAR ATUAL */}
        <div className="w-64 text-center">
          <div className="border border-[#C5A059] p-6 bg-black/40">
            <p className="text-[#C5A059] text-[8px] uppercase font-bold mb-2">Exemplar</p>
            <p className="font-serif text-xl italic text-white">{horse.nome_cavalo}</p>
          </div>
        </div>

        <div className="h-px w-12 bg-zinc-800"></div>

        {/* PAIS */}
        <div className="flex flex-col gap-12">
          <div className="w-56 border border-zinc-800 p-4 hover:border-[#C5A059] transition-all">
            <p className="text-zinc-600 text-[8px] uppercase font-bold mb-1">Pai (Sire)</p>
            <p className="font-serif text-sm italic text-white">{horse.pai || "Ancestral de Elite"}</p>
          </div>
          <div className="w-56 border border-zinc-800 p-4 hover:border-[#C5A059] transition-all">
            <p className="text-zinc-600 text-[8px] uppercase font-bold mb-1">Mãe (Dam)</p>
            <p className="font-serif text-sm italic text-white">{horse.mae || "Ventre de Ouro"}</p>
          </div>
        </div>

        <div className="h-px w-12 bg-zinc-800"></div>

        {/* AVÓS (RESUMO) */}
        <div className="flex flex-col gap-4">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="w-48 border border-zinc-900 p-3 opacity-60 hover:opacity-100 transition-all">
                <p className="text-zinc-700 text-[7px] uppercase font-bold">G2 Ancestor</p>
                <p className="font-serif text-[10px] italic text-zinc-400">Linhagem Consagrada</p>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
}
// @ts-nocheck
import React from 'react';

// Componente auxiliar para o Cartão de Ancestral
const AncestorCard = ({ type, name, reg, isFemale = false }) => (
  <div className={`
    relative p-4 border transition-all duration-500 group min-w-[180px]
    ${isFemale ? 'border-zinc-900 bg-zinc-950/30' : 'border-zinc-800 bg-zinc-950/60'}
    hover:border-[#C5A059] hover:bg-zinc-900
  `}>
    <span className="text-[8px] uppercase tracking-widest text-zinc-600 block mb-1 group-hover:text-[#C5A059] transition-colors">
      {type}
    </span>
    <p className="font-serif italic text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis">
      {name || "Não registado"}
    </p>
    {/* Número de Registo Fictício para visual (podes adicionar na DB depois) */}
    <p className="text-[7px] text-zinc-700 font-mono mt-1">
      {reg || "N/A"}
    </p>
    
    {/* Ponto de Conexão Visual */}
    <div className="absolute -right-3 top-1/2 w-3 h-px bg-zinc-800 group-hover:bg-[#C5A059] transition-colors"></div>
  </div>
);

export default function Pedigree({ cavalo }) {
  return (
    <div className="w-full overflow-x-auto py-12 border border-zinc-900 bg-black">
      <div className="flex items-center justify-center min-w-[800px] gap-8 px-8">
        
        {/* COLUNA 1: O Cavalo (HERÓI) */}
        <div className="flex flex-col justify-center">
           <div className="border border-[#C5A059] bg-[#C5A059]/10 p-6 min-w-[200px] relative">
              <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-2">O Exemplar</span>
              <h3 className="text-xl font-serif italic text-white">{cavalo.nome_cavalo}</h3>
              <div className="absolute -left-3 top-1/2 w-3 h-px bg-[#C5A059]"></div>
           </div>
        </div>

        {/* Conector Central */}
        <div className="h-px w-10 bg-zinc-800"></div>

        {/* COLUNA 2: Pais (Sire & Dam) */}
        <div className="flex flex-col gap-16 relative">
          {/* Linhas de conexão verticais */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-zinc-800 -ml-5 border-l border-zinc-800"></div>
          <div className="absolute left-0 top-1/4 w-5 h-px bg-zinc-800 -ml-5"></div>
          <div className="absolute left-0 bottom-1/4 w-5 h-px bg-zinc-800 -ml-5"></div>

          {/* PAI */}
          <div className="relative">
             <AncestorCard type="Pai (Sire)" name={cavalo.pai} reg="LUS-2938" />
             {/* Conector para Avós */}
             <div className="absolute -right-8 top-1/2 w-8 h-px bg-zinc-800"></div>
          </div>

          {/* MÃE */}
          <div className="relative">
             <AncestorCard type="Mãe (Dam)" name={cavalo.mae} reg="LUS-1102" isFemale={true} />
             {/* Conector para Avós */}
             <div className="absolute -right-8 top-1/2 w-8 h-px bg-zinc-800"></div>
          </div>
        </div>

        {/* COLUNA 3: Avós (Grandparents) - Simulados visualmente */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mb-8 relative">
             {/* Conectores */}
             <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-zinc-800 -ml-4"></div>
             <div className="absolute left-0 top-1/4 w-4 h-px bg-zinc-800 -ml-4"></div>
             <div className="absolute left-0 bottom-1/4 w-4 h-px bg-zinc-800 -ml-4"></div>
             
             <AncestorCard type="Avô Paterno" name="Zimbro" reg="VEIGA" />
             <AncestorCard type="Avó Paterna" name="Xarola" reg="VEIGA" isFemale={true} />
          </div>

          <div className="flex flex-col gap-2 relative">
             {/* Conectores */}
             <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-zinc-800 -ml-4"></div>
             <div className="absolute left-0 top-1/4 w-4 h-px bg-zinc-800 -ml-4"></div>
             <div className="absolute left-0 bottom-1/4 w-4 h-px bg-zinc-800 -ml-4"></div>

             <AncestorCard type="Avô Materno" name="Uivador" reg="ANDRADE" />
             <AncestorCard type="Avó Materna" name="Toleirona" reg="ANDRADE" isFemale={true} />
          </div>
        </div>

      </div>
    </div>
  );
}
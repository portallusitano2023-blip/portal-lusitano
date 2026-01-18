// @ts-nocheck
import Navbar from "@/components/Navbar";

// SOLUÇÃO DE ENGENHARIA: Declarar as fórmulas como strings constantes fora do componente
const FORMULA_IMPULSAO = "$$ \\vec{F}_{res} = \\sum \\vec{F}_{post} \\cdot \\cos(\\theta) - \\mu \\cdot \\vec{N} $$";
const FORMULA_EQUILIBRIO = "$$ \\Phi = \\frac{A+B}{A} \\approx 1.618 $$";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-48 pb-60 selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* FASE 1: A GÉNISE (O SIMPLES) */}
          <header className="mb-64 border-b border-zinc-900 pb-20">
            <span className="text-[#C5A059] uppercase tracking-[1.5em] text-[9px] font-bold block mb-10 italic">I. Da Poeira dos Milénios</span>
            <h1 className="text-8xl md:text-[14rem] font-serif italic tracking-tighter leading-none mb-20">
              O Mito <br /> <span className="text-[#C5A059]">Vivo</span>
            </h1>
            <p className="max-w-4xl text-zinc-500 text-2xl font-light leading-relaxed italic">
              "O Cavalo Lusitano é a ponte entre o mundo antigo e a equitação do futuro. Uma simbiose perfeita entre a coragem indómita e a inteligência de corte."
            </p>
          </header>

          {/* FASE 2: AS QUATRO LINHAGENS (CONHECIMENTO BASE) */}
          <section className="mb-64">
            <h2 className="text-[#C5A059] uppercase tracking-[0.8em] text-xs font-bold mb-24 text-center">II. As Fontes do Sangue Real</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
              <div className="bg-black p-16 space-y-8">
                <h3 className="text-4xl font-serif italic text-white">Veiga (MV)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">
                  A linhagem do fogo. Selecionada para a reatividade explosiva no toureio, apresenta o perfil sub-convexo mais puro e uma biomecânica de pivots instantâneos.
                </p>
              </div>
              <div className="bg-black p-16 space-y-8">
                <h3 className="text-4xl font-serif italic text-white">Andrade (SA)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">
                  A linhagem da funcionalidade. Cavalos de alçada superior e andamentos elásticos, fundamentais para a projeção do Lusitano no Grand Prix de Dressage internacional.
                </p>
              </div>
              <div className="bg-black p-16 space-y-8">
                <h3 className="text-4xl font-serif italic text-white">Alter-Real (AR)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">
                  A aristocracia preservada. Fundada em 1748, mantém a cadência majestosa e a elegância rítmica da Escola Portuguesa de Arte Equestre.
                </p>
              </div>
              <div className="bg-black p-16 space-y-8">
                <h3 className="text-4xl font-serif italic text-white">C. Nacional (CN)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">
                  O fiel da balança. O repositório genético que garante a homogeneidade e a pureza morfológica do Stud-Book oficial.
                </p>
              </div>
            </div>
          </section>

          {/* FASE 3: COMPLEXIDADE MÁXIMA (A CIÊNCIA) */}
          <section className="mb-64 space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
              <div className="space-y-16">
                <h2 className="text-[#C5A059] uppercase tracking-widest text-xs font-bold border-l-4 border-[#C5A059] pl-10">III. Antropometria e Vectores de Reunião</h2>
                <div className="space-y-10 text-zinc-300 font-light leading-relaxed text-2xl">
                  <p>
                    Analisamos a **Equação de Impulsão Dinâmica**, onde a resultante das forças nos posteriores é transposta para a elevação vertical do terço anterior.
                  </p>
                  <div className="p-12 bg-zinc-950 border border-zinc-900 font-serif text-[#C5A059] shadow-2xl">
                    <p className="text-[10px] uppercase tracking-widest mb-8 opacity-60">Resultante de Força de Reunião</p>
                    <p className="text-3xl">{FORMULA_IMPULSAO}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-12">
                <h3 className="text-5xl font-serif italic">A Geometria de Phi ($\Phi$)</h3>
                <p className="text-zinc-400 font-light text-xl leading-relaxed">
                  O Lusitano é o único cavalo que se inscreve num quadrado perfeito. Esta proporção áurea permite que o centro de gravidade se desloque sem perda de balanço.
                </p>
                <div className="p-8 border border-zinc-900 text-white italic text-center text-3xl">
                   {FORMULA_EQUILIBRIO}
                </div>
              </div>
            </div>
          </section>

          {/* FASE 4: O NUNCA VISTO (A VISÃO PORTAL LUSITANO) */}
          <section className="py-60 text-center space-y-20 border-t border-zinc-900">
            <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-12">IV. A Singularidade Portal Lusitano</span>
            <h2 className="text-7xl md:text-9xl font-serif italic leading-tight">Sangue <br /> & <span className="text-[#C5A059]">Algoritmo</span></h2>
            <p className="max-w-4xl mx-auto text-zinc-400 text-xl font-light italic leading-loose">
              "Não estamos a construir um marketplace. Estamos a construir o primeiro repositório de Inteligência Hipológica Global. Onde a tradição milenar das coudelarias encontra a precisão analítica do século XXI."
            </p>
            <div className="w-px h-60 bg-gradient-to-b from-[#C5A059] to-transparent mx-auto"></div>
          </section>

        </div>
      </main>
    </>
  );
}
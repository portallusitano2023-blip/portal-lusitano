// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-48 pb-60 selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* CAMADA I: A GÉNESE DO MITO (O Início Simples) */}
          <header className="mb-64">
            <span className="text-[#C5A059] uppercase tracking-[1.5em] text-[10px] font-bold block mb-12 italic text-center">I. A Gesta do Cavalo de Reis</span>
            <h1 className="text-7xl md:text-[14rem] font-serif italic tracking-tighter leading-none mb-20 text-center">
              Puro Sangue <br /> <span className="text-[#C5A059]">Lusitano</span>
            </h1>
            <p className="max-w-4xl mx-auto text-zinc-500 text-2xl font-light leading-relaxed italic text-center">
              "Um legado de cinco milénios que moldou a alma de Portugal, unindo a força do cavalo de guerra à elegância da corte." [cite: 2026-01-18]
            </p>
            <div className="w-px h-40 bg-gradient-to-b from-[#C5A059] to-transparent mx-auto mt-20"></div>
          </header>

          {/* CAMADA II: AS QUATRO LINHAGENS FUNDAMENTAIS (A Base Técnica) */}
          <section className="mb-64 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1px bg-zinc-900 border border-zinc-900">
            {[
              { t: "Veiga (MV)", d: "O expoente da reatividade sináptica. Criado para o toureio, apresenta o perfil sub-convexo mais pronunciado e uma agilidade felina indómita." },
              { t: "Andrade (SA)", d: "A base da funcionalidade desportiva. Cavalos de alçada superior e andamentos elásticos, fundamentais para a Dressage internacional." },
              { t: "Alter-Real (AR)", d: "A aristocracia da Alta Escola. Fundada em 1748, preserva a cadência majestosa e a baía castanha da Corte Portuguesa." },
              { t: "C. Nacional (CN)", d: "O guardião do equilíbrio morfológico. Repositório genético que garante a homogeneidade e a pureza do standard oficial." }
            ].map((l, i) => (
              <div key={i} className="bg-black p-12 space-y-6">
                <h3 className="text-[#C5A059] font-serif italic text-2xl">{l.t}</h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">{l.d} [cite: 2026-01-16, 2026-01-18]</p>
              </div>
            ))}
          </section>

          {/* CAMADA III: TRATADO DE HIPOMETRIA AVANÇADA (A Complexidade Máxima) */}
          <section className="mb-64 space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-16">
                <h2 className="text-[#C5A059] uppercase tracking-widest text-xs font-bold border-l-4 border-[#C5A059] pl-10">III. Antropometria e Biomecânica Vectorial</h2>
                <div className="space-y-8 text-zinc-300 font-light leading-relaxed text-xl">
                  <p>
                    Analisamos a **Equação de Impulsão Longitudinal**, onde a resultante das forças nos posteriores ($\vec{F}$) é convertida em elevação através do ângulo de engajamento ($\theta$). [cite: 2026-01-18]
                  </p>
                  {/* FIX: Fórmulas envoltas em strings para evitar ReferenceError */}
                  <div className="p-12 bg-zinc-950 border border-zinc-900 font-serif text-[#C5A059] shadow-2xl">
                    <p className="text-[10px] uppercase tracking-widest mb-8 opacity-60">Resultante de Forças de Reunião</p>
                    <p className="text-3xl">
                      {"$$ \\vec{F}_{res} = \\sum \\vec{F}_{post} \\cdot \\cos(\\theta) - \\mu \\cdot \\vec{N} $$"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-12 border-l border-zinc-900 pl-20">
                <h3 className="text-4xl font-serif italic">O Índice Cefálico e o Perfil</h3>
                <p className="text-zinc-500 font-light leading-relaxed text-lg italic">
                  "O perfil sub-convexo do Lusitano facilita a flexão cervical de nuca, reduzindo a tensão no ligamento nucal e permitindo a leveza absoluta." [cite: 2026-01-18]
                </p>
                <div className="grid grid-cols-2 gap-8 text-[9px] uppercase tracking-widest text-zinc-600 font-bold">
                  <div className="border border-zinc-900 p-6">Ângulo Escápulo-Humeral: 60º-65º</div>
                  <div className="border border-zinc-900 p-6">Ângulo Coxo-Femoral: 90º</div>
                </div>
              </div>
            </div>
          </section>

          {/* CAMADA IV: A SINGULARIDADE PORTAL LUSITANO (O Nunca Visto) */}
          <section className="py-60 text-center space-y-20 border-t border-zinc-900">
            <h2 className="text-6xl md:text-8xl font-serif italic">Onde o Sangue encontra o <span className="text-[#C5A059]">Dígito</span>.</h2>
            <p className="max-w-4xl mx-auto text-zinc-400 text-xl font-light italic leading-loose">
              "O Portal Lusitano não é um marketplace. É a primeira plataforma de inteligência equestre do mundo que utiliza análise biométrica e algoritmos de nobreza para projetar o Lusitano ao topo da exclusividade global." [cite: 2026-01-15, 2026-01-18]
            </p>
            <div className="w-px h-40 bg-gradient-to-b from-[#C5A059] to-transparent mx-auto"></div>
          </section>

        </div>
      </main>
    </>
  );
}
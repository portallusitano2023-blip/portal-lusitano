// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-48 pb-40 selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* TÍTULO MAGNÂNIMO */}
          <header className="mb-40 border-l border-[#C5A059]/30 pl-10">
            <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-8 italic">Tratado de Morfologia e Estudo Biomecânico</span>
            <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none mb-12">
              Puro Sangue <br /> <span className="text-[#C5A059]">Lusitano</span>
            </h1>
            <p className="max-w-3xl text-zinc-500 text-lg font-light leading-relaxed">
              O Lusitano é o cavalo de sela mais antigo do mundo, um animal **mesomorfo** e **eumétrico** que preserva a geometria sagrada da equitação clássica. [cite: 2026-01-16, 2026-01-18]
            </p>
          </header>

          {/* SECÇÃO I: A CABEÇA E O PERFIL SUB-CONVEXO */}
          <section className="mb-56 space-y-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10">
                <h2 className="text-4xl font-serif italic text-white underline decoration-[#C5A059]/30 underline-offset-[20px]">I. A Expressão da Nobreza</h2>
                <div className="space-y-6 text-zinc-400 font-light leading-relaxed text-lg">
                  <p>
                    O crânio do Lusitano apresenta um perfil **sub-convexo**, uma característica biomecânica que facilita a flexão da nuca e a submissão ao freio. As arcadas orbitais devem ser pouco salientes e os olhos vivos e expressivos. [cite: 2026-01-18]
                  </p>
                  <p>
                    Diferente de outras raças, a cabeça do PSL é de comprimento médio, seca e de ganachas pouco carnudas, permitindo uma liberdade de movimentos essencial para a **Alta Escola**. [cite: 2026-01-18]
                  </p>
                </div>
              </div>
              <div className="p-12 bg-zinc-950 border border-zinc-900">
                <h4 className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold mb-6">Nota Técnica de Engenharia</h4>
                <p className="text-sm text-zinc-500 italic mb-6">
                  A agilidade do Lusitano pode ser quantificada pela sua capacidade de transferência de massa longitudinal: [cite: 2026-01-03]
                </p>
                {/* CORREÇÃO DO ERRO: Fórmulas como Strings para evitar o ReferenceError */}
                <p className="text-[#C5A059] text-2xl font-serif">
                  {"$$ Agilidade = \\frac{Engajamento}{Equilíbrio} $$"}
                </p>
              </div>
            </div>
          </section>

          {/* SECÇÃO II: AS 4 ESTIRPES (LINHAGENS) AO PORMENOR */}
          <section className="mb-56 space-y-20">
            <h2 className="text-center text-[#C5A059] uppercase tracking-[0.5em] text-xs font-bold">II. Estudo Genético e Linhagens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-zinc-950/40 p-12 border border-zinc-900 group hover:border-[#C5A059]/50 transition-all duration-700">
                <h3 className="text-3xl font-serif italic mb-6">Veiga (MV)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">
                  Considerada a linhagem mais pura para o toureio. Cavalos com formas arredondadas, reatividade explosiva e uma coragem indómita. São animais de "vontade própria", ideais para a luta no campo e na arena. [cite: 2026-01-16, 2026-01-18]
                </p>
              </div>
              <div className="bg-zinc-950/40 p-12 border border-zinc-900 group hover:border-[#C5A059]/50 transition-all duration-700">
                <h3 className="text-3xl font-serif italic mb-6">Andrade (SA)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">
                  A base do Lusitano de desporto moderno. São cavalos mais altos, com garupas horizontais e andamentos largos. Esta linhagem é a responsável pela projeção do PSL no Grand Prix de Dressage mundial. [cite: 2026-01-16, 2026-01-18]
                </p>
              </div>
              <div className="bg-zinc-950/40 p-12 border border-zinc-900 group hover:border-[#C5A059]/50 transition-all duration-700">
                <h3 className="text-3xl font-serif italic mb-6">Alter-Real (AR)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">
                  A linhagem real fundada em 1748. Criados especificamente para a Alta Escola da corte, mantêm a elegância e a cadência necessárias para exercícios como o *Piaffe* e o *Passage*. [cite: 2026-01-16, 2026-01-18]
                </p>
              </div>
              <div className="bg-zinc-950/40 p-12 border border-zinc-900 group hover:border-[#C5A059]/50 transition-all duration-700">
                <h3 className="text-3xl font-serif italic mb-6">Coudelaria Nacional (CN)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">
                  O centro de equilíbrio da raça. Esta linhagem foca na manutenção do standard oficial da APSL, servindo como o repositório genético que garante a homogeneidade morfológica da raça. [cite: 2026-01-16, 2026-01-18]
                </p>
              </div>
            </div>
          </section>

          {/* SECÇÃO III: BIOMECÂNICA DE REUNIÃO */}
          <section className="py-40 bg-zinc-950 border-y border-zinc-900 text-center px-10">
            <h2 className="text-5xl font-serif italic mb-12">A Mecânica da Reunião</h2>
            <p className="max-w-4xl mx-auto text-zinc-400 font-light text-xl leading-relaxed italic mb-16">
              "A aptidão natural do Lusitano para os ares de escola reside na sua capacidade de fletir os jarretes sob a massa, transferindo o centro de gravidade para os posteriores de forma instantânea." [cite: 2026-01-18]
            </p>
            <div className="inline-block p-10 border border-[#C5A059]/20 font-serif text-[#C5A059] text-3xl">
              {"$$ CG = \\int_{0}^{L} x \\cdot \\rho(x) \\, dx $$"}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
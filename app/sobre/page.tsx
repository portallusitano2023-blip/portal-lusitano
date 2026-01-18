// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white selection:bg-[#C5A059] selection:text-black">
        
        {/* CAMADA 1: A GÉNERO (O Início Simples) */}
        <section className="pt-60 pb-40 px-6 max-w-7xl mx-auto border-b border-zinc-900">
          <div className="max-w-4xl">
            <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-12">I. A Origem do Guerreiro</span>
            <h2 className="text-7xl md:text-9xl font-serif italic tracking-tighter mb-16">Do Sorraia ao <span className="text-[#C5A059]">Puro Sangue</span></h2>
            <p className="text-zinc-400 text-2xl font-light leading-relaxed italic">
              "Há cinco mil anos, nas planícies da Península Ibérica, o cavalo Lusitano começou a moldar a história da humanidade. O que começou como um parceiro de sobrevivência, tornou-se o cavalo de reis e conquistadores." [cite: 2026-01-18]
            </p>
          </div>
        </section>

        {/* CAMADA 2: AS ESTIRPES (A Base Genética) */}
        <section className="py-40 px-6 max-w-7xl mx-auto border-b border-zinc-900">
          <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-24 text-center">II. As Quatro Colunas da Raça</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h3 className="text-3xl font-serif italic text-[#C5A059]">Veiga (MV)</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">O expoente do fogo. Criado para o toureio, o Veiga é a reatividade pura. Uma linhagem compacta, felina e de uma coragem que desafia a razão. [cite: 2026-01-18]</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-serif italic text-[#C5A059]">Andrade (SA)</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">A força do desporto moderno. Cavalos de maior alçada e andamentos largos. É o motor genético que colocou o Lusitano no Grand Prix de Dressage. [cite: 2026-01-18]</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-serif italic text-[#C5A059]">Alter-Real (AR)</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">A aristocracia. Fundada pela coroa portuguesa em 1748, preserva a arte da Alta Escola e a cadência majestosa dos ares de escola. [cite: 2026-01-18]</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-serif italic text-[#C5A059]">C. Nacional (CN)</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">O padrão. O fiel da balança que garante a preservação do Stud-Book e a harmonia morfológica que une todas as linhagens. [cite: 2026-01-18]</p>
            </div>
          </div>
        </section>

        {/* CAMADA 3: A CIÊNCIA (Complexidade Técnica) */}
        <section className="py-40 px-6 max-w-7xl mx-auto border-b border-zinc-900 bg-zinc-950/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            <div className="space-y-16">
              <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block">III. Tratado de Biomecânica</span>
              <h2 className="text-5xl font-serif italic">A Geometria da Reunião</h2>
              <div className="space-y-8 text-zinc-400 font-light text-lg">
                <p>O Lusitano é o único cavalo do mundo cuja morfologia se inscreve num quadrado perfeito ($\Phi$), permitindo uma articulação de nuca e jarrete que anula a força centrífuga. [cite: 2026-01-18]</p>
                
                {/* COMPLEXIDADE MATEMÁTICA */}
                <div className="p-12 border border-zinc-900 bg-black space-y-8">
                  <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Cálculo de Impulsão Longitudinal</p>
                  <p className="text-4xl text-white font-serif">
                    $$ \vec{F}_{res} = \sum \vec{F}_{posteriores} \cdot \cos(\theta) - \mu \cdot \vec{N} $$
                  </p>
                  <p className="text-xs text-zinc-600">Onde $\theta$ representa o ângulo de engajamento do jarrete sob o centro de gravidade. No PSL, este valor atinge a eficiência máxima na transição para o Piaffe. [cite: 2026-01-18]</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-12 border-l border-zinc-900 pl-20">
              <div>
                <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Índice Dactilo-Torácico (IDT)</h4>
                <p className="text-zinc-500 text-sm font-light">Analisamos a robustez óssea relativa à massa muscular, um dado crucial para identificar exemplares de elite com longevidade desportiva. [cite: 2026-01-18]</p>
              </div>
              <div>
                <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Morfometria Proporcional</h4>
                <p className="text-zinc-500 text-sm font-light">O perfil sub-convexo facilita a flexão cervical, reduzindo a tensão no ligamento nucal e permitindo a "leveza de mão" que define a raça. [cite: 2026-01-18]</p>
              </div>
            </div>
          </div>
        </section>

        {/* CAMADA 4: O PORTAL (O NUNCA VISTO) */}
        <section className="py-60 px-6 text-center max-w-5xl mx-auto">
          <span className="text-[#C5A059] uppercase tracking-[1.5em] text-[10px] font-bold block mb-12">IV. A Singularidade Portal Lusitano</span>
          <h2 className="text-7xl font-serif italic mb-20 leading-tight">Onde o Sangue encontra o <span className="text-[#C5A059]">Dígito</span>.</h2>
          <p className="text-zinc-500 text-xl font-light italic leading-relaxed mb-32">
            "Não estamos a criar apenas um marketplace. Estamos a construir o primeiro repositório de inteligência equestre global focado na preservação e elevação do Cavalo Lusitano. Através da análise de dados genéticos e morfológicos, o Portal Lusitano é o guardião tecnológico de uma herança milenar." [cite: 2026-01-15, 2026-01-18]
          </p>
          <div className="w-px h-40 bg-gradient-to-b from-[#C5A059] to-transparent mx-auto"></div>
        </section>

      </main>
    </>
  );
}
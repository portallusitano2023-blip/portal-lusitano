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
          
          {/* INTRODUÇÃO: O CAVALO DE SELA MAIS ANTIGO DO MUNDO */}
          <header className="mb-40 border-l-2 border-[#C5A059] pl-12">
            <span className="text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold block mb-6">Tratado de Excelência</span>
            <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none mb-12">
              Puro Sangue <br /> <span className="text-[#C5A059]">Lusitano</span>
            </h1>
            <p className="max-w-3xl text-zinc-400 text-xl font-light leading-relaxed italic">
              "O Lusitano não se explica pela força, mas pela harmonia de tensões e pela inteligência de resposta."
            </p>
          </header>

          {/* SECÇÃO TÉCNICA 1: MORFOLOGIA E BIOMECÂNICA */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-48">
            <div className="space-y-12">
              <h2 className="text-[#C5A059] uppercase tracking-widest text-xs font-bold">I. Precisão Morfométrica</h2>
              <div className="space-y-6 text-zinc-300 font-light leading-relaxed text-lg">
                <p>
                  O standard do PSL define um cavalo de sela de peso médio, com um perfil **sub-convexo** (traço de nobreza ancestral) e formas arredondadas. A sua estrutura é inscrita num quadrado, garantindo uma agilidade biomecânica superior.
                </p>
                <ul className="space-y-4 border-t border-zinc-900 pt-8">
                  <li className="flex justify-between border-b border-zinc-900/50 pb-2">
                    <span className="text-zinc-500 uppercase text-[10px] tracking-widest">Pescoço</span>
                    <span className="italic font-serif">De comprimento médio, em forma de cisne</span>
                  </li>
                  <li className="flex justify-between border-b border-zinc-900/50 pb-2">
                    <span className="text-zinc-500 uppercase text-[10px] tracking-widest">Dorso-Lombo</span>
                    <span className="italic font-serif">Curto, largo e ligeiramente convexo</span>
                  </li>
                  <li className="flex justify-between border-b border-zinc-900/50 pb-2">
                    <span className="text-zinc-500 uppercase text-[10px] tracking-widest">Membros</span>
                    <span className="italic font-serif">Canelas curtas e jarretes fortes</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-zinc-950 p-1 bg-[url('https://images.unsplash.com/photo-1599411993215-381c00223594?q=80&w=1974')] bg-cover bg-center grayscale opacity-40 hover:opacity-80 transition-all duration-[2s]">
              {/* Espaço para imagem técnica de anatomia equestre */}
            </div>
          </section>

          {/* SECÇÃO TÉCNICA 2: AS LINHAGENS FUNDAMENTAIS */}
          <section className="mb-48 bg-zinc-950/20 p-16 border-y border-zinc-900">
            <h2 className="text-[#C5A059] uppercase tracking-widest text-xs font-bold mb-20 text-center">II. A Genética da Aristocracia</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-6 text-center">
                <h3 className="font-serif italic text-3xl">Veiga</h3>
                <p className="text-zinc-500 text-sm font-light">
                  A linhagem do "Cavalo de Toureio". Conhecidos pela sua reatividade explosiva, coragem indómita e a morfologia típica de **Sorraia**.
                </p>
              </div>
              <div className="space-y-6 text-center">
                <h3 className="font-serif italic text-3xl">Andrade</h3>
                <p className="text-zinc-500 text-sm font-light">
                  Focada na funcionalidade desportiva. Cavalos mais altos, com andamentos mais largos, ideais para o **Dressage** e Equitação de Trabalho.
                </p>
              </div>
              <div className="space-y-6 text-center">
                <h3 className="font-serif italic text-3xl">Alter-Real</h3>
                <p className="text-zinc-500 text-sm font-light">
                  O Cavalo Real. Preserva a elegância da Escola Portuguesa de Arte Equestre, com foco na cadência e nos ares de escola.
                </p>
              </div>
            </div>
          </section>

          {/* MANIFESTO DE ELEVAÇÃO GLOBAL */}
          <section className="max-w-3xl mx-auto text-center space-y-16">
            <h2 className="text-5xl font-serif italic">Elevar o Perfil Global</h2>
            <p className="text-zinc-400 font-light text-xl leading-relaxed italic">
              O **Portal Lusitano** não é apenas uma plataforma de transações. É um guardião do Stud-Book. O nosso propósito é projetar o perfil do PSL para os cinco continentes, garantindo que o mundo reconheça a versatilidade única deste cavalo: desde o Grand Prix de Dressage à bravura do Campo.
            </p>
            <div className="w-px h-32 bg-gradient-to-b from-[#C5A059] to-transparent mx-auto"></div>
            <p className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold italic">Preservar. Valorizar. Expandir.</p>
          </section>

        </div>
      </main>
    </>
  );
}
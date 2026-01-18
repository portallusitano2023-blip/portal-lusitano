// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-48 pb-40 selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* O MANIFESTO DO ABSOLUTO */}
          <header className="mb-56 border-b border-zinc-900 pb-20">
            <span className="text-[#C5A059] uppercase tracking-[1.2em] text-[9px] font-bold block mb-10">Ontologia do Cavalo de Reis</span>
            <h1 className="text-8xl md:text-[13rem] font-serif italic tracking-tighter leading-none mb-16">
              A Gnose <br /> <span className="text-[#C5A059]">Lusitana</span>
            </h1>
            <p className="max-w-4xl text-zinc-500 text-2xl font-light leading-relaxed italic">
              "O Lusitano não é apenas uma raça; é um sistema biológico de perfeição estética e funcional, forjado no fogo da história e na precisão da natureza."
            </p>
          </header>

          {/* SECÇÃO I: A MATEMÁTICA DA DIVINDADE (A Proporção Áurea) */}
          <section className="mb-64 grid grid-cols-1 lg:grid-cols-2 gap-32">
            <div className="space-y-16">
              <h2 className="text-[#C5A059] uppercase tracking-widest text-xs font-bold border-l-2 border-[#C5A059] pl-8">I. Geometria Sagrada e Morfometria</h2>
              <div className="space-y-8 text-zinc-300 font-light leading-relaxed text-xl">
                <p>
                  A arquitetura do PSL obedece à **Proporção Áurea (Phi)**. A relação entre a altura à cernelha e o comprimento do corpo cria o "Quadrado Equilibrado", permitindo uma pivotagem sobre o centro de gravidade que desafia as leis da física clássica.
                </p>
                <div className="p-10 bg-zinc-950 border border-zinc-900 font-serif text-[#C5A059]">
                  <p className="text-sm uppercase tracking-widest mb-6 opacity-60">Equação de Equilíbrio Dinâmico</p>
                  {"$$ \Phi = \frac{A+B}{A} \approx 1.618 $$"}
                  <p className="mt-6 text-zinc-500 text-sm italic">Onde o equilíbrio entre a impulsão posterior e a leveza anterior atinge a suspensão absoluta.</p>
                </div>
              </div>
            </div>
            <div className="space-y-12">
               <h3 className="text-4xl font-serif italic">O Perfil Sub-Convexo: A Lógica do Ar</h3>
               <p className="text-zinc-400 font-light text-lg">
                 Ao contrário do perfil retilíneo do Puro Sangue Inglês, a curvatura sub-convexa do crânio lusitano é um vestígio de adaptação à montanha e ao combate. Esta conformação permite uma articulação de nuca superior, facilitando o **"Ramener"** e a descida de mão sem perda de contacto.
               </p>
            </div>
          </section>

          {/* SECÇÃO II: O ARCANO GENÉTICO (DNA e Linhagens-Mãe) */}
          <section className="mb-64">
            <h2 className="text-center text-[#C5A059] uppercase tracking-[0.5em] text-xs font-bold mb-24">II. A Criptografia do Sangue</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900">
              <div className="bg-black p-16 space-y-8 border-b border-zinc-900 md:border-b-0">
                <h3 className="text-3xl font-serif italic text-white">Linhagens Primordiais</h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">
                  O **Portal Lusitano** descodifica as 4 estirpes fundamentais. Do fogo reativo da linhagem **Veiga** à amplitude estrutural da linhagem **Andrade**, analisamos a convergência genética que permite a versatilidade absoluta.
                </p>
              </div>
              <div className="bg-black p-16 space-y-8 border-b border-zinc-900 md:border-b-0 md:border-x border-zinc-900">
                <h3 className="text-3xl font-serif italic text-white">O Poder Mitocondrial</h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">
                  Honramos o "Ventre de Ouro". O conhecimento profundo exige olhar para as Linhagens-Mãe, o ADN mitocondrial que preserva a resiliência e a inteligência emocional da raça ao longo dos séculos.
                </p>
              </div>
              <div className="bg-black p-16 space-y-8">
                <h3 className="text-3xl font-serif italic text-white">Curadoria de Elite</h3>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">
                  Cada exemplar no nosso sistema é sujeito a uma análise de **Fenótipo vs Genótipo**, garantindo que apenas os portadores do "Selo de Nobreza" figuram na nossa montra global.
                </p>
              </div>
            </div>
          </section>

          {/* SECÇÃO III: A ALMA DO COMBATE (Psicologia) */}
          <section className="py-60 text-center space-y-16">
            <span className="text-[#C5A059] text-[10px] uppercase tracking-[1em] font-bold">Areté Lusitana</span>
            <h2 className="text-6xl md:text-8xl font-serif italic max-w-5xl mx-auto leading-tight">
              "Onde o medo se transforma em <span className="text-[#C5A059]">submissão consciente</span>."
            </h2>
            <p className="max-w-3xl mx-auto text-zinc-500 text-xl font-light italic">
              O Lusitano é o único cavalo capaz de enfrentar o perigo com a elegância de um bailarino. Esta inteligência de combate é o que o torna no parceiro supremo para a equitação de lazer, desporto ou arte.
            </p>
            <div className="w-px h-32 bg-gradient-to-b from-[#C5A059] to-transparent mx-auto"></div>
          </section>

        </div>
      </main>
    </>
  );
}
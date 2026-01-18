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
          
          <header className="mb-40">
            <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-8">Tratado de Morfologia e Funcionalidade</span>
            <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-none mb-16">
              A Excelência <br /> <span className="text-[#C5A059]">Morfométrica</span>
            </h1>
          </header>

          {/* ANÁLISE PROFUNDA: CABEÇA E PESCOÇO */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-48 border-t border-zinc-900 pt-20">
            <div className="space-y-12">
              <h2 className="text-[#C5A059] uppercase tracking-widest text-xs font-bold italic">Capítulo I: A Nobreza do Perfil</h2>
              <div className="space-y-8 text-zinc-300 font-light leading-relaxed text-lg">
                <p>
                  A cabeça do Lusitano é o seu principal distintivo de raça. O perfil **sub-convexo** (traço andaluz-árabe) deve apresentar uma fronte larga e orelhas finas, expressivas e paralelas.
                </p>
                <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-sm">
                  <h4 className="text-white font-serif italic mb-4">A Angulação Craneana</h4>
                  <p className="text-sm text-zinc-500">
                    Matematicamente, a beleza do perfil é ditada pela harmonia entre a linha nasal e a arcada orbital. Em exemplares de elite, o ângulo de inserção da cabeça no pescoço permite uma flexão de nuca que facilita a **reunião** sem compressão das vias respiratórias.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
               <h3 className="font-serif text-3xl italic">Mecânica do Pescoço</h3>
               <p className="text-zinc-400 font-light">O pescoço deve ser de comprimento médio, com crineira delgada e inserção estreita na cabeça, mas larga na base da espádua. Esta estrutura é o "balancé" natural do cavalo, permitindo a transferência de massa instantânea para os posteriores.</p>
               <div className="bg-zinc-900/10 p-6 border-l-2 border-[#C5A059]">
                 <p className="text-[#C5A059] font-mono text-xs uppercase tracking-tighter">Variável Técnica: Centro de Gravidade Longitudinal</p>
                 <p className="text-2xl font-serif mt-2">$$ CG = \int_{0}^{L} x \cdot \rho(x) \, dx $$</p>
               </div>
            </div>
          </section>

          {/* O SISTEMA DE LINHAGENS: ANÁLISE GENÉTICA */}
          <section className="mb-48">
            <h2 className="text-[#C5A059] uppercase tracking-widest text-xs font-bold mb-20 text-center">Capítulo II: O Legado das Bloodlines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="border border-zinc-900 p-12 space-y-6 hover:bg-zinc-950/50 transition-all">
                <h3 className="text-4xl font-serif italic text-[#C5A059]">Veiga (MV)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  A linhagem do "sangue vivo". Criados no Casal do Branco, os Veiga preservam o tipo mais primitivo e funcional para o toureio. São cavalos de formas arredondadas, garupa derribada e uma reatividade sináptica inigualável.
                </p>
              </div>
              <div className="border border-zinc-900 p-12 space-y-6 hover:bg-zinc-950/50 transition-all">
                <h3 className="text-4xl font-serif italic text-[#C5A059]">Andrade (SA)</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  A linhagem da estrutura e amplitude. Ruy d’Andrade selecionou animais com maior estatura (meso-dolicomorfos) e membros mais longos, resultando na base genética que hoje domina o Grand Prix internacional.
                </p>
              </div>
            </div>
          </section>

          {/* O PSICOGRAMA: TEMPERAMENTO E INTELIGÊNCIA */}
          <section className="mb-48 text-center max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl font-serif italic">O Psicograma do Lusitano</h2>
            <p className="text-zinc-400 font-light text-xl leading-relaxed italic">
              "Um cavalo dócil, mas ardente." A inteligência do Lusitano permite uma aprendizagem acelerada dos exercícios de Alta Escola. A sua generosidade sob pressão é o que o distingue de qualquer outra raça de sela no mundo.
            </p>
          </section>

        </div>
      </main>
    </>
  );
}
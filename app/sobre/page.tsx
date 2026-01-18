// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white selection:bg-[#C5A059] selection:text-black font-light">
        
        {/* I. HERO: A SOBERANIA (Impacto Visual Puro) */}
        <section className="relative pt-60 pb-40 px-6 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-[#C5A059] uppercase tracking-[1.2em] text-[10px] font-bold block mb-12 animate-pulse">Est. 5000 A.C.</span>
            <h1 className="text-8xl md:text-[13rem] font-serif italic tracking-tighter leading-none mb-16 text-white mix-blend-difference">
              Soberano <br /> <span className="text-[#C5A059]">Absoluto</span>
            </h1>
            <p className="max-w-3xl mx-auto text-zinc-400 text-2xl leading-relaxed italic font-serif">
              "Antes de ser arte, o Lusitano foi guerreiro. Antes de pisar os picadeiros reais, dominou os campos de batalha da Ibéria. Esta é a história do cavalo mais antigo do mundo."
            </p>
          </div>
        </section>

        {/* II. A HISTÓRIA: A GINETA E A GUERRA */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <div className="border-r border-zinc-900 p-20 flex flex-col justify-center space-y-12">
            <span className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold">Capítulo I: A Origem Bélica</span>
            <h2 className="text-6xl font-serif italic">A Monta à Gineta</h2>
            <div className="space-y-8 text-zinc-400 text-lg leading-relaxed">
              <p>
                A superioridade do Lusitano nasceu na necessidade de sobrevivência. A técnica de guerra ibérica — a <strong>Gineta</strong> — exigia um cavalo capaz de paragens instantâneas e piruetas fulminantes para o combate corpo-a-corpo.
              </p>
              <p>
                Enquanto o resto da Europa usava cavalos pesados e lentos, o Lusitano vencia pela agilidade mental e física. Foi esta seleção natural pelo combate que criou a <strong>reatividade</strong> que hoje admiramos no toureio e na Dressage.
              </p>
            </div>
          </div>
          <div className="bg-zinc-950 p-20 flex flex-col justify-center relative overflow-hidden">
            {/* Elemento Decorativo: Citação Histórica */}
            <blockquote className="relative z-10 text-3xl font-serif italic text-white/80 leading-loose text-center">
              "O cavalo de Portugal é o mais nobre, o mais generoso e o mais digno de ser montado por um Rei nos dias de triunfo."
              <footer className="text-[#C5A059] text-[10px] uppercase tracking-widest mt-8 not-italic">— William Cavendish, Duque de Newcastle (1667)</footer>
            </blockquote>
            <div className="absolute top-0 right-0 p-10 opacity-10 font-serif text-[20rem] leading-none text-[#C5A059] pointer-events-none">”</div>
          </div>
        </section>

        {/* III. A BIOMECÂNICA: O QUADRADO PERFEITO */}
        <section className="py-40 border-y border-zinc-900 bg-black">
          <div className="max-w-7xl mx-auto px-6">
             <div className="mb-24 text-center">
               <span className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold">Capítulo II: Engenharia Natural</span>
               <h2 className="text-5xl md:text-7xl font-serif italic mt-6">O Cavalo "Mesomorfo"</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
               <div className="p-10 border border-zinc-900 hover:border-[#C5A059] transition-colors duration-700 group">
                 <h3 className="text-2xl font-serif italic text-white mb-6 group-hover:text-[#C5A059]">O Perfil Sub-Convexo</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   A nobreza da cabeça. A curvatura nasal é a assinatura da raça, permitindo uma inserção cabeça-pescoço que facilita a <strong>reunião</strong> (o engajamento dos posteriores) sem esforço.
                 </p>
               </div>
               <div className="p-10 border border-zinc-900 hover:border-[#C5A059] transition-colors duration-700 group">
                 <h3 className="text-2xl font-serif italic text-white mb-6 group-hover:text-[#C5A059]">A Garupa Derribada</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   A biomecânica da elevação. Ao contrário dos cavalos de corrida, a garupa inclinada do Lusitano funciona como uma mola, permitindo os ares altos (Levade, Cabriole) naturais da raça.
                 </p>
               </div>
               <div className="p-10 border border-zinc-900 hover:border-[#C5A059] transition-colors duration-700 group">
                 <h3 className="text-2xl font-serif italic text-white mb-6 group-hover:text-[#C5A059]">O Caráter (Areté)</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   Ardente mas submisso. A inteligência superior do Lusitano permite-lhe distinguir o momento de explodir em energia do momento de quietude absoluta.
                 </p>
               </div>
             </div>
          </div>
        </section>

        {/* IV. AS DINASTIAS GENÉTICAS (Detalhe Profundo) */}
        <section className="min-h-screen flex flex-col">
          <div className="py-20 px-6 border-b border-zinc-900">
            <span className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold">Capítulo III: As Fontes do Sangue</span>
            <h2 className="text-5xl font-serif italic mt-6">As Quatro Dinastias</h2>
          </div>
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4">
            {/* VEIGA */}
            <div className="border-r border-zinc-900 p-10 hover:bg-zinc-950 transition-all duration-500 group">
              <span className="text-zinc-700 font-bold text-6xl opacity-20 group-hover:opacity-50 group-hover:text-[#C5A059]">MV</span>
              <h3 className="text-3xl font-serif italic mt-8 mb-4">Veiga</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-6 font-bold">O Guerreiro</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                A linhagem mais típica e antiga. Cavalos de porte mais pequeno, extremamente reativos e valentes. Selecionados funcionalmente para o toureio a cavalo, onde o erro é fatal.
              </p>
            </div>

            {/* ANDRADE */}
            <div className="border-r border-zinc-900 p-10 hover:bg-zinc-950 transition-all duration-500 group">
              <span className="text-zinc-700 font-bold text-6xl opacity-20 group-hover:opacity-50 group-hover:text-[#C5A059]">SA</span>
              <h3 className="text-3xl font-serif italic mt-8 mb-4">Andrade</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-6 font-bold">O Atleta</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Ruy d'Andrade procurou estrutura e força. Criou cavalos mais altos, com garupas fortes e andamentos amplos, desenhados para a funcionalidade desportiva e a Dressage de competição.
              </p>
            </div>

            {/* ALTER REAL */}
            <div className="border-r border-zinc-900 p-10 hover:bg-zinc-950 transition-all duration-500 group">
              <span className="text-zinc-700 font-bold text-6xl opacity-20 group-hover:opacity-50 group-hover:text-[#C5A059]">AR</span>
              <h3 className="text-3xl font-serif italic mt-8 mb-4">Alter-Real</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-6 font-bold">O Artista</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Fundada em 1748 por D. João V. Cavalos exclusivamente de pelagem castanha, criados para a Picaria Real. São os guardiões da Alta Escola Portuguesa e da elegância barroca.
              </p>
            </div>

            {/* COUDELARIA NACIONAL */}
            <div className="p-10 hover:bg-zinc-950 transition-all duration-500 group">
              <span className="text-zinc-700 font-bold text-6xl opacity-20 group-hover:opacity-50 group-hover:text-[#C5A059]">CN</span>
              <h3 className="text-3xl font-serif italic mt-8 mb-4">C. Nacional</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-6 font-bold">O Padrão</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                A antiga Coudelaria de Roscas. Funciona como o repositório genético da raça, mantendo as características morfológicas mais puras e servindo de base para cruzar com outras linhagens.
              </p>
            </div>
          </div>
        </section>

        {/* V. O MANIFESTO FINAL (A Visão) */}
        <section className="py-60 px-6 bg-zinc-950 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif italic leading-tight text-white">
              "O Portal Lusitano não vende apenas cavalos. <br /> <span className="text-[#C5A059]">Nós curamos História.</span>"
            </h2>
            <p className="text-zinc-500 text-lg font-light leading-relaxed">
              Através de uma análise rigorosa de linhagens, morfologia e temperamento, elevamos o padrão de exigência. Cada cavalo no nosso portal é um embaixador de cinco milénios de seleção genética.
            </p>
            <div className="pt-20">
               <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] border border-[#C5A059] px-8 py-3 hover:bg-[#C5A059] hover:text-black transition-all cursor-pointer">
                 Entrar no Marketplace de Elite
               </span>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
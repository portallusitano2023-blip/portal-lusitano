// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white selection:bg-[#C5A059] selection:text-black font-light">
        
        {/* I. HERO: A SOBERANIA (Imagem de Impacto: O Perfil Nobre) */}
        <section className="relative min-h-[90vh] flex flex-col justify-center px-6 border-b border-zinc-900 overflow-hidden">
           {/* IMAGEM DE FUNDO INTEGRADA */}
           <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071" 
               className="w-full h-full object-cover grayscale opacity-30 scale-105" 
               alt="Perfil Lusitano"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80"></div>
           </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <span className="text-[#C5A059] uppercase tracking-[1.2em] text-[10px] font-bold block mb-12 animate-pulse">Est. 5000 A.C.</span>
            <h1 className="text-8xl md:text-[13rem] font-serif italic tracking-tighter leading-none mb-16 text-white mix-blend-overlay opacity-90">
              Soberano <br /> <span className="text-[#C5A059] mix-blend-normal">Absoluto</span>
            </h1>
            <p className="max-w-3xl mx-auto text-zinc-300 text-2xl leading-relaxed italic font-serif drop-shadow-md">
              "Antes de ser arte, o Lusitano foi guerreiro. Antes de pisar os picadeiros reais, dominou os campos de batalha da Ibéria. Esta é a história do cavalo mais antigo do mundo."
            </p>
          </div>
        </section>

        {/* II. A HISTÓRIA: A GINETA (Imagem de Ação/Barroca) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <div className="border-r border-zinc-900 p-20 flex flex-col justify-center space-y-12 bg-black z-10">
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
          {/* IMAGEM LATERAL INTEGRADA */}
          <div className="relative overflow-hidden h-[50vh] lg:h-auto">
             <img 
               src="https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1974" 
               className="w-full h-full object-cover grayscale opacity-50"
               alt="Lusitano em movimento"
             />
             <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
            
            <blockquote className="absolute bottom-20 left-10 right-10 z-20 text-2xl font-serif italic text-white/90 leading-loose text-center drop-shadow-lg">
              "O cavalo de Portugal é o mais nobre, o mais generoso e o mais digno de ser montado por um Rei."
              <footer className="text-[#C5A059] text-[10px] uppercase tracking-widest mt-4 not-italic">— Duque de Newcastle (1667)</footer>
            </blockquote>
          </div>
        </section>

        {/* III. A BIOMECÂNICA: O QUADRADO PERFEITO (Imagem Estrutural de Fundo) */}
        <section className="py-40 border-y border-zinc-900 relative overflow-hidden">
          {/* TEXTURA DE FUNDO SUBTIl */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
             <img src="https://images.unsplash.com/photo-1616167740257-b45eb3be96c3?q=80&w=2070" className="w-full h-full object-cover grayscale" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
             <div className="mb-24 text-center">
               <span className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold">Capítulo II: Engenharia Natural</span>
               <h2 className="text-5xl md:text-7xl font-serif italic mt-6">O Cavalo "Mesomorfo"</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
               <div className="p-10 border border-zinc-900 bg-black/80 hover:border-[#C5A059] transition-colors duration-700 group backdrop-blur-sm">
                 <h3 className="text-2xl font-serif italic text-white mb-6 group-hover:text-[#C5A059]">O Perfil Sub-Convexo</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   A nobreza da cabeça. A curvatura nasal é a assinatura da raça, permitindo uma inserção cabeça-pescoço que facilita a <strong>reunião</strong> (o engajamento dos posteriores) sem esforço.
                 </p>
               </div>
               <div className="p-10 border border-zinc-900 bg-black/80 hover:border-[#C5A059] transition-colors duration-700 group backdrop-blur-sm">
                 <h3 className="text-2xl font-serif italic text-white mb-6 group-hover:text-[#C5A059]">A Garupa Derribada</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   A biomecânica da elevação. Ao contrário dos cavalos de corrida, a garupa inclinada do Lusitano funciona como uma mola, permitindo os ares altos (Levade, Cabriole) naturais da raça.
                 </p>
               </div>
               <div className="p-10 border border-zinc-900 bg-black/80 hover:border-[#C5A059] transition-colors duration-700 group backdrop-blur-sm">
                 <h3 className="text-2xl font-serif italic text-white mb-6 group-hover:text-[#C5A059]">O Caráter (Areté)</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   Ardente mas submisso. A inteligência superior do Lusitano permite-lhe distinguir o momento de explodir em energia do momento de quietude absoluta.
                 </p>
               </div>
             </div>
          </div>
        </section>

        {/* IV. AS DINASTIAS GENÉTICAS (Mantemos limpo para contraste) */}
        <section className="min-h-screen flex flex-col bg-black">
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
                A linhagem mais típica e antiga. Cavalos de porte mais pequeno, extremamente reativos e valentes. Selecionados funcionalmente para o toureio a cavalo.
              </p>
            </div>

            {/* ANDRADE */}
            <div className="border-r border-zinc-900 p-10 hover:bg-zinc-950 transition-all duration-500 group">
              <span className="text-zinc-700 font-bold text-6xl opacity-20 group-hover:opacity-50 group-hover:text-[#C5A059]">SA</span>
              <h3 className="text-3xl font-serif italic mt-8 mb-4">Andrade</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-6 font-bold">O Atleta</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Ruy d'Andrade procurou estrutura e força. Criou cavalos mais altos, com garupas fortes e andamentos amplos, desenhados para a funcionalidade desportiva.
              </p>
            </div>

            {/* ALTER REAL */}
            <div className="border-r border-zinc-900 p-10 hover:bg-zinc-950 transition-all duration-500 group">
              <span className="text-zinc-700 font-bold text-6xl opacity-20 group-hover:opacity-50 group-hover:text-[#C5A059]">AR</span>
              <h3 className="text-3xl font-serif italic mt-8 mb-4">Alter-Real</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-6 font-bold">O Artista</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Fundada em 1748 por D. João V. Cavalos exclusivamente de pelagem castanha. São os guardiões da Alta Escola Portuguesa e da elegância barroca.
              </p>
            </div>

            {/* COUDELARIA NACIONAL */}
            <div className="p-10 hover:bg-zinc-950 transition-all duration-500 group">
              <span className="text-zinc-700 font-bold text-6xl opacity-20 group-hover:opacity-50 group-hover:text-[#C5A059]">CN</span>
              <h3 className="text-3xl font-serif italic mt-8 mb-4">C. Nacional</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-6 font-bold">O Padrão</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                A antiga Coudelaria de Roscas. Funciona como o repositório genético da raça, mantendo as características morfológicas mais puras.
              </p>
            </div>
          </div>
        </section>

        {/* V. IMAGEM FINAL DE IMPACTO & MANIFESTO */}
        <section className="relative py-60 px-6 text-center overflow-hidden">
           <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1534073131349-8bc29255f006?q=80&w=1974" 
               className="w-full h-full object-cover grayscale opacity-20" 
               alt="Olho Lusitano"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50"></div>
           </div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif italic leading-tight text-white drop-shadow-lg">
              "O Portal Lusitano não vende apenas cavalos. <br /> <span className="text-[#C5A059]">Nós curamos História.</span>"
            </h2>
            <p className="text-zinc-400 text-lg font-light leading-relaxed drop-shadow-md">
              Através de uma análise rigorosa de linhagens, morfologia e temperamento, elevamos o padrão de exigência. Cada cavalo no nosso portal é um embaixador de cinco milénios de seleção genética.
            </p>
            <div className="pt-20">
               <a href="/comprar?dev=true" className="inline-block text-[#C5A059] text-[9px] uppercase tracking-[0.4em] border border-[#C5A059]/50 px-10 py-4 hover:bg-[#C5A059] hover:text-black transition-all duration-500 cursor-pointer backdrop-blur-sm">
                 Entrar no Marketplace de Elite
               </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
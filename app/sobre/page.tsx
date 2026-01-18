// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white selection:bg-[#C5A059] selection:text-black font-sans">
        
        {/* SECÇÃO I: A EMOÇÃO (O Início Simples) */}
        <section className="pt-64 pb-40 px-6 max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-12 italic">A Génese do Cavalo de Reis</span>
            <h1 className="text-7xl md:text-[11rem] font-serif italic tracking-tighter leading-none mb-20">
              A Alma <br /> <span className="text-[#C5A059]">Lusitana</span>
            </h1>
            <p className="text-zinc-400 text-3xl font-light leading-relaxed italic border-l border-[#C5A059]/30 pl-12">
              "Há cinco milénios, o cavalo Lusitano começou a moldar a história. O que começou como um parceiro de guerra, tornou-se o expoente máximo da elegância nas cortes europeias." [cite: 2026-01-18]
            </p>
          </div>
        </section>

        {/* SECÇÃO II: A FORMA (Morfologia e Padrão) */}
        <section className="py-40 px-6 bg-zinc-950/50 border-y border-zinc-900">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
              <h2 className="text-[#C5A059] uppercase tracking-widest text-xs font-bold">II. O Standard da Perfeição</h2>
              <div className="space-y-8 text-zinc-300 font-light text-xl leading-relaxed">
                <p>
                  O Lusitano é um cavalo **eumétrico** e **mesomorfo**. A sua silhueta inscreve-se num quadrado perfeito, garantindo um equilíbrio natural que nenhuma outra raça consegue replicar. [cite: 2026-01-18]
                </p>
                <ul className="space-y-6 pt-10">
                  <li className="flex gap-6 border-b border-zinc-900 pb-6">
                    <span className="text-[#C5A059] font-serif italic text-2xl">01.</span>
                    <p className="text-sm uppercase tracking-widest leading-loose">
                      <strong className="text-white block mb-2">Perfil Sub-Convexo</strong>
                      A curvatura nobre do crânio facilita a flexão da nuca, permitindo uma submissão leve e harmoniosa. [cite: 2026-01-18]
                    </p>
                  </li>
                  <li className="flex gap-6 border-b border-zinc-900 pb-6">
                    <span className="text-[#C5A059] font-serif italic text-2xl">02.</span>
                    <p className="text-sm uppercase tracking-widest leading-loose">
                      <strong className="text-white block mb-2">Garupa Derribada</strong>
                      Essencial para o engajamento dos posteriores, convertendo força em elevação para os ares de escola. [cite: 2026-01-18]
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="aspect-[4/5] bg-zinc-900/20 border border-zinc-900 overflow-hidden group">
               <img 
                src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071" 
                className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-[3s] grayscale" 
               />
            </div>
          </div>
        </section>

        {/* SECÇÃO III: O SANGUE (Linhagens - Complexidade Técnica) */}
        <section className="py-60 px-6 max-w-7xl mx-auto">
          <h2 className="text-center text-[#C5A059] uppercase tracking-[0.8em] text-[10px] font-bold mb-32">III. As Quatro Estirpes Fundamentais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 shadow-2xl">
            <div className="bg-black p-20 space-y-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-4xl font-serif italic text-white">Veiga <span className="text-[#C5A059] text-sm block mt-2 uppercase tracking-widest not-italic">O Fogo Reativo</span></h3>
              <p className="text-zinc-500 font-light leading-relaxed">Considerada a linhagem mais pura para o combate. Animais de formas arredondadas e reatividade felina, selecionados para a coragem absoluta perante o perigo. [cite: 2026-01-18]</p>
            </div>
            <div className="bg-black p-20 space-y-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-4xl font-serif italic text-white">Andrade <span className="text-[#C5A059] text-sm block mt-2 uppercase tracking-widest not-italic">A Amplitude Moderna</span></h3>
              <p className="text-zinc-500 font-light leading-relaxed">A base do Lusitano de desporto. Com maior estatura e andamentos elásticos, esta linhagem é a responsável pelo sucesso mundial do cavalo em Dressage. [cite: 2026-01-18]</p>
            </div>
            <div className="bg-black p-20 space-y-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-4xl font-serif italic text-white">Alter-Real <span className="text-[#C5A059] text-sm block mt-2 uppercase tracking-widest not-italic">A Nobreza Real</span></h3>
              <p className="text-zinc-500 font-light leading-relaxed">Preservada desde 1748 para servir a Corte. Especialistas na cadência majestosa e nos exercícios de Alta Escola que definem a Arte Equestre. [cite: 2026-01-18]</p>
            </div>
            <div className="bg-black p-20 space-y-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-4xl font-serif italic text-white">C. Nacional <span className="text-[#C5A059] text-sm block mt-2 uppercase tracking-widest not-italic">O Repositório</span></h3>
              <p className="text-zinc-500 font-light leading-relaxed">O fiel da balança. Garante a homogeneidade do Stud-Book, assegurando que as características ancestrais se mantêm intactas para as gerações futuras. [cite: 2026-01-18]</p>
            </div>
          </div>
        </section>

        {/* SECÇÃO IV: A MISSÃO (O Portal) */}
        <section className="py-60 px-6 text-center max-w-5xl mx-auto border-t border-zinc-900">
          <span className="text-[#C5A059] uppercase tracking-[1em] text-[10px] font-bold block mb-12">IV. A Visão Portal Lusitano</span>
          <h2 className="text-6xl md:text-8xl font-serif italic leading-tight mb-20">Elevar o Legado ao <br /> <span className="text-[#C5A059]">Palco Mundial</span></h2>
          <p className="text-zinc-500 text-xl font-light italic leading-loose max-w-3xl mx-auto mb-32">
            "Não somos apenas um marketplace. Somos curadores de uma herança. O Portal Lusitano nasce para unir o conhecimento hipológico profundo à tecnologia do século XXI, garantindo que o mundo reconheça a singularidade do Puro Sangue Lusitano." [cite: 2026-01-15, 2026-01-18]
          </p>
          <div className="w-px h-60 bg-gradient-to-b from-[#C5A059] to-transparent mx-auto"></div>
        </section>

      </main>
    </>
  );
}
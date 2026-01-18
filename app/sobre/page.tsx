// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-48 pb-32 selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-5xl mx-auto px-6">
          
          <header className="mb-32 text-center">
            <span className="text-[#C5A059] uppercase tracking-[0.7em] text-[11px] font-bold block mb-6 italic">Manifesto de Prestígio</span>
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-tight">
              Uma Paixão sem <span className="text-[#C5A059]">Fronteiras</span>
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-40">
            <div className="space-y-10">
              <h2 className="text-3xl font-serif italic text-white/90">Elevar o Cavalo de Reis ao Mundo</h2>
              <p className="text-zinc-400 font-light leading-relaxed text-xl">
                O cavalo Lusitano é o expoente máximo da nobreza equestre. A nossa missão no **Portal Lusitano** é simples, mas audaciosa: retirar este ícone das sombras da tradição local e colocá-lo no palco principal do luxo mundial.
              </p>
              <p className="text-zinc-500 font-light leading-relaxed">
                Queremos que cada investidor, de Nova Iorque a Dubai, reconheça no Lusitano não apenas um animal, mas um legado de inteligência, coragem e elegância incomparável.
              </p>
            </div>
            <div className="aspect-[3/4] border border-zinc-900 overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1974" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-[2s] grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
          </div>

          <section className="bg-zinc-950/40 p-16 border border-zinc-900 text-center space-y-8">
            <h3 className="text-4xl font-serif italic">Compromisso com a Excelência</h3>
            <p className="max-w-2xl mx-auto text-zinc-400 font-light italic text-lg leading-relaxed">
              "A minha vontade é ver o Cavalo Lusitano ocupar o lugar que lhe é devido: o topo do mundo. O Portal Lusitano é a ferramenta tecnológica desenhada para tornar essa visão uma realidade incontestável."
            </p>
            <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.4em] font-bold">— Francisco Gaspar, Fundador</span>
          </section>

        </div>
      </main>
    </>
  );
}
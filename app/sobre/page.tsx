// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function SobrePage({ searchParams }) {
  const sParams = await searchParams;
  if (sParams?.dev !== "true") return null;

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-48 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-24 text-center">
            <span className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold block mb-4 italic">The Founder's Vision</span>
            <h1 className="text-6xl font-serif italic mb-8">Tradição & Engenharia</h1>
            <div className="w-20 h-[1px] bg-[#C5A059] mx-auto opacity-30"></div>
          </header>

          <div className="grid grid-cols-1 gap-20 text-zinc-400 font-light leading-relaxed text-lg">
            <section className="space-y-6">
              <p>
                O **Portal Lusitano** nasce de uma necessidade de exclusividade no mercado equestre global. Como estudante de Engenharia Informática na **Nova FCT**, Francisco Gaspar idealizou uma plataforma onde a precisão tecnológica serve a herança do cavalo mais nobre do mundo.
              </p>
              <p>
                Não somos apenas um marketplace; somos curadores. Cada exemplar, cada peça da nossa lifestyle store e cada leilão é pensado para quem não aceita nada menos que a excelência.
              </p>
            </section>

            <section className="bg-zinc-950 p-12 border border-zinc-900 italic">
              <p className="text-white mb-6">"O nosso compromisso é com a pureza da linhagem e a segurança da transação. Onde outros vêm um negócio, nós vemos a preservação de uma história."</p>
              <span className="text-[#C5A059] text-[9px] uppercase font-bold tracking-[0.3em]">— Francisco Gaspar, Founder</span>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
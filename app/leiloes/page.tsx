// @ts-nocheck
import Navbar from "@/components/Navbar";

export default async function LeiloesPage({ searchParams }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  return (
    <>
      <Navbar dev={isDev} />
      <main className="min-h-screen bg-black text-white pt-48 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-20">
            <h1 className="text-7xl font-serif italic mb-4">Próximos <span className="text-[#C5A059]">Leilões</span></h1>
            <p className="text-zinc-500 uppercase tracking-[0.4em] text-[10px]">Lances exclusivos para membros Portal Lusitano</p>
          </header>

          {/* CARD DE LEILÃO EM DESTAQUE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-zinc-950 border border-zinc-900 group">
            <div className="aspect-square bg-zinc-900 overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1974" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-all duration-[3s]" />
               <div className="absolute top-10 left-10 bg-[#C5A059] text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest">Brevemente</div>
            </div>
            <div className="p-16 flex flex-col justify-center">
              <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.5em] mb-4 font-bold">Lote #001 — Coudelaria de Elite</span>
              <h2 className="text-5xl font-serif italic mb-10">Exemplar Puro Sangue</h2>
              
              <div className="grid grid-cols-3 gap-8 mb-16 border-y border-zinc-900 py-10">
                <div className="text-center">
                  <p className="text-3xl font-serif text-white">04</p>
                  <p className="text-[8px] uppercase text-zinc-600 tracking-widest mt-2">Dias</p>
                </div>
                <div className="text-center border-x border-zinc-900">
                  <p className="text-3xl font-serif text-white">12</p>
                  <p className="text-[8px] uppercase text-zinc-600 tracking-widest mt-2">Horas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-serif text-white">45</p>
                  <p className="text-[8px] uppercase text-zinc-600 tracking-widest mt-2">Minutos</p>
                </div>
              </div>

              <button className="w-full border border-[#C5A059]/30 text-[#C5A059] py-6 text-[10px] uppercase font-bold tracking-[0.5em] hover:bg-[#C5A059] hover:text-black transition-all duration-700">
                Registar para Licitar
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
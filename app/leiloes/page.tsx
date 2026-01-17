// @ts-nocheck
import { getProducts } from "@/lib/shopify";
import Navbar from "@/components/Navbar";

export default async function LeiloesPage({ searchParams }: { searchParams: Promise<{ dev?: string }> }) {
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";
  if (!isDev) return null;

  const auctions = await getProducts("leilao");

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-[#050505] text-white pt-48 px-10 pb-32">
        <div className="max-w-7xl mx-auto">
          <header className="mb-24 border-b border-zinc-900 pb-12">
            <span className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">Auction House</span>
            <h1 className="text-7xl font-serif italic tracking-tighter">Leilões Ativos</h1>
          </header>

          {auctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              {auctions.map((a) => (
                <div key={a.id} className="group">
                  {/* Layout imponente para cavalos */}
                  <div className="aspect-[16/10] bg-zinc-950 overflow-hidden relative border border-zinc-900">
                    <img src={a.images?.[0]?.url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-[2s]" />
                  </div>
                  <h3 className="mt-8 font-serif text-4xl italic">{a.title}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center border border-zinc-900 bg-zinc-950/20">
              <p className="text-zinc-600 font-serif italic text-xl">Nenhum leilão ativo de momento.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
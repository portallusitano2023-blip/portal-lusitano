// @ts-nocheck
import { client } from "@/lib/client";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getStats() {
  const stats = await client.fetch(`{
    "totalSubscritores": count(*[_type == "subscritor"]),
    "totalCavalos": count(*[_type == "cavalo"]),
    "leiloesAtivos": count(*[_type == "leilao" && ativo == true]),
    "ultimosSubscritores": *[_type == "subscritor"] | order(dataInscricao desc)[0...5] {
      email,
      dataInscricao
    }
  }`);
  return stats;
}

export default async function AdminStats() {
  const data = await getStats();

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-[#C5A059] uppercase tracking-[0.3em] text-xs font-bold">Gestão Portal Lusitano</span>
            <h1 className="text-4xl font-serif mt-2 text-white">Dashboard de Performance</h1>
          </div>
          <Link href="/studio" target="_blank" className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-xs uppercase tracking-widest hover:bg-[#C5A059] hover:text-black transition-all">
            Abrir Sanity Studio
          </Link>
        </div>

        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
          <div className="bg-zinc-900/50 p-8 border border-zinc-800">
            <p className="text-zinc-500 uppercase text-[10px] tracking-widest mb-2">Total de Leads (Emails)</p>
            <p className="text-5xl font-serif text-[#C5A059]">{data.totalSubscritores}</p>
          </div>
          <div className="bg-zinc-900/50 p-8 border border-zinc-800">
            <p className="text-zinc-500 uppercase text-[10px] tracking-widest mb-2">Cavalos em Portefólio</p>
            <p className="text-5xl font-serif text-white">{data.totalCavalos}</p>
          </div>
          <div className="bg-zinc-900/50 p-8 border border-zinc-800">
            <p className="text-zinc-500 uppercase text-[10px] tracking-widest mb-2">Leilões a Decorrer</p>
            <p className="text-5xl font-serif text-[#C5A059] animate-pulse">{data.leiloesAtivos}</p>
          </div>
        </div>

        {/* ÚLTIMOS SUBSCRITORES */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-8">
          <h2 className="text-xl font-serif mb-6 border-b border-zinc-800 pb-4">Últimas Subscrições de Clientes</h2>
          <div className="space-y-4">
            {data.ultimosSubscritores.map((sub, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-900 pb-3 last:border-0">
                <span className="text-zinc-300">{sub.email}</span>
                <span className="text-zinc-600 text-[10px] uppercase">
                  {new Date(sub.dataInscricao).toLocaleDateString('pt-PT')}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <p className="mt-12 text-zinc-600 text-[10px] text-center uppercase tracking-widest">
          Consola Privada &bull; Apenas para Uso do Fundador
        </p>
      </div>
    </main>
  );
}
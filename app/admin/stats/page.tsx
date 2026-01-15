// @ts-nocheck
import { client } from "@/lib/client";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getStats() {
  const stats = await client.fetch(`{
    "totalSubscritores": count(*[_type == "subscritor"]),
    "totalCavalos": count(*[_type == "cavalo"]),
    "totalLicitacoes": count(*[_type == "licitacao"]),
    "valorTotal": sum(*[_type == "licitacao"].valor),
    "ultimasLicitacoes": *[_type == "licitacao"] | order(dataHora desc)[0...5] {
      nome,
      valor,
      cavalo,
      dataHora
    }
  }`);
  return stats;
}

export default async function AdminStats({ searchParams }) {
  const params = await searchParams;
  const password = params.pwd;
  const SENHA_CORRETA = "gaspar2026"; 

  if (password !== SENHA_CORRETA) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-zinc-800 uppercase tracking-[0.5em] text-xs font-bold font-sans">Acesso Restrito</h1>
        <Link href="/" className="mt-8 text-zinc-600 text-[10px] underline uppercase tracking-widest font-sans">Voltar</Link>
      </main>
    );
  }

  const data = await getStats();

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-8">
          <div>
            <span className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-bold block mb-2">Administração</span>
            <h1 className="text-4xl font-serif italic text-white">Performance do Portal</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-900/30 border border-zinc-800 p-8">
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-2">Leads</p>
            <p className="text-4xl font-serif text-[#C5A059]">{data.totalSubscritores}</p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800 p-8">
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-2">Propostas</p>
            <p className="text-4xl font-serif text-white">{data.totalLicitacoes}</p>
          </div>
          <div className="bg-zinc-900/30 border border-[#C5A059]/30 p-8">
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-2">Volume Total</p>
            <p className="text-4xl font-serif text-[#C5A059]">{(data.valorTotal || 0).toLocaleString('pt-PT')} €</p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800 p-8">
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-2">Cavalos</p>
            <p className="text-4xl font-serif text-white">{data.totalCavalos}</p>
          </div>
        </div>

        <div className="bg-zinc-900/10 border border-zinc-900 p-8">
          <h3 className="font-serif text-xl mb-6">Últimas Propostas Recebidas</h3>
          <div className="space-y-4">
            {data.ultimasLicitacoes?.map((lic, i) => (
              <div key={i} className="flex justify-between items-center p-4 border-b border-zinc-900">
                <div>
                  <p className="text-sm font-bold text-zinc-200">{lic.nome}</p>
                  <p className="text-[10px] text-zinc-500 uppercase">{lic.cavalo}</p>
                </div>
                <p className="text-[#C5A059] font-serif font-bold">{lic.valor.toLocaleString('pt-PT')} €</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
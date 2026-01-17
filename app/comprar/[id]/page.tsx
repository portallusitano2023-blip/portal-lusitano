// @ts-nocheck
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// Em Next.js 15/16, params e searchParams são Promises
export default async function DetalheCavaloPage({ params, searchParams }) {
  // PASSO DE ENGENHARIA: Precisas de fazer await dos params para extrair o id
  const resolvedParams = await params;
  const id = resolvedParams?.id; 

  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  // Verificação de segurança: se o id não existir, o build não rebenta
  if (!id) return null;

  // Busca os dados do cavalo específico no Supabase
  const { data: cavalo } = await supabase
    .from('cavalos_venda')
    .select('*')
    .eq('id', id)
    .single();

  if (!cavalo) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white font-serif italic">
        Exemplar não encontrado ou indisponível.
      </main>
    );
  }

  return (
    <>
      <Navbar dev={isDev} />
      <main className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="relative aspect-square border border-zinc-900 bg-zinc-950">
            {cavalo.image_url && (
              <img src={cavalo.image_url} alt={cavalo.nome_cavalo} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-7xl font-serif italic mb-6">{cavalo.nome_cavalo}</h1>
            <p className="text-[#C5A059] text-4xl font-serif mb-10">
              {Number(cavalo.preco).toLocaleString('pt-PT')} €
            </p>
            <div className="border-t border-zinc-900 pt-10 space-y-4">
              <p className="uppercase tracking-widest text-xs text-zinc-500">Linhagem: <span className="text-white ml-2">{cavalo.linhagem}</span></p>
              <p className="uppercase tracking-widest text-xs text-zinc-500">Estado: <span className="text-[#C5A059] ml-2">{cavalo.status}</span></p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
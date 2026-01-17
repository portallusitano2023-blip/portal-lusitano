// @ts-nocheck
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function ComprarPage({ searchParams }) {
  // PASSO DE ENGENHARIA: Em Next.js 15/16, searchParams é uma Promise
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  // BUSCA DE DADOS: Definimos a variável 'cavalos' aqui
  const { data: cavalos, error } = await supabase
    .from('cavalos_venda')
    .select('*')
    .eq('status', 'aprovado') // Apenas os que tu aprovaste no Admin
    .order('created_at', { ascending: false });

  // Tratamento de erro básico para evitar que o build rebente
  if (error) {
    console.error("Erro Supabase:", error.message);
  }

  return (
    <>
      <Navbar dev={isDev} />
      <main className="min-h-screen bg-black text-white pt-48 px-6 md:px-20 pb-32">
        <header className="mb-24 text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold block mb-4">Marketplace de Prestígio</span>
          <h1 className="text-6xl font-serif italic text-white mb-8">Comprar Exemplar</h1>
          <div className="w-24 h-[1px] bg-[#C5A059] mx-auto opacity-40"></div>
        </header>

        {/* Verificação: Só tentamos mapear se 'cavalos' existir e tiver dados */}
        {cavalos && cavalos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {cavalos.map((c) => (
              <Link 
                key={c.id} 
                href={`/comprar/${c.id}${isDev ? '?dev=true' : ''}`}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] bg-zinc-950 border border-zinc-900 overflow-hidden relative">
                  {c.image_url ? (
                    <img 
                      src={c.image_url} 
                      alt={c.nome_cavalo} 
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-800 text-[8px] tracking-widest uppercase">Sem Foto</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="mt-8 text-center">
                  <h2 className="font-serif text-2xl italic mb-2">{c.nome_cavalo}</h2>
                  <p className="text-[#C5A059] font-serif text-xl">
                    {Number(c.preco).toLocaleString('pt-PT')} €
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <p className="text-zinc-600 font-serif italic text-xl italic font-light">
              Nenhum exemplar aprovado para venda no momento.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
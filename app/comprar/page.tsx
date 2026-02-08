import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import HorseCard from "@/components/HorseCard";
import Link from "next/link";

export default async function ComprarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  // PASSO DE ENGENHARIA: Em Next.js 15/16, searchParams é uma Promise
  const sParams = await searchParams;
  const isDev = sParams?.dev === "true";

  // BUSCA DE DADOS: Definimos a variável 'cavalos' aqui
  const { data: cavalos, error } = await supabase
    .from("cavalos_venda")
    .select("*")
    .eq("status", "aprovado") // Apenas os que tu aprovaste no Admin
    .order("created_at", { ascending: false });

  // Tratamento de erro básico para evitar que o build rebente
  if (error) {
    console.error("Erro Supabase:", error.message);
  }

  return (
    <>
      <Navbar dev={isDev} />
      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 md:pt-48 px-4 sm:px-6 md:px-12 lg:px-20 pb-24 sm:pb-32">
        {/* Header - Responsive */}
        <header className="mb-8 sm:mb-12 md:mb-24 text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[9px] sm:text-[10px] font-bold block mb-2 sm:mb-4">
            Marketplace de Prestígio
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-white mb-4 sm:mb-8">
            Comprar Exemplar
          </h1>
          <div className="w-16 sm:w-24 h-[1px] bg-[#C5A059] mx-auto opacity-40"></div>

          {/* Count badge */}
          {cavalos && cavalos.length > 0 && (
            <p className="mt-4 sm:mt-6 text-zinc-500 text-sm">
              {cavalos.length} {cavalos.length === 1 ? "cavalo disponível" : "cavalos disponíveis"}
            </p>
          )}
        </header>

        {/* Sell CTA Banner */}
        <div className="mb-8 sm:mb-12 bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/10 to-transparent border border-[#C5A059]/30 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-serif mb-1">Quer vender o seu Lusitano?</h2>
              <p className="text-sm text-zinc-400">
                Anuncie no maior marketplace de cavalos Lusitanos em Portugal. Verificação de
                documentação incluída.
              </p>
            </div>
            <Link
              href="/vender-cavalo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A059] text-black font-semibold rounded-lg hover:bg-[#D4AF6A] transition-colors touch-manipulation whitespace-nowrap"
            >
              Vender Cavalo
            </Link>
          </div>
        </div>

        {/* Grid - Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols */}
        {cavalos && cavalos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {cavalos.map((c) => (
              <HorseCard
                key={c.id}
                horse={c}
                href={`/comprar/${c.id}${isDev ? "?dev=true" : ""}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 sm:py-32 md:py-40 px-4">
            <p className="text-zinc-600 font-serif italic text-base sm:text-lg md:text-xl font-light">
              Nenhum exemplar aprovado para venda no momento.
            </p>
          </div>
        )}
      </main>
    </>
  );
}

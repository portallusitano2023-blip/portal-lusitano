// @ts-nocheck
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Pedigree from "@/components/Pedigree";
import Link from "next/link";

export default async function DetalheCavaloPage({ params }) {
  const { id } = await params;
  
  // Buscar dados reais
  const { data: cavalo } = await supabase
    .from('cavalos_venda')
    .select('*')
    .eq('id', id)
    .single();

  if (!cavalo) return null;

  return (
    <>
      <Navbar dev={true} />
      
      <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
        
        {/* LADO ESQUERDO: A IMAGEM FIXA (Visual Hero) */}
        <div className="lg:w-1/2 h-[50vh] lg:h-screen lg:fixed lg:top-0 lg:left-0 relative border-r border-zinc-900 z-0">
          <img 
            src={cavalo.image_url} 
            alt={cavalo.nome_cavalo} 
            className="w-full h-full object-cover grayscale brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 lg:hidden"></div>
          
          {/* Marca d'água de luxo */}
          <div className="absolute top-10 left-10 hidden lg:block">
            <span className="text-white/20 font-serif text-9xl italic leading-none opacity-10 select-none">PL</span>
          </div>
        </div>

        {/* LADO DIREITO: O DOSSIER TÉCNICO (Scrollable) */}
        <div className="lg:w-1/2 lg:ml-[50%] bg-black relative z-10">
          <div className="px-8 py-20 lg:p-24 max-w-3xl mx-auto space-y-20">
            
            {/* CABEÇALHO */}
            <header className="space-y-6 border-b border-zinc-900 pb-12">
              <div className="flex items-center gap-4">
                 <span className="px-3 py-1 border border-[#C5A059] text-[#C5A059] text-[9px] uppercase tracking-widest font-bold">
                   {cavalo.linhagem || "Linhagem Pura"}
                 </span>
                 <span className="text-zinc-500 text-[9px] uppercase tracking-widest">ID: #{cavalo.id.slice(0,4)}</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-serif italic text-white">{cavalo.nome_cavalo}</h1>
              <p className="text-3xl text-[#C5A059] font-serif">
                {Number(cavalo.preco).toLocaleString('pt-PT')} €
              </p>
            </header>

            {/* ESPECIFICAÇÕES BIOMÉTRICAS */}
            <section className="grid grid-cols-2 gap-8 text-zinc-400">
               <div>
                 <span className="text-[10px] uppercase tracking-widest block mb-2 text-zinc-600">Idade</span>
                 <p className="text-2xl text-white font-serif">{cavalo.idade} Anos</p>
               </div>
               <div>
                 <span className="text-[10px] uppercase tracking-widest block mb-2 text-zinc-600">Localização</span>
                 <p className="text-2xl text-white font-serif">{cavalo.localizacao}</p>
               </div>
               <div className="col-span-2">
                 <span className="text-[10px] uppercase tracking-widest block mb-2 text-zinc-600">Descrição Técnica</span>
                 <p className="font-light leading-relaxed text-sm">
                   {cavalo.descricao || "Exemplar de estrutura sólida, com excelentes aprumos e uma mecânica de movimentos elástica. Apresenta um carácter dócil e aptidão para Dressage."}
                 </p>
               </div>
            </section>

            {/* A ÁRVORE GENEALÓGICA VISUAL (O NUNCA VISTO) */}
            <section>
              <h3 className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold mb-8">Certificado de Sangue</h3>
              <Pedigree cavalo={cavalo} />
              <p className="text-center text-[9px] text-zinc-600 mt-4 uppercase tracking-widest">
                Dados validados pelo Stud-Book da APSL
              </p>
            </section>

            {/* CALL TO ACTION */}
            <div className="pt-10 sticky bottom-0 bg-black/90 backdrop-blur-md py-6 border-t border-zinc-900">
              <button className="w-full bg-[#C5A059] text-black py-6 text-[11px] uppercase font-bold tracking-[0.4em] hover:bg-white transition-all duration-500">
                Solicitar Dossier & Visita
              </button>
              <p className="text-center text-[8px] text-zinc-500 mt-4 uppercase">
                A reserva requer aprovação prévia de perfil.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
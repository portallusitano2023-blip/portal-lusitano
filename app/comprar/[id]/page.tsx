// @ts-nocheck
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Pedigree from "@/components/Pedigree";

export default async function DetalheCavaloPage({ params }) {
  const resolvedParams = await params; // Next.js 15+ requer await
  const { id } = resolvedParams;
  
  let cavalo;

  // --- MODO DEMO (Para visualizares sem base de dados) ---
  if (id === 'demo') {
    cavalo = {
      id: "demo-123",
      nome_cavalo: "Imperador do Lagar",
      preco: 45000,
      idade: 6,
      localizacao: "Golegã, Capital do Cavalo",
      linhagem: "Veiga (MV)",
      descricao: "Garanhão de pelagem ruça, com 1.64m ao garrote. Aprovado com 76 pontos. Apresenta uma mecânica de movimentos excecional, com facilidade natural para o Piaffe e Passage. Temperamento de fogo mas colaborante, típico da linhagem Veiga antiga.",
      image_url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071",
      pai: "Sultão (MV)",
      mae: "Duquesa (MV)",
      pontuacao_apsl: 76
    };
  } 
  // --- MODO REAL (Supabase) ---
  else {
    const { data } = await supabase
      .from('cavalos_venda')
      .select('*')
      .eq('id', id)
      .single();
    cavalo = data;
  }

  // Se não houver cavalo (nem demo nem real), não mostra nada
  if (!cavalo) return <div className="text-white pt-40 text-center">Exemplar não encontrado.</div>;

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
                 <span className="text-zinc-500 text-[9px] uppercase tracking-widest">REG: {cavalo.id.slice(0,4).toUpperCase()}</span>
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
               <div>
                 <span className="text-[10px] uppercase tracking-widest block mb-2 text-zinc-600">Pontuação APSL</span>
                 <p className="text-2xl text-white font-serif">{cavalo.pontuacao_apsl || "N/A"} pts</p>
               </div>
               <div className="col-span-2 mt-8">
                 <span className="text-[10px] uppercase tracking-widest block mb-4 text-[#C5A059] font-bold">Parecer Técnico</span>
                 <p className="font-light leading-relaxed text-lg italic text-zinc-300">
                   "{cavalo.descricao}"
                 </p>
               </div>
            </section>

            {/* A ÁRVORE GENEALÓGICA VISUAL */}
            <section className="py-10 border-t border-zinc-900">
              <h3 className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold mb-12">Certificado de Sangue</h3>
              <Pedigree cavalo={cavalo} />
              <p className="text-center text-[9px] text-zinc-600 mt-6 uppercase tracking-widest">
                Dados verificados via Stud-Book Digital
              </p>
            </section>

            {/* CALL TO ACTION */}
            <div className="pt-10 sticky bottom-0 bg-black/95 backdrop-blur-md py-6 border-t border-zinc-900">
              <button className="w-full bg-[#C5A059] text-black py-6 text-[11px] uppercase font-bold tracking-[0.4em] hover:bg-white transition-all duration-500">
                Solicitar Dossier Completo
              </button>
              <p className="text-center text-[8px] text-zinc-500 mt-4 uppercase tracking-widest">
                Exclusivo para membros Portal Lusitano
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
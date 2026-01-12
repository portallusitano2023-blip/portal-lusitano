import Link from "next/link";
import { cavalos } from "../../../data/cavalos";

export default async function PaginaCavalo({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Esperar pelos parâmetros (para funcionar no Next.js 15)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Procurar o cavalo na base de dados
  const cavalo = cavalos.find((c) => c.id === Number(id));

  // 3. Se não encontrar, mostra erro
  if (!cavalo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-4xl font-serif mb-4">Cavalo não encontrado</h1>
        <p className="text-zinc-500 mb-8">O ID {id} não corresponde a nenhum animal.</p>
        <Link href="/" className="text-yellow-600 hover:underline">Voltar ao Início</Link>
      </div>
    );
  }

  // 4. Se encontrar, mostra a página
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Botão de Voltar */}
        <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 text-sm uppercase tracking-widest transition-colors">
          &larr; Voltar à Lista
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Lado Esquerdo: Imagem */}
          <div className="h-[500px] lg:h-[700px] bg-zinc-900 border border-zinc-800 p-2">
            <img 
              src={cavalo.imagem} 
              alt={cavalo.nome} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Lado Direito: Informação */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-start">
                <span className="text-yellow-600 font-bold tracking-widest uppercase mb-2 text-sm">{cavalo.tipo}</span>
                <span className="text-zinc-500 text-xs uppercase tracking-widest flex items-center gap-1">
                  📍 {cavalo.localizacao}
                </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">{cavalo.nome}</h1>
            <p className="text-2xl text-zinc-400 mb-8">{cavalo.preco}</p>
            
            <div className="space-y-4 text-zinc-400 mb-12 border-t border-b border-zinc-800 py-8 text-sm">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Idade</span>
                <span className="text-white font-bold">{cavalo.idade} Anos</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Altura</span>
                <span className="text-white font-bold">{cavalo.altura}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Raça</span>
                <span className="text-white font-bold">{cavalo.raca}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Pai</span>
                <span className="text-white font-bold">{cavalo.pai}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span>Mãe</span>
                <span className="text-white font-bold">{cavalo.mae}</span>
              </div>
              
              <div className="pt-4">
                <p className="leading-relaxed text-base">{cavalo.descricao}</p>
              </div>
            </div>

            <div className="flex gap-4 flex-col sm:flex-row">
              {/* CORRIGI O ERRO NESTE BOTÃO ABAIXO: */}
              <button className="flex-1 py-4 bg-yellow-600 text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">
                Contactar Vendedor
              </button>
              
              <button className="flex-1 py-4 border border-zinc-700 text-white font-bold uppercase tracking-widest hover:border-white transition-colors">
                Marcar Visita
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
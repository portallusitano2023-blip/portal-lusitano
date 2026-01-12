import Link from "next/link";
import { cavalos } from "../../../data/cavalos";

export default async function PaginaCavalo({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Receber o ID
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Procurar o cavalo
  const cavalo = cavalos.find((c) => c.id === Number(id));

  // 3. Se não encontrar, erro
  if (!cavalo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-4xl font-serif mb-4">Cavalo não encontrado</h1>
        <Link href="/" className="text-yellow-600 hover:underline">Voltar ao Início</Link>
      </div>
    );
  }

  // --- LÓGICA DO WHATSAPP ---
  // AQUI: Podes mudar para o número da Liquen Events ou o teu (formato: 35191xxxxxxx)
  const numeroTelemovel = "351939513151"; 
  
  // Criamos a mensagem dinâmica
  const mensagem = `Olá! Estou interessado no cavalo *${cavalo.nome}* (${cavalo.preco}) que vi no Portal Lusitano. Gostaria de saber mais detalhes.`;
  
  // Codificamos a mensagem para URL (transforma espaços em %20, etc.)
  const linkWhatsApp = `https://wa.me/${numeroTelemovel}?text=${encodeURIComponent(mensagem)}`;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 text-sm uppercase tracking-widest transition-colors">
          &larr; Voltar à Lista
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Imagem */}
          <div className="h-[500px] lg:h-[700px] bg-zinc-900 border border-zinc-800 p-2">
            <img 
              src={cavalo.imagem} 
              alt={cavalo.nome} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Informação */}
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
              {/* --- BOTÃO DO WHATSAPP --- */}
              {/* Transformámos o button num link <a> que abre noutra aba (_blank) */}
              <a 
                href={linkWhatsApp}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex-1 py-4 bg-[#25D366] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors text-center flex items-center justify-center gap-2"
              >
                {/* Ícone simples do WhatsApp */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                Contactar no WhatsApp
              </a>
              
              <button className="flex-1 py-4 border border-zinc-700 text-white font-bold uppercase tracking-widest hover:border-white transition-colors">
                Marcar uma visita
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
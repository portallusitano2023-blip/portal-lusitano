// @ts-nocheck
import { client } from "@/lib/client";
import Link from "next/link";

export const dynamic = 'force-dynamic';

// 1. Função para buscar os leilões reais do Sanity
async function getLeiloes() {
  const query = `*[_type == "leilao" && ativo == true] | order(dataFecho asc) {
    _id,
    titulo,
    lanceInicial,
    dataFecho,
    "cavaloNome": cavalo->nome,
    "cavaloSlug": cavalo->slug.current,
    "imagemUrl": cavalo->fotografiaPrincipal.asset->url,
    "descricaoCavalo": cavalo->descricao
  }`;
  return client.fetch(query);
}

export default async function Leiloes() {
  const leiloes = await getLeiloes();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        <span className="text-yellow-600 tracking-widest uppercase text-sm font-bold mb-4 block">
          Oportunidades Exclusivas
        </span>
        
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-8">
          Leilões Ativos
        </h1>
        
        <p className="text-xl text-zinc-400 mb-16 leading-relaxed">
          Participe nos leilões mais prestigiados do mundo equestre. 
          Licite em tempo real e adquira exemplares únicos da raça Lusitana.
        </p>

        <div className="space-y-8">
          {leiloes.length === 0 ? (
            <div className="py-20 border border-zinc-900 text-zinc-600">
              Não existem leilões ativos de momento.
            </div>
          ) : (
            leiloes.map((item) => (
              /* CARTÃO DE LEILÃO DINÂMICO */
              <div key={item._id} className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 relative overflow-hidden group hover:border-yellow-600 transition-all text-left">
                  <div className="absolute top-0 right-0 bg-yellow-600 text-black font-bold px-6 py-2 text-sm uppercase tracking-wider">
                      A Decorrer
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-full md:w-1/2 h-64 bg-zinc-800 overflow-hidden">
                          <img 
                            src={item.imagemUrl} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            alt={item.titulo} 
                          />
                      </div>
                      <div className="w-full md:w-1/2">
                          <h3 className="text-2xl font-serif text-white mb-2">{item.titulo}</h3>
                          <p className="text-zinc-500 mb-6 line-clamp-2">
                            {item.descricaoCavalo || `Leilão do exemplar ${item.cavaloNome}. Lance inicial de ${item.lanceInicial}€.`}
                          </p>
                          
                          <div className="flex justify-between items-center border-t border-zinc-800 pt-6">
                              <div>
                                  <span className="block text-xs text-zinc-500 uppercase">Termina em</span>
                                  <span className="text-yellow-600 font-bold text-lg">
                                    {new Date(item.dataFecho).toLocaleDateString('pt-PT')}
                                  </span>
                              </div>
                              <Link href={`/cavalo/${item.cavaloSlug}`}>
                                <button className="px-6 py-3 bg-white text-black font-bold uppercase text-[10px] tracking-widest hover:bg-yellow-600 transition-colors">
                                    Entrar no Leilão
                                </button>
                              </Link>
                          </div>
                      </div>
                  </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12">
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors border-b border-zinc-800 hover:border-white pb-1">
                Voltar à Página Inicial
            </Link>
        </div>

      </div>
    </main>
  );
}
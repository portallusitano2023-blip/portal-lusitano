// @ts-nocheck
import { client } from "@/lib/client";
import { PortableText } from "@portabletext/react";
import Countdown from "../../components/Countdown";
import Link from "next/link";

export default async function CavaloPage({ params }) {
  const { slug } = await params;

  // Busca os dados no Sanity
  const data = await client.fetch(`
    *[_type == "cavalo" && slug.current == $slug][0]{
      nome,
      idade,
      ferro,
      genealogia,
      descricao,
      "imageUrl": fotografiaPrincipal.asset->url,
      "leilao": *[_type == "leilao" && cavalo._ref == ^._id][0]{
        dataFecho,
        lanceInicial,
        ativo
      }
    }
  `, { slug });

  if (!data) return <div className="pt-40 text-center text-white">Exemplar não encontrado.</div>;

  // Lógica do WhatsApp personalizada com os dados do Sanity
  const numeroTelemovel = "351939513151"; 
  const mensagem = `Olá Francisco! Estou interessado no cavalo *${data.nome}* que vi no Portal Lusitano. Gostaria de obter mais informações.`;
  const linkWhatsApp = `https://wa.me/${numeroTelemovel}?text=${encodeURIComponent(mensagem)}`;

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/leiloes" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 text-xs uppercase tracking-[0.2em] transition-colors">
          &larr; Voltar aos Leilões
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Imagem Principal */}
          <div className="aspect-[4/5] overflow-hidden border border-zinc-900 bg-zinc-900">
            {data.imageUrl && (
              <img src={data.imageUrl} alt={data.nome} className="w-full h-full object-cover" />
            )}
          </div>

          {/* Detalhes e Ações */}
          <div className="flex flex-col">
            <span className="text-[#C5A059] uppercase tracking-[0.3em] text-sm mb-2 font-bold">Puro Sangue Lusitano</span>
            <h1 className="text-6xl font-serif mb-6">{data.nome}</h1>
            
            {/* Box de Negócio/Leilão */}
            <div className="bg-zinc-900/50 border border-[#C5A059]/30 p-8 mb-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Valor de Referência</p>
                  <p className="text-3xl font-serif text-[#C5A059]">{data.leilao?.lanceInicial || "Sob Consulta"} €</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Tempo Restante</p>
                  {data.leilao?.dataFecho ? (
                    <Countdown targetDate={data.leilao.dataFecho} />
                  ) : (
                    <span className="text-zinc-400 font-bold uppercase text-xs tracking-tighter">Venda Direta</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <a 
                  href={linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-white transition-all text-center flex items-center justify-center gap-2"
                >
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                   Contactar Especialista
                </a>
              </div>
            </div>

            {/* Ficha Técnica Detalhada */}
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-y-4 border-t border-zinc-800 pt-6">
                <p><span className="text-zinc-500 uppercase tracking-tighter block mb-1">Idade</span> {data.idade} anos</p>
                <p><span className="text-zinc-500 uppercase tracking-tighter block mb-1">Ferro</span> {data.ferro}</p>
                <div className="col-span-2">
                  <span className="text-zinc-500 uppercase tracking-tighter block mb-1">Genealogia</span>
                  <p className="italic text-zinc-300">{data.genealogia}</p>
                </div>
              </div>
              
              <div className="border-t border-zinc-800 pt-6">
                <span className="text-zinc-500 uppercase tracking-tighter block mb-2">Descrição Editorial</span>
                <p className="text-zinc-400 leading-relaxed text-base italic font-serif">
                   {data.descricao}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
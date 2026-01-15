// @ts-nocheck
'use client'; 

import { client } from "@/lib/client";
import { useEffect, useState } from "react";
import Countdown from "../../components/Countdown";
import BiddingForm from "../../components/BiddingForm";
import Link from "next/link";

export default function CavaloPage({ params }) {
  const [data, setData] = useState(null);
  const [relacionados, setRelacionados] = useState([]); // Novo estado para outros cavalos
  const [fotoAtiva, setFotoAtiva] = useState(null);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      // Query Dupla: Busca o cavalo atual E outros 3 cavalos aleatórios
      const result = await client.fetch(`
        {
          "atual": *[_type == "cavalo" && slug.current == $slug][0]{
            nome, idade, ferro, genealogia, descricao,
            "imageUrl": fotografiaPrincipal.asset->url,
            "galeriaUrls": galeria[].asset->url,
            "leilao": *[_type == "leilao" && cavalo._ref == ^._id][0]{
              dataFecho, lanceInicial, ativo
            }
          },
          "relacionados": *[_type == "cavalo" && slug.current != $slug][0...3]{
            nome,
            "slug": slug.current,
            "imageUrl": fotografiaPrincipal.asset->url,
            idade
          }
        }
      `, { slug });
      
      if (result.atual) {
        setData(result.atual);
        setFotoAtiva(result.atual.imageUrl);
        setRelacionados(result.relacionados);
      }
    };

    fetchData();
  }, [slug]);

  if (!data) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white italic">Carregando exemplar de elite...</div>;

  const numeroTelemovel = "351939513151"; 
  const mensagem = `Olá Francisco! Estou interessado no cavalo *${data.nome}* que vi no Portal Lusitano.`;
  const linkWhatsApp = `https://wa.me/${numeroTelemovel}?text=${encodeURIComponent(mensagem)}`;

  const todasAsFotos = [data.imageUrl, ...(data.galeriaUrls || [])];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/leiloes" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 text-xs uppercase tracking-[0.2em] transition-colors no-print">
          &larr; Voltar aos Leilões
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* GALERIA INTERATIVA */}
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden border border-zinc-900 bg-zinc-900 shadow-2xl">
              <img src={fotoAtiva} alt={data.nome} className="w-full h-full object-cover transition-all duration-500" />
            </div>
            <div className="grid grid-cols-4 gap-2 no-print">
              {todasAsFotos.map((url, idx) => (
                <button key={idx} onClick={() => setFotoAtiva(url)} className={`aspect-square border-2 transition-all ${fotoAtiva === url ? 'border-[#C5A059]' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                  <img src={url} className="w-full h-full object-cover" alt={`Miniatura ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* DETALHES E LICITAÇÃO */}
          <div className="flex flex-col">
            <span className="text-[#C5A059] uppercase tracking-[0.3em] text-sm mb-2 font-bold">Puro Sangue Lusitano</span>
            <h1 className="text-6xl font-serif mb-6">{data.nome}</h1>
            
            <div className="bg-zinc-900/50 border border-[#C5A059]/30 p-8 mb-10 shadow-2xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Valor de Referência</p>
                  <p className="text-3xl font-serif text-[#C5A059]">{data.leilao?.lanceInicial || "Sob Consulta"} €</p>
                </div>
                <div className="text-right no-print">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Tempo Restante</p>
                  {data.leilao?.dataFecho ? <Countdown targetDate={data.leilao.dataFecho} /> : <span className="text-zinc-400 font-bold uppercase text-xs">Venda Direta</span>}
                </div>
              </div>

              {/* FORMULÁRIO DE LICITAÇÃO OFICIAL */}
              <div className="mb-6">
                <BiddingForm cavaloNome={data.nome} />
              </div>

              <div className="flex flex-col gap-3 no-print">
                <a href={linkWhatsApp} target="_blank" className="w-full py-4 bg-zinc-900 border border-[#25D366]/30 text-[#25D366] font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#25D366] hover:text-black transition-all text-center">
                  Dúvidas por WhatsApp
                </a>
              </div>
            </div>

            {/* FICHA TÉCNICA */}
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-y-4 border-t border-zinc-800 pt-6">
                <p><span className="text-zinc-500 uppercase tracking-tighter block mb-1">Idade</span> {data.idade} anos</p>
                <p><span className="text-zinc-500 uppercase tracking-tighter block mb-1">Ferro</span> {data.ferro}</p>
              </div>
              <div className="border-t border-zinc-800 pt-6">
                <span className="text-zinc-500 uppercase tracking-tighter block mb-2">Descrição Editorial</span>
                <p className="text-zinc-400 leading-relaxed text-base italic font-serif">{data.descricao}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECÇÃO: EXEMPLARES RELACIONADOS (A Magia do Retenção) */}
        {relacionados.length > 0 && (
          <div className="mt-32 pt-20 border-t border-zinc-900">
            <h3 className="font-serif text-3xl mb-12 text-center text-white">Outros <span className="text-[#C5A059]">Exemplares de Elite</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relacionados.map((rel) => (
                <Link key={rel.slug} href={`/cavalo/${rel.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-zinc-900 mb-4 border border-zinc-800 group-hover:border-[#C5A059] transition-all">
                    <img src={rel.imageUrl} alt={rel.nome} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                  </div>
                  <p className="text-[#C5A059] uppercase tracking-widest text-[10px] mb-1 font-bold">Puro Sangue Lusitano</p>
                  <h4 className="text-xl font-serif text-white group-hover:text-[#C5A059] transition-colors">{rel.nome}</h4>
                  <p className="text-zinc-500 text-xs mt-1">{rel.idade} anos</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
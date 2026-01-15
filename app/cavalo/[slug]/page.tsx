// @ts-nocheck
'use client'; // Necessário para a interatividade da galeria

import { client } from "@/lib/client";
import { useEffect, useState } from "react";
import Countdown from "../../components/Countdown";
import Link from "next/link";

export default function CavaloPage({ params }) {
  const [data, setData] = useState(null);
  const [fotoAtiva, setFotoAtiva] = useState(null);
  const [slug, setSlug] = useState(null);

  // 1. Resolve os params e busca os dados
  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      const result = await client.fetch(`
        *[_type == "cavalo" && slug.current == $slug][0]{
          nome,
          idade,
          ferro,
          genealogia,
          descricao,
          "imageUrl": fotografiaPrincipal.asset->url,
          "galeriaUrls": galeria[].asset->url,
          "leilao": *[_type == "leilao" && cavalo._ref == ^._id][0]{
            dataFecho,
            lanceInicial,
            ativo
          }
        }
      `, { slug });
      
      setData(result);
      if (result) setFotoAtiva(result.imageUrl);
    };

    fetchData();
  }, [slug]);

  if (!data) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white italic">Carregando exemplar...</div>;

  const numeroTelemovel = "351939513151"; 
  const mensagem = `Olá Francisco! Estou interessado no cavalo *${data.nome}* que vi no Portal Lusitano.`;
  const linkWhatsApp = `https://wa.me/${numeroTelemovel}?text=${encodeURIComponent(mensagem)}`;

  // Criamos uma lista única com todas as fotos (principal + galeria)
  const todasAsFotos = [data.imageUrl, ...(data.galeriaUrls || [])];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/leiloes" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 text-xs uppercase tracking-[0.2em] transition-colors">
          &larr; Voltar aos Leilões
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* COLUNA ESQUERDA: GALERIA INTERATIVA */}
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden border border-zinc-900 bg-zinc-900 shadow-2xl">
              <img src={fotoAtiva} alt={data.nome} className="w-full h-full object-cover transition-all duration-500" />
            </div>
            
            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-2">
              {todasAsFotos.map((url, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setFotoAtiva(url)}
                  className={`aspect-square border-2 transition-all ${fotoAtiva === url ? 'border-[#C5A059]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={url} className="w-full h-full object-cover" alt={`Miniatura ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* COLUNA DIREITA: DETALHES */}
          <div className="flex flex-col">
            <span className="text-[#C5A059] uppercase tracking-[0.3em] text-sm mb-2 font-bold">Puro Sangue Lusitano</span>
            <h1 className="text-6xl font-serif mb-6">{data.nome}</h1>
            
            <div className="bg-zinc-900/50 border border-[#C5A059]/30 p-8 mb-10 shadow-2xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Valor de Referência</p>
                  <p className="text-3xl font-serif text-[#C5A059]">{data.leilao?.lanceInicial || "Sob Consulta"} €</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Tempo Restante</p>
                  {data.leilao?.dataFecho ? <Countdown targetDate={data.leilao.dataFecho} /> : <span className="text-zinc-400 font-bold uppercase text-xs">Venda Direta</span>}
                </div>
              </div>
              <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-[#25D366] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-white transition-all text-center flex items-center justify-center gap-2">
                Contactar Especialista
              </a>
            </div>

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
                <p className="text-zinc-400 leading-relaxed text-base italic font-serif">{data.descricao}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
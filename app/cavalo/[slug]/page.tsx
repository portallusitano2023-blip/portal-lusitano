"use client";

import { client } from "@/lib/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface CavaloSanity {
  nome: string;
  idade: number;
  ferro: string;
  genealogia?: string;
  descricao: string;
  preco?: number;
  imageUrl: string;
  galeriaUrls?: string[];
}

interface CavaloRelacionado {
  nome: string;
  slug: string;
  imageUrl: string;
  idade: number;
}

export default function CavaloPage({ params }: { params: Promise<{ slug: string }> }) {
  const [data, setData] = useState<CavaloSanity | null>(null);
  const [relacionados, setRelacionados] = useState<CavaloRelacionado[]>([]);
  const [fotoAtiva, setFotoAtiva] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      const result = await client.fetch(
        `
        {
          "atual": *[_type == "cavalo" && slug.current == $slug][0]{
            nome, idade, ferro, genealogia, descricao, preco,
            "imageUrl": fotografiaPrincipal.asset->url,
            "galeriaUrls": galeria[].asset->url
          },
          "relacionados": *[_type == "cavalo" && slug.current != $slug][0...3]{
            nome,
            "slug": slug.current,
            "imageUrl": fotografiaPrincipal.asset->url,
            idade
          }
        }
      `,
        { slug }
      );

      if (result.atual) {
        setData(result.atual);
        setFotoAtiva(result.atual.imageUrl);
        setRelacionados(result.relacionados);
      }
    };

    fetchData();
  }, [slug]);

  if (!data)
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white italic">
        Carregando exemplar de elite...
      </div>
    );

  const numeroTelemovel = "351939513151";
  const mensagem = `Ola! Estou interessado no cavalo *${data.nome}* que vi no Portal Lusitano.`;
  const linkWhatsApp = `https://wa.me/${numeroTelemovel}?text=${encodeURIComponent(mensagem)}`;

  const todasAsFotos = [data.imageUrl, ...(data.galeriaUrls || [])];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center text-zinc-500 hover:text-white mb-8 text-xs uppercase tracking-[0.2em] transition-colors no-print"
        >
          &larr; Voltar ao Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* GALERIA INTERATIVA */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden border border-zinc-900 bg-zinc-900 shadow-2xl">
              {fotoAtiva && (
                <Image
                  src={fotoAtiva}
                  alt={data.nome}
                  fill
                  className="object-cover transition-all duration-500"
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 no-print">
              {todasAsFotos.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setFotoAtiva(url)}
                  className={`relative aspect-square border-2 transition-all ${fotoAtiva === url ? "border-[#C5A059]" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Image src={url} fill className="object-cover" alt={`Miniatura ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* DETALHES */}
          <div className="flex flex-col">
            <span className="text-[#C5A059] uppercase tracking-[0.3em] text-sm mb-2 font-bold">
              Puro Sangue Lusitano
            </span>
            <h1 className="text-6xl font-serif mb-6">{data.nome}</h1>

            <div className="bg-zinc-900/50 border border-[#C5A059]/30 p-8 mb-10 shadow-2xl backdrop-blur-sm">
              <div className="mb-8">
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Preco</p>
                <p className="text-3xl font-serif text-[#C5A059]">
                  {data.preco ? `${data.preco.toLocaleString("pt-PT")} €` : "Sob Consulta"}
                </p>
              </div>

              <div className="flex flex-col gap-3 no-print">
                <a
                  href={linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#20bd5a] transition-all text-center"
                >
                  Contactar por WhatsApp
                </a>
                <a
                  href="mailto:portal.lusitano2023@gmail.com"
                  className="w-full py-4 bg-zinc-900 border border-[#C5A059]/30 text-[#C5A059] font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#C5A059] hover:text-black transition-all text-center"
                >
                  Enviar Email
                </a>
              </div>
            </div>

            {/* FICHA TECNICA */}
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-y-4 border-t border-zinc-800 pt-6">
                <p>
                  <span className="text-zinc-500 uppercase tracking-tighter block mb-1">Idade</span>{" "}
                  {data.idade} anos
                </p>
                <p>
                  <span className="text-zinc-500 uppercase tracking-tighter block mb-1">Ferro</span>{" "}
                  {data.ferro}
                </p>
              </div>
              {data.genealogia && (
                <div className="border-t border-zinc-800 pt-6">
                  <span className="text-zinc-500 uppercase tracking-tighter block mb-2">
                    Genealogia
                  </span>
                  <p className="text-zinc-400">{data.genealogia}</p>
                </div>
              )}
              <div className="border-t border-zinc-800 pt-6">
                <span className="text-zinc-500 uppercase tracking-tighter block mb-2">
                  Descricao
                </span>
                <p className="text-zinc-400 leading-relaxed text-base italic font-serif">
                  {data.descricao}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* EXEMPLARES RELACIONADOS */}
        {relacionados.length > 0 && (
          <div className="mt-32 pt-20 border-t border-zinc-900">
            <h3 className="font-serif text-3xl mb-12 text-center text-white">
              Outros <span className="text-[#C5A059]">Exemplares de Elite</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relacionados.map((rel) => (
                <Link key={rel.slug} href={`/cavalo/${rel.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-zinc-900 mb-4 border border-zinc-800 group-hover:border-[#C5A059] transition-all relative">
                    <Image
                      src={rel.imageUrl}
                      alt={rel.nome}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-[#C5A059] uppercase tracking-widest text-[10px] mb-1 font-bold">
                    Puro Sangue Lusitano
                  </p>
                  <h4 className="text-xl font-serif text-white group-hover:text-[#C5A059] transition-colors">
                    {rel.nome}
                  </h4>
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

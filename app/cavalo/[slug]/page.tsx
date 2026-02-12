"use client";

import { client } from "@/lib/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DynamicSEO from "@/components/DynamicSEO";
import { analytics } from "@/lib/analytics-events";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Timeout de 10 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

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
          { slug },
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (result.atual) {
          setData(result.atual);
          setFotoAtiva(result.atual.imageUrl);
          setRelacionados(result.relacionados || []);

          // Track view do cavalo
          analytics.viewCavalo({
            id: slug,
            nome: result.atual.nome,
            preco: result.atual.preco,
            coudelaria: result.atual.ferro,
            idade: result.atual.idade,
          });
        } else {
          // Cavalo nao encontrado (404)
          setError("not_found");
        }
      } catch (err) {
        console.error("Erro ao carregar cavalo:", err);

        // Tratamento de erro especifico
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            setError("timeout");
          } else {
            setError("network");
          }
        } else {
          setError("unknown");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--gold)] mb-4"></div>
          <p className="italic text-[var(--foreground-secondary)]">
            Carregando exemplar de elite...
          </p>
        </div>
      </div>
    );
  }

  // Error 404 - Cavalo nao encontrado
  if (error === "not_found") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)] px-6">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-serif mb-4 text-[var(--gold)]">404</h1>
          <p className="text-xl mb-6 text-[var(--foreground-secondary)]">Exemplar nao encontrado</p>
          <p className="text-sm text-[var(--foreground-muted)] mb-8">
            O cavalo que procura pode ter sido vendido ou o link esta incorreto.
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-8 py-3 bg-[var(--gold)] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#d4b670] transition-all"
          >
            Ver Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Error timeout
  if (error === "timeout") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)] px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-serif mb-4 text-[var(--gold)]">Tempo esgotado</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mb-8">
            A conexao demorou muito tempo. Verifique sua internet e tente novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block px-8 py-3 bg-[var(--gold)] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#d4b670] transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Error network/unknown
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)] px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-serif mb-4 text-[var(--gold)]">Erro ao carregar</h1>
          <p className="text-sm text-[var(--foreground-secondary)] mb-8">
            Ocorreu um erro ao carregar o cavalo. Por favor, tente novamente.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[var(--gold)] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#d4b670] transition-all"
            >
              Tentar Novamente
            </button>
            <Link
              href="/marketplace"
              className="px-8 py-3 bg-[var(--background-secondary)] border border-[var(--gold)]/30 text-[var(--gold)] font-bold uppercase text-xs tracking-[0.2em] hover:bg-[var(--gold)] hover:text-black transition-all"
            >
              Voltar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safety check (nunca deve acontecer, mas por precaucao)
  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)] italic">
        Carregando exemplar de elite...
      </div>
    );
  }

  const numeroTelemovel = "351939513151";
  const mensagem = `Ola! Estou interessado no cavalo *${data.nome}* que vi no Portal Lusitano.`;
  const linkWhatsApp = `https://wa.me/${numeroTelemovel}?text=${encodeURIComponent(mensagem)}`;

  const todasAsFotos = [data.imageUrl, ...(data.galeriaUrls || [])];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-20">
      <DynamicSEO
        title={`${data.nome} - Cavalo Lusitano a Venda - Portal Lusitano`}
        description={
          data.descricao ||
          `${data.nome}, ${data.idade} anos, ${data.ferro}. Cavalo Lusitano de elite disponivel para venda.`
        }
        image={data.imageUrl}
        url={`https://portallusitano.com/cavalo/${slug}`}
      />
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-8 text-xs uppercase tracking-[0.2em] transition-colors no-print"
        >
          &larr; Voltar ao Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* GALERIA INTERATIVA */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden border border-[var(--background-secondary)] bg-[var(--background-secondary)] shadow-2xl">
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
                  className={`relative aspect-square border-2 transition-all ${fotoAtiva === url ? "border-[var(--gold)]" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Image src={url} fill className="object-cover" alt={`Miniatura ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* DETALHES */}
          <div className="flex flex-col">
            <span className="text-[var(--gold)] uppercase tracking-[0.3em] text-sm mb-2 font-bold">
              Puro Sangue Lusitano
            </span>
            <h1 className="text-6xl font-serif mb-6">{data.nome}</h1>

            <div className="bg-[var(--background-secondary)]/50 border border-[var(--gold)]/30 p-8 mb-10 shadow-2xl backdrop-blur-sm">
              <div className="mb-8">
                <p className="text-[var(--foreground-muted)] text-[10px] uppercase tracking-widest mb-1">
                  Preco
                </p>
                <p className="text-3xl font-serif text-[var(--gold)]">
                  {data.preco ? `${data.preco.toLocaleString("pt-PT")} €` : "Sob Consulta"}
                </p>
              </div>

              <div className="flex flex-col gap-3 no-print">
                <a
                  href={linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Track contacto WhatsApp
                    analytics.contactCavalo({
                      id: slug!,
                      nome: data.nome,
                      preco: data.preco,
                      method: "whatsapp",
                    });
                  }}
                  className="w-full py-4 bg-[#25D366] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#20bd5a] transition-all text-center"
                >
                  Contactar por WhatsApp
                </a>
                <a
                  href="mailto:portal.lusitano2023@gmail.com"
                  onClick={() => {
                    // Track contacto Email
                    analytics.contactCavalo({
                      id: slug!,
                      nome: data.nome,
                      preco: data.preco,
                      method: "email",
                    });
                  }}
                  className="w-full py-4 bg-[var(--background-secondary)] border border-[var(--gold)]/30 text-[var(--gold)] font-bold uppercase text-xs tracking-[0.2em] hover:bg-[var(--gold)] hover:text-black transition-all text-center"
                >
                  Enviar Email
                </a>
              </div>
            </div>

            {/* FICHA TECNICA */}
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-y-4 border-t border-[var(--border)] pt-6">
                <p>
                  <span className="text-[var(--foreground-muted)] uppercase tracking-tighter block mb-1">
                    Idade
                  </span>{" "}
                  {data.idade} anos
                </p>
                <p>
                  <span className="text-[var(--foreground-muted)] uppercase tracking-tighter block mb-1">
                    Ferro
                  </span>{" "}
                  {data.ferro}
                </p>
              </div>
              {data.genealogia && (
                <div className="border-t border-[var(--border)] pt-6">
                  <span className="text-[var(--foreground-muted)] uppercase tracking-tighter block mb-2">
                    Genealogia
                  </span>
                  <p className="text-[var(--foreground-secondary)]">{data.genealogia}</p>
                </div>
              )}
              <div className="border-t border-[var(--border)] pt-6">
                <span className="text-[var(--foreground-muted)] uppercase tracking-tighter block mb-2">
                  Descricao
                </span>
                <p className="text-[var(--foreground-secondary)] leading-relaxed text-base italic font-serif">
                  {data.descricao}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* EXEMPLARES RELACIONADOS */}
        {relacionados.length > 0 && (
          <div className="mt-32 pt-20 border-t border-[var(--background-secondary)]">
            <h3 className="font-serif text-3xl mb-12 text-center text-[var(--foreground)]">
              Outros <span className="text-[var(--gold)]">Exemplares de Elite</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relacionados.map((rel) => (
                <Link key={rel.slug} href={`/cavalo/${rel.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-[var(--background-secondary)] mb-4 border border-[var(--border)] group-hover:border-[var(--gold)] transition-all relative">
                    <Image
                      src={rel.imageUrl}
                      alt={rel.nome}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-[var(--gold)] uppercase tracking-widest text-[10px] mb-1 font-bold">
                    Puro Sangue Lusitano
                  </p>
                  <h4 className="text-xl font-serif text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                    {rel.nome}
                  </h4>
                  <p className="text-[var(--foreground-muted)] text-xs mt-1">{rel.idade} anos</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Pedigree from "@/components/Pedigree";
import { ProductSchema, BreadcrumbSchema } from "@/components/JsonLd";

import { CavaloVenda } from "@/types/cavalo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

export default async function DetalheCavaloPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Next.js 15+ requer await
  const { id } = resolvedParams;

  let cavalo: CavaloVenda | null = null;

  // --- MODO DEMO (Para visualizares sem base de dados) ---
  if (id === "demo") {
    cavalo = {
      id: "demo-123",
      nome_cavalo: "Imperador do Lagar",
      preco: 45000,
      idade: 6,
      localizacao: "Golegã, Capital do Cavalo",
      linhagem: "Veiga (MV)",
      descricao:
        "Garanhão de pelagem ruça, com 1.64m ao garrote. Aprovado com 76 pontos. Apresenta uma mecânica de movimentos excecional, com facilidade natural para o Piaffe e Passage. Temperamento de fogo mas colaborante, típico da linhagem Veiga antiga.",
      image_url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071",
      pai: "Sultão (MV)",
      mae: "Duquesa (MV)",
      pontuacao_apsl: 76,
    };
  }
  // --- MODO REAL (Supabase) ---
  else {
    const { data } = await supabase.from("cavalos_venda").select("*").eq("id", id).single();
    cavalo = data;
  }

  // Se não houver cavalo (nem demo nem real), não mostra nada
  if (!cavalo) return <div className="text-white pt-40 text-center">Exemplar não encontrado.</div>;

  return (
    <>
      <ProductSchema
        name={cavalo.nome_cavalo}
        description={cavalo.descricao || `Cavalo Lusitano - ${cavalo.nome_cavalo}`}
        image={cavalo.image_url || ""}
        price={String(cavalo.preco || 0)}
        sku={cavalo.id}
      />
      <BreadcrumbSchema
        items={[
          { name: "Início", url: siteUrl },
          { name: "Comprar", url: `${siteUrl}/comprar` },
          { name: cavalo.nome_cavalo, url: `${siteUrl}/comprar/${id}` },
        ]}
      />
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
        {/* LADO ESQUERDO: A IMAGEM FIXA (Visual Hero) */}
        <div className="lg:w-1/2 h-[50vh] lg:h-screen lg:fixed lg:top-0 lg:left-0 relative border-r border-zinc-900 z-0">
          <Image
            src={cavalo.image_url}
            alt={cavalo.nome_cavalo}
            fill
            className="object-cover grayscale brightness-75"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 lg:hidden"></div>

          {/* Marca d'água de luxo */}
          <div className="absolute top-10 left-10 hidden lg:block">
            <span className="text-white/20 font-serif text-9xl italic leading-none opacity-10 select-none">
              PL
            </span>
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
                <span className="text-zinc-500 text-[9px] uppercase tracking-widest">
                  REG: {cavalo.id.slice(0, 4).toUpperCase()}
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-serif italic text-white">
                {cavalo.nome_cavalo}
              </h1>
              <p className="text-3xl text-[#C5A059] font-serif">
                {Number(cavalo.preco).toLocaleString("pt-PT")} €
              </p>
            </header>

            {/* ESPECIFICAÇÕES BIOMÉTRICAS */}
            <section className="grid grid-cols-2 gap-8 text-zinc-400">
              <div>
                <span className="text-[10px] uppercase tracking-widest block mb-2 text-zinc-600">
                  Idade
                </span>
                <p className="text-2xl text-white font-serif">{cavalo.idade} Anos</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest block mb-2 text-zinc-600">
                  Localização
                </span>
                <p className="text-2xl text-white font-serif">{cavalo.localizacao}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest block mb-2 text-zinc-600">
                  Pontuação APSL
                </span>
                <p className="text-2xl text-white font-serif">
                  {cavalo.pontuacao_apsl || "N/A"} pts
                </p>
              </div>
              <div className="col-span-2 mt-8">
                <span className="text-[10px] uppercase tracking-widest block mb-4 text-[#C5A059] font-bold">
                  Parecer Técnico
                </span>
                <p className="font-light leading-relaxed text-lg italic text-zinc-300">
                  &ldquo;{cavalo.descricao}&rdquo;
                </p>
              </div>
            </section>

            {/* A ÁRVORE GENEALÓGICA VISUAL */}
            <section className="py-10 border-t border-zinc-900">
              <h3 className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold mb-12">
                Certificado de Sangue
              </h3>
              <Pedigree cavalo={cavalo} />
              <p className="text-center text-[9px] text-zinc-600 mt-6 uppercase tracking-widest">
                Dados verificados via Stud-Book Digital
              </p>
            </section>

            {/* SECÇÃO BLOCKCHAIN / INOVAÇÃO (NOVA) */}
            <section className="py-12 border-t border-zinc-900">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[#C5A059] uppercase tracking-[0.5em] text-[10px] font-bold">
                  Digital Asset
                </h3>
                <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 text-[8px] uppercase tracking-widest rounded-full animate-pulse">
                  Blockchain Verified
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                {/* Efeito de Código de Fundo */}
                <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-[10px] text-blue-400 pointer-events-none select-none">
                  0x71C...9A21
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div>
                    <h4 className="text-white font-serif italic text-2xl mb-2">
                      Certificado NFT #8829
                    </h4>
                    <p className="text-zinc-500 text-xs font-light leading-relaxed mb-6">
                      Este exemplar possui um Gémeo Digital registado na rede Polygon. A propriedade
                      é transferida via Smart Contract no momento da venda, garantindo autenticidade
                      e histórico imutável.
                    </p>
                    <div className="flex gap-4 font-mono text-[9px] text-zinc-400">
                      <div>
                        <span className="block text-zinc-600 uppercase">Token ID</span>
                        <span className="text-white">8829304...</span>
                      </div>
                      <div>
                        <span className="block text-zinc-600 uppercase">Contract</span>
                        <span className="text-[#C5A059]">0xPort...Lusi</span>
                      </div>
                      <div>
                        <span className="block text-zinc-600 uppercase">Standard</span>
                        <span className="text-white">ERC-721</span>
                      </div>
                    </div>
                  </div>

                  {/* Visualização do Smart Contract (Simulada) */}
                  <div className="bg-black border border-zinc-900 p-4 font-mono text-[8px] text-zinc-500 leading-loose rounded overflow-hidden">
                    <p>
                      <span className="text-blue-400">function</span>{" "}
                      <span className="text-yellow-400">transferOwnership</span>(address _newOwner){" "}
                      <span className="text-blue-400">public</span> &#123;
                    </p>
                    <p className="pl-4">require(msg.sender == owner);</p>
                    <p className="pl-4">owner = _newOwner;</p>
                    <p className="pl-4 text-green-500">{/* Royalties automáticos de 5% */}</p>
                    <p className="pl-4">payable(creator).transfer(msg.value * 0.05);</p>
                    <p>&#125;</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CALL TO ACTION */}
            <div className="pt-10 sticky bottom-0 bg-black/95 backdrop-blur-md py-6 border-t border-zinc-900">
              <button className="w-full bg-[#C5A059] text-black py-6 text-[11px] uppercase font-bold tracking-[0.4em] hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                Solicitar Dossier & Visita
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

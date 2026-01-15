import { client } from "@/lib/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

// Função para buscar o cavalo ao Sanity
async function getCavalo(slug: string) {
  const query = `*[_type == "cavalo" && slug.current == $slug][0]{
    _id,
    nome,
    preco,
    idade,
    altura,
    genero,
    localizacao,
    disciplina,
    descricao,
    "imagemUrl": fotografiaPrincipal.asset->url,
    "galeria": galeria[].asset->url
  }`;
  
  // Aqui passamos o parâmetro para a query
  return client.fetch(query, { slug });
}

// CORREÇÃO AQUI: Definimos params como uma Promise
export default async function CavaloPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // 1. AWAIT PARAMS (Obrigatório no Next.js 15/16)
  // Temos de "esperar" que o parâmetro chegue antes de o usar
  const { slug } = await params;

  // 2. Agora já podemos buscar o cavalo com o slug certo
  const cavalo = await getCavalo(slug);

  if (!cavalo) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-gray-300 selection:bg-[#C5A059] selection:text-black font-sans pb-20">
      
      {/* === HEADER COM IMAGEM DE FUNDO (Efeito Blur) === */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {cavalo.imagemUrl && (
          <>
            <Image
              src={cavalo.imagemUrl}
              alt={cavalo.nome}
              fill
              className="object-cover opacity-40 blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
          </>
        )}
        
        {/* Botão Voltar */}
        <div className="absolute top-32 left-4 md:left-10 z-20">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-[#C5A059] transition uppercase text-xs tracking-widest font-bold">
            ← Voltar ao Início
          </Link>
        </div>

        {/* Título Principal */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 flex flex-col md:flex-row items-end justify-between gap-6">
          <div>
            <span className="text-[#C5A059] tracking-[0.4em] uppercase text-xs font-bold pl-1 block mb-2">
              {cavalo.disciplina || "Cavalo Lusitano"}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none">
              {cavalo.nome}
            </h1>
          </div>
          <div className="mb-2">
             <span className="text-2xl md:text-3xl text-white font-serif italic border-b border-[#C5A059] pb-1">
               {cavalo.preco ? `${cavalo.preco} €` : "Preço sob consulta"}
             </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* === COLUNA ESQUERDA: FOTO PRINCIPAL & GALERIA === */}
        <div className="lg:col-span-7 space-y-8">
          {/* Foto Principal Limpa */}
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-gray-800 shadow-2xl">
            {cavalo.imagemUrl ? (
              <Image
                src={cavalo.imagemUrl}
                alt={cavalo.nome}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-600">
                Sem Imagem
              </div>
            )}
          </div>

          {/* Galeria (Placeholder se não houver fotos extra) */}
          {cavalo.galeria && cavalo.galeria.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {cavalo.galeria.map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-square border border-gray-800 overflow-hidden cursor-pointer hover:opacity-80 transition">
                  <Image src={img} alt={`Galeria ${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* === COLUNA DIREITA: DETALHES TÉCNICOS === */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Ficha Técnica */}
          <div className="bg-[#0a0a0a] border border-gray-900 p-8 md:p-10">
            <h3 className="text-white font-serif text-2xl mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-[#C5A059]"></span>
              Ficha Técnica
            </h3>
            
            <dl className="grid grid-cols-2 gap-y-8 gap-x-4 text-sm">
              <div>
                <dt className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Idade / Nascimento</dt>
                <dd className="text-white text-lg">{cavalo.idade || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Altura (Garrote)</dt>
                <dd className="text-white text-lg">{cavalo.altura ? `${cavalo.altura} m` : "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Género</dt>
                <dd className="text-white text-lg">{cavalo.genero || "Macho"}</dd>
              </div>
              <div>
                <dt className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Localização</dt>
                <dd className="text-white text-lg">{cavalo.localizacao || "Portugal"}</dd>
              </div>
              <div className="col-span-2 pt-4 border-t border-gray-800">
                <dt className="text-gray-500 uppercase text-[10px] tracking-widest mb-2">Sobre este Cavalo</dt>
                <dd className="text-gray-400 leading-relaxed">
                  {cavalo.descricao || "Este cavalo destaca-se pela sua morfologia e caráter excecional, típico do Puro Sangue Lusitano. Contacte-nos para mais detalhes e vídeos."}
                </dd>
              </div>
            </dl>
          </div>

          {/* Botões de Contacto */}
          <div className="space-y-4">
            <a 
              href={`https://wa.me/351939513151?text=Olá, estou interessado no cavalo ${cavalo.nome}.`}
              target="_blank"
              className="block w-full bg-[#C5A059] text-black text-center py-4 font-bold uppercase tracking-widest text-xs hover:bg-white transition duration-300"
            >
              Contactar via WhatsApp
            </a>
            <a 
              href="mailto:portal.lusitano2023@gmail.com"
              className="block w-full border border-gray-800 text-white text-center py-4 font-bold uppercase tracking-widest text-xs hover:border-[#C5A059] hover:text-[#C5A059] transition duration-300"
            >
              Pedir Mais Informações
            </a>
          </div>

          <p className="text-xs text-center text-gray-600 px-4">
            Nota: Todos os exames veterinários e Raio-X podem ser disponibilizados sob pedido.
          </p>
        </div>
      </div>
    </main>
  );
}
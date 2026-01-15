import { client } from "@/lib/client"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"

// 1. QUERY ATUALIZADA: Agora trazemos a galeria também!
const QUERY = `*[_type == "cavalo" && slug.current == $slug][0]{
  nome,
  preco,
  disciplina,
  localizacao,
  descricao,
  "imagemUrl": fotografiaPrincipal.asset->url,
  "coudelariaNome": coudelaria->nome,
  "galeria": galeria[].asset->url
}`

export default async function CavaloPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const cavalo = await client.fetch(QUERY, { slug: params.slug });

  if (!cavalo) { return notFound(); }

  // 2. Lógica do WhatsApp
  // Substitui este número pelo telemóvel da tua empresa (com 351)
  const TELEMOVEL = "351910000000"; 
  const mensagem = `Olá, vi o cavalo ${cavalo.nome} no Portal Lusitano e gostava de saber mais detalhes.`;
  const whatsappLink = `https://wa.me/${TELEMOVEL}?text=${encodeURIComponent(mensagem)}`;

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Lado Esquerdo: Imagem Principal */}
        <div className="relative h-[60vh] lg:h-[80vh] bg-gray-900 sticky top-24">
          {cavalo.imagemUrl ? (
            <Image src={cavalo.imagemUrl} alt={cavalo.nome} fill className="object-cover" priority />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">Sem Imagem</div>
          )}
        </div>

        {/* Lado Direito: Informação de Venda */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-4 flex items-center gap-4">
             <span className="bg-[#C5A059] text-black px-3 py-1 text-xs font-bold uppercase tracking-widest">
               {cavalo.disciplina || 'Lusitano'}
             </span>
             {cavalo.coudelariaNome && (
               <span className="text-gray-400 text-sm uppercase tracking-wider">
                 Criador: {cavalo.coudelariaNome}
               </span>
             )}
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-serif mb-6 leading-none">{cavalo.nome}</h1>
          <p className="text-xl text-gray-300 mb-8 flex items-center gap-2">
            📍 {cavalo.localizacao || "Portugal"}
          </p>
          
          <div className="border-t border-b border-gray-800 py-8 my-8">
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Preço Solicitado</p>
            <p className="text-4xl lg:text-5xl font-serif text-[#C5A059]">
              {cavalo.preco ? `${cavalo.preco.toLocaleString()}€` : "Sob Consulta"}
            </p>
          </div>

          <div className="space-y-4">
            {/* Botão WhatsApp */}
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-[#25D366] text-white text-center py-4 font-bold uppercase tracking-widest hover:bg-[#128C7E] transition duration-300"
            >
              WhatsApp Oficial 📞
            </a>
            
            <button className="block w-full border border-white text-white py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition duration-300">
              Enviar Email
            </button>
          </div>

          {/* Descrição em Texto */}
          {cavalo.descricao && (
             <div className="mt-12 text-gray-400 leading-relaxed max-w-lg">
               <p>Descrição detalhada indisponível de momento.</p>
             </div>
          )}
        </div>
      </div>

      {/* --- NOVA SECÇÃO: GALERIA DE FOTOS --- */}
      {cavalo.galeria && cavalo.galeria.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif mb-8 border-l-4 border-[#C5A059] pl-4">Galeria Multimédia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cavalo.galeria.map((fotoUrl: string, index: number) => (
              <div key={index} className="relative aspect-square bg-gray-900 group overflow-hidden">
                <Image 
                  src={fotoUrl} 
                  alt={`Galeria ${cavalo.nome} ${index + 1}`} 
                  fill 
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
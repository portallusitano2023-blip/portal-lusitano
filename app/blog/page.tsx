// @ts-nocheck
import { client } from "@/lib/client";
import { PortableText } from "@portabletext/react";
// Corrigido o caminho para garantir que o Vercel encontra o componente
import Newsletter from "../../../components/Newsletter";

export default async function BlogPost({ params }) {
  // 1. O 'id' vem do nome da pasta [id] no teu VS Code
  const { id } = await params;

  // 2. Busca o artigo no Sanity usando o id (slug)
  const post = await client.fetch(`*[_type == "post" && slug.current == $id][0]{
    title,
    mainImage,
    body,
    publishedAt,
    "authorName": author->name,
    "imageUrl": mainImage.asset->url
  }`, { id });

  // Caso o artigo não exista ou o slug esteja errado
  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <p className="text-xl font-serif">Artigo não encontrado.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-gray-300 pb-20">
      {/* Hero do Artigo com Imagem do Sanity */}
      <div className="h-[60vh] relative overflow-hidden">
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            className="w-full h-full object-cover opacity-60" 
            alt={post.title} 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        <div className="absolute bottom-10 left-0 w-full px-6 md:px-20 text-center md:text-left">
           <span className="text-[#C5A059] uppercase tracking-[0.4em] text-xs font-bold mb-4 block">
             Cultura Lusitana
           </span>
           <h1 className="text-4xl md:text-7xl font-serif text-white max-w-4xl leading-tight">
             {post.title}
           </h1>
        </div>
      </div>

      {/* Área do Conteúdo */}
      <div className="max-w-3xl mx-auto px-6 mt-20">
        {/* Metadados: Autor e Data */}
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-900">
           <div className="text-xs text-gray-500 uppercase tracking-widest">
             Escrito por <span className="text-white">{post.authorName || "Francisco Gaspar"}</span>
           </div>
           <div className="h-1 w-1 rounded-full bg-[#C5A059]" />
           <div className="text-xs text-gray-500 uppercase tracking-widest">
             {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-PT') : "Recentemente"}
           </div>
        </div>

        {/* Texto do Artigo com Estilo de Revista */}
        <article className="prose prose-invert prose-gold max-w-none 
          first-letter:text-7xl first-letter:font-serif first-letter:text-[#C5A059] 
          first-letter:mr-3 first-letter:float-left leading-relaxed text-lg text-gray-400">
          <PortableText value={post.body} />
        </article>

        {/* Separador e Newsletter Automática */}
        <div className="mt-32 pt-20 border-t border-gray-900">
          <Newsletter />
        </div>
      </div>
    </main>
  );
}
// @ts-nocheck
import { client } from "@/lib/client";
import { PortableText } from "@portabletext/react";
// DOIS níveis para cima para achar a pasta components a partir de [id]
import Newsletter from "../../../components/Newsletter";

export default async function BlogPost({ params }) {
  const { id } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $id][0]{
    title,
    mainImage,
    body,
    publishedAt,
    "authorName": author->name,
    "imageUrl": mainImage.asset->url
  }`, { id });

  if (!post) return <div className="pt-40 text-center text-white font-serif">Artigo não encontrado.</div>;

  return (
    <main className="min-h-screen bg-[#050505] text-gray-300 pb-20">
      <div className="h-[60vh] relative overflow-hidden">
        {post.imageUrl && <img src={post.imageUrl} className="w-full h-full object-cover opacity-60" alt={post.title} />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        <div className="absolute bottom-10 left-0 w-full px-6 md:px-20">
           <span className="text-[#C5A059] uppercase tracking-[0.4em] text-xs font-bold mb-4 block">Cultura Lusitana</span>
           <h1 className="text-4xl md:text-7xl font-serif text-white max-w-4xl leading-tight">{post.title}</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 mt-20">
        <article className="prose prose-invert prose-gold max-w-none 
          first-letter:text-7xl first-letter:font-serif first-letter:text-[#C5A059] 
          first-letter:mr-3 first-letter:float-left leading-relaxed text-lg text-gray-400">
          <PortableText value={post.body} />
        </article>
        <div className="mt-32 pt-20 border-t border-gray-900">
          <Newsletter />
        </div>
      </div>
    </main>
  );
}
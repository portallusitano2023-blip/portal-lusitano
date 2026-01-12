import Link from "next/link";
import { artigos } from "@/data/blog";

export default async function PaginaArtigo({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;
  const artigo = artigos.find((a) => a.id === Number(id));

  if (!artigo) {
    return <div className="p-20 text-center text-white">Artigo não encontrado.</div>;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 pt-32 pb-20">
      
      {/* Artigo Centralizado */}
      <article className="max-w-3xl mx-auto px-4">
        
        <Link href="/blog" className="text-zinc-500 text-sm hover:text-white mb-8 block">
            &larr; Voltar às Notícias
        </Link>

        <span className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-4 block">
            {artigo.categoria} • {artigo.data}
        </span>

        <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
            {artigo.titulo}
        </h1>

        <div className="h-[400px] w-full mb-12">
            <img 
                src={artigo.imagem} 
                alt={artigo.titulo} 
                className="w-full h-full object-cover"
            />
            <p className="text-right text-zinc-600 text-xs mt-2 italic">Escrito por {artigo.autor}</p>
        </div>

        <div className="prose prose-invert prose-lg text-zinc-300 leading-loose">
            {/* Aqui simulamos parágrafos dividindo o texto */}
            <p>{artigo.conteudo}</p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
        </div>

        {/* Autor */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-xl">
                👤
            </div>
            <div>
                <p className="text-white font-bold text-sm">Escrito por {artigo.autor}</p>
                <p className="text-zinc-500 text-xs">Equipa Portal Lusitano</p>
            </div>
        </div>

      </article>
    </main>
  );
}
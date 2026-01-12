import Link from "next/link";
import { artigos } from "@/data/blog"; // Importamos os dados novos

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 pt-32 pb-20">
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <span className="text-yellow-600 tracking-widest uppercase text-sm font-bold mb-4 block">
            Jornal Lusitano
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Notícias & Artigos
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Acompanhe as últimas novidades do mundo equestre, dicas de saúde e histórias da nossa tradição.
          </p>
        </div>

        {/* Grelha de Artigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {artigos.map((artigo) => (
            <article key={artigo.id} className="group bg-zinc-900 border border-zinc-800 flex flex-col hover:border-zinc-600 transition-colors">
              {/* Imagem */}
              <div className="h-60 overflow-hidden relative">
                 <div className="absolute top-4 left-4 bg-yellow-600 text-black text-xs font-bold px-3 py-1 uppercase tracking-wider z-10">
                    {artigo.categoria}
                 </div>
                 <img 
                    src={artigo.imagem} 
                    alt={artigo.titulo} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 />
              </div>

              {/* Texto */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-zinc-500 text-xs uppercase tracking-widest mb-3 flex justify-between">
                    <span>{artigo.data}</span>
                    <span>{artigo.autor}</span>
                </div>
                
                <h2 className="text-2xl font-serif text-white mb-4 leading-tight group-hover:text-yellow-600 transition-colors">
                    {artigo.titulo}
                </h2>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                    {artigo.resumo}
                </p>

                <Link 
                    href={`/blog/${artigo.id}`} 
                    className="text-white border-b border-zinc-700 pb-1 self-start hover:border-yellow-600 hover:text-yellow-600 transition-all text-sm uppercase tracking-widest"
                >
                    Ler Artigo &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}
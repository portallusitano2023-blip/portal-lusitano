"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Post {
  title: string;
  publishedAt: string;
  slug: string;
  imageUrl: string | null;
}

export default function BlogContent({ posts }: { posts: Post[] }) {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 selection:bg-[#C5A059] selection:text-black">

      {/* --- CABECALHO "GOLDEN GLOW" --- */}
      <div className="relative max-w-7xl mx-auto mb-24 mt-10 text-center">

        {/* Efeito de Luz de Fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[150px] bg-[#C5A059] opacity-[0.05] blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-6 animate-fade-in">
            {t.blog.editorial}
          </span>

          <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tight drop-shadow-2xl mb-8">
            <span className="italic font-light opacity-90">{t.blog.title.split(' ')[0]}</span>{' '}
            <span className="font-medium text-[#C5A059]">{t.blog.title.split(' ').slice(1).join(' ')}</span>
          </h1>

          <p className="text-zinc-500 font-serif italic text-lg max-w-2xl mx-auto">
            {t.blog.subtitle}
          </p>
        </div>
      </div>

      {/* --- GRELHA DE NOTICIAS --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block cursor-pointer">

              {/* Imagem do Artigo */}
              <div className="aspect-[16/10] overflow-hidden mb-6 bg-zinc-900 border border-white/5 relative shadow-lg">
                {/* Data Sobreposta */}
                <div className="absolute top-0 left-0 bg-black/80 backdrop-blur-sm px-3 py-2 z-10 border-r border-b border-white/10">
                  <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>

                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    alt={post.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700 uppercase tracking-widest text-xs">
                    {t.blog.no_cover}
                  </div>
                )}
              </div>

              {/* Titulo e Link */}
              <div className="pr-2">
                <h2 className="text-2xl font-serif text-zinc-200 group-hover:text-[#C5A059] transition-colors leading-tight mb-4">
                  {post.title}
                </h2>
                <div className="flex items-center gap-2 group/btn">
                  <span className="h-[1px] w-6 bg-zinc-700 group-hover:bg-[#C5A059] transition-colors"></span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                    {t.blog.read}
                  </span>
                </div>
              </div>

            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 border border-dashed border-zinc-900">
            <p className="text-zinc-600 text-xs uppercase tracking-[0.2em]">{t.blog.no_news}</p>
          </div>
        )}
      </div>

    </main>
  );
}

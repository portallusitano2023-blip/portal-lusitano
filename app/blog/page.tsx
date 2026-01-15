// @ts-nocheck
import { client } from "@/lib/client";
import Link from "next/link";
import Newsletter from "../components/Newsletter";
export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
  const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url
  }`);

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-white mb-12 text-center">Blog <span className="text-[#C5A059]">Lusitano</span></h1>
        
        <div className="grid gap-12">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block border-b border-gray-900 pb-12 hover:border-[#C5A059] transition-all">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {post.imageUrl && (
                  <img src={post.imageUrl} className="w-full md:w-48 h-32 object-cover opacity-80 group-hover:opacity-100 transition" alt={post.title} />
                )}
                <div>
                  <h2 className="text-3xl text-white font-serif mb-4 group-hover:text-[#C5A059] transition">{post.title}</h2>
                  <p className="text-[#C5A059] text-xs uppercase tracking-widest">Ler Artigo Completo →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-20">
        <Newsletter />
      </div>
    </main>
  );
}
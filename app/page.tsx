import { client } from "@/sanity/lib/client"
import Image from "next/image"
import Link from "next/link"

const QUERY = `*[_type == "cavalo"] | order(_createdAt desc) {
  _id, nome, preco, localizacao, disciplina, "slug": slug.current, "imagemUrl": fotografiaPrincipal.asset->url
}`

export default async function Home() {
  const cavalos: any[] = await client.fetch(QUERY);
  const destaque = cavalos[0]; 

  return (
    <main className="min-h-screen bg-black text-white">
      {/* CAPA (HERO) */}
      {destaque && (
        <section className="relative h-[80vh] w-full flex items-end justify-start p-8 lg:p-16">
          <div className="absolute inset-0 z-0">
             {destaque.imagemUrl && (
               <Image src={destaque.imagemUrl} alt={destaque.nome} fill className="object-cover opacity-60" priority />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
          <div className="relative z-10 max-w-4xl">
             <h1 className="text-6xl lg:text-8xl font-serif mb-4">{destaque.nome}</h1>
             <Link href={`/cavalo/${destaque.slug}`}>
               <button className="bg-[#C5A059] text-black px-8 py-3 font-bold hover:bg-white transition">Ver Detalhes</button>
             </Link>
          </div>
        </section>
      )}
    </main>
  );
}     

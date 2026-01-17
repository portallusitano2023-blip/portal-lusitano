// @ts-nocheck
import Link from "next/link";

// Dentro do teu map de cavalos:
{cavalos.map((c) => (
  <Link 
    key={c.id} 
    href={`/comprar/${c.id}${isDev ? '?dev=true' : ''}`} // Link dinâmico com ID
    className="group cursor-pointer"
  >
    <div className="aspect-[4/5] bg-zinc-950 border border-zinc-900 overflow-hidden relative">
      {c.image_url ? (
        <img 
          src={c.image_url} 
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s]"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-800 text-[8px] tracking-widest uppercase">Exemplar sem imagem</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
    </div>
    <div className="mt-8 text-center">
      <h2 className="font-serif text-2xl italic mb-2">{c.nome_cavalo}</h2>
      <p className="text-[#C5A059] font-serif text-xl">{Number(c.preco).toLocaleString('pt-PT')} €</p>
    </div>
  </Link>
))}
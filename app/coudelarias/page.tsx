"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CoudelariasPage() {
  const { t } = useLanguage();

  const coudelarias = [
    {
      id: 1,
      name: "Coudelaria Real",
      location: "Alter do Chao, Alentejo",
      image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1000&auto=format&fit=crop",
      description: t.nav.home === "Home"
        ? "Preserving the pure lineage of the Lusitano horse since 1748."
        : "Preservando a linhagem pura do cavalo Lusitano desde 1748."
    },
    {
      id: 2,
      name: "Monte da Leziria",
      location: "Vila Franca de Xira",
      image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop",
      description: t.nav.home === "Home"
        ? "Functional horses with golden temperament and superior morphology."
        : "Cavalos funcionais com temperamento de ouro e morfologia superior."
    },
    {
      id: 3,
      name: "Veiga Legacy",
      location: "Golega, Ribatejo",
      image: "https://images.unsplash.com/photo-1629814403061-0083a54d6d60?q=80&w=1000&auto=format&fit=crop",
      description: t.nav.home === "Home"
        ? "The bullfighting tradition and equestrian art in perfect symbiosis."
        : "A tradicao tauromaquica e a arte equestre em perfeita simbiose."
    },
    {
      id: 4,
      name: "Herdade do Ouro",
      location: "Evora",
      image: null,
      description: t.nav.home === "Home"
        ? "Genetic innovation combined with classic selection methods."
        : "Inovacao genetica aliada aos metodos classicos de selecao."
    }
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 selection:bg-[#C5A059] selection:text-black">

        {/* Cabecalho */}
        <div className="max-w-4xl mx-auto text-center mb-20">
            <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-6 animate-fade-in">
              {t.studs.directory}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight mb-6">
              {t.studs.title.split(' ').slice(0, -1).join(' ')} <span className="italic font-light text-zinc-500">{t.studs.title.split(' ').slice(-1)}</span>
            </h1>
            <p className="text-zinc-400 font-light max-w-2xl mx-auto text-sm leading-loose">
              {t.studs.subtitle}
            </p>
        </div>

        {/* Grelha de Coudelarias */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {coudelarias.map((item) => (
                <div key={item.id} className="group relative bg-zinc-900/20 border border-white/5 overflow-hidden hover:border-[#C5A059]/50 transition-all duration-700">

                    {/* Imagem */}
                    <div className="h-64 w-full overflow-hidden relative">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out opacity-80"
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                <span className="text-zinc-700 text-[10px] uppercase tracking-widest">{t.studs.no_image}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-90"></div>

                        {/* Texto dentro da imagem (Bottom) */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-[#C5A059] text-[9px] uppercase tracking-widest mb-2">{item.location}</p>
                            <h2 className="text-3xl font-serif text-white italic">{item.name}</h2>
                        </div>
                    </div>

                    {/* Descricao e Botao */}
                    <div className="p-8">
                        <p className="text-zinc-500 text-sm font-light leading-relaxed mb-6">
                            {item.description}
                        </p>
                        <div className="flex justify-end">
                            <button className="text-[9px] uppercase tracking-[0.2em] text-white group-hover:text-[#C5A059] transition-colors flex items-center gap-2">
                                {t.studs.view_profile} <span className="text-lg leading-none">→</span>
                            </button>
                        </div>
                    </div>

                </div>
            ))}
        </div>

        {/* Rodape da seccao */}
        <div className="text-center mt-20 border-t border-zinc-900 pt-10">
            <p className="text-zinc-600 text-xs uppercase tracking-widest">
                {t.studs.breeder} <Link href="/contacto" className="text-[#C5A059] hover:text-white underline underline-offset-4">{t.studs.join}</Link>
            </p>
        </div>

      </main>
    </>
  );
}

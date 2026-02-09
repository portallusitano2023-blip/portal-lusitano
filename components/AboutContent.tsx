"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AboutContent() {
  const { t } = useLanguage();

  return (
    <main className="bg-[#050505] min-h-screen text-white pt-40 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Título Principal */}
        <div className="text-center mb-24">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] mb-6 block">
            Portal Lusitano
          </span>
          {/* AQUI ESTÁ A MUDANÇA: Usamos a variável t.about.title */}
          <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-8">
            {t.about.title}
          </h1>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto opacity-50"></div>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8 order-2 md:order-1">
            {/* Subtítulo Traduzido */}
            <p className="text-xl md:text-2xl font-serif text-white leading-relaxed">
              {`\u201C${t.about.subtitle}\u201D`}
            </p>

            <div className="text-zinc-400 font-serif leading-loose text-sm md:text-base space-y-6 text-justify">
              {/* Texto Traduzido */}
              <p>{t.about.story_text}</p>
            </div>

            <div className="pt-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                {t.about.founder}
              </p>
              <p className="font-serif italic text-lg text-white">Portal Lusitano</p>
            </div>
          </div>

          {/* Imagem (Mantém-se igual) */}
          <div className="order-1 md:order-2">
            <div className="aspect-[4/5] w-full bg-zinc-900 border border-zinc-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                <span className="text-zinc-700 font-serif italic">Fotografia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Valores Traduzidos */}
        <div className="border-t border-zinc-900 pt-20 text-center">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-10">
            {t.about.values_title}
          </h3>
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-24 font-serif italic text-xl text-[#C5A059]">
            <span>{t.about.value1}</span>
            <span className="hidden md:block text-zinc-800">•</span>
            <span>{t.about.value2}</span>
            <span className="hidden md:block text-zinc-800">•</span>
            <span>{t.about.value3}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

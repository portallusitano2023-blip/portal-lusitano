"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import TextSplit from "@/components/TextSplit";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">

      {/* 1. IMAGEM DE FUNDO — clip-path reveal cinematográfico */}
      <div
        className="absolute inset-0 z-0 clip-reveal-left"
        style={{ animationDuration: "1.2s" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1920&auto=format&fit=crop"
          alt="Nobreza Lusitana"
          fill
          className="object-cover opacity-50"
          style={{ objectPosition: "center 30%" }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-black/40"></div>
      </div>

      {/* 2. CONTEUDO */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">

        <p
          className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#C5A059] opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
          style={{ animationDelay: "0.4s" }}
        >
          {t.home.est}
        </p>

        {/* HEADLINE — cada palavra surge individualmente */}
        <h1 className="text-6xl md:text-8xl font-serif text-white leading-tight drop-shadow-lg">
          <TextSplit
            text={t.home.title_main}
            baseDelay={0.5}
            wordDelay={0.12}
          />
        </h1>

        <p
          className="text-sm md:text-base font-serif italic text-zinc-200 max-w-lg mx-auto leading-relaxed drop-shadow-md opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
          style={{ animationDelay: "0.9s" }}
        >
          &ldquo;{t.home.hero_text}&rdquo;
        </p>

        <div
          className="pt-8 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
          style={{ animationDelay: "1.1s" }}
        >
          <Link
            href="/loja"
            className="inline-block border border-white/30 bg-black/20 backdrop-blur-md px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-white hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-500"
          >
            {t.home.cta}
          </Link>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/40 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
        style={{ animationDelay: "1.3s" }}
      >
        <span className="text-[10px] tracking-widest uppercase animate-[bounce-scroll_1.5s_ease-in-out_infinite]">
          {t.home.scroll}
        </span>
      </div>

    </main>
  );
}

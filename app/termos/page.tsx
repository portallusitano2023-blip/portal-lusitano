"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function TermosPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-light selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-6 text-center">{t.terms.legal}</span>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-16 text-center">{t.terms.title}</h1>

          <div className="space-y-12 text-zinc-400 leading-relaxed text-sm">
            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">{t.terms.scope}</h2>
              <p>{t.terms.scope_text}</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">{t.terms.marketplace}</h2>
              <p>{t.terms.marketplace_text}</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">{t.terms.intellectual}</h2>
              <p>{t.terms.intellectual_text}</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">{t.terms.liability}</h2>
              <p>{t.terms.liability_text}</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

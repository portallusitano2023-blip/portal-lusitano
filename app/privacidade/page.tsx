"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacidadePage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-light selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-6 text-center">{t.privacy.security}</span>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-16 text-center">{t.privacy.title}</h1>

          <div className="space-y-12 text-zinc-400 leading-relaxed text-sm">
            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">{t.privacy.data_privacy}</h2>
              <p>{t.privacy.data_text}</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">{t.privacy.collection}</h2>
              <p>{t.privacy.collection_text}</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">{t.privacy.cookies}</h2>
              <p>{t.privacy.cookies_text}</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

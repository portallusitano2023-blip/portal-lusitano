"use client";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacidadePage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-20 px-6 font-light selection:bg-[var(--gold)] selection:text-black">
        <div className="max-w-4xl mx-auto">
          <span className="text-[var(--gold)] text-[9px] uppercase tracking-[0.4em] font-bold block mb-6 text-center">
            {t.privacy.security}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-16 text-center">
            {t.privacy.title}
          </h1>

          <div className="space-y-12 text-[var(--foreground-secondary)] leading-relaxed text-sm">
            <section>
              <h2 className="text-[var(--foreground)] font-serif italic text-xl mb-4">
                {t.privacy.data_privacy}
              </h2>
              <p>{t.privacy.data_text}</p>
            </section>

            <section>
              <h2 className="text-[var(--foreground)] font-serif italic text-xl mb-4">
                {t.privacy.collection}
              </h2>
              <p>{t.privacy.collection_text}</p>
            </section>

            <section>
              <h2 className="text-[var(--foreground)] font-serif italic text-xl mb-4">
                {t.privacy.cookies}
              </h2>
              <p>{t.privacy.cookies_text}</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

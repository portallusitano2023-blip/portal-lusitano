"use client";

import { Dna, AlertTriangle, Palette, ChevronRight, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface IntroHeroProps {
  onStart: () => void;
}

export default function IntroHero({ onStart }: IntroHeroProps) {
  const { t } = useLanguage();

  return (
    <div className="animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1920')",
              backgroundPosition: "center 40%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span
            className="inline-block px-4 py-1.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-medium uppercase tracking-[0.2em] rounded-full mb-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            {t.verificador.badge}
          </span>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[var(--foreground)] mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          >
            {t.verificador.title_prefix}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mt-2">
              {t.verificador.title_accent}
            </span>
          </h1>

          <p
            className="text-lg text-[var(--foreground-secondary)] max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.4s" }}
          >
            &ldquo;{t.verificador.intro_quote}&rdquo;
          </p>

          <p
            className="text-sm text-[var(--foreground-muted)] max-w-xl mx-auto mb-10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.5s" }}
          >
            {t.verificador.intro_desc}
          </p>

          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-400 hover:to-purple-500 transition-all shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.6s" }}
          >
            <Dna size={20} />
            {t.verificador.start_btn}
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="grid md:grid-cols-3 gap-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <Dna className="text-pink-400" size={24} />
              </div>
              <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                {t.verificador.feat_coi}
              </h3>
              <p className="text-sm text-[var(--foreground-secondary)]">
                {t.verificador.feat_coi_desc}
              </p>
            </div>

            <div className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Palette className="text-purple-400" size={24} />
              </div>
              <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                {t.verificador.feat_coat}
              </h3>
              <p className="text-sm text-[var(--foreground-secondary)]">
                {t.verificador.feat_coat_desc}
              </p>
            </div>

            <div className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="text-amber-400" size={24} />
              </div>
              <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                {t.verificador.feat_risks}
              </h3>
              <p className="text-sm text-[var(--foreground-secondary)]">
                {t.verificador.feat_risks_desc}
              </p>
            </div>
          </div>

          <div
            className="mt-12 p-6 bg-pink-500/5 border border-pink-500/20 rounded-xl opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="flex items-start gap-4">
              <Info className="text-pink-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-[var(--foreground)] font-medium mb-2">
                  {t.verificador.about_title}
                </h4>
                <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
                  {t.verificador.about_desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

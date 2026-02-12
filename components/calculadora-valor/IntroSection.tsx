"use client";

import { Calculator, Dna, ChevronRight, Info, BarChart3, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface IntroSectionProps {
  onStart: () => void;
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1920&auto=format&fit=crop')",
              backgroundPosition: "center 30%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/50 via-transparent to-[var(--background)]/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span
            className="inline-block px-4 py-1.5 bg-[var(--gold)]/10 border border-[#C5A059]/30 text-[var(--gold)] text-xs font-medium uppercase tracking-[0.2em] rounded-full mb-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            {t.calculadora.badge}
          </span>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          >
            {t.calculadora.title}
            <span className="block text-[var(--gold)] mt-2">{t.calculadora.title_accent}</span>
          </h1>

          <p
            className="text-lg text-zinc-300 max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.4s" }}
          >
            &ldquo;{t.calculadora.intro_quote}&rdquo;
          </p>

          <p
            className="text-sm text-zinc-500 max-w-xl mx-auto mb-10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.5s" }}
          >
            {t.calculadora.intro_desc}
          </p>

          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all shadow-lg shadow-[#C5A059]/20 hover:shadow-[#C5A059]/30 hover:scale-[1.02] active:scale-[0.98] transition-transform opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.6s" }}
          >
            <Calculator size={20} />
            {t.calculadora.start_btn}
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
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center mb-4">
                <Dna className="text-[var(--gold)]" size={24} />
              </div>
              <h3 className="text-lg font-serif text-white mb-2">{t.calculadora.feat_genetic}</h3>
              <p className="text-sm text-zinc-400">{t.calculadora.feat_genetic_desc}</p>
            </div>

            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-[var(--gold)]" size={24} />
              </div>
              <h3 className="text-lg font-serif text-white mb-2">{t.calculadora.feat_blup}</h3>
              <p className="text-sm text-zinc-400">{t.calculadora.feat_blup_desc}</p>
            </div>

            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-[var(--gold)]" size={24} />
              </div>
              <h3 className="text-lg font-serif text-white mb-2">{t.calculadora.feat_market}</h3>
              <p className="text-sm text-zinc-400">{t.calculadora.feat_market_desc}</p>
            </div>
          </div>

          {/* Info Box */}
          <div
            className="mt-12 p-6 bg-[var(--gold)]/5 border border-[#C5A059]/20 rounded-xl opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="flex items-start gap-4">
              <Info className="text-[var(--gold)] flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-white font-medium mb-2">{t.calculadora.methodology_title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.calculadora.methodology_desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

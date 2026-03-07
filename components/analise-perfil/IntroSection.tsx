"use client";

import Image from "next/image";
import {
  ChevronRight,
  Clock,
  BookOpen,
  Target,
  Feather,
  DollarSign,
  Trophy,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface IntroSectionProps {
  onStart: () => void;
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/analise-perfil/capa.png"
            alt="Cavalo Lusitano"
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-[var(--background)]/40" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]">
            <span
              className="inline-block px-4 py-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] text-xs font-medium uppercase tracking-[0.2em] rounded-full mb-6"
            >
              {t.analise_perfil.badge}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-[var(--foreground)] mb-6 leading-tight">
              {t.analise_perfil.title_line1}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[#E8D5A3] italic mt-2">
                {t.analise_perfil.title_line2}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--foreground-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
              {t.analise_perfil.intro_desc}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--foreground-secondary)] mb-12">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[var(--gold)]" />
                <span>{t.analise_perfil.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[var(--gold)]" />
                <span>{t.analise_perfil.questions_count}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-[var(--gold)]" />
                <span>{t.analise_perfil.detailed_result}</span>
              </div>
            </div>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[var(--gold)] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[var(--gold)] transition-all shadow-lg shadow-[var(--gold)]/20 hover:shadow-[var(--gold)]/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.analise_perfil.start}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.35s" }}
          >
            {[
              {
                icon: Target,
                title: t.analise_perfil.feat_profile,
                desc: t.analise_perfil.feat_profile_desc,
              },
              {
                icon: Feather,
                title: t.analise_perfil.feat_horse,
                desc: t.analise_perfil.feat_horse_desc,
              },
              {
                icon: DollarSign,
                title: t.analise_perfil.feat_costs,
                desc: t.analise_perfil.feat_costs_desc,
              },
              {
                icon: Trophy,
                title: t.analise_perfil.feat_references,
                desc: t.analise_perfil.feat_references_desc,
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl"
              >
                <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="text-[var(--gold)]" size={24} />
                </div>
                <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--foreground-secondary)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

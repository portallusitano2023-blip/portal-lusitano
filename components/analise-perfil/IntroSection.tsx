"use client";

import Image from "next/image";
import {
  ChevronRight,
  ChevronDown,
  Clock,
  BookOpen,
  Target,
  Feather,
  DollarSign,
  Trophy,
  ClipboardCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface IntroSectionProps {
  onStart: () => void;
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  const { t } = useLanguage();

  return (
    <div key="intro" className="min-h-screen animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920&auto=format&fit=crop"
            alt="Cavalo Lusitano"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-[var(--background)]/40" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]">
            <span className="inline-flex items-center gap-2 text-[var(--gold)] text-xs uppercase tracking-[0.3em] mb-6">
              <ClipboardCheck size={14} />
              {t.analise_perfil.badge}
              <ClipboardCheck size={14} />
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-[var(--foreground)] mb-6 leading-tight">
              {t.analise_perfil.title_line1}
              <span className="block text-[var(--gold)] italic">
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
              className="group inline-flex items-center gap-3 bg-[var(--gold)] text-black px-10 py-5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              {t.analise_perfil.start}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-[gentle-bounce_2s_ease-in-out_infinite]">
            <ChevronDown className="text-[var(--foreground)]/30" size={32} />
          </div>
        </div>
      </section>
      <section className="py-20 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-2xl font-serif text-[var(--foreground)] mb-12">
            {t.analise_perfil.discover_title}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
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
            ].map((f, i) => (
              <div
                key={f.title}
                className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 mx-auto bg-[var(--gold)]/10 rounded-full flex items-center justify-center mb-4">
                  <f.icon className="text-[var(--gold)]" size={24} />
                </div>
                <h3 className="text-[var(--foreground)] font-medium mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

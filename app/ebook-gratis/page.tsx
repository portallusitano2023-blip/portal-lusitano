"use client";

import { useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { trackEbookFunnel } from "@/lib/analytics";
import {
  BookOpen,
  Download,
  Star,
  Award,
  Users,
  Clock,
  Gift,
  Mail,
  FileText,
  Shield,
  Heart,
} from "lucide-react";

const EbookForm = dynamic(() => import("@/components/ebook/EbookForm"), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 max-w-lg">
      <div className="h-[56px] animate-pulse bg-[var(--surface-hover)] border border-[var(--border)]" />
      <div className="h-[56px] animate-pulse bg-[var(--surface-hover)] border border-[var(--border)]" />
      <div className="h-[56px] animate-pulse bg-[var(--gold)]/20" />
    </div>
  ),
});

export default function EbookGratisPage() {
  const { t } = useLanguage();

  useEffect(() => {
    trackEbookFunnel("view_landing");
  }, []);

  const chapters = [
    {
      number: "01",
      title: "O Que É o Cavalo Lusitano?",
      description: "Definição, história e características únicas que distinguem esta raça",
      pages: 8,
    },
    {
      number: "02",
      title: "História em 10 Minutos",
      description: "Da Idade do Gelo à modernidade — uma jornada épica",
      pages: 8,
    },
    {
      number: "03",
      title: "Características Únicas",
      description: "Morfologia, andamentos, temperamento e aptidões naturais",
      pages: 10,
    },
    {
      number: "04",
      title: "Próximos Passos",
      description: "Recursos, comunidade e como continuar a aprender",
      pages: 4,
    },
  ];

  const testimonials = [
    {
      name: "Ana Costa",
      role: "Cavaleira Amadora",
      text: "Incrível! Aprendi mais neste ebook gratuito do que em horas de pesquisa online.",
      avatar: "AC",
      rating: 5,
    },
    {
      name: "Rui Mendes",
      role: "Estudante de Veterinária",
      text: "Conteúdo de qualidade profissional. Perfeito para quem está a começar.",
      avatar: "RM",
      rating: 5,
    },
    {
      name: "Sofia Pereira",
      role: "Aficionada Lusitanos",
      text: "Um guia completo e bem estruturado. Recomendo a todos!",
      avatar: "SP",
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ===== HERO ===== */}
      <section className="relative pt-20 sm:pt-36 pb-12 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/8 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[var(--gold)]/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            {/* Left */}
            <div className="opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]">
              <div className="inline-flex items-center gap-2 bg-[var(--gold)]/10 border border-[var(--gold)]/20 px-4 py-2 mb-8">
                <Gift className="text-[var(--gold)]" size={14} />
                <span className="text-[var(--gold)] text-[11px] uppercase tracking-[0.15em] font-medium">
                  {t.ebook_page.free_badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[var(--foreground)] mb-6 leading-[1.08]">
                Introdução ao <span className="text-[var(--gold)]">Cavalo Lusitano</span>
              </h1>

              <p className="hidden sm:block text-lg sm:text-xl text-[var(--foreground-secondary)] mb-8 leading-relaxed max-w-xl">
                O guia essencial para conhecer a raça mais nobre da Península Ibérica.{" "}
                <span className="text-[var(--foreground)] font-medium">
                  30 páginas de puro conhecimento.
                </span>
              </p>

              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-3 mb-6 sm:mb-10">
                {[
                  { icon: FileText, text: `30 ${t.ebook_page.pages}` },
                  { icon: Clock, text: `20 ${t.ebook_page.read_time}` },
                  { icon: Award, text: t.ebook_page.verified_content },
                  { icon: Users, text: `5.000+ ${t.ebook_page.downloads}` },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 text-[var(--foreground-secondary)] text-sm"
                  >
                    <item.icon size={15} className="text-[var(--gold)] flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <EbookForm variant="hero" />
            </div>

            {/* Right - Book Cover */}
            <div
              className="relative order-first lg:order-last opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative max-w-[200px] sm:max-w-sm mx-auto">
                {/* Glow externo */}
                <div className="absolute inset-0 bg-[var(--gold)]/15 blur-[100px] scale-[1.3]" />

                {/* Book */}
                <div className="relative">
                  {/* Spine */}
                  <div className="absolute -left-4 top-2 bottom-2 w-6 bg-gradient-to-r from-[#2A1A04] via-[#7A5A1E] to-[#8B6B2E] shadow-2xl" />
                  {/* Page edge hint */}
                  <div className="absolute -right-0.5 top-3 bottom-3 w-1.5 bg-gradient-to-l from-transparent to-[#E8D5A0]/8" />

                  {/* Cover */}
                  <div className="relative bg-gradient-to-b from-[#0E0B04] via-[#0A0803] to-[#060401] border border-[#2A1E08] shadow-[0_30px_90px_rgba(0,0,0,0.85)] aspect-[3/4] overflow-hidden flex flex-col">

                    {/* Textura diagonal sutil */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.022]" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="ebook-grain" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                          <line x1="0" y1="0" x2="0" y2="6" stroke="#C5A059" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#ebook-grain)"/>
                    </svg>

                    {/* Barras douradas — topo */}
                    <div className="absolute top-0 left-0 right-0 z-10">
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
                      <div className="h-px mt-[3px] bg-gradient-to-r from-transparent via-[var(--gold)]/25 to-transparent" />
                    </div>

                    {/* Borda exterior */}
                    <div className="absolute inset-3 border border-[var(--gold)]/20 pointer-events-none z-10" />
                    {/* Borda interior */}
                    <div className="absolute inset-[18px] border border-[var(--gold)]/10 pointer-events-none z-10" />

                    {/* Cantos SVG ornamentados */}
                    <div className="absolute top-3 left-3 z-10">
                      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M22 0 L0 0 L0 22" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeOpacity="0.45"/><path d="M22 5 L5 5 L5 22" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.2"/><circle cx="5" cy="5" r="1.5" fill="var(--gold)" fillOpacity="0.4"/></svg>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L22 0 L22 22" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeOpacity="0.45"/><path d="M0 5 L17 5 L17 22" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.2"/><circle cx="17" cy="5" r="1.5" fill="var(--gold)" fillOpacity="0.4"/></svg>
                    </div>
                    <div className="absolute bottom-3 left-3 z-10">
                      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M22 22 L0 22 L0 0" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeOpacity="0.45"/><path d="M22 17 L5 17 L5 0" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.2"/><circle cx="5" cy="17" r="1.5" fill="var(--gold)" fillOpacity="0.4"/></svg>
                    </div>
                    <div className="absolute bottom-3 right-3 z-10">
                      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M0 22 L22 22 L22 0" fill="none" stroke="var(--gold)" strokeWidth="1.2" strokeOpacity="0.45"/><path d="M0 17 L17 17 L17 0" fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.2"/><circle cx="17" cy="17" r="1.5" fill="var(--gold)" fillOpacity="0.4"/></svg>
                    </div>

                    {/* Conteúdo interior */}
                    <div className="relative z-10 flex flex-col items-center justify-between flex-1 py-8 px-7 text-center">

                      {/* ZONA A — Subtítulo topo */}
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-[var(--gold)]/50 text-[8px] uppercase tracking-[0.4em]">Portal Lusitano</p>
                        <div className="flex items-center gap-2">
                          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]/25" />
                          <svg width="5" height="5" viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="4" height="4" transform="rotate(45 2.5 2.5)" fill="none" stroke="var(--gold)" strokeWidth="0.8" strokeOpacity="0.4"/>
                          </svg>
                          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--gold)]/25" />
                        </div>
                      </div>

                      {/* ZONA B — Logo central */}
                      <div className="flex items-center justify-center flex-1 py-2">
                        <div className="relative flex flex-col items-center">
                          {/* Halo radial */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.12)_0%,transparent_65%)] scale-[2.5]" />
                          {/* Círculo tracejado */}
                          <svg className="absolute inset-[-40%] w-[180%] h-[180%]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="2 3"/>
                          </svg>
                          <Image
                            src="/logo.webp"
                            alt="Portal Lusitano"
                            width={140}
                            height={38}
                            className="opacity-70 object-contain relative z-10"
                          />
                        </div>
                      </div>

                      {/* ZONA C — Título */}
                      <div className="flex flex-col items-center">
                        {/* Divisor com losango */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--gold)]/35" />
                          <svg width="7" height="7" viewBox="0 0 7 7" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="6" height="6" transform="rotate(45 3.5 3.5)" fill="none" stroke="var(--gold)" strokeWidth="0.9" strokeOpacity="0.55"/>
                          </svg>
                          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--gold)]/35" />
                        </div>

                        <p className="text-[var(--foreground-secondary)]/65 text-[8px] tracking-[0.45em] uppercase mb-2">
                          Introdução ao
                        </p>
                        <h3 className="font-serif text-[var(--gold)] text-[1.35rem] sm:text-[1.55rem] tracking-[0.12em] leading-none uppercase">
                          Cavalo
                        </h3>
                        <h3 className="font-serif text-[var(--gold)] text-[1.35rem] sm:text-[1.55rem] tracking-[0.12em] leading-none uppercase mb-3">
                          Lusitano
                        </h3>

                        {/* Divisor inferior */}
                        <div className="flex items-center mb-2">
                          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]/18" />
                          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]/18" />
                        </div>

                        <p className="text-[var(--foreground-muted)]/55 text-[7px] tracking-[0.3em] uppercase">
                          O Guia Essencial · 2026
                        </p>
                      </div>
                    </div>

                    {/* Barras douradas — fundo */}
                    <div className="absolute bottom-0 left-0 right-0 z-10">
                      <div className="h-px mb-[3px] bg-gradient-to-r from-transparent via-[var(--gold)]/25 to-transparent" />
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 bg-[var(--gold)] text-black px-3 sm:px-5 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-bold shadow-lg opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: "0.4s" }}
                >
                  GRÁTIS
                </div>

                <div
                  className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-[var(--background-secondary)] border border-[var(--border)] px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl flex items-center gap-2 sm:gap-2.5 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-[var(--gold)] text-[var(--gold)]" />
                    ))}
                  </div>
                  <span className="text-[var(--foreground)] text-[10px] sm:text-xs font-medium">4.9/5</span>
                  <span className="text-[var(--foreground-muted)] text-[10px]">(234)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CHAPTERS ===== */}
      <section className="py-10 sm:py-28 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {t.ebook_page.content}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {t.ebook_page.what_learn}
            </h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">
              4 capítulos essenciais para compreender o Lusitano
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.number}
                className="group bg-[var(--surface-hover)] border border-[var(--border)] p-6 sm:p-8 hover:border-[var(--gold)]/20 hover:bg-[var(--surface-hover)] transition-all duration-500 relative overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-start gap-5">
                  <span className="text-4xl sm:text-5xl font-serif text-[var(--gold)]/15 group-hover:text-[var(--gold)]/30 transition-colors duration-500 leading-none">
                    {chapter.number}
                  </span>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors duration-300">
                      {chapter.title}
                    </h3>
                    <p className="text-[var(--foreground-muted)] text-sm leading-relaxed mb-3">
                      {chapter.description}
                    </p>
                    <span className="text-[11px] text-[var(--foreground-muted)] uppercase tracking-wider">
                      {chapter.pages} {t.ebook_page.pages}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-t border-b border-[var(--border)] bg-[var(--surface-hover)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            {[
              { value: "5.000+", label: t.ebook_page.downloads, icon: Download },
              { value: "4.9/5", label: t.ebook_page.average_rating, icon: Star },
              {
                value: "30",
                label: t.ebook_page.pages.charAt(0).toUpperCase() + t.ebook_page.pages.slice(1),
                icon: FileText,
              },
              { value: "100%", label: t.ebook_page.free_badge, icon: Gift },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon size={20} className="text-[var(--gold)]/40 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl font-serif text-[var(--foreground)] mb-1">
                  {stat.value}
                </div>
                <div className="text-[11px] text-[var(--foreground-muted)] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-10 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {t.ebook_page.testimonials}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {t.ebook_page.what_readers_say}
            </h2>
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-[var(--gold)] text-[var(--gold)]" size={16} />
              ))}
            </div>
            <p className="text-[var(--foreground-muted)] text-sm">
              {t.ebook_page.average_rating}: 4.9/5
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-6 max-w-5xl mx-auto -mx-4 px-4 sm:mx-auto sm:px-0">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="group flex-none w-[80vw] sm:w-auto bg-[var(--surface-hover)] border border-[var(--border)] p-6 sm:p-8 hover:border-[var(--gold)]/15 hover:bg-[var(--surface-hover)] transition-all duration-500 relative overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex gap-1 mb-5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-[var(--gold)] fill-[var(--gold)]" size={13} />
                    ))}
                  </div>
                  <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--gold)]/20 to-[var(--gold)]/5 border border-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)] text-xs font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-[var(--foreground)] text-sm font-medium">
                        {testimonial.name}
                      </h4>
                      <p className="text-[var(--foreground-muted)] text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-12 sm:py-32 border-t border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--gold)]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-6 block">
            {t.ebook_page.start_now}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-6">
            Descarrega o Teu Guia <span className="text-[var(--gold)]">Gratuito</span>
          </h2>
          <p className="text-[var(--foreground-secondary)] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Recebe imediatamente o ebook + acesso à newsletter semanal com dicas exclusivas.
          </p>

          <EbookForm variant="cta" />

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8 text-sm text-[var(--foreground-muted)]">
            <div className="flex items-center gap-2">
              <Shield className="text-[var(--foreground-muted)]" size={14} />
              <span>Sem custos ocultos</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-[var(--foreground-muted)]" size={14} />
              <span>Cancela a qualquer momento</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="text-[var(--foreground-muted)]" size={14} />
              <span>100% grátis para sempre</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

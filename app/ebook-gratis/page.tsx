"use client";

import { useState, useEffect, useRef } from "react";
import { trackEbookFunnel, trackEmailSubscription, trackEbookDownload } from "@/lib/analytics";
import {
  BookOpen,
  Download,
  Check,
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

export default function EbookGratisPage() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formStartedRef = useRef(false);

  useEffect(() => {
    trackEbookFunnel("view_landing");
  }, []);

  const handleFormStart = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEbookFunnel("start_form");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ebook-gratis/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nome }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pedido");
      }

      trackEbookFunnel("submit_form");
      trackEmailSubscription("free-ebook");
      trackEbookDownload("introducao-lusitano", "free");

      setLoading(false);
      setSubmitted(true);

      setTimeout(() => {
        window.location.href = "/ebook-gratis/download";
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      alert(error instanceof Error ? error.message : "Erro ao processar pedido. Tenta novamente.");
    }
  };

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

  if (submitted) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
        <div className="text-center max-w-md opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div
            className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            <Check className="text-green-400" size={44} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
            Sucesso!
          </h2>
          <p className="text-[var(--foreground-secondary)] mb-2 text-lg">
            Enviámos o link de download para
          </p>
          <p className="text-[var(--gold)] font-medium text-lg mb-6">{email}</p>
          <div className="flex items-center justify-center gap-2 text-[var(--foreground-muted)] text-sm">
            <div className="w-4 h-4 border-2 border-[var(--border)] border-t-[var(--gold)] rounded-full animate-spin" />
            A redirecionar para o download...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ===== HERO ===== */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--gold)]/8 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[var(--gold)]/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <div className="opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]">
              <div className="inline-flex items-center gap-2 bg-[var(--gold)]/10 border border-[var(--gold)]/20 px-4 py-2 mb-8">
                <Gift className="text-[var(--gold)]" size={14} />
                <span className="text-[var(--gold)] text-[11px] uppercase tracking-[0.15em] font-medium">
                  100% Gratuito
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[var(--foreground)] mb-6 leading-[1.08]">
                Introdução ao <span className="text-[var(--gold)]">Cavalo Lusitano</span>
              </h1>

              <p className="text-lg sm:text-xl text-[var(--foreground-secondary)] mb-8 leading-relaxed max-w-xl">
                O guia essencial para conhecer a raça mais nobre da Península Ibérica.{" "}
                <span className="text-[var(--foreground)] font-medium">
                  30 páginas de puro conhecimento.
                </span>
              </p>

              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-3 mb-10">
                {[
                  { icon: FileText, text: "30 Páginas" },
                  { icon: Clock, text: "20 min leitura" },
                  { icon: Award, text: "Conteúdo verificado" },
                  { icon: Users, text: "5.000+ downloads" },
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

              <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onFocus={handleFormStart}
                  placeholder="O teu nome"
                  required
                  autoComplete="name"
                  className="w-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)] px-5 py-4 text-[15px] focus:outline-none focus:border-[var(--gold)]/50 focus:bg-[var(--surface-hover)] transition-all placeholder:text-[var(--foreground-muted)]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleFormStart}
                  placeholder="O teu melhor email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  className="w-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)] px-5 py-4 text-[15px] focus:outline-none focus:border-[var(--gold)]/50 focus:bg-[var(--surface-hover)] transition-all placeholder:text-[var(--foreground-muted)]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--gold)] text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--gold-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-h-[56px] active:scale-[0.98] touch-manipulation"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      A processar...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Descarregar Grátis
                    </>
                  )}
                </button>
                <p className="text-[var(--foreground-muted)] text-[11px] text-center pt-1">
                  Sem spam. Cancela a qualquer momento.
                </p>
              </form>
            </div>

            {/* Right - Book Cover */}
            <div
              className="relative opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative max-w-sm mx-auto">
                {/* Glow */}
                <div className="absolute inset-0 bg-[var(--gold)]/15 blur-[80px] scale-125" />

                {/* Book */}
                <div className="relative">
                  <div className="absolute -left-3 top-3 bottom-3 w-5 bg-gradient-to-r from-[#7A6235] via-[#A08848] to-[#8B7340] shadow-xl" />
                  <div className="absolute -right-1 top-4 bottom-4 w-2 bg-zinc-200/10" />

                  <div className="relative bg-gradient-to-br from-[#0D0D0D] via-[#111111] to-[#080808] border border-[var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] aspect-[3/4] flex flex-col items-center justify-center p-10 sm:p-14 text-center">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                    <div className="absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2 border-[var(--gold)]/25" />
                    <div className="absolute top-5 right-5 w-10 h-10 border-t-2 border-r-2 border-[var(--gold)]/25" />
                    <div className="absolute bottom-5 left-5 w-10 h-10 border-b-2 border-l-2 border-[var(--gold)]/25" />
                    <div className="absolute bottom-5 right-5 w-10 h-10 border-b-2 border-r-2 border-[var(--gold)]/25" />

                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent mb-8" />
                    <BookOpen className="text-[var(--gold)]/50 mb-6" size={52} />
                    <h3 className="text-xl sm:text-2xl font-serif text-[var(--foreground)]/90 mb-2 leading-tight">
                      Introdução ao
                    </h3>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[var(--gold)] mb-8 leading-tight">
                      Cavalo Lusitano
                    </h3>
                    <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent mb-6" />
                    <p className="text-[var(--foreground-muted)] text-[11px] uppercase tracking-[0.25em] mb-1">
                      O Guia Essencial
                    </p>
                    <p className="text-[var(--foreground-muted)] text-[10px] uppercase tracking-[0.25em]">
                      Para Iniciantes
                    </p>
                    <div className="absolute bottom-8 left-0 right-0">
                      <div className="w-8 h-[1px] bg-[var(--gold)]/20 mx-auto mb-3" />
                      <p className="text-[var(--foreground-muted)] text-[9px] uppercase tracking-[0.4em]">
                        Portal Lusitano
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 bg-[var(--gold)] text-black px-5 py-2.5 text-xs font-bold shadow-lg opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.9s" }}
                >
                  GRÁTIS
                </div>

                <div
                  className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-[var(--background-secondary)] border border-[var(--border)] px-4 py-2.5 shadow-xl flex items-center gap-2.5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "1.1s" }}
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-[var(--gold)] text-[var(--gold)]" />
                    ))}
                  </div>
                  <span className="text-[var(--foreground)] text-xs font-medium">4.9/5</span>
                  <span className="text-[var(--foreground-muted)] text-[10px]">(234)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CHAPTERS ===== */}
      <section className="py-20 sm:py-28 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              Conteúdo
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              O Que Vais Aprender
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
                      {chapter.pages} páginas
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
              { value: "5.000+", label: "Downloads", icon: Download },
              { value: "4.9/5", label: "Avaliação média", icon: Star },
              { value: "30", label: "Páginas", icon: FileText },
              { value: "100%", label: "Gratuito", icon: Gift },
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
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              Testemunhos
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              O Que Dizem Os Leitores
            </h2>
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-[var(--gold)] text-[var(--gold)]" size={16} />
              ))}
            </div>
            <p className="text-[var(--foreground-muted)] text-sm">Avaliação média: 4.9/5</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="group bg-[var(--surface-hover)] border border-[var(--border)] p-6 sm:p-8 hover:border-[var(--gold)]/15 hover:bg-[var(--surface-hover)] transition-all duration-500 relative overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
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
      <section className="relative py-24 sm:py-32 border-t border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--gold)]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-6 block">
            Começa Agora
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-6">
            Descarrega o Teu Guia <span className="text-[var(--gold)]">Gratuito</span>
          </h2>
          <p className="text-[var(--foreground-secondary)] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Recebe imediatamente o ebook + acesso à newsletter semanal com dicas exclusivas.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 max-w-lg mx-auto">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onFocus={handleFormStart}
              placeholder="O teu nome"
              required
              autoComplete="name"
              className="w-full bg-black/40 border border-[var(--border)] text-white px-5 py-4 text-[15px] focus:outline-none focus:border-[var(--gold)]/50 focus:bg-black/60 transition-all placeholder:text-[var(--foreground-muted)]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFormStart}
              placeholder="O teu melhor email"
              required
              autoComplete="email"
              inputMode="email"
              className="w-full bg-black/40 border border-[var(--border)] text-white px-5 py-4 text-[15px] focus:outline-none focus:border-[var(--gold)]/50 focus:bg-black/60 transition-all placeholder:text-[var(--foreground-muted)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--gold)] text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[var(--gold-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-h-[56px] active:scale-[0.98] touch-manipulation"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  A processar...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Quero o Meu Ebook
                </>
              )}
            </button>
            <p className="text-[var(--foreground-muted)] text-[11px] text-center pt-1">
              Sem spam. Cancela a qualquer momento.
            </p>
          </form>

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

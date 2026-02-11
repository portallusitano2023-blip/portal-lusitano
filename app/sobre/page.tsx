"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import {
  BookOpen,
  Shield,
  Crown,
  Users,
  Mail,
  ArrowRight,
  Heart,
  Globe,
  Target,
} from "lucide-react";

export default function SobrePage() {
  const { language } = useLanguage();
  const isPt = language === "pt";

  const values = [
    {
      icon: Shield,
      title: isPt ? "Rigor" : "Rigour",
      desc: isPt
        ? "Cada facto publicado é verificado em fontes credíveis. Preferimos ter menos informação do que informação errada."
        : "Every fact published is verified from credible sources. We prefer less information over wrong information.",
    },
    {
      icon: BookOpen,
      title: isPt ? "Conhecimento" : "Knowledge",
      desc: isPt
        ? "Arquivo editorial com investigação profunda sobre a história, genética e arte equestre do Lusitano."
        : "Editorial archive with deep research on the history, genetics and equestrian art of the Lusitano.",
    },
    {
      icon: Crown,
      title: isPt ? "Tradição" : "Tradition",
      desc: isPt
        ? "Honramos 500 anos de criação equestre portuguesa, preservando o legado das grandes coudelarias."
        : "We honour 500 years of Portuguese horse breeding, preserving the legacy of the great stud farms.",
    },
    {
      icon: Globe,
      title: isPt ? "Acessibilidade" : "Accessibility",
      desc: isPt
        ? "Ferramentas gratuitas e conteúdo bilingue para que o conhecimento sobre o Lusitano chegue a todos."
        : "Free tools and bilingual content so that knowledge about the Lusitano reaches everyone.",
    },
  ];

  const features = [
    {
      title: isPt ? "Marketplace de Cavalos" : "Horse Marketplace",
      desc: isPt
        ? "Compra e venda de cavalos Lusitanos com fichas técnicas detalhadas."
        : "Buy and sell Lusitano horses with detailed technical sheets.",
    },
    {
      title: isPt ? "Directório de Coudelarias" : "Stud Farm Directory",
      desc: isPt
        ? "As melhores coudelarias de Portugal, com perfis completos e avaliações."
        : "The best stud farms in Portugal, with complete profiles and reviews.",
    },
    {
      title: isPt ? "Ferramentas Equestres" : "Equestrian Tools",
      desc: isPt
        ? "Calculadora de valor, comparador, verificador de compatibilidade e análise de perfil."
        : "Value calculator, comparator, compatibility checker and profile analysis.",
    },
    {
      title: isPt ? "Jornal & Arquivo" : "Journal & Archive",
      desc: isPt
        ? "Artigos de investigação, crónicas e o maior arquivo digital sobre o cavalo Lusitano."
        : "Research articles, chronicles and the largest digital archive about the Lusitano horse.",
    },
    {
      title: isPt ? "Loja Equestre" : "Equestrian Shop",
      desc: isPt
        ? "Vestuário e acessórios que celebram a herança equestre portuguesa."
        : "Clothing and accessories that celebrate Portuguese equestrian heritage.",
    },
    {
      title: isPt ? "Comunidade" : "Community",
      desc: isPt
        ? "Rede de cavaleiros, criadores, veterinários e profissionais do sector."
        : "Network of riders, breeders, veterinarians and industry professionals.",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20">
      {/* ===== HERO ===== */}
      <section className="px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-6 block">
              {isPt ? "Sobre Nós" : "About Us"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[var(--foreground)] mb-6 leading-[1.08]">
              {isPt ? "A Nossa " : "Our "}
              <span className="text-[var(--gold)]">{isPt ? "Missão" : "Mission"}</span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--foreground-secondary)] leading-relaxed max-w-2xl mx-auto">
              {isPt
                ? "O Portal Lusitano nasceu para elevar o Cavalo Lusitano ao palco global. Unimos tecnologia, investigação e paixão equestre numa plataforma sem precedentes."
                : "Portal Lusitano was born to elevate the Lusitano Horse to the global stage. We unite technology, research and equestrian passion in an unprecedented platform."}
            </p>
          </div>
        </div>
      </section>

      {/* ===== ORIGIN STORY ===== */}
      <section className="px-4 sm:px-6 mb-20 sm:mb-28 border-t border-[var(--border)] pt-20 sm:pt-28">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
                  {isPt ? "A Origem" : "The Origin"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-6">
                  {isPt ? "Fundado em 2023" : "Founded in 2023"}
                </h2>
                <div className="space-y-4 text-[var(--foreground-secondary)] leading-relaxed">
                  <p>
                    {isPt
                      ? "O Portal Lusitano foi fundado por Francisco Gaspar com uma visão clara: criar a plataforma de referência para o cavalo Lusitano no mundo digital."
                      : "Portal Lusitano was founded by Francisco Gaspar with a clear vision: to create the reference platform for the Lusitano horse in the digital world."}
                  </p>
                  <p>
                    {isPt
                      ? "Combinando engenharia digital com profundo conhecimento equestre, construímos ferramentas que ajudam cavaleiros, criadores e entusiastas a tomar decisões informadas."
                      : "Combining digital engineering with deep equestrian knowledge, we build tools that help riders, breeders and enthusiasts make informed decisions."}
                  </p>
                  <p>
                    {isPt
                      ? "Cada peça de conteúdo é verificada em fontes credíveis. Cada ferramenta é optimizada para as especificidades da raça Lusitana."
                      : "Every piece of content is verified from credible sources. Every tool is optimised for the specificities of the Lusitano breed."}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-64 h-80 bg-gradient-to-br from-[var(--background-elevated)] to-[var(--background-secondary)] border border-[var(--gold)]/15 flex flex-col items-center justify-center">
                    <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-[var(--gold)]/20" />
                    <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-[var(--gold)]/20" />
                    <Target className="text-[var(--gold)]/30 mb-6" size={48} />
                    <p className="text-[var(--foreground)] font-serif text-2xl mb-2">2023</p>
                    <p className="text-[var(--foreground-muted)] text-[10px] uppercase tracking-[0.3em]">
                      Portugal
                    </p>
                    <div className="w-12 h-[1px] bg-[var(--gold)]/20 my-4" />
                    <p className="text-[var(--foreground-muted)] text-[9px] uppercase tracking-[0.4em]">
                      Portal Lusitano
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="px-4 sm:px-6 mb-20 sm:mb-28 border-t border-[var(--border)] pt-20 sm:pt-28">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {isPt ? "Valores" : "Values"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {isPt ? "O Que Nos Define" : "What Defines Us"}
            </h2>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <AnimateOnScroll key={value.title} delay={i * 100}>
                <div className="bg-[var(--background-card)] border border-[var(--border)] p-8 hover:border-[var(--gold)]/15 transition-colors duration-500">
                  <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center mb-5">
                    <value.icon size={22} className="text-[var(--gold)]" />
                  </div>
                  <h3 className="text-xl font-serif text-[var(--foreground)] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE OFFER ===== */}
      <section className="px-4 sm:px-6 mb-20 sm:mb-28 border-t border-[var(--border)] pt-20 sm:pt-28">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {isPt ? "Plataforma" : "Platform"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {isPt ? "O Que Oferecemos" : "What We Offer"}
            </h2>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimateOnScroll key={feature.title} delay={i * 80}>
                <div className="p-6 border-l border-[var(--gold)]/20">
                  <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative px-4 sm:px-6 py-24 sm:py-32 border-t border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--gold)]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <AnimateOnScroll>
            <Heart className="text-[var(--gold)]/30 mx-auto mb-6" size={32} />
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {isPt ? "Junta-te à Comunidade" : "Join the Community"}
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-10 max-w-lg mx-auto leading-relaxed">
              {isPt
                ? "Faz parte da maior comunidade digital dedicada ao cavalo Lusitano. Regista-te gratuitamente."
                : "Be part of the largest digital community dedicated to the Lusitano horse. Register for free."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/registar"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-bold hover:from-white hover:to-white transition-all duration-300"
              >
                <Users size={16} />
                {isPt ? "Criar Conta Grátis" : "Create Free Account"}
              </Link>
              <a
                href="mailto:portal.lusitano2023@gmail.com"
                className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] text-[11px] uppercase tracking-[0.15em] transition-colors"
              >
                <Mail size={14} />
                {isPt ? "Contactar" : "Contact"} <ArrowRight size={12} />
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  );
}

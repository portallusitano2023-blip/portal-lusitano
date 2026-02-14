"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import TextSplit from "@/components/TextSplit";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import MagneticButton from "@/components/ui/MagneticButton";
import ParallaxSection from "@/components/ui/ParallaxSection";
import HorizontalScrollGallery from "@/components/ui/HorizontalScrollGallery";
import {
  ShoppingCart,
  Crown,
  Calculator,
  BookOpen,
  Gift,
  Newspaper,
  ArrowRight,
  MapPin,
  Trophy,
  Shield,
  ChevronDown,
  Sparkles,
  Star,
  Heart,
  Compass,
  Feather,
} from "lucide-react";

export default function Home() {
  const { language, t } = useLanguage();
  const isPt = language === "pt";

  const features = [
    {
      icon: ShoppingCart,
      title: isPt ? "Comprar Cavalo" : "Buy a Horse",
      desc: isPt
        ? "Marketplace com cavalos Lusitanos verificados à venda"
        : "Marketplace with verified Lusitano horses for sale",
      href: "/comprar",
      accent: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: Crown,
      title: isPt ? "Coudelarias" : "Stud Farms",
      desc: isPt
        ? "Directório das melhores coudelarias de Portugal"
        : "Directory of the best stud farms in Portugal",
      href: "/directorio",
      accent: "from-yellow-500/20 to-amber-500/20",
    },
    {
      icon: Calculator,
      title: isPt ? "Ferramentas" : "Tools",
      desc: isPt
        ? "Calculadora de valor, comparador e análise de perfil"
        : "Value calculator, comparator and profile analysis",
      href: "/ferramentas",
      accent: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: Newspaper,
      title: isPt ? "Jornal" : "Journal",
      desc: isPt
        ? "Artigos, investigação e crónicas sobre o Lusitano"
        : "Articles, research and chronicles about the Lusitano",
      href: "/jornal",
      accent: "from-blue-500/20 to-indigo-500/20",
    },
    {
      icon: Trophy,
      title: isPt ? "Lusitanos Notáveis" : "Notable Lusitanos",
      desc: isPt
        ? "Galeria de honra dos cavalos que fizeram história"
        : "Hall of fame of horses that made history",
      href: "/cavalos-famosos",
      accent: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: MapPin,
      title: isPt ? "Mapa Interativo" : "Interactive Map",
      desc: isPt
        ? "Encontre coudelarias, eventos e profissionais no mapa"
        : "Find stud farms, events and professionals on the map",
      href: "/mapa",
      accent: "from-rose-500/20 to-red-500/20",
    },
  ];

  const pillars = [
    {
      icon: BookOpen,
      title: isPt ? "Conhecimento" : "Knowledge",
      desc: isPt
        ? "Arquivo editorial com investigação sobre a raça"
        : "Editorial archive with research about the breed",
    },
    {
      icon: Shield,
      title: isPt ? "Verificação" : "Verification",
      desc: isPt ? "Dados verificados e fontes credíveis" : "Verified data and credible sources",
    },
    {
      icon: Crown,
      title: isPt ? "Tradição" : "Tradition",
      desc: isPt
        ? "500 anos de história equestre portuguesa"
        : "500 years of Portuguese equestrian history",
    },
    {
      icon: Gift,
      title: isPt ? "Comunidade" : "Community",
      desc: isPt
        ? "Uma rede de cavaleiros, criadores e entusiastas"
        : "A network of riders, breeders and enthusiasts",
    },
  ];

  const galleryItems = [
    {
      icon: Trophy,
      label: isPt ? "Dressage" : "Dressage",
      value: isPt ? "Excelência" : "Excellence",
    },
    { icon: Shield, label: isPt ? "Linhagem" : "Lineage", value: isPt ? "500 Anos" : "500 Years" },
    {
      icon: Star,
      label: isPt ? "Morfologia" : "Morphology",
      value: isPt ? "Perfeição" : "Perfection",
    },
    {
      icon: Heart,
      label: isPt ? "Temperamento" : "Temperament",
      value: isPt ? "Nobreza" : "Nobility",
    },
    {
      icon: Compass,
      label: isPt ? "Versatilidade" : "Versatility",
      value: isPt ? "Completo" : "Complete",
    },
    { icon: Feather, label: isPt ? "Elegância" : "Elegance", value: isPt ? "Inata" : "Innate" },
    {
      icon: Sparkles,
      label: isPt ? "Presença" : "Presence",
      value: isPt ? "Majestosa" : "Majestic",
    },
  ];

  const stats = [
    { value: 500, suffix: "+", label: isPt ? "Anos de História" : "Years of History" },
    { value: 15, suffix: "", label: isPt ? "Cavalos Notáveis" : "Notable Horses" },
    { value: 6, suffix: "", label: isPt ? "Ferramentas Exclusivas" : "Exclusive Tools" },
    { value: 3, suffix: "", label: isPt ? "Idiomas" : "Languages" },
  ];

  return (
    <main>
      {/* ===== HERO — Full Screen with Parallax ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden noise-overlay">
        {/* Parallax Background Image */}
        <ParallaxSection speed={0.4} className="absolute inset-0 z-0">
          <div className="clip-reveal-left" style={{ animationDuration: "1.2s" }}>
            <Image
              src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1920&auto=format&fit=crop"
              alt="Nobreza Lusitana"
              fill
              className="object-cover opacity-50 scale-110"
              style={{ objectPosition: "center 30%" }}
              priority
              sizes="100vw"
            />
          </div>
        </ParallaxSection>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-black/40 z-[1]" />

        {/* Floating Gold Orbs */}
        <div
          className="gradient-orb w-[500px] h-[500px] bg-[var(--gold)] top-1/4 -left-64 z-[1]"
          aria-hidden="true"
        />
        <div
          className="gradient-orb w-[400px] h-[400px] bg-[var(--gold)] bottom-1/4 -right-48 z-[1]"
          aria-hidden="true"
          style={{ animationDelay: "-3s" }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <p
            className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-[var(--gold)] opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
            style={{ animationDelay: "0.4s" }}
          >
            {t.home.est}
          </p>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-[var(--foreground)] leading-[0.9] drop-shadow-lg">
            <TextSplit text={t.home.title_main} baseDelay={0.5} wordDelay={0.12} />
          </h1>

          {/* Decorative line */}
          <div
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: "0.85s" }}
          />

          <p
            className="text-sm md:text-base font-serif italic text-[var(--foreground)]/80 max-w-lg mx-auto leading-relaxed drop-shadow-md opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
            style={{ animationDelay: "0.9s" }}
          >
            &ldquo;{t.home.hero_text}&rdquo;
          </p>

          <div
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
            style={{ animationDelay: "1.1s" }}
          >
            <MagneticButton strength={0.2}>
              <Link
                href="/comprar"
                className="ripple-btn shimmer-gold inline-block border border-[var(--gold)]/30 bg-black/20 backdrop-blur-md px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)] hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-500"
              >
                {isPt ? "Comprar Cavalo" : "Buy a Horse"}
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.15}>
              <Link
                href="/loja"
                className="line-draw inline-block px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-300"
              >
                {t.home.cta} →
              </Link>
            </MagneticButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
          style={{ animationDelay: "1.5s" }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--foreground-muted)]">
            {t.home.scroll}
          </span>
          <ChevronDown size={14} className="text-[var(--gold)] animate-bounce" />
        </div>
      </section>

      {/* ===== STATS BAR — Animated Counters ===== */}
      <section className="relative py-16 border-y border-[var(--border)] bg-[var(--background-secondary)]/50 content-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <RevealOnScroll key={stat.label} delay={i * 100} variant="fade-up">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-serif text-gradient-gold mb-2">
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      duration={2000 + i * 300}
                    />
                  </div>
                  <p className="text-[var(--foreground-muted)] text-xs uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HORIZONTAL SCROLL — Lusitano Qualities ===== */}
      <section className="py-20 sm:py-24 overflow-hidden content-auto">
        <RevealOnScroll className="text-center mb-10 px-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-3 block">
            {isPt ? "A Essência" : "The Essence"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[var(--foreground)]">
            {isPt ? "O Que Define o Lusitano" : "What Defines the Lusitano"}
          </h2>
        </RevealOnScroll>

        <HorizontalScrollGallery>
          {galleryItems.map((item) => (
            <div
              key={item.label}
              className="w-[280px] sm:w-[320px] h-[180px] bg-[var(--background-card)] border border-[var(--border)] p-8 flex flex-col justify-between group hover:border-[var(--gold)]/30 transition-all duration-500 card-premium shimmer-gold"
            >
              <item.icon
                size={28}
                className="text-[var(--gold)] group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <p className="text-[var(--foreground)] font-serif text-lg">{item.value}</p>
                <p className="text-[var(--foreground-muted)] text-[10px] uppercase tracking-[0.25em]">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </HorizontalScrollGallery>
      </section>

      {/* ===== DISCOVER SECTION ===== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 content-auto">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll variant="blur-up" className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {isPt ? "Descubra" : "Discover"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
              {isPt ? "Tudo Sobre o Lusitano" : "Everything About the Lusitano"}
            </h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">
              {isPt
                ? "A plataforma mais completa dedicada ao cavalo Lusitano"
                : "The most complete platform dedicated to the Lusitano horse"}
            </p>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <RevealOnScroll key={feature.href} delay={i * 100} variant="fade-up">
                <Link
                  href={feature.href}
                  className="group block bg-[var(--background-card)] border border-[var(--border)] p-6 sm:p-8 hover:border-[var(--gold)]/20 transition-all duration-500 relative overflow-hidden card-premium animated-border"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="relative">
                    <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-[var(--gold)]/20 transition-colors group-hover:scale-110 duration-300">
                      <feature.icon size={22} className="text-[var(--gold)]" />
                    </div>
                    <h3 className="text-lg font-serif text-[var(--foreground)] mb-2 group-hover:text-[var(--gold)] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--foreground-muted)] text-sm leading-relaxed mb-4">
                      {feature.desc}
                    </p>
                    <span className="text-[11px] uppercase tracking-wider text-[var(--foreground-muted)] group-hover:text-[var(--gold)] transition-colors flex items-center gap-2">
                      {isPt ? "Explorar" : "Explore"}
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-2 transition-transform duration-300"
                      />
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PILLARS ===== */}
      <section className="py-20 sm:py-28 border-t border-[var(--border)] relative overflow-hidden content-auto">
        {/* Background orb */}
        <div className="gradient-orb w-[600px] h-[600px] bg-[var(--gold)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <RevealOnScroll variant="fade-scale" className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {isPt ? "Os Nossos Pilares" : "Our Pillars"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {isPt ? "Porquê o Portal Lusitano" : "Why Portal Lusitano"}
            </h2>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <RevealOnScroll key={pillar.title} delay={i * 120} variant="fade-up">
                <div className="text-center p-6 group">
                  <div className="w-14 h-14 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-[var(--gold)]/20 group-hover:scale-110 transition-all duration-500 glow-pulse">
                    <pillar.icon size={24} className="text-[var(--gold)]" />
                  </div>
                  <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EBOOK CTA ===== */}
      <section className="relative py-24 sm:py-32 border-t border-[var(--border)] overflow-hidden noise-overlay content-auto">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--gold)]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <RevealOnScroll variant="fade-left">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              {/* Book Preview */}
              <div className="flex-shrink-0">
                <div className="w-48 h-64 sm:w-56 sm:h-72 bg-gradient-to-br from-[var(--background-elevated)] to-[var(--background-secondary)] border border-[var(--gold)]/20 flex flex-col items-center justify-center relative shadow-2xl shadow-black/50 float-gentle">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[var(--gold)]/20" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[var(--gold)]/20" />
                  <BookOpen className="text-[var(--gold)]/40 mb-4" size={40} />
                  <p className="text-[var(--foreground)]/80 font-serif text-sm text-center px-6">
                    Introdução ao Cavalo Lusitano
                  </p>
                  <p className="text-[var(--foreground-muted)] text-[9px] uppercase tracking-[0.3em] mt-3">
                    30 {isPt ? "Páginas" : "Pages"}
                  </p>
                </div>
              </div>

              {/* Text */}
              <div className="text-center md:text-left">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
                  Ebook {isPt ? "Gratuito" : "Free"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
                  {isPt ? "O Guia Essencial do Lusitano" : "The Essential Lusitano Guide"}
                </h2>
                <p className="text-[var(--foreground-secondary)] leading-relaxed mb-8 max-w-lg">
                  {isPt
                    ? "Descobre a história, as características e o que torna esta raça única. 30 páginas de conhecimento gratuito."
                    : "Discover the history, characteristics and what makes this breed unique. 30 pages of free knowledge."}
                </p>
                <MagneticButton>
                  <Link
                    href="/ebook-gratis"
                    className="ripple-btn inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-bold hover:from-white hover:to-white transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.15)]"
                  >
                    <Gift size={16} />
                    {isPt ? "Descarregar Grátis" : "Download Free"}
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== LOJA CTA ===== */}
      <section className="py-20 sm:py-28 border-t border-[var(--border)] content-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <RevealOnScroll variant="fade-scale">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {isPt ? "Loja" : "Shop"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {isPt ? "Vestuário & Acessórios Equestres" : "Equestrian Clothing & Accessories"}
            </h2>
            <p className="text-[var(--foreground-muted)] max-w-lg mx-auto mb-10">
              {isPt
                ? "Peças que celebram a herança equestre portuguesa. Design contemporâneo, tradição secular."
                : "Pieces that celebrate Portuguese equestrian heritage. Contemporary design, secular tradition."}
            </p>
            <MagneticButton>
              <Link
                href="/loja"
                className="ripple-btn shimmer-gold inline-block border border-[var(--border-hover)] px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)] hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-500"
              >
                {t.home.cta}
              </Link>
            </MagneticButton>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}

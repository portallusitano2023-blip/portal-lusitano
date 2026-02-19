"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
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
  // createTranslator returns a pure function of language — memoize it so
  // the same reference is reused across renders when language is unchanged.
  const tr = useMemo(() => createTranslator(language), [language]);

  // Memoize all static data arrays so they are not recreated on every render.
  // These only need to change when `language` changes (tr/t depend on it).
  const features = useMemo(
    () => [
      {
        icon: ShoppingCart,
        title: tr("Comprar Cavalo", "Buy a Horse", "Comprar Caballo"),
        desc: tr(
          "Marketplace com cavalos Lusitanos verificados à venda",
          "Marketplace with verified Lusitano horses for sale",
          "Mercado con caballos Lusitanos verificados en venta"
        ),
        href: "/comprar",
        accent: "from-amber-500/20 to-orange-500/20",
      },
      {
        icon: Crown,
        title: tr("Coudelarias", "Stud Farms", "Haras"),
        desc: tr(
          "Directório das melhores coudelarias de Portugal",
          "Directory of the best stud farms in Portugal",
          "Directorio de los mejores haras de Portugal"
        ),
        href: "/directorio",
        accent: "from-yellow-500/20 to-amber-500/20",
      },
      {
        icon: Calculator,
        title: tr("Ferramentas", "Tools", "Herramientas"),
        desc: tr(
          "Calculadora de valor, comparador e análise de perfil",
          "Value calculator, comparator and profile analysis",
          "Calculadora de valor, comparador y análisis de perfil"
        ),
        href: "/ferramentas",
        accent: "from-emerald-500/20 to-teal-500/20",
      },
      {
        icon: Newspaper,
        title: tr("Jornal", "Journal", "Revista"),
        desc: tr(
          "Artigos, investigação e crónicas sobre o Lusitano",
          "Articles, research and chronicles about the Lusitano",
          "Artículos, investigación y crónicas sobre el Lusitano"
        ),
        href: "/jornal",
        accent: "from-blue-500/20 to-indigo-500/20",
      },
      {
        icon: Trophy,
        title: tr("Lusitanos Notáveis", "Notable Lusitanos", "Lusitanos Notables"),
        desc: tr(
          "Galeria de honra dos cavalos que fizeram história",
          "Hall of fame of horses that made history",
          "Galería de honor de los caballos que hicieron historia"
        ),
        href: "/cavalos-famosos",
        accent: "from-purple-500/20 to-pink-500/20",
      },
      {
        icon: MapPin,
        title: tr("Mapa Interativo", "Interactive Map", "Mapa Interactivo"),
        desc: tr(
          "Encontre coudelarias, eventos e profissionais no mapa",
          "Find stud farms, events and professionals on the map",
          "Encuentre haras, eventos y profesionales en el mapa"
        ),
        href: "/mapa",
        accent: "from-rose-500/20 to-red-500/20",
      },
    ],
    [tr]
  );

  const pillars = useMemo(
    () => [
      {
        icon: BookOpen,
        title: tr("Conhecimento", "Knowledge", "Conocimiento"),
        desc: tr(
          "Arquivo editorial com investigação sobre a raça",
          "Editorial archive with research about the breed",
          "Archivo editorial con investigación sobre la raza"
        ),
      },
      {
        icon: Shield,
        title: tr("Verificação", "Verification", "Verificación"),
        desc: tr(
          "Dados verificados e fontes credíveis",
          "Verified data and credible sources",
          "Datos verificados y fuentes creíbles"
        ),
      },
      {
        icon: Crown,
        title: tr("Tradição", "Tradition", "Tradición"),
        desc: tr(
          "500 anos de história equestre portuguesa",
          "500 years of Portuguese equestrian history",
          "500 años de historia ecuestre portuguesa"
        ),
      },
      {
        icon: Gift,
        title: tr("Comunidade", "Community", "Comunidad"),
        desc: tr(
          "Uma rede de cavaleiros, criadores e entusiastas",
          "A network of riders, breeders and enthusiasts",
          "Una red de jinetes, criadores y entusiastas"
        ),
      },
    ],
    [tr]
  );

  const galleryItems = useMemo(
    () => [
      {
        icon: Trophy,
        label: tr("Dressage", "Dressage", "Dressage"),
        value: tr("Excelência", "Excellence", "Excelencia"),
      },
      {
        icon: Shield,
        label: tr("Linhagem", "Lineage", "Linaje"),
        value: tr("500 Anos", "500 Years", "500 Años"),
      },
      {
        icon: Star,
        label: tr("Morfologia", "Morphology", "Morfología"),
        value: tr("Perfeição", "Perfection", "Perfección"),
      },
      {
        icon: Heart,
        label: tr("Temperamento", "Temperament", "Temperamento"),
        value: tr("Nobreza", "Nobility", "Nobleza"),
      },
      {
        icon: Compass,
        label: tr("Versatilidade", "Versatility", "Versatilidad"),
        value: tr("Completo", "Complete", "Completo"),
      },
      {
        icon: Feather,
        label: tr("Elegância", "Elegance", "Elegancia"),
        value: tr("Inata", "Innate", "Innata"),
      },
      {
        icon: Sparkles,
        label: tr("Presença", "Presence", "Presencia"),
        value: tr("Majestosa", "Majestic", "Majestuosa"),
      },
    ],
    [tr]
  );

  const stats = useMemo(
    () => [
      {
        value: 500,
        suffix: "+",
        label: tr("Anos de História", "Years of History", "Años de Historia"),
      },
      {
        value: 15,
        suffix: "",
        label: tr("Cavalos Notáveis", "Notable Horses", "Caballos Notables"),
      },
      {
        value: 4,
        suffix: "",
        label: tr("Ferramentas Exclusivas", "Exclusive Tools", "Herramientas Exclusivas"),
      },
      { value: 3, suffix: "", label: tr("Idiomas", "Languages", "Idiomas") },
    ],
    [tr]
  );

  const steps = useMemo(
    () => [
      {
        number: "01",
        icon: Compass,
        title: tr("Pesquise", "Browse", "Explore"),
        desc: tr(
          "Filtre por disciplina, preço e localização no nosso marketplace verificado.",
          "Filter by discipline, price and location on our verified marketplace.",
          "Filtre por disciplina, precio y ubicación en nuestro marketplace verificado."
        ),
      },
      {
        number: "02",
        icon: Heart,
        title: tr("Contacte", "Connect", "Contacte"),
        desc: tr(
          "Entre em contacto directo com o criador ou proprietário e visite o cavalo.",
          "Get in direct contact with the breeder or owner and visit the horse.",
          "Entre en contacto directo con el criador o propietario y visite el caballo."
        ),
      },
      {
        number: "03",
        icon: Trophy,
        title: tr("Adquira", "Acquire", "Adquiera"),
        desc: tr(
          "Conclua a transacção com confiança e bem-vindo à família Lusitana.",
          "Complete the transaction with confidence and welcome to the Lusitano family.",
          "Complete la transacción con confianza y bienvenido a la familia Lusitana."
        ),
      },
    ],
    [tr]
  );

  return (
    <main
      aria-label={tr(
        "Portal Lusitano — Página Principal",
        "Portal Lusitano — Home",
        "Portal Lusitano — Inicio"
      )}
    >
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
                {tr("Comprar Cavalo", "Buy a Horse", "Comprar Caballo")}
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
            {tr("A Essência", "The Essence", "La Esencia")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[var(--foreground)]">
            {tr(
              "O Que Define o Lusitano",
              "What Defines the Lusitano",
              "Lo Que Define al Lusitano"
            )}
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
              {tr("Descubra", "Discover", "Descubra")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
              {tr(
                "Tudo Sobre o Lusitano",
                "Everything About the Lusitano",
                "Todo Sobre el Lusitano"
              )}
            </h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">
              {tr(
                "A plataforma mais completa dedicada ao cavalo Lusitano",
                "The most complete platform dedicated to the Lusitano horse",
                "La plataforma más completa dedicada al caballo Lusitano"
              )}
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
                      {tr("Explorar", "Explore", "Explorar")}
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
              {tr("Os Nossos Pilares", "Our Pillars", "Nuestros Pilares")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr("Porquê o Portal Lusitano", "Why Portal Lusitano", "Por Qué Portal Lusitano")}
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

      {/* ===== COMO FUNCIONA ===== */}
      <section className="py-20 sm:py-28 border-t border-[var(--border)] content-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <RevealOnScroll variant="fade-scale" className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {tr("Processo", "Process", "Proceso")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr(
                "Como Encontrar o Seu Cavalo",
                "How to Find Your Horse",
                "Cómo Encontrar su Caballo"
              )}
            </h2>
            <p className="text-[var(--foreground-muted)] max-w-md mx-auto">
              {tr(
                "Três passos simples para encontrar o Lusitano perfeito.",
                "Three simple steps to find the perfect Lusitano.",
                "Tres pasos simples para encontrar el Lusitano perfecto."
              )}
            </p>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
            {steps.map((step, i) => (
              <RevealOnScroll key={step.number} delay={i * 150} variant="fade-up">
                <div className="relative p-6 sm:p-8 bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--gold)]/20 transition-all duration-500 group">
                  {/* Step number */}
                  <span
                    className="absolute top-4 right-5 text-[64px] font-serif text-[var(--foreground-muted)]/10 leading-none select-none"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-[var(--gold)]/20 group-hover:scale-110 transition-all duration-500">
                    <step.icon size={22} className="text-[var(--gold)]" />
                  </div>
                  <h3 className="text-xl font-serif text-[var(--foreground)] mb-3">{step.title}</h3>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll className="text-center mt-12" delay={450}>
            <Link
              href="/comprar"
              className="ripple-btn inline-flex items-center gap-3 bg-[var(--gold)] text-black px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-white transition-all duration-300"
            >
              {tr("Ver Cavalos Disponíveis", "View Available Horses", "Ver Caballos Disponibles")}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </RevealOnScroll>
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
                    {tr(
                      "Introdução ao Cavalo Lusitano",
                      "Introduction to the Lusitano Horse",
                      "Introducción al Caballo Lusitano"
                    )}
                  </p>
                  <p className="text-[var(--foreground-muted)] text-[9px] uppercase tracking-[0.3em] mt-3">
                    30 {tr("Páginas", "Pages", "Páginas")}
                  </p>
                </div>
              </div>

              {/* Text */}
              <div className="text-center md:text-left">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
                  Ebook {tr("Gratuito", "Free", "Gratuito")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
                  {tr(
                    "O Guia Essencial do Lusitano",
                    "The Essential Lusitano Guide",
                    "La Guía Esencial del Lusitano"
                  )}
                </h2>
                <p className="text-[var(--foreground-secondary)] leading-relaxed mb-8 max-w-lg">
                  {tr(
                    "Descobre a história, as características e o que torna esta raça única. 30 páginas de conhecimento gratuito.",
                    "Discover the history, characteristics and what makes this breed unique. 30 pages of free knowledge.",
                    "Descubre la historia, las características y lo que hace única a esta raza. 30 páginas de conocimiento gratuito."
                  )}
                </p>
                <MagneticButton>
                  <Link
                    href="/ebook-gratis"
                    className="ripple-btn inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-bold hover:from-white hover:to-white transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.15)]"
                  >
                    <Gift size={16} />
                    {tr("Descarregar Grátis", "Download Free", "Descargar Gratis")}
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== VENDER CAVALO CTA ===== */}
      <section className="border-t border-[var(--border)] content-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <RevealOnScroll variant="fade-right">
            <div className="bg-[var(--background-card)] border border-[var(--border)] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden hover:border-[var(--gold)]/20 transition-all duration-500">
              {/* Corner ornaments */}
              <div
                className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[var(--gold)]/20"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[var(--gold)]/20"
                aria-hidden="true"
              />
              {/* Gold orb */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-[80px] pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative text-center sm:text-left">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-3 block">
                  {tr("Para Proprietários", "For Owners", "Para Propietarios")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[var(--foreground)] mb-3">
                  {tr(
                    "Tem um Cavalo para Vender?",
                    "Have a Horse to Sell?",
                    "¿Tiene un Caballo para Vender?"
                  )}
                </h2>
                <p className="text-[var(--foreground-muted)] leading-relaxed max-w-lg">
                  {tr(
                    "Publique o seu anúncio e alcance compradores qualificados em Portugal e no mundo.",
                    "Publish your listing and reach qualified buyers in Portugal and worldwide.",
                    "Publique su anuncio y alcance compradores calificados en Portugal y en el mundo."
                  )}
                </p>
              </div>

              <MagneticButton strength={0.15}>
                <Link
                  href="/vender-cavalo"
                  className="ripple-btn shimmer-gold inline-flex items-center gap-3 border border-[var(--border-hover)] text-[var(--foreground)] px-8 py-4 text-[11px] uppercase tracking-[0.15em] hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-300 whitespace-nowrap"
                >
                  {tr("Anunciar Cavalo", "List Your Horse", "Anunciar Caballo")}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== LOJA CTA ===== */}
      <section className="py-20 sm:py-28 border-t border-[var(--border)] content-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <RevealOnScroll variant="fade-scale">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {tr("Loja", "Shop", "Tienda")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr(
                "Vestuário & Acessórios Equestres",
                "Equestrian Clothing & Accessories",
                "Ropa y Accesorios Ecuestres"
              )}
            </h2>
            <p className="text-[var(--foreground-muted)] max-w-lg mx-auto mb-10">
              {tr(
                "Peças que celebram a herança equestre portuguesa. Design contemporâneo, tradição secular.",
                "Pieces that celebrate Portuguese equestrian heritage. Contemporary design, secular tradition.",
                "Piezas que celebran el patrimonio ecuestre portugués. Diseño contemporáneo, tradición secular."
              )}
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

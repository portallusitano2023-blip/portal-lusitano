"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import TextSplit from "@/components/TextSplit";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

// Dynamic imports for below-fold interactive components — reduces initial JS bundle
const AnimatedCounter = dynamic(() => import("@/components/ui/AnimatedCounter"), { ssr: false });
const MagneticButton = dynamic(() => import("@/components/ui/MagneticButton"));
const ParallaxSection = dynamic(() => import("@/components/ui/ParallaxSection"));
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
  Stethoscope,
  Tag,
  Euro,
  ShoppingBag,
  Package,
} from "lucide-react";
import type { ProductListing } from "@/types/product";

export default function HomeContent({ featuredProduct }: { featuredProduct?: ProductListing | null }) {
  const { language, t } = useLanguage();
  // createTranslator returns a pure function of language — memoize it so
  // the same reference is reused across renders when language is unchanged.
  const tr = useMemo(() => createTranslator(language), [language]);

  // Show sticky CTA after scrolling past hero on mobile
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowStickyCTA(window.scrollY > 380);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        title: tr("Ferramentas Pro", "Pro Tools", "Herramientas Pro"),
        desc: tr(
          "Calculadora de valor, comparador e análise de perfil profissional",
          "Value calculator, comparator and professional profile analysis",
          "Calculadora de valor, comparador y análisis de perfil profesional"
        ),
        href: "/precos",
        accent: "from-emerald-500/20 to-teal-500/20",
      },
      {
        icon: Stethoscope,
        title: tr("Profissionais", "Professionals", "Profesionales"),
        desc: tr(
          "Veterinários, treinadores e ferradores verificados",
          "Verified veterinarians, trainers and farriers",
          "Veterinarios, entrenadores y herradores verificados"
        ),
        href: "/profissionais",
        accent: "from-cyan-500/20 to-blue-500/20",
      },
      {
        icon: Tag,
        title: tr("Publicidade", "Advertising", "Publicidad"),
        desc: tr(
          "Promova o seu negócio equestre à comunidade Lusitana",
          "Promote your equestrian business to the Lusitano community",
          "Promueva su negocio ecuestre a la comunidad Lusitana"
        ),
        href: "/publicidade",
        accent: "from-orange-500/20 to-red-500/20",
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

  const testimonials = useMemo(
    () => [
      {
        quote: tr(
          "O Portal Lusitano ajudou-me a encontrar o garanhão perfeito para a minha coudelaria. Processo simples e seguro.",
          "Portal Lusitano helped me find the perfect stallion for my stud farm. Simple and secure process.",
          "Portal Lusitano me ayudó a encontrar el semental perfecto para mi haras. Proceso simple y seguro."
        ),
        name: tr("João Ribeiro", "João Ribeiro", "João Ribeiro"),
        role: tr(
          "Criador, Coudelaria Vale do Tejo",
          "Breeder, Vale do Tejo Stud Farm",
          "Criador, Haras Vale do Tejo"
        ),
      },
      {
        quote: tr(
          "As ferramentas Pro são indispensáveis. A calculadora de valor poupou-me horas de pesquisa de mercado.",
          "The Pro tools are indispensable. The value calculator saved me hours of market research.",
          "Las herramientas Pro son indispensables. La calculadora de valor me ahorró horas de investigación."
        ),
        name: tr("Ana Santos", "Ana Santos", "Ana Santos"),
        role: tr("Veterinária Equina", "Equine Veterinarian", "Veterinaria Equina"),
      },
      {
        quote: tr(
          "Vendi o meu Lusitano em menos de duas semanas. Os compradores qualificados fazem toda a diferença.",
          "I sold my Lusitano in less than two weeks. The qualified buyers make all the difference.",
          "Vendí mi Lusitano en menos de dos semanas. Los compradores calificados marcan la diferencia."
        ),
        name: tr("Miguel Costa", "Miguel Costa", "Miguel Costa"),
        role: tr("Proprietário, Alentejo", "Owner, Alentejo", "Propietario, Alentejo"),
      },
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
    <>
      {/* ===== HERO — Full Screen with Parallax ===== */}
      <section className="relative min-h-[78vh] sm:min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden noise-overlay">
        {/* Background Image */}
        <Image
          src="/images/home/hero.png"
          alt="Cavalo Lusitano — Nobreza Portuguesa"
          fill
          className="object-cover opacity-60 z-0"
          style={{ objectPosition: "center 20%" }}
          priority
          sizes="100vw"
          quality={90}
        />

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
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Brand identity — always visible */}
          <div
            className="opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.05s" }}
          >
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.45em] text-[var(--gold)] font-semibold drop-shadow-md">
              Portal Lusitano
            </p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[var(--foreground-muted)]/70 mt-1">
              {t.home.est}
            </p>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif text-[var(--foreground)] leading-[0.9] drop-shadow-lg">
            <TextSplit text={t.home.title_main} baseDelay={0.15} wordDelay={0.06} />
          </h1>

          {/* Decorative line */}
          <div
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.3s" }}
          />

          <p
            className="text-sm md:text-base font-serif italic text-[var(--foreground)]/80 max-w-lg mx-auto leading-relaxed drop-shadow-md opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.35s" }}
          >
            &ldquo;{t.home.hero_text}&rdquo;
          </p>

          <div
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            style={{ animationDelay: "0.45s" }}
          >
            {/* Mobile: solid gold primary CTA | Desktop: shimmer border */}
            <MagneticButton strength={0.2}>
              <LocalizedLink
                href="/vender-cavalo"
                className="ripple-btn inline-flex items-center gap-2 sm:gap-0 bg-[var(--gold)] sm:bg-black/20 text-black sm:text-[var(--foreground)] border border-[var(--gold)] sm:border-[var(--gold)]/30 sm:backdrop-blur-md shimmer-gold px-10 py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--gold)] hover:text-black transition-all duration-500 font-semibold sm:font-normal w-full sm:w-auto justify-center"
              >
                {tr("Vender Cavalo", "Sell a Horse", "Vender Caballo")}
              </LocalizedLink>
            </MagneticButton>
            <MagneticButton strength={0.15}>
              <LocalizedLink
                href="/comprar"
                className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-secondary)] border border-[var(--foreground-muted)]/25 sm:border-transparent hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)]/50 transition-all duration-300 line-draw"
              >
                {tr("Comprar Cavalo", "Buy a Horse", "Comprar Caballo")} →
              </LocalizedLink>
            </MagneticButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-28 lg:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--foreground-muted)]">
            {t.home.scroll}
          </span>
          <ChevronDown size={14} className="text-[var(--gold)] animate-bounce" />
        </div>
      </section>

      {/* ===== MOBILE CONVERSION HUB ===== */}
      <section className="sm:hidden px-4 pt-5 pb-6 bg-[var(--background)]">

        {/* ── CARD 1: VENDER CAVALO ─────────────────────────── */}
        <LocalizedLink
          href="/vender-cavalo"
          className="group flex items-center gap-4 w-full p-5 mb-3 rounded-2xl bg-gradient-to-r from-[var(--gold)]/20 via-[var(--gold)]/10 to-transparent border border-[var(--gold)]/40 active:scale-[0.98] touch-manipulation transition-transform relative overflow-hidden"
        >
          {/* brilho no hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)]/5 to-transparent opacity-0 group-active:opacity-100 transition-opacity" />
          <div className="w-14 h-14 rounded-xl bg-[var(--gold)] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(197,160,89,0.4)]">
            <Euro size={24} className="text-black" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-base font-bold text-[var(--foreground)] leading-tight">
                {tr("Vender o seu Cavalo", "Sell Your Horse", "Vender su Caballo")}
              </p>
              <span className="text-[8px] uppercase tracking-[0.15em] bg-[var(--gold)]/20 text-[var(--gold)] px-1.5 py-0.5 rounded font-semibold flex-shrink-0">
                {tr("Marketplace", "Marketplace", "Marketplace")}
              </span>
            </div>
            <p className="text-[12px] text-[var(--foreground-muted)] leading-snug">
              {tr("Compradores qualificados em Portugal e no mundo", "Qualified buyers in Portugal and worldwide", "Compradores en Portugal y en todo el mundo")}
            </p>
          </div>
          <ArrowRight size={18} className="text-[var(--gold)] flex-shrink-0 group-active:translate-x-0.5 transition-transform" />
        </LocalizedLink>

        {/* ── CARDS 2+3: LOJA + PRO ─────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-3">

          {/* Loja / Boné */}
          <LocalizedLink
            href={featuredProduct?.handle ? `/loja/${featuredProduct.handle}` : "/loja"}
            className="group relative flex flex-col rounded-2xl overflow-hidden border border-[var(--border)] active:scale-[0.97] touch-manipulation transition-transform bg-[var(--background-secondary)]"
          >
            {/* Imagem do produto */}
            <div className="relative w-full aspect-square bg-[var(--background-card)]">
              {featuredProduct?.images[0]?.url ? (
                <Image
                  src={featuredProduct.images[0].url}
                  alt={featuredProduct.title}
                  fill
                  sizes="50vw"
                  className="object-cover group-active:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag size={32} className="text-[var(--gold)]/30" />
                </div>
              )}
              {/* Badge */}
              <div className="absolute top-2 left-2">
                <span className="bg-[var(--gold)] text-black text-[8px] uppercase tracking-[0.15em] font-bold px-2 py-1 rounded-sm leading-none">
                  {tr("Exclusivo", "Exclusive", "Exclusivo")}
                </span>
              </div>
            </div>
            {/* Info */}
            <div className="p-3">
              <p className="text-xs font-semibold text-[var(--foreground)] leading-tight mb-0.5 truncate">
                {featuredProduct?.title ?? tr("Loja Exclusiva", "Exclusive Shop", "Tienda Exclusiva")}
              </p>
              {featuredProduct?.priceRange ? (
                <p className="text-sm font-bold text-[var(--gold)]">
                  {Number(featuredProduct.priceRange.minVariantPrice.amount).toFixed(2)} €
                </p>
              ) : (
                <p className="text-[11px] text-[var(--foreground-muted)]">
                  {tr("Ver loja →", "View shop →", "Ver tienda →")}
                </p>
              )}
            </div>
          </LocalizedLink>

          {/* Ferramentas Pro */}
          <LocalizedLink
            href="/precos"
            className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] p-4 active:scale-[0.97] touch-manipulation transition-transform bg-[var(--background-secondary)] relative overflow-hidden"
          >
            {/* gradiente fundo */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/8 via-transparent to-transparent" />
            <div className="relative">
              <div className="w-10 h-10 bg-[var(--gold)]/15 border border-[var(--gold)]/30 rounded-xl flex items-center justify-center mb-3">
                <Sparkles size={18} className="text-[var(--gold)]" />
              </div>
              <p className="text-sm font-bold text-[var(--foreground)] leading-tight mb-1">
                {tr("Ferramentas Pro", "Pro Tools", "Herramientas Pro")}
              </p>
              <p className="text-[11px] text-[var(--foreground-muted)] leading-snug">
                {tr("Calculadora · Comparador · Análise", "Calculator · Comparator · Analysis", "Calculadora · Comparador")}
              </p>
            </div>
            <div className="relative mt-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--gold)]">
                {tr("Ver planos", "View plans", "Ver planes")}
              </span>
              <ArrowRight size={13} className="text-[var(--gold)] group-active:translate-x-0.5 transition-transform" />
            </div>
          </LocalizedLink>
        </div>

        {/* ── QUICK LINKS ───────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { href: "/comprar", icon: ShoppingCart, label: tr("Cavalos", "Horses", "Caballos"), color: "text-amber-400" },
            { href: "/directorio", icon: Crown, label: tr("Coudel.", "Studs", "Haras"), color: "text-yellow-400" },
            { href: "/jornal", icon: Newspaper, label: tr("Jornal", "Journal", "Revista"), color: "text-blue-400" },
            { href: "/ebook-gratis", icon: Gift, label: tr("Ebook", "Ebook", "Ebook"), color: "text-[var(--gold)]" },
          ].map((item) => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] active:scale-95 touch-manipulation transition-transform"
            >
              <item.icon size={18} className={item.color} />
              <span className="text-[9px] text-[var(--foreground-muted)] leading-tight text-center">
                {item.label}
              </span>
            </LocalizedLink>
          ))}
        </div>
      </section>

      {/* ===== STATS BAR — Animated Counters ===== */}
      <section className="relative py-8 sm:py-16 border-y border-[var(--border)] bg-[var(--background-secondary)]/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
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

      {/* ===== QUALITIES GRID — Lusitano Essence ===== */}
      <section className="hidden sm:block py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <RevealOnScroll className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-3 block">
              {tr("A Essência", "The Essence", "La Esencia")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[var(--foreground)] mb-4">
              {tr(
                "O Que Define o Lusitano",
                "What Defines the Lusitano",
                "Lo Que Define al Lusitano"
              )}
            </h2>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto" />
          </RevealOnScroll>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {galleryItems.map((item, index) => (
              <RevealOnScroll
                key={item.label}
                className={`group relative bg-[var(--background-card)] border border-[var(--border)] rounded-lg p-6 sm:p-8 flex flex-col items-center text-center gap-4 hover:border-[var(--gold)]/30 transition-all duration-500 ${index === galleryItems.length - 1 && galleryItems.length % 2 !== 0 ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[var(--gold)]/20 flex items-center justify-center group-hover:border-[var(--gold)]/50 group-hover:bg-[var(--gold)]/5 transition-all duration-500">
                  <item.icon
                    size={22}
                    className="text-[var(--gold)] group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <p className="text-[var(--foreground)] font-serif text-lg sm:text-xl mb-1">
                    {item.value}
                  </p>
                  <p className="text-[var(--foreground-muted)] text-[9px] sm:text-[10px] uppercase tracking-[0.25em]">
                    {item.label}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DISCOVER SECTION ===== */}
      <section className="py-8 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll variant="blur-up" className="text-center mb-6 sm:mb-16">
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

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {features.map((feature, i) => (
              <RevealOnScroll key={feature.href} delay={i * 100} variant="fade-up">
                <LocalizedLink
                  href={feature.href}
                  className="group block bg-[var(--background-card)] border border-[var(--border)] p-4 sm:p-8 hover:border-[var(--gold)]/20 transition-all duration-500 relative overflow-hidden card-premium animated-border"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-[var(--gold)]/20 transition-colors group-hover:scale-110 duration-300">
                      <feature.icon size={18} className="text-[var(--gold)]" />
                    </div>
                    <h3 className="text-sm sm:text-lg font-serif text-[var(--foreground)] mb-1 sm:mb-2 group-hover:text-[var(--gold)] transition-colors duration-300 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="hidden sm:block text-[var(--foreground-muted)] text-sm leading-relaxed mb-4">
                      {feature.desc}
                    </p>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] group-hover:text-[var(--gold)] transition-colors flex items-center gap-1.5 mt-2">
                      {tr("Explorar", "Explore", "Explorar")}
                      <ArrowRight
                        size={10}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </span>
                  </div>
                </LocalizedLink>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PILLARS ===== */}
      <section className="py-10 sm:py-28 border-t border-[var(--border)] relative overflow-hidden">
        {/* Background orb */}
        <div className="gradient-orb w-[600px] h-[600px] bg-[var(--gold)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <RevealOnScroll variant="fade-scale" className="text-center mb-8 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {tr("Os Nossos Pilares", "Our Pillars", "Nuestros Pilares")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr("Porquê o Portal Lusitano", "Why Portal Lusitano", "Por Qué Portal Lusitano")}
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((pillar, i) => (
              <RevealOnScroll key={pillar.title} delay={i * 120} variant="fade-up">
                <div className="text-center p-4 sm:p-6 group">
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
      <section className="py-10 sm:py-28 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 sm:px-6">
          <RevealOnScroll variant="fade-scale" className="text-center mb-8 sm:mb-16">
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
          </div>

          {/* Mobile: horizontal scroll — Desktop: grid */}
          <div className="sm:hidden overflow-x-auto scrollbar-hide px-4 pb-2">
            <div className="flex gap-3" style={{ width: "max-content" }}>
              {steps.map((step) => (
                <div key={step.number} className="relative w-[72vw] max-w-[280px] p-5 bg-[var(--background-card)] border border-[var(--border)] flex-none">
                  <span
                    className="absolute top-3 right-4 text-[56px] font-serif text-[var(--foreground-muted)]/10 leading-none select-none"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <div className="w-10 h-10 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mb-4">
                    <step.icon size={18} className="text-[var(--gold)]" />
                  </div>
                  <h3 className="text-base font-serif text-[var(--foreground)] mb-2">{step.title}</h3>
                  <p className="text-[var(--foreground-muted)] text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:grid sm:grid-cols-3 gap-6 px-6">
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

          <RevealOnScroll className="text-center mt-10 sm:mt-12 px-4 sm:px-6" delay={450}>
            <LocalizedLink
              href="/comprar"
              className="ripple-btn inline-flex items-center gap-3 bg-[var(--gold)] text-black px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-white transition-all duration-300"
            >
              {tr("Ver Cavalos Disponíveis", "View Available Horses", "Ver Caballos Disponibles")}
              <ArrowRight size={14} aria-hidden="true" />
            </LocalizedLink>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== SOCIAL PROOF — Testimonials ===== */}
      <section className="py-10 sm:py-28 border-t border-[var(--border)] bg-[var(--background-secondary)]/30">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 sm:px-6">
          <RevealOnScroll variant="fade-scale" className="text-center mb-8 sm:mb-14">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {tr("Testemunhos", "Testimonials", "Testimonios")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr(
                "O Que Dizem os Nossos Utilizadores",
                "What Our Users Say",
                "Lo Que Dicen Nuestros Usuarios"
              )}
            </h2>
          </RevealOnScroll>
          </div>

          {/* Mobile: horizontal scroll — Desktop: grid */}
          <div className="sm:hidden overflow-x-auto scrollbar-hide px-4 pb-2">
            <div className="flex gap-3" style={{ width: "max-content" }}>
              {testimonials.map((item) => (
                <div key={item.name} className="w-[80vw] max-w-[300px] flex-none bg-[var(--background-card)] border border-[var(--border)] p-5 relative">
                  <span
                    className="text-[var(--gold)]/30 text-5xl font-serif absolute top-3 left-5 leading-none select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="text-[var(--foreground-secondary)] text-xs leading-relaxed mb-4 pt-6 italic">
                    {item.quote}
                  </p>
                  <div className="border-t border-[var(--border)] pt-3">
                    <p className="text-[var(--foreground)] font-serif text-sm">{item.name}</p>
                    <p className="text-[var(--foreground-muted)] text-xs">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:grid sm:grid-cols-3 gap-6 px-6">
            {testimonials.map((item, i) => (
              <RevealOnScroll key={item.name} delay={i * 120} variant="fade-up">
                <div className="bg-[var(--background-card)] border border-[var(--border)] p-6 sm:p-8 relative hover:border-[var(--gold)]/20 transition-all duration-500">
                  <span
                    className="text-[var(--gold)]/30 text-5xl font-serif absolute top-4 left-6 leading-none select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-6 pt-6 italic">
                    {item.quote}
                  </p>
                  <div className="border-t border-[var(--border)] pt-4">
                    <p className="text-[var(--foreground)] font-serif text-sm">{item.name}</p>
                    <p className="text-[var(--foreground-muted)] text-xs">{item.role}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* Trust badges */}
          <RevealOnScroll className="mt-10 sm:mt-12 px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-center">
              <div>
                <p className="text-2xl font-serif text-[var(--gold)]">5.000+</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                  {tr("Leads Ebook", "Ebook Leads", "Leads Ebook")}
                </p>
              </div>
              <div className="w-[1px] h-8 bg-[var(--border)]" />
              <div>
                <p className="text-2xl font-serif text-[var(--gold)]">100+</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                  {tr("Cavalos Listados", "Horses Listed", "Caballos Listados")}
                </p>
              </div>
              <div className="w-[1px] h-8 bg-[var(--border)]" />
              <div>
                <p className="text-2xl font-serif text-[var(--gold)]">50+</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                  {tr("Coudelarias", "Stud Farms", "Haras")}
                </p>
              </div>
              <div className="w-[1px] h-8 bg-[var(--border)]" />
              <div>
                <p className="text-2xl font-serif text-[var(--gold)]">98%</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                  {tr("Satisfação", "Satisfaction", "Satisfacción")}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== VENDER CAVALO CTA ===== */}

      <section className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-20">
          <RevealOnScroll variant="fade-right">
            <div className="bg-[var(--background-card)] border border-[var(--border)] p-5 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-8 relative overflow-hidden hover:border-[var(--gold)]/20 transition-all duration-500">
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
                <LocalizedLink
                  href="/vender-cavalo"
                  className="ripple-btn shimmer-gold inline-flex items-center gap-3 border border-[var(--border-hover)] text-[var(--foreground)] px-8 py-4 text-[11px] uppercase tracking-[0.15em] hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-300 whitespace-nowrap"
                >
                  {tr("Anunciar Cavalo", "List Your Horse", "Anunciar Caballo")}
                  <ArrowRight size={14} aria-hidden="true" />
                </LocalizedLink>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== EBOOK CTA ===== */}
      <section className="relative py-12 sm:py-32 border-t border-[var(--border)] overflow-hidden noise-overlay">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--gold)]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <RevealOnScroll variant="fade-left">
            <div className="flex flex-row sm:flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-16">
              {/* Book Preview */}
              <div className="flex-shrink-0">
                <div className="w-28 h-36 sm:w-56 sm:h-72 bg-gradient-to-br from-[var(--background-elevated)] to-[var(--background-secondary)] border border-[var(--gold)]/20 flex flex-col items-center justify-center relative shadow-2xl shadow-black/50 float-gentle">
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-t border-l border-[var(--gold)]/20" />
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-b border-r border-[var(--gold)]/20" />
                  <BookOpen className="text-[var(--gold)]/40 mb-2 sm:mb-4" size={28} />
                  <p className="text-[var(--foreground)]/80 font-serif text-[10px] sm:text-sm text-center px-3 sm:px-6 leading-snug">
                    {tr(
                      "Introdução ao Cavalo Lusitano",
                      "Introduction to the Lusitano Horse",
                      "Introducción al Caballo Lusitano"
                    )}
                  </p>
                  <p className="text-[var(--foreground-muted)] text-[8px] sm:text-[9px] uppercase tracking-[0.3em] mt-2 sm:mt-3">
                    30 {tr("Páginas", "Pages", "Páginas")}
                  </p>
                </div>
              </div>

              {/* Text */}
              <div className="text-left sm:text-center md:text-left flex-1">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-2 sm:mb-4 block">
                  Ebook {tr("Gratuito", "Free", "Gratuito")}
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif text-[var(--foreground)] mb-3 sm:mb-4">
                  {tr(
                    "O Guia Essencial do Lusitano",
                    "The Essential Lusitano Guide",
                    "La Guía Esencial del Lusitano"
                  )}
                </h2>
                <p className="hidden sm:block text-[var(--foreground-secondary)] leading-relaxed mb-8 max-w-lg">
                  {tr(
                    "Descobre a história, as características e o que torna esta raça única. 30 páginas de conhecimento gratuito.",
                    "Discover the history, characteristics and what makes this breed unique. 30 pages of free knowledge.",
                    "Descubre la historia, las características y lo que hace única a esta raza. 30 páginas de conocimiento gratuito."
                  )}
                </p>
                <MagneticButton>
                  <LocalizedLink
                    href="/ebook-gratis"
                    className="ripple-btn inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-bold hover:from-white hover:to-white transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.15)]"
                  >
                    <Gift size={16} />
                    {tr("Descarregar Grátis", "Download Free", "Descargar Gratis")}
                  </LocalizedLink>
                </MagneticButton>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== STICKY SCROLL CTA — Mobile only, appears after hero ===== */}
      <div
        className={`sm:hidden fixed bottom-16 left-0 right-0 z-30 bg-[var(--background)]/96 backdrop-blur-md border-t border-[var(--border)] px-3 py-2.5 flex gap-2 transition-transform duration-300 ${
          showStickyCTA ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <LocalizedLink
          href="/comprar"
          className="flex-1 flex items-center justify-center py-3 text-[9px] uppercase tracking-[0.2em] font-semibold text-[var(--foreground-secondary)] border border-[var(--border)] rounded-lg active:scale-95 touch-manipulation transition-transform"
        >
          {tr("Cavalos", "Horses", "Caballos")}
        </LocalizedLink>
        <LocalizedLink
          href={featuredProduct?.handle ? `/loja/${featuredProduct.handle}` : "/loja"}
          className="flex-1 flex items-center justify-center gap-1 py-3 text-[9px] uppercase tracking-[0.2em] font-semibold text-[var(--foreground-secondary)] border border-[var(--border)] rounded-lg active:scale-95 touch-manipulation transition-transform"
        >
          <ShoppingBag size={11} strokeWidth={2.5} />
          {tr("Loja", "Shop", "Tienda")}
        </LocalizedLink>
        <LocalizedLink
          href="/vender-cavalo"
          className="flex-[1.4] flex items-center justify-center gap-1.5 py-3 text-[9px] uppercase tracking-[0.2em] font-bold bg-[var(--gold)] text-black rounded-lg active:scale-95 touch-manipulation transition-transform shadow-[0_0_12px_rgba(197,160,89,0.25)]"
        >
          <Euro size={11} strokeWidth={2.5} />
          {tr("Vender", "Sell", "Vender")}
        </LocalizedLink>
      </div>

      {/* ===== PRODUTO EM DESTAQUE ===== */}
      <section className="border-t border-[var(--border)] overflow-hidden">
        {featuredProduct ? (
          <RevealOnScroll variant="fade-up">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
                {/* Imagem */}
                <LocalizedLink
                  href={`/loja/${featuredProduct.handle}`}
                  className="group relative bg-[var(--background-secondary)] overflow-hidden block min-h-[320px] lg:min-h-[520px]"
                >
                  {featuredProduct.images[0]?.url ? (
                    <>
                      <Image
                        src={featuredProduct.images[0].url}
                        alt={featuredProduct.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package size={64} className="text-[var(--gold)]/20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 lg:hidden">
                    <span className="bg-[var(--gold)] text-black text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1.5">
                      {tr("Exclusivo", "Exclusive", "Exclusivo")}
                    </span>
                  </div>
                </LocalizedLink>

                {/* Info */}
                <div className="relative bg-[var(--background)] flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10 lg:py-20">
                  <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-[var(--gold)]/20 hidden lg:block" aria-hidden="true" />
                  <div className="absolute bottom-6 left-6 w-10 h-10 border-b border-l border-[var(--gold)]/20 hidden lg:block" aria-hidden="true" />

                  <div className="hidden lg:flex items-center gap-3 mb-6">
                    <span className="bg-[var(--gold)] text-black text-[9px] uppercase tracking-[0.25em] font-bold px-3 py-1.5">
                      {tr("Exclusivo", "Exclusive", "Exclusivo")}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                      {tr("Loja Portal Lusitano", "Portal Lusitano Shop", "Tienda Portal Lusitano")}
                    </span>
                  </div>

                  <span className="lg:hidden text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-3 block">
                    {tr("Loja", "Shop", "Tienda")}
                  </span>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[var(--foreground)] mb-4 leading-tight">
                    {featuredProduct.title}
                  </h2>

                  {featuredProduct.description && (
                    <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6 max-w-md text-sm sm:text-base">
                      {featuredProduct.description.length > 160
                        ? featuredProduct.description.slice(0, 157) + "..."
                        : featuredProduct.description}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 mb-8">
                    {[
                      tr("Qualidade premium portuguesa", "Premium Portuguese quality", "Calidad premium portuguesa"),
                      tr("Envio para todo o mundo", "Worldwide shipping", "Envío a todo el mundo"),
                      tr("Design equestre exclusivo", "Exclusive equestrian design", "Diseño ecuestre exclusivo"),
                    ].map((feat) => (
                      <div key={feat} className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] flex-shrink-0" />
                        <span className="text-xs text-[var(--foreground-muted)]">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] mb-1">
                        {tr("Preço", "Price", "Precio")}
                      </p>
                      <p className="text-3xl font-serif text-[var(--gold)]">
                        {Number(featuredProduct.priceRange?.minVariantPrice.amount || 0).toFixed(2)} €
                      </p>
                    </div>

                    <MagneticButton strength={0.2}>
                      <LocalizedLink
                        href={`/loja/${featuredProduct.handle}`}
                        className="ripple-btn inline-flex items-center gap-3 bg-[var(--gold)] text-black px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.25)] active:scale-95 touch-manipulation"
                      >
                        <ShoppingBag size={15} strokeWidth={2.5} />
                        {tr("Comprar Agora", "Buy Now", "Comprar Ahora")}
                      </LocalizedLink>
                    </MagneticButton>
                  </div>

                  <LocalizedLink
                    href="/loja"
                    className="inline-flex items-center gap-1.5 mt-5 text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors group w-fit"
                  >
                    {tr("Ver toda a coleção", "View full collection", "Ver colección completa")}
                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </LocalizedLink>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="py-10 sm:py-28">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <RevealOnScroll variant="fade-scale">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
                  {tr("Loja", "Shop", "Tienda")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
                  {tr("Vestuário & Acessórios Equestres", "Equestrian Clothing & Accessories", "Ropa y Accesorios Ecuestres")}
                </h2>
                <p className="text-[var(--foreground-muted)] max-w-lg mx-auto mb-10">
                  {tr(
                    "Peças que celebram a herança equestre portuguesa. Design contemporâneo, tradição secular.",
                    "Pieces that celebrate Portuguese equestrian heritage. Contemporary design, secular tradition.",
                    "Piezas que celebran el patrimonio ecuestre portugués. Diseño contemporáneo, tradición secular."
                  )}
                </p>
                <MagneticButton>
                  <LocalizedLink
                    href="/loja"
                    className="ripple-btn shimmer-gold inline-block border border-[var(--border-hover)] px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)] hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-500"
                  >
                    {t.home.cta}
                  </LocalizedLink>
                </MagneticButton>
              </RevealOnScroll>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

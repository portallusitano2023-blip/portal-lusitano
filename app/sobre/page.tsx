"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { CONTACT_EMAIL } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import {
  BookOpen,
  Shield,
  Crown,
  Users,
  Mail,
  ArrowRight,
  ArrowUpRight,
  Heart,
  Globe,
  Store,
  Wrench,
  ShoppingCart,
  Search,
  Building2,
  Trophy,
  Briefcase,
  Check,
  LucideIcon,
} from "lucide-react";

/* ─── Ornamental Separator ─────────────────────────────────────── */
function OrnamentalSeparator() {
  return (
    <div className="flex items-center gap-4 max-w-5xl mx-auto px-4 sm:px-6 mb-20 sm:mb-28">
      <div className="flex-1 h-px bg-[var(--border)]" />
      <div className="w-1.5 h-1.5 rotate-45 bg-[var(--gold)]/40" />
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
  );
}

export default function SobrePage() {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  const values = [
    {
      icon: Shield,
      title: tr("Rigor", "Rigour", "Rigor"),
      desc: tr(
        "Cada facto publicado é verificado em fontes credíveis. Preferimos ter menos informação do que informação errada.",
        "Every fact published is verified from credible sources. We prefer less information over wrong information.",
        "Cada hecho publicado es verificado en fuentes creíbles. Preferimos menos información que información errónea."
      ),
    },
    {
      icon: BookOpen,
      title: tr("Conhecimento", "Knowledge", "Conocimiento"),
      desc: tr(
        "Arquivo editorial com investigação profunda sobre a história, genética e arte equestre do Lusitano.",
        "Editorial archive with deep research on the history, genetics and equestrian art of the Lusitano.",
        "Archivo editorial con investigación profunda sobre la historia, genética y arte ecuestre del Lusitano."
      ),
    },
    {
      icon: Crown,
      title: tr("Tradição", "Tradition", "Tradición"),
      desc: tr(
        "Honramos 500 anos de criação equestre portuguesa, preservando o legado das grandes coudelarias.",
        "We honour 500 years of Portuguese horse breeding, preserving the legacy of the great stud farms.",
        "Honramos 500 años de cría ecuestre portuguesa, preservando el legado de los grandes establos."
      ),
    },
    {
      icon: Globe,
      title: tr("Acessibilidade", "Accessibility", "Accesibilidad"),
      desc: tr(
        "Ferramentas gratuitas e conteúdo trilingue para que o conhecimento sobre o Lusitano chegue a todos.",
        "Free tools and trilingual content so that knowledge about the Lusitano reaches everyone.",
        "Herramientas gratuitas y contenido trilingüe para que el conocimiento sobre el Lusitano llegue a todos."
      ),
    },
  ];

  const features: {
    icon: LucideIcon;
    title: string;
    desc: string;
    href: string;
  }[] = [
    {
      icon: Store,
      title: tr("Marketplace de Cavalos", "Horse Marketplace", "Mercado de Caballos"),
      desc: tr(
        "Compra e venda de cavalos Lusitanos com fichas técnicas detalhadas.",
        "Buy and sell Lusitano horses with detailed technical sheets.",
        "Compra y venta de caballos Lusitanos con fichas técnicas detalladas."
      ),
      href: "/comprar",
    },
    {
      icon: Building2,
      title: tr("Directório de Coudelarias", "Stud Farm Directory", "Directorio de Caballerizas"),
      desc: tr(
        "As melhores coudelarias de Portugal, com perfis completos e avaliações.",
        "The best stud farms in Portugal, with complete profiles and reviews.",
        "Las mejores caballerizas de Portugal, con perfiles completos y valoraciones."
      ),
      href: "/directorio",
    },
    {
      icon: Wrench,
      title: tr("Ferramentas Equestres", "Equestrian Tools", "Herramientas Ecuestres"),
      desc: tr(
        "Calculadora de valor, comparador, verificador de compatibilidade e análise de perfil.",
        "Value calculator, comparator, compatibility checker and profile analysis.",
        "Calculadora de valor, comparador, verificador de compatibilidad y análisis de perfil."
      ),
      href: "/ferramentas",
    },
    {
      icon: BookOpen,
      title: tr("Jornal & Arquivo", "Journal & Archive", "Diario & Archivo"),
      desc: tr(
        "Artigos de investigação, crónicas e o maior arquivo digital sobre o cavalo Lusitano.",
        "Research articles, chronicles and the largest digital archive about the Lusitano horse.",
        "Artículos de investigación, crónicas y el mayor archivo digital sobre el caballo Lusitano."
      ),
      href: "/jornal",
    },
    {
      icon: ShoppingCart,
      title: tr("Loja Equestre", "Equestrian Shop", "Tienda Ecuestre"),
      desc: tr(
        "Vestuário e acessórios que celebram a herança equestre portuguesa.",
        "Clothing and accessories that celebrate Portuguese equestrian heritage.",
        "Ropa y accesorios que celebran el patrimonio ecuestre portugués."
      ),
      href: "/loja",
    },
    {
      icon: Users,
      title: tr("Comunidade", "Community", "Comunidad"),
      desc: tr(
        "Rede de cavaleiros, criadores, veterinários e profissionais do sector.",
        "Network of riders, breeders, veterinarians and industry professionals.",
        "Red de jinetes, criadores, veterinarios y profesionales del sector."
      ),
      href: "/registar",
    },
  ];

  const stats = [
    {
      value: "15",
      label: tr("Cavalos documentados", "Documented horses", "Caballos documentados"),
    },
    {
      value: "4",
      label: tr("Ferramentas especializadas", "Specialist tools", "Herramientas especializadas"),
    },
    { value: "3", label: tr("Línguas", "Languages", "Idiomas") },
    { value: "2023", label: tr("Ano de fundação", "Founded", "Año de fundación") },
  ];

  const principles = [
    tr("Informação verificada", "Verified information", "Información verificada"),
    tr("Trilingue PT / EN / ES", "Trilingual PT / EN / ES", "Trilingüe PT / EN / ES"),
    tr("Ferramentas gratuitas", "Free tools", "Herramientas gratuitas"),
    tr("Comunidade aberta", "Open community", "Comunidad abierta"),
    tr("Sem anúncios invasivos", "No invasive ads", "Sin anuncios invasivos"),
  ];

  const audience: { icon: LucideIcon; title: string; desc: string }[] = [
    {
      icon: Search,
      title: tr("Compradores", "Buyers", "Compradores"),
      desc: tr(
        "Ferramentas precisas para encontrar e avaliar o cavalo ideal.",
        "Precise tools to find and evaluate the ideal horse.",
        "Herramientas precisas para encontrar y evaluar el caballo ideal."
      ),
    },
    {
      icon: Building2,
      title: tr("Criadores", "Breeders", "Criadores"),
      desc: tr(
        "Promove a tua coudelaria para compradores nacionais e internacionais.",
        "Promote your stud farm to national and international buyers.",
        "Promociona tu caballeriza para compradores nacionales e internacionales."
      ),
    },
    {
      icon: Trophy,
      title: tr("Cavaleiros", "Riders", "Jinetes"),
      desc: tr(
        "Mantém-te a par da actualidade equestre lusitana.",
        "Stay up to date with Lusitano equestrian news.",
        "Mantente al tanto de la actualidad ecuestre lusitana."
      ),
    },
    {
      icon: Briefcase,
      title: tr("Profissionais", "Professionals", "Profesionales"),
      desc: tr(
        "Ganha visibilidade no directório de profissionais equestres.",
        "Gain visibility in the equestrian professionals directory.",
        "Gana visibilidad en el directorio de profesionales ecuestres."
      ),
    },
    {
      icon: Globe,
      title: tr("Internacional", "International", "Internacional"),
      desc: tr(
        "Descobre o património equestre português em três línguas.",
        "Discover Portuguese equestrian heritage in three languages.",
        "Descubre el patrimonio ecuestre portugués en español."
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20">
      {/* ===== HERO ===== */}
      <section className="px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-6 block">
              {tr("Sobre Nós", "About Us", "Sobre Nosotros")}
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[var(--foreground)] mb-3 leading-[1.08]">
              {tr("A Nossa", "Our", "Nuestra")}
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-[var(--gold)] mb-8 leading-[1.08]">
              {tr("Missão", "Mission", "Misión")}
            </h1>

            <p className="text-lg sm:text-xl text-[var(--foreground-secondary)] leading-relaxed max-w-2xl mx-auto mb-10">
              {tr(
                "O Portal Lusitano nasceu para elevar o Cavalo Lusitano ao palco global. Unimos tecnologia, investigação e paixão equestre numa plataforma sem precedentes.",
                "Portal Lusitano was born to elevate the Lusitano Horse to the global stage. We unite technology, research and equestrian passion in an unprecedented platform.",
                "Portal Lusitano nació para elevar el Caballo Lusitano al escenario global. Unimos tecnología, investigación y pasión ecuestre en una plataforma sin precedentes."
              )}
            </p>

            {/* Decorative golden line */}
            <div className="flex items-center justify-center gap-3 mx-auto">
              <div className="w-16 h-px bg-[var(--gold)]/30" />
              <div className="w-1 h-1 rotate-45 bg-[var(--gold)]/50" />
              <div className="w-px h-14 bg-[var(--gold)]/25" />
              <div className="w-1 h-1 rotate-45 bg-[var(--gold)]/50" />
              <div className="w-16 h-px bg-[var(--gold)]/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="px-4 sm:px-6 border-y border-[var(--border)] py-10 sm:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimateOnScroll key={stat.label} delay={i * 80} className="text-center">
                <p className="text-4xl sm:text-5xl font-serif text-[var(--gold)] mb-2">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--foreground-muted)]">
                  {stat.label}
                </p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MANIFESTO ===== */}
      <section className="relative px-4 sm:px-6 py-24 sm:py-32 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background-secondary)] to-[var(--background)] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[var(--gold)]/4 rounded-full blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimateOnScroll>
            {/* Decorative opening quotation mark */}
            <div className="relative mb-6 select-none pointer-events-none" aria-hidden="true">
              <span className="absolute left-1/2 -translate-x-1/2 -top-4 text-[10rem] sm:text-[14rem] font-serif leading-none text-[var(--gold)]/8 select-none">
                &ldquo;
              </span>
            </div>

            <blockquote className="relative">
              <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-[var(--foreground)] leading-[1.4] max-w-3xl mx-auto">
                {tr(
                  "O Lusitano não é apenas uma raça — é uma civilização inteira a galope.",
                  "The Lusitano is not just a breed — it is an entire civilisation at full gallop.",
                  "El Lusitano no es solo una raza — es toda una civilización al galope."
                )}
              </p>
            </blockquote>

            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-[var(--gold)]/40" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]/60">
                Portal Lusitano
              </span>
              <div className="w-8 h-px bg-[var(--gold)]/40" />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <OrnamentalSeparator />

      {/* ===== ORIGIN STORY ===== */}
      <section className="px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
                  {tr("A Origem", "The Origin", "El Origen")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-8">
                  {tr("Fundado em 2023", "Founded in 2023", "Fundado en 2023")}
                </h2>

                {/* Timeline paragraphs with golden left border */}
                <div className="space-y-6">
                  {[
                    tr(
                      "O Portal Lusitano foi fundado por Francisco Gaspar com uma visão clara: criar a plataforma de referência para o cavalo Lusitano no mundo digital.",
                      "Portal Lusitano was founded by Francisco Gaspar with a clear vision: to create the reference platform for the Lusitano horse in the digital world.",
                      "Portal Lusitano fue fundado por Francisco Gaspar con una visión clara: crear la plataforma de referencia para el caballo Lusitano en el mundo digital."
                    ),
                    tr(
                      "Combinando engenharia digital com profundo conhecimento equestre, construímos ferramentas que ajudam cavaleiros, criadores e entusiastas a tomar decisões informadas.",
                      "Combining digital engineering with deep equestrian knowledge, we build tools that help riders, breeders and enthusiasts make informed decisions.",
                      "Combinando ingeniería digital con profundo conocimiento ecuestre, construimos herramientas que ayudan a jinetes, criadores y entusiastas a tomar decisiones informadas."
                    ),
                    tr(
                      "Cada peça de conteúdo é verificada em fontes credíveis. Cada ferramenta é optimizada para as especificidades da raça Lusitana.",
                      "Every piece of content is verified from credible sources. Every tool is optimised for the specificities of the Lusitano breed.",
                      "Cada pieza de contenido es verificada en fuentes creíbles. Cada herramienta está optimizada para las especificidades de la raza Lusitana."
                    ),
                  ].map((text, i) => (
                    <div key={i} className="flex gap-5">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center flex-shrink-0 pt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]/60 flex-shrink-0" />
                        {i < 2 && <div className="w-px flex-1 mt-2 bg-[var(--gold)]/15" />}
                      </div>
                      <p className="text-[var(--foreground-secondary)] leading-relaxed pb-2">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-xs">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-6">
                    {tr("Os Nossos Compromissos", "Our Commitments", "Nuestros Compromisos")}
                  </p>
                  <ul className="space-y-3">
                    {principles.map((p, i) => (
                      <li key={p} className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[var(--gold)]/20 transition-colors duration-300">
                          <Check size={11} className="text-[var(--gold)]" />
                        </div>
                        <span className="text-sm text-[var(--foreground-secondary)] group-hover/item:text-[var(--foreground)] transition-colors duration-300">
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <OrnamentalSeparator />

      {/* ===== VALUES ===== */}
      <section className="px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {tr("Valores", "Values", "Valores")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr("O Que Nos Define", "What Defines Us", "Lo Que Nos Define")}
            </h2>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <AnimateOnScroll key={value.title} delay={i * 100}>
                <div className="group bg-[var(--background-card)] border border-[var(--border)] p-8 hover:border-[var(--gold)]/25 transition-all duration-500 hover:bg-gradient-to-br hover:from-[var(--gold)]/5 hover:to-transparent">
                  <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-[var(--gold)]/20 group-hover:scale-105 transition-all duration-300">
                    <value.icon
                      size={22}
                      className="text-[var(--gold)] group-hover:text-[var(--gold)]"
                    />
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

      <OrnamentalSeparator />

      {/* ===== WHAT WE OFFER ===== */}
      <section className="px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {tr("Plataforma", "Platform", "Plataforma")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr("O Que Oferecemos", "What We Offer", "Lo Que Ofrecemos")}
            </h2>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimateOnScroll key={feature.title} delay={i * 80}>
                <Link
                  href={feature.href}
                  className="group block p-6 border border-[var(--border)] hover:border-[var(--gold)]/30 transition-all duration-500 hover:bg-[var(--background-elevated)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--gold)]/20 group-hover:scale-105 transition-all duration-300">
                      <feature.icon
                        size={18}
                        className="text-[var(--gold)]/70 group-hover:text-[var(--gold)] transition-colors duration-300"
                      />
                    </div>
                    <ArrowUpRight
                      size={15}
                      className="text-[var(--gold)]/0 group-hover:text-[var(--gold)]/60 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 translate-x-1 group-hover:translate-x-0"
                    />
                  </div>
                  <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <OrnamentalSeparator />

      {/* ===== PARA QUEM ===== */}
      <section className="px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block">
              {tr("Audiência", "Audience", "Audiencia")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr("Para Quem é o Portal?", "Who Is the Portal For?", "¿Para Quién es el Portal?")}
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {audience.map((a, i) => (
              <AnimateOnScroll key={a.title} delay={i * 80}>
                <div className="group flex flex-col items-center text-center p-6 bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--gold)]/25 hover:bg-[var(--background-elevated)] transition-all duration-500">
                  <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[var(--gold)]/20 group-hover:scale-105 transition-all duration-300">
                    <a.icon
                      size={20}
                      className="text-[var(--gold)] group-hover:brightness-125 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-base font-serif text-[var(--foreground)] mb-2">{a.title}</h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed group-hover:text-[var(--foreground-secondary)] transition-colors duration-300">
                    {a.desc}
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
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--gold)]/6 rounded-full blur-[130px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[var(--gold)]/3 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <AnimateOnScroll>
            <Heart className="text-[var(--gold)]/30 mx-auto mb-6" size={32} />
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] mb-4">
              {tr("Junta-te à Comunidade", "Join the Community", "Únete a la Comunidad")}
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-10 max-w-lg mx-auto leading-relaxed">
              {tr(
                "Faz parte da maior comunidade digital dedicada ao cavalo Lusitano. Regista-te gratuitamente.",
                "Be part of the largest digital community dedicated to the Lusitano horse. Register for free.",
                "Sé parte de la mayor comunidad digital dedicada al caballo Lusitano. Regístrate gratuitamente."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
              {/* Shimmer CTA button */}
              <Link
                href="/registar"
                className="relative inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-bold overflow-hidden group/cta hover:from-white hover:to-white transition-all duration-300"
              >
                {/* Shimmer overlay */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                />
                <Users size={16} />
                {tr("Criar Conta Grátis", "Create Free Account", "Crear Cuenta Gratis")}
              </Link>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] text-[11px] uppercase tracking-[0.15em] transition-colors"
              >
                <Mail size={14} />
                {tr("Contactar", "Contact", "Contactar")} <ArrowRight size={12} />
              </a>
            </div>

            {/* Reassurance line */}
            <p className="text-[11px] text-[var(--foreground-muted)] tracking-wide">
              {tr(
                "Sem cartão de crédito. Sem compromisso.",
                "No credit card. No commitment.",
                "Sin tarjeta de crédito. Sin compromiso."
              )}
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  );
}

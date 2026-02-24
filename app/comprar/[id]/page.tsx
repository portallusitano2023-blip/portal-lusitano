import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Pedigree from "@/components/Pedigree";
import { HorseSchema, BreadcrumbSchema } from "@/components/JsonLd";
import { MapPin, Calendar, ArrowLeft, Phone, Mail, ChevronRight } from "lucide-react";

import { CavaloVenda } from "@/types/cavalo";

// cache() deduplicates this call between generateMetadata and the page component
// within a single server request — saves 1 Supabase round-trip per page load
const getCavalo = cache(async (id: string) => {
  const { data } = await supabase.from("cavalos_venda").select("*").eq("id", id).single();
  return data;
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

// ISR: revalidar páginas de cavalos a cada 30 minutos (preços e disponibilidade mudam)
export const revalidate = 1800;

// Pré-renderizar os cavalos aprovados para indexação imediata pelo Google
export async function generateStaticParams() {
  try {
    const { data: cavalos } = await supabase
      .from("cavalos_venda")
      .select("id")
      .eq("status", "aprovado");
    return (cavalos || []).map((c) => ({ id: c.id }));
  } catch {
    return [{ id: "demo" }];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  if (id === "demo") {
    return {
      title: "Imperador do Lagar | Portal Lusitano",
      description: "Garanhão Lusitano de linhagem Veiga, 6 anos. Disponível no Portal Lusitano.",
    };
  }

  try {
    // Reuses cached result from getCavalo() — no extra Supabase call
    const cavalo = await getCavalo(id);

    if (cavalo) {
      const description = cavalo.descricao || `Cavalo Lusitano - ${cavalo.nome_cavalo}`;
      return {
        title: `${cavalo.nome_cavalo} | Portal Lusitano`,
        description,
        openGraph: {
          title: cavalo.nome_cavalo,
          description,
          images: cavalo.image_url ? [{ url: cavalo.image_url, alt: cavalo.nome_cavalo }] : [],
          type: "website",
          url: `${siteUrl}/comprar/${id}`,
        },
        twitter: {
          card: "summary_large_image",
          title: cavalo.nome_cavalo,
          description,
        },
        alternates: { canonical: `${siteUrl}/comprar/${id}` },
      };
    }
  } catch {
    // fallback
  }

  return {
    title: "Cavalo Lusitano | Portal Lusitano",
    description: "Cavalos Lusitanos de elite à venda no Portal Lusitano.",
  };
}

// Extended CavaloVenda with optional extra fields returned from SELECT *
interface CavaloDetalhe extends CavaloVenda {
  sexo?: string;
  altura?: number;
  pelagem?: string;
  disciplinas?: string[] | string | null;
  nivel?: string;
  contacto_nome?: string;
  contacto_email?: string;
  contacto_telefone?: string;
  destaque?: boolean;
}

export default async function DetalheCavaloPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let cavalo: CavaloDetalhe | null = null;

  // --- MODO DEMO ---
  if (id === "demo") {
    cavalo = {
      id: "demo-123",
      nome_cavalo: "Imperador do Lagar",
      preco: 45000,
      idade: 6,
      localizacao: "Golegã, Capital do Cavalo",
      linhagem: "Veiga (MV)",
      descricao:
        "Garanhão de pelagem ruça, com 1.64m ao garrote. Aprovado com 76 pontos. Apresenta uma mecânica de movimentos excecional, com facilidade natural para o Piaffe e Passage. Temperamento de fogo mas colaborante, típico da linhagem Veiga antiga.",
      image_url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071",
      pai: "Sultão (MV)",
      mae: "Duquesa (MV)",
      pontuacao_apsl: 76,
      sexo: "Macho",
      altura: 164,
      pelagem: "Ruça",
      nivel: "Alta-escola",
      disciplinas: ["Dressage", "Alta-escola"],
    };
  }
  // --- MODO REAL (Supabase) ---
  else {
    cavalo = await getCavalo(id);
  }

  if (!cavalo) {
    notFound();
  }

  // Normalise disciplines to array
  const disciplines: string[] = (() => {
    if (!cavalo.disciplinas) return [];
    if (Array.isArray(cavalo.disciplinas)) return cavalo.disciplinas as string[];
    if (typeof cavalo.disciplinas === "string") {
      return (cavalo.disciplinas as string)
        .split(",")
        .map((d: string) => d.trim())
        .filter(Boolean);
    }
    return [];
  })();

  const hasImage = Boolean(cavalo.image_url);

  return (
    <>
      <HorseSchema
        name={cavalo.nome_cavalo}
        description={cavalo.descricao || `Cavalo Lusitano - ${cavalo.nome_cavalo}`}
        image={cavalo.image_url || ""}
        price={cavalo.preco || undefined}
        breed="Lusitano"
        age={cavalo.idade || undefined}
        location={cavalo.localizacao || undefined}
      />
      <BreadcrumbSchema
        items={[
          { name: "Início", url: siteUrl },
          { name: "Comprar", url: `${siteUrl}/comprar` },
          { name: cavalo.nome_cavalo, url: `${siteUrl}/comprar/${id}` },
        ]}
      />

      <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* LEFT PANEL — fixed hero image (desktop) / top image (mobile) */}
        <div className="lg:w-1/2 h-[55vw] max-h-[70vh] lg:h-screen lg:max-h-none lg:fixed lg:top-0 lg:left-0 relative border-r border-[var(--background-secondary)] z-0">
          {hasImage ? (
            <>
              <Image
                src={cavalo.image_url}
                alt={`${cavalo.nome_cavalo} — Cavalo Lusitano`}
                fill
                className="object-cover grayscale brightness-75"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Bottom fade for mobile legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
              {/* Subtle top vignette */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-60" />
            </>
          ) : (
            /* Fallback when no image is available */
            <div
              className="w-full h-full flex items-center justify-center bg-[var(--background-secondary)]"
              role="img"
              aria-label={`${cavalo.nome_cavalo} — sem fotografia`}
            >
              <span className="text-[var(--foreground-muted)] text-[10px] uppercase tracking-widest">
                Sem Fotografia
              </span>
            </div>
          )}

          {/* Watermark */}
          <div
            className="absolute top-8 left-8 hidden lg:block pointer-events-none select-none"
            aria-hidden="true"
          >
            <span className="text-white/10 font-serif text-9xl italic leading-none">PL</span>
          </div>

          {/* Back link */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
            <Link
              href="/comprar"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              aria-label="Voltar ao marketplace"
            >
              <ArrowLeft size={12} aria-hidden="true" />
              Marketplace
            </Link>
          </div>

          {/* Destaque badge on hero */}
          {cavalo.destaque && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
              <span className="bg-[var(--gold)] text-black text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1">
                Destaque
              </span>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — scrollable dossier */}
        <div className="lg:w-1/2 lg:ml-[50%] bg-[var(--background)] relative z-10">
          <div className="px-4 sm:px-8 py-12 sm:py-16 lg:p-20 xl:p-24 max-w-2xl mx-auto space-y-12 sm:space-y-16">
            {/* HEADER */}
            <header className="space-y-4 border-b border-[var(--background-secondary)] pb-8">
              {/* Breadcrumb chips */}
              <nav
                aria-label="Localização no site"
                className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-widest text-[var(--foreground-muted)]"
              >
                <Link href="/comprar" className="hover:text-[var(--gold)] transition-colors">
                  Comprar
                </Link>
                <ChevronRight size={10} aria-hidden="true" />
                <span className="text-[var(--foreground-secondary)]">{cavalo.nome_cavalo}</span>
              </nav>

              {/* Linhagem + ID chips */}
              <div className="flex flex-wrap items-center gap-3">
                {cavalo.linhagem && (
                  <span className="px-3 py-1 border border-[var(--gold)] text-[var(--gold)] text-[9px] uppercase tracking-widest font-bold">
                    {cavalo.linhagem}
                  </span>
                )}
                <span className="text-[var(--foreground-muted)] text-[9px] uppercase tracking-widest font-mono">
                  REG: {cavalo.id.slice(0, 8).toUpperCase()}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-[var(--foreground)] leading-tight">
                {cavalo.nome_cavalo}
              </h1>

              <p className="text-2xl sm:text-3xl text-[var(--gold)] font-serif">
                {Number(cavalo.preco).toLocaleString("pt-PT")} €
              </p>

              {/* Quick meta pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {cavalo.idade && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--foreground-secondary)] border border-[var(--border)] px-2.5 py-1">
                    <Calendar size={11} aria-hidden="true" />
                    {cavalo.idade} anos
                  </span>
                )}
                {cavalo.localizacao && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--foreground-secondary)] border border-[var(--border)] px-2.5 py-1">
                    <MapPin size={11} aria-hidden="true" />
                    {cavalo.localizacao}
                  </span>
                )}
                {cavalo.sexo && (
                  <span className="text-[10px] text-[var(--foreground-secondary)] border border-[var(--border)] px-2.5 py-1 uppercase tracking-wide">
                    {cavalo.sexo}
                  </span>
                )}
                {disciplines.map((d) => (
                  <span
                    key={d}
                    className="text-[10px] text-[var(--gold)] border border-[var(--gold)]/30 px-2.5 py-1 uppercase tracking-wide"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </header>

            {/* BIOMETRIC SPECS */}
            <section aria-labelledby="specs-heading">
              <h2
                id="specs-heading"
                className="text-[var(--gold)] uppercase tracking-[0.5em] text-[10px] font-bold mb-8"
              >
                Especificações
              </h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
                {cavalo.idade && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">
                      Idade
                    </dt>
                    <dd className="text-xl sm:text-2xl text-[var(--foreground)] font-serif">
                      {cavalo.idade} Anos
                    </dd>
                  </div>
                )}
                {cavalo.localizacao && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">
                      Localização
                    </dt>
                    <dd className="text-xl sm:text-2xl text-[var(--foreground)] font-serif">
                      {cavalo.localizacao}
                    </dd>
                  </div>
                )}
                {cavalo.altura && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">
                      Altura ao Garrote
                    </dt>
                    <dd className="text-xl sm:text-2xl text-[var(--foreground)] font-serif">
                      {cavalo.altura} cm
                    </dd>
                  </div>
                )}
                {cavalo.pelagem && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">
                      Pelagem
                    </dt>
                    <dd className="text-xl sm:text-2xl text-[var(--foreground)] font-serif">
                      {cavalo.pelagem}
                    </dd>
                  </div>
                )}
                {cavalo.nivel && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">
                      Nível de Treino
                    </dt>
                    <dd className="text-xl sm:text-2xl text-[var(--foreground)] font-serif">
                      {cavalo.nivel}
                    </dd>
                  </div>
                )}
                {cavalo.pontuacao_apsl && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] mb-1">
                      Pontuação APSL
                    </dt>
                    <dd className="text-xl sm:text-2xl text-[var(--foreground)] font-serif">
                      {cavalo.pontuacao_apsl} pts
                    </dd>
                  </div>
                )}
              </dl>

              {/* Description */}
              {cavalo.descricao && (
                <div className="mt-10 pt-8 border-t border-[var(--background-secondary)]">
                  <h3 className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold mb-4">
                    Parecer Técnico
                  </h3>
                  <p className="font-light leading-relaxed text-base sm:text-lg italic text-[var(--foreground-secondary)]">
                    &ldquo;{cavalo.descricao}&rdquo;
                  </p>
                </div>
              )}
            </section>

            {/* PEDIGREE */}
            {(cavalo.pai || cavalo.mae) && (
              <section
                aria-labelledby="pedigree-heading"
                className="border-t border-[var(--background-secondary)] pt-10"
              >
                <h2
                  id="pedigree-heading"
                  className="text-[var(--gold)] uppercase tracking-[0.5em] text-[10px] font-bold mb-10"
                >
                  Certificado de Sangue
                </h2>
                <Pedigree cavalo={cavalo} />
                <p className="text-center text-[9px] text-[var(--foreground-muted)] mt-6 uppercase tracking-widest">
                  Dados verificados via Stud-Book Digital
                </p>
              </section>
            )}

            {/* CONTACT / CTA */}
            <section
              aria-labelledby="contact-heading"
              className="border-t border-[var(--background-secondary)] pt-10"
            >
              <h2
                id="contact-heading"
                className="text-[var(--gold)] uppercase tracking-[0.5em] text-[10px] font-bold mb-8"
              >
                Solicitar Informação
              </h2>

              <div className="bg-[var(--background-secondary)] border border-[var(--border)] p-6 sm:p-8 space-y-6">
                <div>
                  <p className="text-[var(--foreground)] font-serif italic text-xl sm:text-2xl mb-2">
                    Interessado neste exemplar?
                  </p>
                  <p className="text-[var(--foreground-secondary)] text-sm font-light leading-relaxed">
                    Entre em contacto com o vendedor para agendar uma visita, solicitar o dossier
                    veterinário completo ou obter mais informações sobre este cavalo.
                  </p>
                </div>

                {/* Contact details if available */}
                {(cavalo.contacto_nome || cavalo.contacto_telefone || cavalo.contacto_email) && (
                  <div className="space-y-3 border-t border-[var(--border)] pt-6">
                    {cavalo.contacto_nome && (
                      <p className="text-sm text-[var(--foreground)]">
                        <span className="text-[9px] uppercase tracking-widest text-[var(--foreground-muted)] block mb-0.5">
                          Contacto
                        </span>
                        {cavalo.contacto_nome}
                      </p>
                    )}
                    {cavalo.contacto_telefone && (
                      <a
                        href={`tel:${cavalo.contacto_telefone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-hover)] transition-colors text-sm"
                        aria-label={`Ligar para ${cavalo.contacto_telefone}`}
                      >
                        <Phone size={14} aria-hidden="true" />
                        {cavalo.contacto_telefone}
                      </a>
                    )}
                    {cavalo.contacto_email && (
                      <a
                        href={`mailto:${cavalo.contacto_email}?subject=Pedido de informação: ${encodeURIComponent(cavalo.nome_cavalo)}`}
                        className="inline-flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-hover)] transition-colors text-sm"
                        aria-label={`Enviar email para ${cavalo.contacto_email}`}
                      >
                        <Mail size={14} aria-hidden="true" />
                        {cavalo.contacto_email}
                      </a>
                    )}
                  </div>
                )}

                {/* Primary CTA — email portal or contact link */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`mailto:geral@portal-lusitano.pt?subject=Interesse: ${encodeURIComponent(cavalo.nome_cavalo)} (REG: ${cavalo.id.slice(0, 8).toUpperCase()})`}
                    className="flex w-full items-center justify-center gap-3 bg-[var(--gold)] text-black py-4 sm:py-5 text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-[var(--gold-hover)] transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2"
                  >
                    <Mail size={15} aria-hidden="true" />
                    Pedir Informação
                  </a>
                  <p className="text-center text-[9px] text-[var(--foreground-muted)] uppercase tracking-widest">
                    Resposta em menos de 24 horas
                  </p>
                </div>
              </div>
            </section>

            {/* Back to marketplace */}
            <div className="border-t border-[var(--background-secondary)] pt-8">
              <Link
                href="/comprar"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors"
              >
                <ArrowLeft size={12} aria-hidden="true" />
                Ver todos os anúncios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

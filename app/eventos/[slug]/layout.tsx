import { cache } from "react";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase-admin";
import { EventSchema, BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

type EventoData = {
  titulo?: string;
  descricao?: string;
  tipo?: string;
  data_inicio?: string;
  data_fim?: string;
  localizacao?: string;
  morada?: string;
  imagem_capa?: string;
  preco?: string;
  organizador?: string;
} | null;

// React.cache() deduplicates within a single request —
// generateMetadata and EventoLayout share one Supabase query instead of two.
const getEvento = cache(async (slug: string): Promise<EventoData> => {
  try {
    const { data } = await supabase
      .from("eventos")
      .select(
        "titulo, descricao, tipo, data_inicio, data_fim, localizacao, morada, imagem_capa, preco, organizador"
      )
      .eq("slug", slug)
      .single();
    return data;
  } catch {
    return null;
  }
});

export async function generateStaticParams() {
  try {
    const { data: eventos } = await supabase.from("eventos").select("slug").eq("status", "active");
    return (eventos || []).map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEvento(slug);

  if (!evento?.titulo) {
    return {
      title: "Evento | Portal Lusitano",
      description: "Eventos equestres e do mundo Lusitano em Portugal.",
      alternates: { canonical: `${siteUrl}/eventos/${slug}` },
    };
  }

  const dataFormatada = evento.data_inicio
    ? new Date(evento.data_inicio).toLocaleDateString("pt-PT")
    : "";
  const title = `${evento.titulo} | Portal Lusitano`;
  const description =
    evento.descricao?.slice(0, 160) ||
    `${evento.titulo}${dataFormatada ? ` - ${dataFormatada}` : ""}${evento.localizacao ? ` em ${evento.localizacao}` : ""}.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/eventos/${slug}` },
    openGraph: {
      title,
      description,
      images: evento.imagem_capa ? [{ url: evento.imagem_capa, width: 1200, height: 630 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: evento.imagem_capa ? [evento.imagem_capa] : [],
    },
  };
}

export default async function EventoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const evento = await getEvento(slug);

  return (
    <>
      {evento?.titulo && (
        <>
          <EventSchema
            name={evento.titulo}
            description={
              evento.descricao?.slice(0, 160) || `${evento.titulo}. Evento equestre em Portugal.`
            }
            startDate={evento.data_inicio || new Date().toISOString()}
            endDate={evento.data_fim}
            location={evento.localizacao}
            address={evento.morada}
            image={evento.imagem_capa}
            price={evento.preco}
            organizer={evento.organizador}
          />
          <BreadcrumbSchema
            items={[
              { name: "Início", url: siteUrl },
              { name: "Eventos", url: `${siteUrl}/eventos` },
              { name: evento.titulo, url: `${siteUrl}/eventos/${slug}` },
            ]}
          />
        </>
      )}
      {children}
    </>
  );
}

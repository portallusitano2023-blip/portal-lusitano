import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data: evento } = await supabase
      .from("eventos")
      .select("titulo, descricao, tipo, data_inicio, localizacao, imagem_capa")
      .eq("slug", slug)
      .single();

    if (!evento) {
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
  } catch {
    return {
      title: "Evento | Portal Lusitano",
      description: "Eventos equestres e do mundo Lusitano em Portugal.",
      alternates: { canonical: `${siteUrl}/eventos/${slug}` },
    };
  }
}

export default function EventoLayout({ children }: { children: React.ReactNode }) {
  return children;
}

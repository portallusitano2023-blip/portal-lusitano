import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { LocalBusinessSchema, BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

export async function generateStaticParams() {
  try {
    const { data: coudelarias } = await supabase
      .from("coudelarias")
      .select("slug")
      .eq("status", "active");
    return (coudelarias || []).map((c) => ({ slug: c.slug }));
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

  try {
    const { data: coudelaria } = await supabase
      .from("coudelarias")
      .select("nome, descricao, localizacao, foto_capa, especialidades")
      .eq("slug", slug)
      .single();

    if (!coudelaria) {
      return {
        title: "Coudelaria | Portal Lusitano",
        description: "Descubra coudelarias de cavalos Lusitanos em Portugal.",
        alternates: { canonical: `${siteUrl}/directorio/${slug}` },
      };
    }

    const title = `${coudelaria.nome} - Coudelaria | Portal Lusitano`;
    const description =
      coudelaria.descricao?.slice(0, 160) ||
      `${coudelaria.nome}${coudelaria.localizacao ? ` em ${coudelaria.localizacao}` : ""}. Coudelaria de cavalos Lusitanos.`;

    return {
      title,
      description,
      alternates: { canonical: `${siteUrl}/directorio/${slug}` },
      openGraph: {
        title,
        description,
        images: coudelaria.foto_capa
          ? [{ url: coudelaria.foto_capa, width: 1200, height: 630 }]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: coudelaria.foto_capa ? [coudelaria.foto_capa] : [],
      },
    };
  } catch {
    return {
      title: "Coudelaria | Portal Lusitano",
      description: "Descubra coudelarias de cavalos Lusitanos em Portugal.",
      alternates: { canonical: `${siteUrl}/directorio/${slug}` },
    };
  }
}

export default async function CoudelariaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let coudelaria: {
    nome?: string;
    descricao?: string;
    localizacao?: string;
    telefone?: string;
    email?: string;
    website?: string;
    foto_capa?: string;
  } | null = null;

  try {
    const { data } = await supabase
      .from("coudelarias")
      .select("nome, descricao, localizacao, telefone, email, website, foto_capa")
      .eq("slug", slug)
      .single();
    coudelaria = data;
  } catch {
    // Schema não é crítico - continuar sem ele
  }

  return (
    <>
      {coudelaria?.nome && (
        <>
          <LocalBusinessSchema
            name={coudelaria.nome}
            description={
              coudelaria.descricao?.slice(0, 160) ||
              `${coudelaria.nome}. Coudelaria de cavalos Lusitanos.`
            }
            address={coudelaria.localizacao || "Portugal"}
            telephone={coudelaria.telefone}
            email={coudelaria.email}
            website={coudelaria.website}
            image={coudelaria.foto_capa}
          />
          <BreadcrumbSchema
            items={[
              { name: "Início", url: siteUrl },
              { name: "Directório", url: `${siteUrl}/directorio` },
              { name: coudelaria.nome, url: `${siteUrl}/directorio/${slug}` },
            ]}
          />
        </>
      )}
      {children}
    </>
  );
}

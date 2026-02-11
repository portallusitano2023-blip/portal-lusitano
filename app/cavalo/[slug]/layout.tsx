import type { Metadata } from "next";
import { createClient } from "next-sanity";
import { HorseSchema, BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

const client = createClient({
  projectId: "ofrzpaxa",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const cavalo = await client.fetch(
      `*[_type == "cavalo" && slug.current == $slug][0]{
        nome, descricao, idade, ferro, pelagem, preco,
        "imageUrl": fotografiaPrincipal.asset->url,
        "coudelaria": coudelaria->nome,
        "localizacao": coudelaria->localizacao
      }`,
      { slug }
    );

    if (!cavalo) {
      return {
        title: "Cavalo | Portal Lusitano",
        description: "Descubra cavalos Lusitanos de qualidade no Portal Lusitano.",
        alternates: { canonical: `${siteUrl}/cavalo/${slug}` },
      };
    }

    const title = `${cavalo.nome} - Cavalo Lusitano | Portal Lusitano`;
    const description =
      cavalo.descricao?.slice(0, 160) ||
      `${cavalo.nome}, cavalo Lusitano${cavalo.idade ? ` de ${cavalo.idade} anos` : ""}${cavalo.ferro ? ` - Ferro: ${cavalo.ferro}` : ""}.`;

    return {
      title,
      description,
      alternates: { canonical: `${siteUrl}/cavalo/${slug}` },
      openGraph: {
        title,
        description,
        images: cavalo.imageUrl ? [{ url: cavalo.imageUrl, width: 1200, height: 630 }] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: cavalo.imageUrl ? [cavalo.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Cavalo Lusitano | Portal Lusitano",
      description: "Descubra cavalos Lusitanos de qualidade no Portal Lusitano.",
      alternates: { canonical: `${siteUrl}/cavalo/${slug}` },
    };
  }
}

export default async function CavaloLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let cavalo: {
    nome?: string;
    descricao?: string;
    idade?: number;
    pelagem?: string;
    preco?: number;
    imageUrl?: string;
    coudelaria?: string;
    localizacao?: string;
  } | null = null;

  try {
    cavalo = await client.fetch(
      `*[_type == "cavalo" && slug.current == $slug][0]{
        nome, descricao, idade, pelagem, preco,
        "imageUrl": fotografiaPrincipal.asset->url,
        "coudelaria": coudelaria->nome,
        "localizacao": coudelaria->localizacao
      }`,
      { slug }
    );
  } catch {
    // Schema não é crítico - continuar sem ele
  }

  return (
    <>
      {cavalo?.nome && (
        <>
          <HorseSchema
            name={cavalo.nome}
            description={cavalo.descricao?.slice(0, 160) || `${cavalo.nome}, cavalo Lusitano.`}
            image={cavalo.imageUrl}
            price={cavalo.preco}
            age={cavalo.idade}
            color={cavalo.pelagem}
            seller={cavalo.coudelaria}
            location={cavalo.localizacao}
          />
          <BreadcrumbSchema
            items={[
              { name: "Início", url: siteUrl },
              { name: "Cavalos", url: `${siteUrl}/comprar` },
              { name: cavalo.nome, url: `${siteUrl}/cavalo/${slug}` },
            ]}
          />
        </>
      )}
      {children}
    </>
  );
}

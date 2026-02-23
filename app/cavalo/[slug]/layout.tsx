import { cache } from "react";
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

type CavaloData = {
  nome?: string;
  descricao?: string;
  idade?: number;
  ferro?: string;
  pelagem?: string;
  preco?: number;
  imageUrl?: string;
  coudelaria?: string;
  localizacao?: string;
} | null;

// React.cache() deduplicates this fetch within a single request —
// generateMetadata and CavaloLayout now share one Sanity round-trip instead of two.
const getCavalo = cache(async (slug: string): Promise<CavaloData> => {
  try {
    return await client.fetch(
      `*[_type == "cavalo" && slug.current == $slug][0]{
        nome, descricao, idade, ferro, pelagem, preco,
        "imageUrl": fotografiaPrincipal.asset->url,
        "coudelaria": coudelaria->nome,
        "localizacao": coudelaria->localizacao
      }`,
      { slug }
    );
  } catch {
    return null;
  }
});

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<{ slug: string }[]>(
      `*[_type == "cavalo" && defined(slug.current)]{ "slug": slug.current }`
    );
    return slugs.map((s) => ({ slug: s.slug }));
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
  const cavalo = await getCavalo(slug);

  if (!cavalo?.nome) {
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
}

export default async function CavaloLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cavalo = await getCavalo(slug);

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

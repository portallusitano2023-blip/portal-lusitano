import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/lib/client";
import { fetchCavaloBySlug } from "@/lib/sanity-queries";
import CavaloDetail from "@/components/cavalo/CavaloDetail";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

// ISR: Revalidate horse detail every hour
export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const cavalo = await fetchCavaloBySlug(slug);

    if (cavalo) {
      const description =
        cavalo.descricao && cavalo.descricao.length > 0
          ? cavalo.descricao.substring(0, 160)
          : `Cavalo Lusitano — ${cavalo.nome}`;

      return {
        title: `${cavalo.nome} — Portal Lusitano`,
        description,
        alternates: {
          canonical: `${siteUrl}/cavalo/${slug}`,
          languages: {
            "pt-PT": `${siteUrl}/cavalo/${slug}`,
            en: `${siteUrl}/en/cavalo/${slug}`,
            es: `${siteUrl}/es/cavalo/${slug}`,
          },
        },
        openGraph: {
          title: cavalo.nome,
          description,
          url: `${siteUrl}/cavalo/${slug}`,
          type: "website",
          images: cavalo.imageUrl ? [{ url: cavalo.imageUrl, alt: cavalo.nome }] : [],
        },
        twitter: {
          card: "summary_large_image",
          title: cavalo.nome,
          description,
        },
      };
    }
  } catch {
    // fallback
  }

  return {
    title: "Cavalo Lusitano — Portal Lusitano",
    description: "Conheça cavalos Lusitanos incríveis no Portal Lusitano.",
  };
}

export default async function CavaloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const result = await client.fetch(
    `{
      "atual": *[_type == "cavalo" && slug.current == $slug][0]{
        nome, idade, ferro, genealogia, descricao, preco,
        "imageUrl": fotografiaPrincipal.asset->url,
        "galeriaUrls": galeria[].asset->url
      },
      "relacionados": *[_type == "cavalo" && slug.current != $slug][0...3]{
        nome,
        "slug": slug.current,
        "imageUrl": fotografiaPrincipal.asset->url,
        idade
      }
    }`,
    { slug }
  );

  if (!result?.atual) notFound();

  return (
    <CavaloDetail cavalo={result.atual} relacionados={result.relacionados || []} slug={slug} />
  );
}

import type { Metadata } from "next";
import { createClient } from "next-sanity";

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
        nome, descricao, idade, ferro,
        "imageUrl": fotografiaPrincipal.asset->url
      }`,
      { slug }
    );

    if (!cavalo) {
      return {
        title: "Cavalo | Portal Lusitano",
        description: "Descubra cavalos Lusitanos de qualidade no Portal Lusitano.",
      };
    }

    const title = `${cavalo.nome} - Cavalo Lusitano | Portal Lusitano`;
    const description =
      cavalo.descricao?.slice(0, 160) ||
      `${cavalo.nome}, cavalo Lusitano${cavalo.idade ? ` de ${cavalo.idade} anos` : ""}${cavalo.ferro ? ` - Ferro: ${cavalo.ferro}` : ""}.`;

    return {
      title,
      description,
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
    };
  }
}

export default function CavaloLayout({ children }: { children: React.ReactNode }) {
  return children;
}

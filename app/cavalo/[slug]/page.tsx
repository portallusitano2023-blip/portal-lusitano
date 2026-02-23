import { notFound } from "next/navigation";
import { client } from "@/lib/client";
import CavaloDetail from "@/components/cavalo/CavaloDetail";

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

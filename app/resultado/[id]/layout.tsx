import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

// Map tool_name to human-readable labels (must match the client-side TOOL_CONFIG)
const TOOL_LABELS: Record<string, string> = {
  calculadora: "Calculadora de Valor",
  comparador: "Comparador de Cavalos",
  compatibilidade: "Verificador de Compatibilidade",
  perfil: "Analise de Perfil",
};

const TOOL_DESCRIPTIONS: Record<string, string> = {
  calculadora:
    "Resultado da avaliacao de valor de um cavalo Lusitano com base em idade, linhagem e treino.",
  comparador: "Resultado da comparacao detalhada entre cavalos Lusitanos.",
  compatibilidade:
    "Resultado da analise de compatibilidade genetica entre garanhao e egua Lusitanos.",
  perfil: "Resultado da analise de perfil equestre personalizada.",
};

interface ResultRow {
  id: string;
  tool_name: string;
  title: string;
  is_public: boolean;
  share_id: string | null;
  created_at: string;
}

async function getResultData(id: string): Promise<ResultRow | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("saved_results")
      .select("id, tool_name, title, is_public, share_id, created_at")
      .or(`share_id.eq.${id},id.eq.${id}`)
      .single();

    if (error || !data) return null;

    // Only expose metadata for public results
    if (!data.is_public) return null;

    return data as ResultRow;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getResultData(id);

  // Fallback metadata when result is not found or not public
  if (!result) {
    return {
      title: "Resultado",
      description: "Veja o resultado de uma das ferramentas equestres do Portal Lusitano.",
      robots: { index: false, follow: true },
    };
  }

  const toolLabel = TOOL_LABELS[result.tool_name] || "Ferramenta";
  const toolDescription =
    TOOL_DESCRIPTIONS[result.tool_name] ||
    "Resultado gerado pelas ferramentas equestres do Portal Lusitano.";

  const pageTitle = result.title || `Resultado - ${toolLabel}`;
  const pageDescription = `${pageTitle} — ${toolDescription}`;
  const canonicalUrl = `${siteUrl}/resultado/${result.share_id || result.id}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${pageTitle} | Portal Lusitano`,
      description: pageDescription,
      url: canonicalUrl,
      siteName: "Portal Lusitano",
      locale: "pt_PT",
      type: "article",
      publishedTime: result.created_at,
      images: [
        {
          url: `/resultado/${result.share_id || result.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${pageTitle} - Portal Lusitano`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | Portal Lusitano`,
      description: pageDescription,
      images: [`/resultado/${result.share_id || result.id}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ResultadoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResultData(id);
  const toolLabel = result ? TOOL_LABELS[result.tool_name] || "Resultado" : "Resultado";

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Ferramentas", url: `${siteUrl}/ferramentas` },
          {
            name: toolLabel,
            url: `${siteUrl}/resultado/${id}`,
          },
        ]}
      />
      {children}
    </>
  );
}

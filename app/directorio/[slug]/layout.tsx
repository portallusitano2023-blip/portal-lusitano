import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

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
      };
    }

    const title = `${coudelaria.nome} - Coudelaria | Portal Lusitano`;
    const description =
      coudelaria.descricao?.slice(0, 160) ||
      `${coudelaria.nome}${coudelaria.localizacao ? ` em ${coudelaria.localizacao}` : ""}. Coudelaria de cavalos Lusitanos.`;

    return {
      title,
      description,
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
    };
  }
}

export default function CoudelariaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

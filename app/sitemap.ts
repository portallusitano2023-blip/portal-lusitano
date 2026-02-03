import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Páginas estáticas principais
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/loja`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/jornal`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/directorio`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/mapa`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/marketplace`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/eventos`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/linhagens`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/quiz`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/pro`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/ebook-gratis`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/instagram`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/sobre`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacidade`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/termos`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Buscar coudelarias dinâmicas
  let coudelariasPages: MetadataRoute.Sitemap = [];
  try {
    const { data: coudelarias } = await supabase
      .from("coudelarias")
      .select("slug, updated_at")
      .eq("status", "active");

    if (coudelarias) {
      coudelariasPages = coudelarias.map((c) => ({
        url: `${siteUrl}/directorio/${c.slug}`,
        lastModified: c.updated_at || currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Erro ao buscar coudelarias para sitemap:", error);
  }

  // Buscar eventos dinâmicos
  let eventosPages: MetadataRoute.Sitemap = [];
  try {
    const { data: eventos } = await supabase
      .from("eventos")
      .select("slug, updated_at")
      .eq("status", "active");

    if (eventos) {
      eventosPages = eventos.map((e) => ({
        url: `${siteUrl}/eventos/${e.slug}`,
        lastModified: e.updated_at || currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Erro ao buscar eventos para sitemap:", error);
  }

  // Buscar cavalos à venda
  let cavalosPages: MetadataRoute.Sitemap = [];
  try {
    const { data: cavalos } = await supabase
      .from("cavalos_venda")
      .select("slug, updated_at")
      .eq("status", "active");

    if (cavalos) {
      cavalosPages = cavalos.map((c) => ({
        url: `${siteUrl}/marketplace/${c.slug}`,
        lastModified: c.updated_at || currentDate,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Erro ao buscar cavalos para sitemap:", error);
  }

  // Buscar linhagens
  let linhagensPages: MetadataRoute.Sitemap = [];
  try {
    const { data: linhagens } = await supabase
      .from("linhagens")
      .select("slug, updated_at");

    if (linhagens) {
      linhagensPages = linhagens.map((l) => ({
        url: `${siteUrl}/linhagens/${l.slug}`,
        lastModified: l.updated_at || currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Erro ao buscar linhagens para sitemap:", error);
  }

  // Artigos do jornal (1-6)
  const journalArticles: MetadataRoute.Sitemap = Array.from({ length: 6 }, (_, i) => ({
    url: `${siteUrl}/jornal/${i + 1}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...coudelariasPages,
    ...eventosPages,
    ...cavalosPages,
    ...linhagensPages,
    ...journalArticles,
  ];
}

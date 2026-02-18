import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { fetchArticleSlugs } from "@/lib/sanity-queries";
import { logger } from "@/lib/logger";

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
      url: `${siteUrl}/comprar`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/loja`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/directorio`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/profissionais`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/eventos`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/jornal`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/mapa`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/coudelarias`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/piroplasmose`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/sobre`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/glossario`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/cavalos-famosos`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/linhagens`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/ferramentas`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/calculadora-valor`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/comparador-cavalos`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/verificador-compatibilidade`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/analise-perfil`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/ebook-gratis`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/vender-cavalo`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/publicidade`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/instagram`,
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
    logger.error("Erro ao buscar coudelarias para sitemap:", error);
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
    logger.error("Erro ao buscar eventos para sitemap:", error);
  }

  // Buscar cavalos à venda — usa "aprovado" (consistente com comprar/page.tsx) e id (param da rota)
  let cavalosPages: MetadataRoute.Sitemap = [];
  try {
    const { data: cavalos } = await supabase
      .from("cavalos_venda")
      .select("id, updated_at")
      .eq("status", "aprovado");

    if (cavalos) {
      cavalosPages = cavalos.map((c) => ({
        url: `${siteUrl}/comprar/${c.id}`,
        lastModified: c.updated_at || currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    logger.error("Erro ao buscar cavalos para sitemap:", error);
  }

  // Buscar linhagens
  let linhagensPages: MetadataRoute.Sitemap = [];
  try {
    const { data: linhagens } = await supabase.from("linhagens").select("slug, updated_at");

    if (linhagens) {
      linhagensPages = linhagens.map((l) => ({
        url: `${siteUrl}/linhagens/${l.slug}`,
        lastModified: l.updated_at || currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    logger.error("Erro ao buscar linhagens para sitemap:", error);
  }

  // Artigos do jornal (dinâmico via Sanity)
  let journalArticles: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchArticleSlugs();
    if (slugs && slugs.length > 0) {
      journalArticles = slugs.map((s) => ({
        url: `${siteUrl}/jornal/${s.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    } else {
      // Fallback para slugs estáticos
      const staticSlugs = [
        "genese-cavalo-iberico",
        "biomecanica-reuniao",
        "standard-apsl",
        "genetica-pelagens",
        "toricidade-selecao-combate",
        "novilheiro-rubi-revolucao-olimpica",
      ];
      journalArticles = staticSlugs.map((slug) => ({
        url: `${siteUrl}/jornal/${slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Fallback
    const staticSlugs = [
      "genese-cavalo-iberico",
      "biomecanica-reuniao",
      "standard-apsl",
      "genetica-pelagens",
      "toricidade-selecao-combate",
      "novilheiro-rubi-revolucao-olimpica",
    ];
    journalArticles = staticSlugs.map((slug) => ({
      url: `${siteUrl}/jornal/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  return [
    ...staticPages,
    ...coudelariasPages,
    ...eventosPages,
    ...cavalosPages,
    ...linhagensPages,
    ...journalArticles,
  ];
}

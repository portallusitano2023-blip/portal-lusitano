import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { fetchArticleSlugs } from "@/lib/sanity-queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

/**
 * Gerar alternates hreflang para uma URL do sitemap.
 * Produz links para pt (original), en (/en/...) e es (/es/...).
 */
function getAlternates(url: string) {
  const path = url.replace(siteUrl, "");
  return {
    languages: {
      "pt-PT": url,
      "en-US": `${siteUrl}/en${path === "/" ? "" : path}`,
      "es-ES": `${siteUrl}/es${path === "/" ? "" : path}`,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Páginas estáticas principais (com alternates hreflang para pt, en, es)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
      alternates: getAlternates(siteUrl),
    },
    {
      url: `${siteUrl}/comprar`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: getAlternates(`${siteUrl}/comprar`),
    },
    {
      url: `${siteUrl}/marketplace`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: getAlternates(`${siteUrl}/marketplace`),
    },
    {
      url: `${siteUrl}/loja`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: getAlternates(`${siteUrl}/loja`),
    },
    {
      url: `${siteUrl}/directorio`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: getAlternates(`${siteUrl}/directorio`),
    },
    {
      url: `${siteUrl}/profissionais`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: getAlternates(`${siteUrl}/profissionais`),
    },
    {
      url: `${siteUrl}/eventos`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: getAlternates(`${siteUrl}/eventos`),
    },
    {
      url: `${siteUrl}/jornal`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: getAlternates(`${siteUrl}/jornal`),
    },
    {
      url: `${siteUrl}/mapa`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: getAlternates(`${siteUrl}/mapa`),
    },
    {
      url: `${siteUrl}/coudelarias`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: getAlternates(`${siteUrl}/coudelarias`),
    },
    {
      url: `${siteUrl}/piroplasmose`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: getAlternates(`${siteUrl}/piroplasmose`),
    },
    {
      url: `${siteUrl}/cavalos-famosos`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: getAlternates(`${siteUrl}/cavalos-famosos`),
    },
    {
      url: `${siteUrl}/linhagens`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: getAlternates(`${siteUrl}/linhagens`),
    },
    {
      url: `${siteUrl}/calculadora-valor`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: getAlternates(`${siteUrl}/calculadora-valor`),
    },
    {
      url: `${siteUrl}/comparador-cavalos`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: getAlternates(`${siteUrl}/comparador-cavalos`),
    },
    {
      url: `${siteUrl}/verificador-compatibilidade`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: getAlternates(`${siteUrl}/verificador-compatibilidade`),
    },
    {
      url: `${siteUrl}/analise-perfil`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: getAlternates(`${siteUrl}/analise-perfil`),
    },
    {
      url: `${siteUrl}/ebook-gratis`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: getAlternates(`${siteUrl}/ebook-gratis`),
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: getAlternates(`${siteUrl}/faq`),
    },
    {
      url: `${siteUrl}/vender-cavalo`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: getAlternates(`${siteUrl}/vender-cavalo`),
    },
    {
      url: `${siteUrl}/publicidade`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: getAlternates(`${siteUrl}/publicidade`),
    },
    {
      url: `${siteUrl}/instagram`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: getAlternates(`${siteUrl}/instagram`),
    },
    {
      url: `${siteUrl}/privacidade`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: getAlternates(`${siteUrl}/privacidade`),
    },
    {
      url: `${siteUrl}/termos`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: getAlternates(`${siteUrl}/termos`),
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
        alternates: getAlternates(`${siteUrl}/directorio/${c.slug}`),
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
        alternates: getAlternates(`${siteUrl}/eventos/${e.slug}`),
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
        alternates: getAlternates(`${siteUrl}/marketplace/${c.slug}`),
      }));
    }
  } catch (error) {
    console.error("Erro ao buscar cavalos para sitemap:", error);
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
        alternates: getAlternates(`${siteUrl}/linhagens/${l.slug}`),
      }));
    }
  } catch (error) {
    console.error("Erro ao buscar linhagens para sitemap:", error);
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
        alternates: getAlternates(`${siteUrl}/jornal/${s.slug}`),
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
        alternates: getAlternates(`${siteUrl}/jornal/${slug}`),
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
      alternates: getAlternates(`${siteUrl}/jornal/${slug}`),
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

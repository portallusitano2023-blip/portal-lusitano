import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase-admin";
import { fetchArticleSlugs, fetchCavaloSlugs } from "@/lib/sanity-queries";
import { logger } from "@/lib/logger";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

/** Add hreflang alternates for PT / EN / ES to a sitemap entry */
function withAlternates(
  path: string,
  entry: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap[number] {
  const cleanPath = path === "/" ? "" : path;
  return {
    ...entry,
    url: `${siteUrl}${path}`,
    alternates: {
      languages: {
        "pt-PT": `${siteUrl}${path}`,
        "en-US": `${siteUrl}/en${cleanPath}`,
        "es-ES": `${siteUrl}/es${cleanPath}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Páginas estáticas principais
  const staticPages: MetadataRoute.Sitemap = [
    withAlternates("/", { lastModified: currentDate, changeFrequency: "daily", priority: 1 }),
    withAlternates("/comprar", {
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    }),
    withAlternates("/loja", { lastModified: currentDate, changeFrequency: "daily", priority: 0.9 }),
    withAlternates("/directorio", {
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    }),
    withAlternates("/profissionais", {
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    withAlternates("/eventos", {
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    withAlternates("/jornal", {
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    withAlternates("/mapa", {
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    withAlternates("/piroplasmose", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    withAlternates("/sobre", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
    withAlternates("/glossario", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withAlternates("/cavalos-famosos", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withAlternates("/linhagens", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withAlternates("/ferramentas", {
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    withAlternates("/calculadora-valor", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withAlternates("/comparador-cavalos", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
    withAlternates("/verificador-compatibilidade", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
    withAlternates("/analise-perfil", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
    withAlternates("/ebook-gratis", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withAlternates("/faq", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withAlternates("/vender-cavalo", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withAlternates("/cursos", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withAlternates("/publicidade", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    }),
    withAlternates("/instagram", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    }),
    withAlternates("/precos", {
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withAlternates("/privacidade", {
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
    withAlternates("/termos", {
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
  ];

  // Buscar coudelarias dinâmicas
  let coudelariasPages: MetadataRoute.Sitemap = [];
  try {
    const { data: coudelarias } = await supabase
      .from("coudelarias")
      .select("slug, updated_at")
      .eq("status", "active");

    if (coudelarias) {
      coudelariasPages = coudelarias.map((c) =>
        withAlternates(`/directorio/${c.slug}`, {
          lastModified: c.updated_at || currentDate,
          changeFrequency: "weekly",
          priority: 0.8,
        })
      );
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
      eventosPages = eventos.map((e) =>
        withAlternates(`/eventos/${e.slug}`, {
          lastModified: e.updated_at || currentDate,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      );
    }
  } catch (error) {
    logger.error("Erro ao buscar eventos para sitemap:", error);
  }

  // Buscar cavalos à venda
  let cavalosPages: MetadataRoute.Sitemap = [];
  try {
    const { data: cavalos } = await supabase
      .from("cavalos_venda")
      .select("id, updated_at")
      .eq("status", "active");

    if (cavalos) {
      cavalosPages = cavalos.map((c) =>
        withAlternates(`/comprar/${c.id}`, {
          lastModified: c.updated_at || currentDate,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      );
    }
  } catch (error) {
    logger.error("Erro ao buscar cavalos para sitemap:", error);
  }

  // Buscar linhagens
  let linhagensPages: MetadataRoute.Sitemap = [];
  try {
    const { data: linhagens } = await supabase.from("linhagens").select("slug, updated_at");

    if (linhagens) {
      linhagensPages = linhagens.map((l) =>
        withAlternates(`/linhagens/${l.slug}`, {
          lastModified: l.updated_at || currentDate,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      );
    }
  } catch (error) {
    logger.error("Erro ao buscar linhagens para sitemap:", error);
  }

  // Cavalos (dinâmico via Sanity)
  let cavalosDetailPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchCavaloSlugs();
    if (slugs && slugs.length > 0) {
      cavalosDetailPages = slugs.map((c) =>
        withAlternates(`/cavalo/${c.slug}`, {
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      );
    }
  } catch (error) {
    logger.error("Erro ao buscar cavalos para sitemap:", error);
  }

  // Artigos do jornal (dinâmico via Sanity)
  let journalArticles: MetadataRoute.Sitemap = [];
  const staticSlugs = [
    "genese-cavalo-iberico",
    "biomecanica-reuniao",
    "standard-apsl",
    "genetica-pelagens",
    "toricidade-selecao-combate",
    "novilheiro-rubi-revolucao-olimpica",
  ];
  try {
    const slugs = await fetchArticleSlugs();
    const articleSlugs = slugs && slugs.length > 0 ? slugs.map((s) => s.slug) : staticSlugs;
    journalArticles = articleSlugs.map((slug) =>
      withAlternates(`/jornal/${slug}`, {
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );
  } catch {
    journalArticles = staticSlugs.map((slug) =>
      withAlternates(`/jornal/${slug}`, {
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );
  }

  return [
    ...staticPages,
    ...coudelariasPages,
    ...eventosPages,
    ...cavalosPages,
    ...cavalosDetailPages,
    ...linhagensPages,
    ...journalArticles,
  ];
}

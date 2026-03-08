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

  // Fetch all dynamic data in parallel
  const [
    coudelariasResult,
    eventosResult,
    cavalosResult,
    linhagensResult,
    cavaloSlugsResult,
    articleSlugsResult,
  ] = await Promise.allSettled([
    supabase.from("coudelarias").select("slug, updated_at").eq("status", "active"),
    supabase.from("eventos").select("slug, updated_at").eq("status", "active"),
    supabase.from("cavalos_venda").select("id, updated_at").eq("status", "active"),
    supabase.from("linhagens").select("slug, updated_at"),
    fetchCavaloSlugs(),
    fetchArticleSlugs(),
  ]);

  let coudelariasPages: MetadataRoute.Sitemap = [];
  if (coudelariasResult.status === "fulfilled" && coudelariasResult.value.data) {
    coudelariasPages = coudelariasResult.value.data.map((c) =>
      withAlternates(`/directorio/${c.slug}`, {
        lastModified: c.updated_at || currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    );
  } else if (coudelariasResult.status === "rejected") {
    logger.error("Erro ao buscar coudelarias para sitemap:", coudelariasResult.reason);
  }

  let eventosPages: MetadataRoute.Sitemap = [];
  if (eventosResult.status === "fulfilled" && eventosResult.value.data) {
    eventosPages = eventosResult.value.data.map((e) =>
      withAlternates(`/eventos/${e.slug}`, {
        lastModified: e.updated_at || currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );
  } else if (eventosResult.status === "rejected") {
    logger.error("Erro ao buscar eventos para sitemap:", eventosResult.reason);
  }

  let cavalosPages: MetadataRoute.Sitemap = [];
  if (cavalosResult.status === "fulfilled" && cavalosResult.value.data) {
    cavalosPages = cavalosResult.value.data.map((c) =>
      withAlternates(`/comprar/${c.id}`, {
        lastModified: c.updated_at || currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );
  } else if (cavalosResult.status === "rejected") {
    logger.error("Erro ao buscar cavalos para sitemap:", cavalosResult.reason);
  }

  let linhagensPages: MetadataRoute.Sitemap = [];
  if (linhagensResult.status === "fulfilled" && linhagensResult.value.data) {
    linhagensPages = linhagensResult.value.data.map((l) =>
      withAlternates(`/linhagens/${l.slug}`, {
        lastModified: l.updated_at || currentDate,
        changeFrequency: "monthly",
        priority: 0.6,
      })
    );
  } else if (linhagensResult.status === "rejected") {
    logger.error("Erro ao buscar linhagens para sitemap:", linhagensResult.reason);
  }

  let cavalosDetailPages: MetadataRoute.Sitemap = [];
  if (cavaloSlugsResult.status === "fulfilled" && cavaloSlugsResult.value?.length) {
    cavalosDetailPages = cavaloSlugsResult.value.map((c) =>
      withAlternates(`/cavalo/${c.slug}`, {
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );
  } else if (cavaloSlugsResult.status === "rejected") {
    logger.error("Erro ao buscar cavalos para sitemap:", cavaloSlugsResult.reason);
  }

  // Artigos do jornal (dinâmico via Sanity, com datas reais de publicação)
  let journalArticles: MetadataRoute.Sitemap = [];

  // Datas reais dos artigos locais: mapeamento slug → data ISO
  const localArticleDates: Record<string, string> = {
    "genese-cavalo-iberico":           "2026-01-25T00:00:00.000Z",
    "biomecanica-reuniao":             "2026-01-18T00:00:00.000Z",
    "standard-apsl":                   "2026-01-15T00:00:00.000Z",
    "genetica-pelagens":               "2026-01-12T00:00:00.000Z",
    "toricidade-selecao-combate":      "2026-01-08T00:00:00.000Z",
    "novilheiro-rubi-revolucao-olimpica": "2026-01-02T00:00:00.000Z",
  };
  const staticSlugs = Object.keys(localArticleDates);

  if (articleSlugsResult.status === "fulfilled" && articleSlugsResult.value?.length) {
    journalArticles = articleSlugsResult.value.map((s) =>
      withAlternates(`/jornal/${s.slug}`, {
        lastModified: s.publishedAt || localArticleDates[s.slug] || currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );
  } else {
    journalArticles = staticSlugs.map((slug) =>
      withAlternates(`/jornal/${slug}`, {
        lastModified: localArticleDates[slug],
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

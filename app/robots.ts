import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portallusitano.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/minha-conta/",
          "/login",
          "/registar",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

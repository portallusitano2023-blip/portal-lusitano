import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone para Docker
  output: "standalone",

  // Nota: optimizePackageImports removido - Turbopack (Next 16) faz tree-shaking automaticamente
  // e a opção causava erros HMR com lucide-react
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  // Redirects para URLs antigos (blog -> jornal, IDs numéricos -> slugs)
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/jornal",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/jornal/:slug",
        permanent: true,
      },
      {
        source: "/jornal/1",
        destination: "/jornal/genese-cavalo-iberico",
        permanent: true,
      },
      {
        source: "/jornal/2",
        destination: "/jornal/biomecanica-reuniao",
        permanent: true,
      },
      {
        source: "/jornal/3",
        destination: "/jornal/standard-apsl",
        permanent: true,
      },
      {
        source: "/jornal/4",
        destination: "/jornal/genetica-pelagens",
        permanent: true,
      },
      {
        source: "/jornal/5",
        destination: "/jornal/toricidade-selecao-combate",
        permanent: true,
      },
      {
        source: "/jornal/6",
        destination: "/jornal/novilheiro-rubi-revolucao-olimpica",
        permanent: true,
      },
    ];
  },

  // Security + Performance Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // CSP é agora gerido no middleware.ts com nonces por request
          // (eliminando a necessidade de 'unsafe-inline' para scripts)
        ],
      },
      // Cache static assets for 1 year
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache fonts for 1 year
      {
        source: "/:path*.woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

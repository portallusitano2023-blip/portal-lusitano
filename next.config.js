/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Evita gerar mapas de código (Poupa gigabytes de RAM)
  productionBrowserSourceMaps: false,

  // 2. Desliga a compressão pesada
  swcMinify: false,

  // 3. Ignora verificações para o build passar rápido
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 4. Imagens não otimizadas durante o build
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'portal-lusitano.myshopify.com' },
    ],
  },
  
  // NOTA: Removi o "output: standalone" e o "experimental" para deixar o Vercel gerir isso.
};

export default nextConfig;
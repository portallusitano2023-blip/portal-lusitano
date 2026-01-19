/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Desliga a verificação de Typescript e ESLint no Build (poupa memória e tempo)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 2. Não gerar mapas de código (poupa MUITA memória)
  productionBrowserSourceMaps: false,
  
  // 3. As tuas imagens (mantém isto)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },
};

export default nextConfig;
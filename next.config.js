/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. A IMAGEM É A CULPADA: Isto desliga o processamento de imagem no servidor
  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },

  // 2. DESLIGAR VERIFICAÇÕES
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // 3. POUPAR MEMÓRIA NO BUILD (CRÍTICO)
  swcMinify: false, // Desliga a compressão pesada
  productionBrowserSourceMaps: false, // Não gera mapas
  reactStrictMode: false,
};

export default nextConfig;
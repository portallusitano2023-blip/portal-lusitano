/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. DESLIGA OTIMIZAÇÃO DE IMAGENS (O GRANDE CULPADO)
  images: {
    unoptimized: true, // Isto desativa o processamento pesado de imagens
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },

  // 2. DESLIGA VERIFICAÇÕES
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  // 3. DESLIGA COMPRESSÃO E MAPAS
  swcMinify: false,
  productionBrowserSourceMaps: false,
  
  // 4. FORÇA O MODO DINÂMICO (Impede geração estática pesada)
  staticPageGenerationTimeout: 1000,
};

export default nextConfig;
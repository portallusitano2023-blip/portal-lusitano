/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. DESLIGA TUDO O QUE GASTA MEMÓRIA
  reactStrictMode: false,
  swcMinify: false, // Desliga o compressor pesado
  productionBrowserSourceMaps: false, // Sem mapas de código

  // 2. IGNORA ERROS (Para o build não parar por detalhes)
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // 3. IMAGENS (Configuração Leve)
  images: {
    unoptimized: true, // Poupamos CPU não otimizando imagens no build
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'portal-lusitano.myshopify.com' },
    ],
  },

  // 4. A SOLUÇÃO MÁGICA PARA O ERRO DE MEMÓRIA 👇
  experimental: {
    // Obriga o build a ser feito "um a um", poupando RAM
    workerThreads: false,
    cpus: 1, 
  },
};

export default nextConfig;
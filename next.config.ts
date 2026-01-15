const nextConfig = {
  // Ignorar erros na construção
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // === LISTA VIP DE IMAGENS ===
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Imagens dos Cavalos
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com', // Imagens da Loja de Roupa
      }
    ],
  },
};

export default nextConfig;
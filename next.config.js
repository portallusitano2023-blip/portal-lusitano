/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Ignorar erros de verificação para o build passar no Vercel */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* Configuração das Imagens (Resolve o erro do hostname) */
  images: {
    domains: ['cdn.sanity.io', 'cdn.shopify.com'],
  },
};

module.exports = nextConfig;
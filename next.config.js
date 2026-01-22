/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com', // <--- AQUI ESTÁ A CHAVE DE ACESSO DO SHOPIFY
      },
    ],
  },
};

export default nextConfig;
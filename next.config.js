module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['cdn.sanity.io', 'cdn.shopify.com'],
  },
  // Esta linha força o Next.js a ignorar verificações de tipos no build
  swcMinify: true,
};
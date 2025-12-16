/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignora erros de tipagem do TypeScript durante o build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora erros de verificação de estilo (linting) durante o build
    ignoreDuringBuilds: true,
  },
  images: {
    // Permite carregar imagens de qualquer lugar (útil para uploads)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig

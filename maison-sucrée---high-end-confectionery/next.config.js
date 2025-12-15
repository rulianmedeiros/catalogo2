/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // Needed if serving local images in some docker setups without a dedicated image server
  },
  // Ensure we can serve files from the public folder even in standalone mode
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
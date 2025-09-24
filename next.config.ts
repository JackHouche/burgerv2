import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration simple pour Cloudflare Pages
  images: {
    unoptimized: true,
  },
  // Optimisations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configuration spécifique pour éviter les erreurs de build
  experimental: {
    esmExternals: false,
  },
};

export default nextConfig;

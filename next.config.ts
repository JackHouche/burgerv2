import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour Cloudflare Pages avec Functions (pas d'export statique)
  images: {
    unoptimized: true,
  },
  // Correction de l'API dépréciée
  serverExternalPackages: [],
  // Optimisations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

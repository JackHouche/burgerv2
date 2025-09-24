import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour Cloudflare Pages
  output: "export",
  distDir: "out",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Désactiver les features qui ne sont pas compatibles avec l'export statique
    serverComponentsExternalPackages: [],
  },
  // Optimisations pour l'export statique
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

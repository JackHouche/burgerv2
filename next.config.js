const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ["pub-e60d9d89a38b4236976356ca78e829f8.r2.dev"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    CLOUDFLARE_R2_PUBLIC_URL: process.env.CLOUDFLARE_R2_PUBLIC_URL,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "."),
    };
    // Disable cache only in CI/build environment to reduce file sizes
    if (process.env.CF_PAGES || process.env.NODE_ENV === "production") {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;

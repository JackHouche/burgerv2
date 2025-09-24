/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ["a0b3070808c7aac473ac5473f966ebd7.r2.cloudflarestorage.com"],
  },
  env: {
    CLOUDFLARE_R2_PUBLIC_URL: process.env.CLOUDFLARE_R2_PUBLIC_URL,
  },
  webpack: (config, { isServer }) => {
    // Disable cache only for Cloudflare Pages build to avoid 25MB limit
    if (process.env.CF_PAGES === "1" || process.env.CI) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;

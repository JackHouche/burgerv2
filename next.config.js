/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ["pub-e60d9d89a38b4236976356ca78e829f8.r2.dev"],
  },
  env: {
    CLOUDFLARE_R2_PUBLIC_URL: process.env.CLOUDFLARE_R2_PUBLIC_URL,
  },
};

module.exports = nextConfig;

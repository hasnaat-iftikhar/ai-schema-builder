/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode temporarily
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['img.clerk.com'],
    unoptimized: true,
  },
  // Add more detailed error logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Disable server components temporarily to isolate issues
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;

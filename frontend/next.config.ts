import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // Enable Turbopack in development
  experimental: {
    serverActions: true,
  },
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure webpack to handle path aliases
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, './src'),
      };
    }
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Disable ESLint during the build process
  },
  /* other config options can go here */
};

export default nextConfig;

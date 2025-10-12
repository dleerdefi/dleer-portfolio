import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  // This creates a minimal production server with only required dependencies
  output: 'standalone',
};

export default nextConfig;

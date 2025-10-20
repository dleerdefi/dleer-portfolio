import type { NextConfig } from "next";
import { withContentCollections } from '@content-collections/next';
import path from 'path';

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  // This creates a minimal production server with only required dependencies
  output: 'standalone',

  // Explicitly set the project root to avoid workspace detection issues
  // This ensures consistent standalone output structure
  outputFileTracingRoot: path.join(__dirname),

  // Configure remote image patterns for next/image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Cloudflare R2 CDN for portfolio images
      {
        protocol: 'https',
        hostname: 'cdn.dleer.ai',
        pathname: '/**',
      },
    ],
    // Configure quality values for Next.js 16 compatibility
    qualities: [70, 85, 90, 100],
  },
};

// withContentCollections must be the last plugin in the chain
export default withContentCollections(nextConfig);

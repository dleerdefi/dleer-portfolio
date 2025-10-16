import type { NextConfig } from "next";
import { withContentCollections } from '@content-collections/next';

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  // This creates a minimal production server with only required dependencies
  output: 'standalone',

  // Configure remote image patterns for next/image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Add your CDN domain here when ready (e.g., R2/S3)
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.yourdomain.com',
      //   pathname: '/**',
      // },
    ],
  },
};

// withContentCollections must be the last plugin in the chain
export default withContentCollections(nextConfig);

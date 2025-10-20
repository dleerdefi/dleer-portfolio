import type { NextConfig } from "next";
import { withContentCollections } from '@content-collections/next';

const nextConfig: NextConfig = {
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

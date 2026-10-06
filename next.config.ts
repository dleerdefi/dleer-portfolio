import type { NextConfig } from "next";
import { withContentCollections } from '@content-collections/next';

// Bundle analyzer (run with ANALYZE=true npm run build)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
    // Keep optimized images cached for 4 hours (the Next.js 16 default) instead
    // of 60s, so sharp isn't re-run in the background on nearly every visit
    minimumCacheTTL: 14400,
  },
};

// Chain plugins: bundleAnalyzer → contentCollections (order matters)
export default withContentCollections(withBundleAnalyzer(nextConfig));

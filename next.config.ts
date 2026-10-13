import type { NextConfig } from "next";
import { withContentCollections } from '@content-collections/next';
import bundleAnalyzer from '@next/bundle-analyzer';

// Bundle analyzer (run with ANALYZE=true npm run build)
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Security headers (docs/PORTFOLIO_V2_SPEC.md, finding C14). The CSP starts report-only: browsers
// log violations to the console without blocking anything; enforce it once a week of real traffic
// shows none (spec Q8). 'unsafe-inline' is needed by Next's inline runtime and the site's inline
// styles until nonces are wired. Production only, so dev tooling (HMR, eval source maps) is untouched.
const cdnOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_CDN_URL ? new URL(process.env.NEXT_PUBLIC_CDN_URL).origin : '';
  } catch {
    return '';
  }
})();

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${cdnOrigin}`.trim(),
  `media-src 'self' ${cdnOrigin}`.trim(),
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy }]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
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
    // Widths next/image may serve (docs/PORTFOLIO_V2_SPEC.md, phase 1). Phones get 390/640/828,
    // 480 fits the 400 px profile photo, and nothing is served wider than 1920. AVIF is left off:
    // its encode cost lands on the Railway instance whose RAM sharp already dominates
    // (docs/RAILWAY_MEMORY_OPTIMIZATION.md), for a few KB on the few images still optimized.
    deviceSizes: [390, 640, 828, 1080, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 480],
    // Keep optimized images cached for 4 hours (the Next.js 16 default) instead
    // of 60s, so sharp isn't re-run in the background on nearly every visit
    minimumCacheTTL: 14400,
  },
  // The threat map's flag is always defined at build time ('false' when unset), so the build
  // inlines it and drops the threats branches from the home bundle (docs/lab/LAB_UI_SPEC.md §3)
  env: {
    NEXT_PUBLIC_FEATURE_LAB_THREATS: process.env.NEXT_PUBLIC_FEATURE_LAB_THREATS === 'true' ? 'true' : 'false',
  },
  // ~/lab (docs/lab): only when the flag is on at build time, an empty list otherwise
  async redirects() {
    if (process.env.NEXT_PUBLIC_FEATURE_LAB !== 'true') return [];
    return [{ source: '/lab/telemetry', destination: '/lab', permanent: true }];
  },
};

// Chain plugins: bundleAnalyzer → contentCollections (order matters)
export default withContentCollections(withBundleAnalyzer(nextConfig));

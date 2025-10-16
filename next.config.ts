import type { NextConfig } from "next";
import { withContentCollections } from '@content-collections/next';

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  // This creates a minimal production server with only required dependencies
  output: 'standalone',
};

// withContentCollections must be the last plugin in the chain
export default withContentCollections(nextConfig);

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The "legacy" pages deliberately use raw <img> tags and unoptimised assets so
  // ImpactTrace has something worth complaining about.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

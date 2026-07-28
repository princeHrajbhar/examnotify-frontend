// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Legacy course URLs (/course/<category>/<course>) from before the
        // route flattening; excludes /course/category/*, which is a real route.
        source: "/course/:category((?!category/)[^/]+)/:slug",
        destination: "/course/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    // Use a custom loader so <Image> serves directly from the CDN
    // (e.g. https://sn.shikshanation.com/skillo/x.webp?w=256&q=75) instead of
    // proxying through Next's /_next/image optimizer. A custom loader bypasses
    // the optimizer entirely, so `remotePatterns` are not needed.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
};

export default nextConfig;

import type { NextConfig } from "next";

/** Proxy API to Django when `NEXT_PUBLIC_API_BASE_URL` is unset (see `app/lib/api.ts`). */
const BACKEND_ORIGIN = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
const CDN_ORIGIN = (process.env.NEXT_PUBLIC_CDN_URL ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  assetPrefix: CDN_ORIGIN || undefined,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "skillvedika.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "www.skillvedika.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "api.skillvedika.com",
        pathname: "/media/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async rewrites() {
    const backend = BACKEND_ORIGIN.replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${backend}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;

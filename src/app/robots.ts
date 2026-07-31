import type { MetadataRoute } from "next";
import { CANONICAL_SITE_URL } from "@/app/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/static/"],
      },
    ],
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
    host: CANONICAL_SITE_URL.replace(/^https?:\/\//, ""),
  };
}

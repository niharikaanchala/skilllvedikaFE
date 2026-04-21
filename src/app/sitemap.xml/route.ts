import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  fetchBlogs,
  fetchCategories,
  fetchCourses,
  type BlogPostApi,
  type CategoryApi,
  type CourseApi,
} from "@/app/lib/api";

// Ensure this route is always generated dynamically (not cached).
export const dynamic = "force-dynamic";
export const revalidate = 0;

const TODAY_YYYY_MM_DD = new Date().toISOString().slice(0, 10);

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(origin: string, path: string): string {
  const cleanOrigin = origin.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanOrigin}${cleanPath}`;
}

function resolveOrigin(request: NextRequest): string {
  const isLocalHostName = (host: string): boolean => {
    const normalized = host.toLowerCase().split(":")[0];
    return normalized === "localhost" || normalized === "127.0.0.1" || normalized === "::1";
  };

  const envSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim();
  if (envSiteUrl) return envSiteUrl.replace(/\/$/, "");

  const forwardedHost = request.headers.get("x-forwarded-host")?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.trim() || "https";
  if (forwardedHost && !isLocalHostName(forwardedHost)) {
    return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, "");
  }

  const requestOrigin = (request.nextUrl.origin || "").trim().replace(/\/$/, "");
  const requestHost = request.nextUrl.hostname?.toLowerCase() || "";
  const isLocalHost = isLocalHostName(requestHost);

  if (requestOrigin && !isLocalHost) return requestOrigin;
  return "https://skillvedika.com";
}

async function safeFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const origin = resolveOrigin(request);

  const staticPaths = [
    "/",
    "/about",
    "/contact",
    "/instructor",
    "/courses",
    "/blog",
    "/corporate-training",
    "/career-services",
    "/on-job-support",
  ];

  const urls = new Map<string, true>();

  for (const p of staticPaths) {
    urls.set(absoluteUrl(origin, p), true);
  }

  // Pull dynamic URLs from the backend so newly added DB rows show automatically.
  const [categories, courses, blogs] = await Promise.all([
    safeFetch<CategoryApi[]>(() => fetchCategories()),
    safeFetch<CourseApi[]>(() => fetchCourses()),
    safeFetch<BlogPostApi[]>(() => fetchBlogs()),
  ]);

  if (Array.isArray(categories) && categories.length) {
    for (const c of categories) {
      const slug = (c.slug ?? "").trim();
      if (!slug) continue;
      urls.set(absoluteUrl(origin, `/courses/${slug}`), true);
    }
  }

  if (Array.isArray(courses) && courses.length) {
    for (const course of courses) {
      const slug = (course.slug ?? "").trim();
      if (!slug) continue;
      urls.set(absoluteUrl(origin, `/course/${slug}`), true);
    }
  }

  if (Array.isArray(blogs) && blogs.length) {
    for (const b of blogs) {
      const slug = (b.slug ?? "").trim();
      if (!slug) continue;
      urls.set(absoluteUrl(origin, `/blog/${slug}`), true);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls.keys())
  .map((loc) => {
    return [
      "  <url>",
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${TODAY_YYYY_MM_DD}</lastmod>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}


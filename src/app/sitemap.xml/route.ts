import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  apiUrl,
  type BlogPostApi,
  type CategoryApi,
  type CourseApi,
} from "@/app/lib/api";
import { absoluteSiteUrl, resolveSiteOrigin } from "@/app/lib/site-url";

// Always generate at request time so newly added DB rows appear immediately.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 100; // backend MAX_PAGE_SIZE
const MAX_PAGES = 100;

type SitemapEntry = {
  loc: string;
  lastmod: string;
};

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toLastmod(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }
  return new Date().toISOString().slice(0, 10);
}

function categorySlugFromCourse(course: CourseApi): string {
  const direct = (course.category_slug ?? "").trim();
  if (direct) return direct;
  if (course.category && typeof course.category === "object") {
    return String((course.category as CategoryApi).slug ?? "").trim();
  }
  return "";
}

/**
 * Fetch every item from a list endpoint.
 * Uses no-store and walks paginated pages so newly added rows are never missed.
 */
function itemKey(item: unknown, index: number): string {
  if (item && typeof item === "object") {
    const row = item as { id?: unknown; slug?: unknown };
    if (row.id != null) return `id:${String(row.id)}`;
    if (typeof row.slug === "string" && row.slug.trim()) {
      return `slug:${row.slug.trim()}`;
    }
  }
  return `idx:${index}`;
}

async function fetchAllListItems<T>(apiPath: string): Promise<T[]> {
  const base = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  const collected: T[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const separator = base.includes("?") ? "&" : "?";
    const url = apiUrl(
      `${base}${separator}page=${page}&page_size=${PAGE_SIZE}`,
    );

    let data: unknown;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) break;
      data = await res.json();
    } catch {
      break;
    }

    let batch: T[] = [];
    let totalPages = 1;

    if (Array.isArray(data)) {
      batch = data as T[];
      totalPages = 1;
    } else if (data && typeof data === "object") {
      const envelope = data as {
        results?: T[];
        total_pages?: number;
        next?: string | null;
      };
      batch = Array.isArray(envelope.results) ? envelope.results : [];
      totalPages = Math.max(1, Number(envelope.total_pages) || 1);
      if (!envelope.total_pages && envelope.next) {
        totalPages = page + 1;
      }
    }

    if (!batch.length) break;

    for (let i = 0; i < batch.length; i += 1) {
      const item = batch[i];
      const key = itemKey(item, collected.length + i);
      if (seen.has(key)) continue;
      seen.add(key);
      collected.push(item);
    }

    if (page >= totalPages) break;
  }

  // Fallback: unpaginated full list if paginated fetch returned nothing.
  if (!collected.length) {
    try {
      const res = await fetch(apiUrl(base), { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      if (Array.isArray(data)) return data as T[];
      if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as { results?: T[] }).results)
      ) {
        return (data as { results: T[] }).results;
      }
    } catch {
      return [];
    }
  }

  return collected;
}

export async function GET(request: NextRequest) {
  const origin = resolveSiteOrigin(request);
  const today = toLastmod(undefined);

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
    "/privacy",
    "/terms",
    "/disclaimer",
    "/editorial-policy",
  ];

  const entries = new Map<string, SitemapEntry>();

  const add = (path: string, lastmod = today) => {
    const loc = absoluteSiteUrl(path, origin);
    const existing = entries.get(loc);
    if (!existing || lastmod > existing.lastmod) {
      entries.set(loc, { loc, lastmod });
    }
  };

  for (const path of staticPaths) {
    add(path);
  }

  const [categories, courses, blogs] = await Promise.all([
    fetchAllListItems<CategoryApi>("/api/categories/"),
    fetchAllListItems<CourseApi>("/api/courses/"),
    fetchAllListItems<BlogPostApi>("/api/blog/"),
  ]);

  for (const category of categories) {
    const slug = (category.slug ?? "").trim();
    if (!slug) continue;
    add(`/courses/${slug}`);
  }

  for (const course of courses) {
    const slug = (course.slug ?? "").trim();
    if (!slug) continue;

    // Canonical short URL used across the site.
    add(`/course/${slug}`);

    // Nested category URL used on category listing pages.
    const categorySlug = categorySlugFromCourse(course);
    if (categorySlug) {
      add(`/courses/${categorySlug}/${slug}`);
    }
  }

  for (const blog of blogs) {
    const slug = (blog.slug ?? "").trim();
    if (!slug) continue;
    add(`/blog/${slug}`, toLastmod(blog.date));
  }

  const sorted = Array.from(entries.values()).sort((a, b) =>
    a.loc.localeCompare(b.loc),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sorted
  .map((entry) =>
    [
      "  <url>",
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      `    <lastmod>${entry.lastmod}</lastmod>`,
      "  </url>",
    ].join("\n"),
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0, must-revalidate",
    },
  });
}

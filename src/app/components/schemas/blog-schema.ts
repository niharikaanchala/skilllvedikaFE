import type { BlogPostApi } from "@/app/lib/api";

const SITE_URL = "https://skillvedika.com";

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim();
}

function toAbsoluteUrl(pathOrUrl: string | undefined): string | undefined {
  const value = normalizeText(pathOrUrl);
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function blogCore(post: BlogPostApi, url: string) {
  const title = normalizeText(post.title) || "Blog post";
  const excerpt = normalizeText(post.excerpt) || "Read this blog post on SkillVedika.";
  const category = normalizeText(post.category);
  const author = normalizeText(post.author) || "SkillVedika";
  const imageUrl = toAbsoluteUrl(post.image_url);
  const keywords = category ? [category, "SkillVedika"] : ["SkillVedika"];

  return {
    "@type": "BlogPosting",
    mainEntityOfPage: url,
    headline: title,
    description: excerpt,
    url,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "SkillVedika",
      url: SITE_URL,
    },
    ...(normalizeText(post.date) ? { datePublished: normalizeText(post.date) } : {}),
    ...(normalizeText(post.date) ? { dateModified: normalizeText(post.date) } : {}),
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(keywords.length ? { keywords } : {}),
  };
}

export function buildBlogListSchema(posts: BlogPostApi[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SkillVedika Blog",
    url: `${SITE_URL}/blog`,
    blogPost: posts.map((post) => {
      const url = toAbsoluteUrl(`/blog/${post.slug}`) || `${SITE_URL}/blog`;
      return blogCore(post, url);
    }),
  };
}

export function buildBlogDetailSchema(post: BlogPostApi) {
  const url = toAbsoluteUrl(`/blog/${post.slug}`) || `${SITE_URL}/blog`;
  return {
    "@context": "https://schema.org",
    ...blogCore(post, url),
  };
}

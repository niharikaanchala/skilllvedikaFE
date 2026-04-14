import Link from "next/link";
import BlogFilter from "../components/BlogFilter";
import { apiUrl, fetchBlogs } from "@/app/lib/api";
import { blogArticleMeta } from "@/app/lib/blog-utils";
import { buildBlogListSchema } from "@/app/components/schemas/blog-schema";
import { buildBreadcrumbSchema } from "@/app/components/schemas/breadcrumb-schema";
import { Home } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await fetch(apiUrl("/api/blog/meta-tags/"), { cache: "no-store" });
  const data = await meta.json().catch(() => ({}));
  const metaData = data || {};
  return {
    title: metaData.meta_title || "Blog | SkillVedika",
    description: metaData.meta_description || "Blog | SkillVedika",
    keywords: metaData.meta_keywords ? metaData.meta_keywords.split(",") : [],
    alternates: {
      canonical: "https://skillvedika.com/blog",
    },
    openGraph: {
      title: metaData.meta_title || "Blog | SkillVedika",
      description: metaData.meta_description || "Blog | SkillVedika",
      url: "https://skillvedika.com/blog",
      siteName: "SkillVedika",
      type: "website",
      images: metaData.image ? [metaData.image.trim()] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metaData.meta_title || "Blog | SkillVedika",
      description: metaData.meta_description || "Blog | SkillVedika",
      images: metaData.image ? [metaData.image.trim()] : undefined,
    },
  };

}

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof fetchBlogs>> = [];
  try {
    posts = await fetchBlogs();
  } catch {
    posts = [];
  }

  const featuredArticles = posts.slice(0, 2);
  const allArticles = posts.map((p) => ({
    slug: p.slug,
    category: p.category,
    title: p.title,
    summary: p.excerpt,
    meta: blogArticleMeta(p),
  }));
  const blogListSchema = buildBlogListSchema(posts);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/<\/script/gi, "<\\/script"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogListSchema).replace(/<\/script/gi, "<\\/script"),
        }}
      />
      <main className="bg-[#F4F7FB] text-[#0C1A35] pt-16">
      {/* Breadcrumb */}
      <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
        <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center gap-2">
          {/* Home icon */}
          <Home className="w-4 h-4 text-slate-500 mr-1" />
          <Link href="/" className="hover:text-[#0066FF] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-[#001f3f]">Blog</span>
        </div>
      </section>
      <section className="px-6 md:px-12 py-16 bg-[#EAF0F6]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold">Insights, Guides & Career Resources</h1>
          <p className="mt-4 text-[#0C1A35]/70 max-w-2xl">
            Learn latest tech skills and career growth strategies.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0C1A35]">Featured Articles</h2>
            {/* <Link href="/blog" className="text-sm text-[#2C6ED5] font-medium hover:underline">
              View All →
            </Link> */}
          </div>

          {featuredArticles.length === 0 ? (
            <p className="mt-6 text-[#0C1A35]/70 text-sm">No featured articles yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group rounded-2xl overflow-hidden text-white bg-gradient-to-r from-[#2C6ED5] to-[#14B8A6] shadow-lg transition hover:scale-[1.02]"
                >
                  {article.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-44 w-full object-cover"
                    />
                  ) : null}
                  <div className="p-6">
                  <span className="inline-block bg-white/20 px-3 py-1 text-xs rounded-full">
                    {article.category}
                  </span>
                  <h3 className="mt-4 text-xl font-bold leading-snug group-hover:underline">{article.title}</h3>
                  <p className="mt-3 text-white/90 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                  <div className="mt-5 text-xs text-white/80">{blogArticleMeta(article)}</div>
                  <div className="mt-4 text-sm font-medium">Read Article →</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 py-10">
        <div className="max-w-6xl mx-auto">
          <BlogFilter articles={allArticles} />
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-[#eaf0f7] px-6 py-16 text-center md:px-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1a2d49] md:text-5xl">
            Want to Learn More?
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-xl leading-relaxed text-slate-600">
            Explore our courses and start building the skills top employers demand.
          </p>
          <Link
            href="/courses"
            className="mt-10 inline-flex items-center justify-center rounded-xl bg-[#2f5fa8] px-10 py-4 text-2xl font-bold text-white transition hover:bg-[#264f8d]"
          >
            Explore Courses
          </Link>
        </div>
      </section>
      </main>
    </>
  );
}

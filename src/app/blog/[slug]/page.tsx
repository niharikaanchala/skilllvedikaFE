import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogs } from "@/app/lib/api";
import { blogArticleMeta, formatBlogDate } from "@/app/lib/blog-utils";
import { enforceHeadingSizesInHtml, enforcePoppinsHtml, linkifyPlainUrlsInHtml } from "@/app/lib/html";
import { buildBlogDetailSchema } from "@/app/components/schemas/blog-schema";
import { buildBreadcrumbSchema } from "@/app/components/schemas/breadcrumb-schema";
import { Home } from "lucide-react";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blogs = await fetchBlogs().catch(() => []);
  const post = blogs.find((b) => b.slug === slug);

  if (!post) {
    return {
      title: "Blog | Skill Vedika",
      description: "Explore expert articles on career growth, skills, and learning.",
    };
  }

  return {
    title: `${post.title} | Skill Vedika`,
    description: post.excerpt || "Read this blog on Skill Vedika.",

    keywords: [
      post.category,
      "Skill Vedika",
      "online learning",
      "career growth",
      "tech blogs",
    ],

    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://skillvedika.com/blog/${post.slug}`,
      siteName: "Skill Vedika",
      images: [
        {
          url: post.image_url || "/default-blog.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image_url || "/default-blog.jpg"],
    },

    alternates: {
      canonical: `https://skillvedika.com/blog/${post.slug}`,
    },
  };
}

function tocId(title: string, index: number) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `toc-${slug}` : `toc-item-${index + 1}`;
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function injectH2IdsAndBuildToc(
  html: string,
  seenIds: Map<string, number>,
  toc: { title: string; id: string }[],
) {
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attrs: string, inner: string) => {
    const title = stripHtml(inner);
    if (!title) return _match;

    const base = tocId(title, toc.length);
    const used = seenIds.get(base) ?? 0;
    const id = used === 0 ? base : `${base}-${used + 1}`;
    seenIds.set(base, used + 1);
    toc.push({ title, id });

    if (/\sid\s*=/.test(attrs)) {
      return `<h2${attrs}>${inner}</h2>`;
    }
    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const allBlogs = await fetchBlogs().catch(() => [] as Awaited<ReturnType<typeof fetchBlogs>>);
  

  const post = allBlogs.find((b) => b.slug === slug);
  if (!post) notFound();
  const blogDetailSchema = buildBlogDetailSchema(post);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);
  // const recommended = allBlogs
  // .filter(
  //   (b) =>
  //     b.slug !== slug &&
  //     b.category?.toLowerCase() === post.category?.toLowerCase()
  // )
  // .slice(0, 4);
  const recommended = allBlogs.filter(
    (b) =>
      b.slug !== slug &&
      b.category?.toLowerCase() === post.category?.toLowerCase()
  );

  const paragraphs = post.paragraphs?.map((p) => p.content) ?? [];
  const tocSections: { title: string; id: string }[] = [];
  const seenIds = new Map<string, number>();
  const renderedParagraphs = paragraphs.map((paragraph) =>
    injectH2IdsAndBuildToc(paragraph, seenIds, tocSections),
  );
  const htmlContent = enforcePoppinsHtml(
    enforceHeadingSizesInHtml(linkifyPlainUrlsInHtml(renderedParagraphs.join(""))),
  );

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
          __html: JSON.stringify(blogDetailSchema).replace(/<\/script/gi, "<\\/script"),
        }}
      />
      <main className="bg-[#f4f8fc] pt-16 text-[#0f172a]">
      {/* Breadcrumb */}
      <section className="border-b border-slate-200/70 bg-white/70 px-6 py-4 md:px-12">
        <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center gap-2">
          {/* Home icon */}
          <Home className="w-4 h-4 text-slate-500 mr-1" />
          <Link href="/" className="transition-colors hover:text-[#2f5fa8]">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/blog" className="transition-colors hover:text-[#2f5fa8]">
            Blog
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-[#1a2d49]">{post.title}</span>
        </div>
      </section>

      <section className="px-6 py-10 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[minmax(0,1fr)_260px] lg:grid-cols-[minmax(0,1fr)_280px]">
          <article>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2f5fa8]">{post.category}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#1a2d49] md:text-5xl">{post.title}</h1>
            <p className="mt-3 text-sm text-slate-500">
              {post.author} · {formatBlogDate(post.date)} · {post.read_time}
            </p>

            {post.image_url ? (
              <div className="mt-6 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image_url}
                  alt={post.title}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={1200}
                  height={630}
                  className="block h-auto w-full max-w-4xl rounded-lg object-cover"
                />
              </div>
            ) : null}

            <p className="mt-8 text-lg leading-relaxed text-slate-700">{post.excerpt}</p>

            <div
              className="blog-editor-content mt-8 prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* {relatedCourses.length > 0 && (
              <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-[#1a2d49]">Related Courses</div>
                {relatedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between border-b border-slate-100 px-5 py-3 last:border-b-0"
                  >
                    <span className="text-sm text-slate-700">{course.title}</span>
                    <span className="text-sm font-semibold text-[#2f5fa8]">{course.price}</span>
                  </div>
                ))}
              </div>
            )} */}
          </article>

          <aside className="hidden md:block">
            <div className="sticky top-24 border-l border-slate-200 pl-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Related Blogs
              </h3>

              <div className="mt-4 space-y-4">
                {recommended.length === 0 ? (
                  <p className="text-sm text-slate-500">No related blogs in this category.</p>
                ) : (
                  recommended.slice(0, 4).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/blog/${item.slug}`}
                      className="group block rounded-lg border border-slate-200 bg-white p-3 transition-all duration-300 hover:bg-[#F0F7FF] hover:shadow-md"
                    >
                      {item.image_url ? (
                        <div className="mb-2 flex h-20 w-full items-center justify-center rounded-md bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image_url}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            width={320}
                            height={80}
                            className="h-full w-full rounded-md object-cover"
                          />
                        </div>
                      ) : null}

                      <p className="text-[11px] font-semibold text-[#2f5fa8] group-hover:text-[#1d4ed8] transition-colors">
                        {item.category}
                      </p>

                      <p className="mt-1 text-sm font-medium leading-snug text-slate-800 group-hover:text-[#1d4ed8] transition-colors">
                        {item.title}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* <section className="px-6 py-12 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-[#1a2d49]">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-3">
            <details className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <summary className="font-medium cursor-pointer">How long does it take to become a full-stack developer?</summary>
              <p className="mt-2 text-sm text-slate-600">Most learners take 6-12 months with structured practice and projects.</p>
            </details>
            <details className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <summary className="font-medium cursor-pointer">Do I need a CS degree?</summary>
              <p className="mt-2 text-sm text-slate-600">No. A strong portfolio, fundamentals, and interview prep are more important.</p>
            </details>
            <details className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <summary className="font-medium cursor-pointer">What is the best way to start?</summary>
              <p className="mt-2 text-sm text-slate-600">Begin with basics, then build projects consistently and seek mentor feedback.</p>
            </details>
          </div>
        </div>
      </section> */}

      <section className="border-y border-slate-200/70 bg-[#eaf0f7] px-6 py-14 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[#1a2d49]">Ready to Start Learning?</h2>
          <p className="mt-3 text-slate-600">Explore our expert-led courses and transform your career today.</p>
          <Link
            href="/courses"
            className="mt-6 inline-block rounded-md bg-[#2f5fa8] px-6 py-2.5 font-semibold text-white transition hover:bg-[#264f8d]"
          >
            Browse Courses
          </Link>
        </div>
      </section>

      {/* <section className="px-6 py-12 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#1a2d49]">Recommended Articles</h2>
          {recommended.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Explore more articles on the blog listing.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {recommended.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="rounded-lg border border-slate-200 bg-white p-5 transition hover:shadow-md"
                >
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      width={480}
                      height={144}
                      className="mb-3 h-36 w-full rounded-md object-cover"
                    />
                  ) : null}
                  <p className="text-xs font-semibold text-[#2f5fa8]">{item.category}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">{item.title}</h3>
                  <p className="mt-3 text-xs text-slate-500">{blogArticleMeta(item)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section> */}
      </main>
    </>
  );
}

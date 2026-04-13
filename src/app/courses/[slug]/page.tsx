import { notFound } from "next/navigation";
import Link from "next/link";
import FaqSection, { type FaqItem } from "@/app/components/Home/FaqSection";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import {
  fetchBlogs,
  fetchCategories,
  fetchCategoryPageContent,
  fetchCoursesByCategory,
  fetchCoursesPageContent,
  type CategoryApi,
  type CategoryPageContentApi,
  type CourseApi,
  type CoursesPageContentApi,
} from "@/app/lib/api";
import { browseCategories } from "@/app/lib/courses";
import { formatBlogDate } from "@/app/lib/blog-utils";
import { buildCategoryDetailSchema } from "@/app/components/schemas/category-schema";
import { buildBreadcrumbSchema } from "@/app/components/schemas/breadcrumb-schema";
import { Home } from "lucide-react";
import type { Metadata } from "next";
import CoursesCarousel from "@/app/components/CoursesCarousel";
import BlogsCarousel from "@/app/components/BlogsCarousel";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function applyCategoryToken(text: string, categoryName: string) {
  return text
    .replace(/\{\{category\}\}/gi, categoryName)
    .replace(/\{category\}/gi, categoryName);
}

function clampText(text: string, maxLen: number) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "…";
}

function injectCategoryName(text: string, categoryName: string) {
  return text
    .replace(/\{\{category\}\}/gi, categoryName)
    .replace(/\{category\}/gi, categoryName);
}

function normalizeCategoryKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Match URL slug to API category (exact slug, normalized slug/name, or static browse slug → API name). */
function findCategoryBySlug(
  categories: CategoryApi[],
  slug: string,
): CategoryApi | undefined {
  const key = normalizeCategoryKey(slug);
  if (!key) return undefined;

  const exact = categories.find((c) => c.slug === slug);
  if (exact) return exact;

  const bySlug = categories.find(
    (c) => normalizeCategoryKey(c.slug) === key,
  );
  if (bySlug) return bySlug;

  const byName = categories.find(
    (c) => normalizeCategoryKey(c.name) === key,
  );
  if (byName) return byName;

  const browse = browseCategories.find(
    (b) => normalizeCategoryKey(b.slug) === key,
  );
  if (!browse) return undefined;

  return categories.find(
    (c) =>
      normalizeCategoryKey(c.name) === normalizeCategoryKey(browse.key) ||
      normalizeCategoryKey(c.name) === normalizeCategoryKey(browse.label),
  );
}

function buildFaqItems(content: CoursesPageContentApi | null): FaqItem[] {
  const raw = content?.faqItems;
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => ({
    id: typeof item.id === "number" ? item.id : index + 1,
    question: String(item.question ?? "").trim(),
    answer: String(item.answer ?? "").trim(),
  }));
}

function buildCategoryFaqItems(content: CategoryPageContentApi | null): FaqItem[] {
  const raw = content?.faq_items;
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => ({
    id: index + 1,
    question: String(item.question ?? "").trim(),
    answer: String(item.answer ?? "").trim(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const [categories, pageContent] = await Promise.all([
    fetchCategories().catch(() => [] as CategoryApi[]),
    fetchCoursesPageContent(),
  ]);

  const category = findCategoryBySlug(categories, slug);
  const categoryPageContent =
    category?.id != null ? await fetchCategoryPageContent(category.id) : null;
  const categoryName = category?.name?.trim() || "Courses";
  const fallbackTitle = `${categoryName} Courses`;
  const fallbackDescription =
    category?.description?.trim() ||
    "Learn in-demand skills with expert-led training, guided projects, and career-focused support.";

  const rawTitle =
    categoryPageContent?.seo_title?.trim() || pageContent?.metaTitle?.trim() || "";
  const rawDescription =
    categoryPageContent?.seo_description?.trim() ||
    pageContent?.metaDescription?.trim() ||
    "";
  const rawKeywords =
    categoryPageContent?.seo_keywords?.trim() || pageContent?.metaKeywords?.trim() || "";

  const title = rawTitle
    ? applyCategoryToken(rawTitle, categoryName)
    : fallbackTitle;
  const description = rawDescription
    ? applyCategoryToken(rawDescription, categoryName)
    : fallbackDescription;
  const keywords = rawKeywords
    .split(",")
    .map((k) => applyCategoryToken(k.trim(), categoryName))
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
  };
}

function CourseCard({ course, category }: { course: CourseApi, category: CategoryApi }) {
  return (
    <Link
      href={`/courses/${category.slug}/${course.slug}`}
      className="group block rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-md shadow-slate-200/30 hover:shadow-xl hover:shadow-blue-900/10 hover:border-[#0066FF]/30 transition duration-200"
    >
      <div className="h-1.5 bg-gradient-to-r from-[#0066FF] to-sky-400" />
      <div className="h-24 bg-gradient-to-br from-slate-50 to-[#E7F3FF]/60 border-b border-slate-100" />
      <div className="p-5">
        <h3 className="text-sm font-bold text-[#001f3f] leading-snug group-hover:text-[#0066FF] transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
          {clampText(course.description, 110)}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>⏱ {course.duration}</span>
          <span className="text-amber-600 font-semibold">
            ⭐ {course.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="text-sm font-bold text-rose-600">{course.price}</div>
          <span className="text-[11px] font-bold text-[#0066FF] border-2 border-[#0066FF]/40 bg-[#0066FF]/5 px-3 py-1.5 rounded-full group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [categories, blogPosts, pageContent] = await Promise.all([
    fetchCategories(),
    fetchBlogs().catch(() => [] as Awaited<ReturnType<typeof fetchBlogs>>),
    fetchCoursesPageContent(),
  ]);

  const category = findCategoryBySlug(categories, slug);

  if (!category) {
    notFound();
  }

  const categoryPageContent = await fetchCategoryPageContent(category.id);

  const categoryCourses = (await fetchCoursesByCategory(category.id))
    .filter((course) => {
      if (typeof course.category === "number") {
        return course.category === category.id;
      }
      return course.category?.id === category.id;
    })
    .sort((a, b) => b.rating - a.rating);

  const categorySlugKey = normalizeCategoryKey(category.slug);
  const categoryNameKey = normalizeCategoryKey(category.name);
  const latestBlogs = blogPosts
    .filter((post) => {
      const postCategoryKey = normalizeCategoryKey(post.category ?? "");
      return (
        postCategoryKey === categorySlugKey || postCategoryKey === categoryNameKey
      );
    })
    .slice(0, 3);
  const faqItems = buildCategoryFaqItems(categoryPageContent);

  const whyTitleRaw =
    categoryPageContent?.why_title?.trim() ||
    pageContent?.whyTitle?.trim() ||
    `Why learn ${category.name}?`;
  const whyTitle = injectCategoryName(whyTitleRaw, category.name);

  const whyPoints = (
    (categoryPageContent?.why_points?.length
      ? categoryPageContent.why_points
      : pageContent?.whyPoints) ?? []
  ).filter((p) => typeof p === "string" && p.trim().length > 0) as string[];

  const ctaTitle =
    categoryPageContent?.cta_title?.trim() ||
    pageContent?.ctaTitle?.trim() ||
    pageContent?.ctaHeading?.trim() ||
    `Start your ${category.name} journey`;

  const ctaSubtitle =
    categoryPageContent?.cta_subtitle?.trim() ||
    pageContent?.ctaSubtitle?.trim() ||
    pageContent?.ctaText?.trim() ||
    "Enroll in expert-led programmes with structured projects and career-focused support.";

  const faqHeading =
    categoryPageContent?.faq_heading?.trim() ||
    pageContent?.faqHeading?.trim() ||
    "";
  const faqIntro =
    categoryPageContent?.faq_intro?.trim() ||
    pageContent?.faqIntro?.trim() ||
    "";

  const showFaq =
    faqHeading.length > 0 ||
    faqIntro.length > 0 ||
    faqItems.some((i) => i.question && i.answer);
  const categoryDetailSchema = buildCategoryDetailSchema(category, categoryCourses);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
    { name: category.name, url: `/courses/${category.slug}` },
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
          __html: JSON.stringify(categoryDetailSchema).replace(/<\/script/gi, "<\\/script"),
        }}
      />
      <main className="min-h-screen bg-gradient-to-b from-[#E7F3FF]/90 via-white to-slate-50/80 text-slate-800 pt-16">
      {/* Breadcrumb */}
      <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
        <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center">
          {/* Home icon */}
          <Home className="w-4 h-4 text-slate-500 mr-1" />
          <Link href="/" className="hover:text-[#0066FF] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/courses" className="hover:text-[#0066FF] transition-colors">
            Courses
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-[#001f3f]">{category.name}</span>
        </div>
      </section>

      <section className="relative px-6 md:px-12 py-12 md:py-16 border-b border-sky-100/80 overflow-hidden bg-gradient-to-br from-[#E7F3FF] via-white to-sky-50/50">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 10% 0%, rgba(0,102,255,0.12), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0066FF]/15 to-sky-100 ring-2 ring-[#0066FF]/20 flex items-center justify-center text-lg font-bold text-[#0066FF] shrink-0 shadow-sm">
              {category.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {categoryPageContent?.hero_title?.trim() ? (
                <p className="text-xs font-bold tracking-[0.15em] text-[#0066FF] uppercase">
                  {injectCategoryName(
                    categoryPageContent.hero_title.trim(),
                    category.name,
                  )}
                </p>
              ) : pageContent?.heroTitle?.trim() ? (
                <p className="text-xs font-bold tracking-[0.15em] text-[#0066FF] uppercase">
                  {injectCategoryName(pageContent.heroTitle.trim(), category.name)}
                </p>
              ) : (
                <p className="text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">
                  Category
                </p>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#001f3f] mt-3 tracking-tight">
                {category.name}
              </h1>
              <p className="text-sm md:text-base text-slate-600 mt-4 max-w-2xl leading-relaxed">
                {category.description}
              </p>
              {categoryPageContent?.hero_subtitle?.trim() ? (
                <p className="text-sm text-slate-600 mt-4 max-w-2xl leading-relaxed border-l-4 border-[#0066FF] pl-4 bg-white/60 rounded-r-lg py-2 pr-3">
                  {injectCategoryName(
                    categoryPageContent.hero_subtitle.trim(),
                    category.name,
                  )}
                </p>
              ) : pageContent?.heroSubtitle?.trim() ? (
                <p className="text-sm text-slate-600 mt-4 max-w-2xl leading-relaxed border-l-4 border-[#0066FF] pl-4 bg-white/60 rounded-r-lg py-2 pr-3">
                  {injectCategoryName(
                    pageContent.heroSubtitle.trim(),
                    category.name,
                  )}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#001f3f] hover:bg-[#E7F3FF] hover:border-[#0066FF]/30 transition shadow-sm"
            >
              ← Back to Courses
            </Link>
            <span className="text-xs font-bold text-[#001f3f] bg-[#E7F3FF] border border-sky-200 px-4 py-2 rounded-full">
              {categoryCourses.length}{" "}
              {categoryCourses.length === 1 ? "course" : "courses"}
            </span>
            {categoryPageContent?.hero_cta_text?.trim() ? (
              <Link
                href={categoryPageContent.hero_cta_link?.trim() || "/courses#all-courses"}
                className="inline-flex items-center justify-center rounded-full bg-[#ffcc00] text-[#001f3f] px-5 py-2.5 text-sm font-bold hover:brightness-105 transition shadow-md shadow-amber-200/40"
              >
                {categoryPageContent.hero_cta_text.trim()}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12 md:py-14 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-base md:text-lg font-bold text-[#001f3f] shrink-0">
              Courses in this category
            </h2>
            <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-[#0066FF] via-sky-500 to-blue-200" />
          </div>

          {categoryCourses.length ? (
            <CoursesCarousel courses={categoryCourses} />
          ) : (
            <div className="rounded-2xl border border-dashed border-sky-300 bg-gradient-to-br from-[#E7F3FF]/50 to-white p-12 text-center">
              <p className="text-[#001f3f] font-bold text-lg">
                No courses in this category yet.
              </p>
              <p className="text-slate-600 text-sm mt-2">
                Browse other categories from the main courses page.
              </p>
              <Link
                href="/courses"
                className="inline-flex mt-6 text-sm font-bold text-[#0066FF] hover:text-[#0047b3] underline-offset-4 hover:underline"
              >
                View all courses
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 py-14 md:py-16 border-y border-sky-100/70 bg-gradient-to-b from-white to-[#E7F3FF]/40">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#001f3f] tracking-tight">
            {whyTitle}
          </h2>
          {pageContent?.whyIntro?.trim() ? (
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              {injectCategoryName(pageContent.whyIntro.trim(), category.name)}
            </p>
          ) : null}
          {whyPoints.length > 0 ? (
            <ul className="mt-4 grid sm:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
              {whyPoints.map((point, idx) => (
                <li
                  key={`${idx}-${point.slice(0, 24)}`}
                  className="flex gap-3 rounded-2xl border border-sky-100 bg-white p-4 shadow-md shadow-slate-200/30"
                >
                  <span
                    className="mt-0.5 w-8 h-8 shrink-0 rounded-full bg-[#0066FF]/12 text-[#0066FF] flex items-center justify-center text-xs font-bold ring-1 ring-[#0066FF]/25"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed pt-1">
                    {injectCategoryName(point, category.name)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid md:grid-cols-2 gap-5 mt-6 text-left max-w-4xl mx-auto">
              <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-md shadow-slate-200/25">
                <h3 className="text-lg font-bold text-[#001f3f] mb-2">
                  Career scope
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {clampText(category.description, 280)}
                </p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-md shadow-slate-200/25">
                <h3 className="text-lg font-bold text-[#001f3f] mb-2">
                  Structured path
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Explore the courses above for clear milestones, practical work,
                  and outcomes aligned with what employers look for in{" "}
                  {category.name.toLowerCase()}.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 py-14 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#001f3f]">
              Latest blog posts
            </h2>
            <Link
              href="/blog"
              className="text-sm font-bold text-[#0066FF] hover:text-[#0047b3]"
            >
              View all →
            </Link>
          </div>
          {latestBlogs.length === 0 ? (
            <p className="text-slate-600 text-sm">No blog posts yet.</p>
          ) : (
            <BlogsCarousel blogs={latestBlogs} />
          )}
        </div>
      </section>
      <section className="px-6 md:px-12 py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-[#eef5ff] via-[#f8fbff] to-[#e0f2fe]">
  
        {/* SOFT GLOW */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, rgba(37,99,235,0.15), transparent 40%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          
          {/* TITLE */}
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#0f172a]">
            {ctaTitle}
          </h2>

          {/* SUBTITLE */}
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            {ctaSubtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-3">
            {Array.isArray(categoryPageContent?.cta_buttons) &&
            categoryPageContent!.cta_buttons!.length > 0 ? (
              categoryPageContent!.cta_buttons!
                .filter(
                  (b) =>
                    typeof b?.text === "string" &&
                    b.text.trim() &&
                    typeof b?.link === "string" &&
                    b.link.trim(),
                )
                .slice(0, 4)
                .map((b, idx) => (
                  <Link
                    key={`${idx}-${String(b.text).slice(0, 20)}`}
                    href={String(b.link)}
                    className={
                      idx === 0
                        ? "inline-flex items-center justify-center bg-[#2563EB] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#1d4ed8] transition"
                        : "inline-flex items-center justify-center border border-[#2563EB]/30 text-[#1e3a8a] px-8 py-3.5 rounded-full font-bold hover:bg-[#eff6ff] transition"
                    }
                  >
                    {String(b.text)}
                  </Link>
                ))
            ) : (
              <CounsellingModal
                buttonText="Enroll now"
                className="inline-flex items-center justify-center bg-[#2563EB] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#1d4ed8] transition"
              />
            )}
          </div>
        </div>
      </section>
      {showFaq ? (
        <section className="bg-gradient-to-b from-slate-100/80 to-[#E7F3FF]/35 px-6 md:px-12 py-14 md:py-16">
          <div className="mx-auto max-w-6xl rounded-2xl border border-sky-100 bg-white shadow-lg shadow-slate-200/40 overflow-hidden">
            <FaqSection
              heading={faqHeading}
              intro={faqIntro}
              items={faqItems}
            />
          </div>
        </section>
      ) : null}
      </main>
    </>
  );
}

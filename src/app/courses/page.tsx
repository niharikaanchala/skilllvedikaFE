import Link from "next/link";
import FaqSection from "../components/Home/FaqSection";
import CounsellingModal from "../course/[id]/CounsellingModal";
import {
  fetchCategories,
  fetchCourses,
  fetchBlogs,
  fetchCoursesPageContent,
  type CategoryApi,
  type CourseApi,
  type BlogPostApi,
} from "../lib/api";
import { buildCourseListSchema } from "../components/schemas/course-schema";
import { buildCategoryListSchema } from "../components/schemas/category-schema";
import { buildBreadcrumbSchema } from "../components/schemas/breadcrumb-schema";
import { Home } from "lucide-react";
import { Metadata } from "next";
import CategoriesCarousel from "../components/CategoriesCarousel";
import CoursesCarousel from "../components/CoursesCarousel";
import CourseCard from "../components/CourseCard";
import BlogsCarousel from "../components/BlogsCarousel";
function clampText(text: string, maxLen: number) {
  if (!text) return "";
  return text.length <= maxLen ? text : text.slice(0, maxLen - 1) + "…";
}

function normalizeButtons(raw: unknown): { text: string; link: string; variant?: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((b) => b && typeof b === "object")
    .map((b) => b as { text?: unknown; link?: unknown; variant?: unknown })
    .map((b) => ({
      text: String(b.text ?? "").trim(),
      link: String(b.link ?? "").trim(),
      variant: String(b.variant ?? "").trim() || undefined,
    }))
    .filter((b) => b.text && b.link);
}
export const generateMetadata = async (): Promise<Metadata> => {
  const pageContent = await fetchCoursesPageContent();

  const keywords = (pageContent?.metaKeywords ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const title =
    pageContent?.metaTitle ||
    pageContent?.heroTitle ||
    "Courses";

  const description =
    pageContent?.metaDescription ||
    pageContent?.heroSubtitle ||
    "Learn in-demand skills with expert-led training, guided projects, and career-focused support.";

  const url = "https://skillvedika.com/courses"; // ✅ FULL URL

  return {
    title,
    description,
    keywords: keywords.length
      ? keywords
      : ["online courses", "skill training", "career programs"],

    alternates: {
      canonical: url, // ✅ FULL URL (IMPORTANT)
    },

    openGraph: {
      title,
      description,
      url, // ✅ FULL URL
      siteName: "SkillVedika",
      type: "website",
      images: pageContent?.heroImage
        ? [
            {
              url: pageContent.heroImage.trim(),
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: pageContent?.heroImage
        ? [pageContent.heroImage.trim()]
        : undefined,
    },
  };
};
export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const qRaw = sp.q ?? sp.query ?? sp.search;
  const q = (Array.isArray(qRaw) ? qRaw[0] : qRaw ?? "").trim();
  const qLower = q.toLowerCase();
  const categoryRaw = sp.category;
  const category = (Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw ?? "").trim();
  const categoryLower = category.toLowerCase();

  const [categoriesRes, coursesRes, blogsRes, pageContentRes] =
    await Promise.allSettled([
      fetchCategories(),
      fetchCourses(),
      fetchBlogs(),
      fetchCoursesPageContent(),
    ]);

  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value : [];
  const courses = coursesRes.status === "fulfilled" ? coursesRes.value : [];
  const blogs = blogsRes.status === "fulfilled" ? blogsRes.value : [];
  const pageContent =
    pageContentRes.status === "fulfilled" ? pageContentRes.value : null;

    const filteredCourses = courses.filter((course: CourseApi) => {
      const categoryLabel =
        typeof course.category === "object" && course.category
          ? course.category.slug || course.category.name
          : course.category_name || "";
    
      const matchesSearch = qLower
        ? `${course.title ?? ""} ${course.description ?? ""} ${categoryLabel}`
            .toLowerCase()
            .includes(qLower)
        : true;
    
      const matchesCategory = categoryLower
        ? categoryLabel.toLowerCase().includes(categoryLower)
        : true;
    
      return matchesSearch && matchesCategory;
    });

  const sortedCourses = filteredCourses
    ?.slice()
    .sort((a: CourseApi, b: CourseApi) => b.rating - a.rating);
  const isSearchView = Boolean(q || category);
  const courseListSchema = buildCourseListSchema(filteredCourses);
  const categoryListSchema = buildCategoryListSchema(categories);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
  ]);

  if (isSearchView) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(courseListSchema).replace(/<\/script/gi, "<\\/script"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryListSchema).replace(/<\/script/gi, "<\\/script"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema).replace(/<\/script/gi, "<\\/script"),
          }}
        />
        <main className="min-h-screen bg-gradient-to-b from-[#eaf0f7] via-white to-[#f4f8fc] pt-16 text-slate-800">
          <section className="border-b border-slate-200/70 bg-white/70 px-6 py-4 md:px-12">
            <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center">
              <Home className="w-4 h-4 text-slate-500 mr-1" />
              <Link href="/" className="transition-colors hover:text-[#2f5fa8]">
                Home
              </Link>
              <span className="mx-2 text-slate-400">/</span>
              <Link href="/courses" className="transition-colors hover:text-[#2f5fa8]">
                Courses
              </Link>
              <span className="mx-2 text-slate-400">/</span>
              <span className="font-semibold text-[#1a2d49]">Search</span>
            </div>
          </section>

          <section className="bg-white px-6 py-12 md:px-12 md:py-14">
            <div className="max-w-6xl mx-auto">
              {sortedCourses?.length ? (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="shrink-0 text-base font-bold text-[#1a2d49]">
                      Search Results
                    </h2>
                    <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-[#2f5fa8] via-[#4a79bd] to-[#cbdcf1]" />
                  </div>
                  <CoursesCarousel courses={sortedCourses} />
                </>
              ) : (
                <div className="text-center p-12 rounded-2xl border border-dashed border-sky-200 bg-sky-50/50">
                  <p className="font-semibold text-[#1a2d49]">No results found</p>
                  <p className="text-sm text-slate-600 mt-2">
                    {`No course or category matched "${q || category}". Try a different search term.`}
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseListSchema).replace(/<\/script/gi, "<\\/script"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryListSchema).replace(/<\/script/gi, "<\\/script"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/<\/script/gi, "<\\/script"),
        }}
      />
      <main className="min-h-screen bg-gradient-to-b from-[#eaf0f7] via-white to-[#f4f8fc] pt-16 text-slate-800">
      {/* Breadcrumb */}
      <section className="border-b border-slate-200/70 bg-white/70 px-6 py-4 md:px-12">
        <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center">
          {/* Home icon */}
          <Home className="w-4 h-4 text-slate-500 mr-1" />

          <Link href="/" className="transition-colors hover:text-[#2f5fa8]">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-[#1a2d49]">Courses</span>
        </div>
      </section>

      {/* Hero */}
      <section className="border-b border-sky-200/60 bg-gradient-to-br from-sky-100 via-sky-100 to-sky-100 px-6 py-14 md:px-12 md:py-20">         <div className="max-w-6xl mx-auto">
          {/* <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#2f5fa8]">
            SkillVedika
          </p> */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#1a2d49] md:text-4xl lg:text-5xl">
            {pageContent?.heroTitle || "Explore Our Career-Transforming Courses"}
          </h1>

          <p className="mt-4 text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
            {pageContent?.heroSubtitle ||
              "Learn in-demand skills with expert-led training, guided projects, and career-focused support."}
          </p>

          {normalizeButtons(pageContent?.heroCtaButtons).length > 0 ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {normalizeButtons(pageContent?.heroCtaButtons)
                .slice(0, 4)
                .map((b, idx) => (
                  <Link
                    key={`${idx}-${b.text.slice(0, 20)}`}
                    href={b.link}
                    className={
                      idx === 0
                        ? "inline-flex items-center justify-center rounded-xl bg-[#2f5fa8] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#264f8d]"
                        : "inline-flex items-center justify-center rounded-xl border border-[#2f5fa8]/25 bg-white text-[#1a2d49] px-7 py-3 text-sm font-bold transition hover:bg-[#f5f9ff]"
                    }
                  >
                    {b.text}
                  </Link>
                ))}
            </div>
          ) : (
            <Link
              href={pageContent?.hero_cta_link || "#all-courses"}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#2f5fa8] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#264f8d]"
            >
              {pageContent?.hero_cta_text || "Browse Courses"}
            </Link>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 md:px-12 py-16 bg-gradient-to-b from-[#f7faff] via-white to-[#f3f7ff]">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0f1f3a]">
              Browse by Category
            </h2>

            <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
              Discover structured learning paths designed to boost your career in different domains.
            </p>
          </div>

          {/* Grid */}
          {categories?.length ? (
            <CategoriesCarousel categories={categories} />
          ) : (
            <div className="col-span-full text-center p-14 rounded-2xl border border-dashed border-[#cfe0ff] bg-white">
              <p className="text-lg font-semibold text-[#0f1f3a]">
                No categories available
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Categories will appear here once added.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Courses */}
      <section id="all-courses" className="bg-white px-6 py-12 md:px-12 md:py-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="shrink-0 text-base font-bold text-[#1a2d49]">
              All Courses
            </h2>
            <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-[#2f5fa8] via-[#4a79bd] to-[#cbdcf1]" />
          </div>
          {sortedCourses?.length ? (
            <CoursesCarousel courses={sortedCourses} />
          ) : (
            <div className="text-center p-12 rounded-2xl border border-dashed border-sky-200 bg-sky-50/50">
              <p className="font-semibold text-[#1a2d49]">
                {q || category ? "No results found" : "No courses found"}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                {q || category
                  ? `No course or category matched "${q || category}". Try a different search term.`
                  : "Check back soon for new programmes."}
              </p>
            </div>
          )}


        </div>
      </section>

      {/* Why Choose / Why Invest */}
      <section className="border-b border-slate-200/70 bg-gradient-to-br from-[#eef5ff] via-[#f8fbff] to-[#e3edfb] px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-xl font-bold text-[#1a2d49] md:text-2xl">
            {pageContent?.whyTitle || "Why invest in Professional Training?"}
          </h2>

          {pageContent?.whyIntro?.trim() ? (
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
              {pageContent.whyIntro}
            </p>
          ) : null}

          {pageContent?.whyPointsHtml ? (
            <div
              className="prose prose-slate mx-auto mt-8 max-w-3xl text-left"
              dangerouslySetInnerHTML={{ __html: pageContent.whyPointsHtml }}
            />
          ) : (
            <ul className="mx-auto mt-8 max-w-3xl space-y-3 text-left text-sm text-slate-700">
              {Array.isArray(pageContent?.whyPoints)
                ? pageContent.whyPoints.map((item: string, index: number) => (
                    <li key={`why-${index}-${String(item).slice(0, 20)}`} className="flex gap-3 items-start">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2f5fa8]/12 text-xs font-bold text-[#2f5fa8] ring-1 ring-[#2f5fa8]/20">
                        ✓
                      </span>
                      <span className="leading-relaxed pt-0.5">{item}</span>
                    </li>
                  ))
                : null}
            </ul>
          )}
        </div>
      </section>

      {/* Blogs */}
      <section className="px-6 md:px-12 py-14 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-10 text-xl font-bold text-[#1a2d49]">
            Recommended Articles
          </h2>
          {blogs?.length ? (
            <BlogsCarousel blogs={blogs} />
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">
              No articles available
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-slate-200/70 bg-[#eaf0f7] px-6 py-16 text-center md:px-12 md:py-20">
        <div className="relative mx-auto max-w-6xl">
          <h2 className="text-xl font-extrabold tracking-tight text-[#1a2d49] md:text-3xl">
            {pageContent?.ctaHeading ||
              pageContent?.ctaTitle ||
              "Not Sure Which Course to Choose?"}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            {pageContent?.ctaText ||
              pageContent?.ctaSubtitle ||
              "Tell us your goals and timeline. We will recommend the best-fit path."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {normalizeButtons(pageContent?.ctaButtons).length > 0 ? (
              normalizeButtons(pageContent?.ctaButtons)
                .slice(0, 4)
                .map((b, idx) => (
                  <Link
                    key={`${idx}-${b.text.slice(0, 20)}`}
                    href={b.link}
                    className={
                      idx === 0
                        ? "inline-flex items-center justify-center rounded-xl bg-[#2f5fa8] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#264f8d]"
                        : "inline-flex items-center justify-center rounded-xl border border-[#2f5fa8]/25 bg-white px-7 py-3 text-sm font-bold text-[#1a2d49] transition hover:bg-[#f5f9ff]"
                    }
                  >
                    {b.text}
                  </Link>
                ))
            ) : (
              <CounsellingModal
                buttonText="Get Free Counselling"
                className="inline-flex items-center justify-center rounded-xl bg-[#2f5fa8] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#264f8d]"
              />
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {pageContent?.faqItems && pageContent.faqItems.length > 0 ? (
        <div className="bg-gradient-to-b from-slate-100/80 to-[#eaf0f7]/35">
          <FaqSection
            heading={pageContent.faqHeading ?? ""}
            intro={pageContent.faqIntro ?? ""}
            items={pageContent.faqItems.map((item, index) => ({
              id: typeof item.id === "number" ? item.id : index + 1,
              question: String(item.question ?? "").trim(),
              answer: String(item.answer ?? "").trim(),
            }))}
          />
        </div>
      ) : null}
      </main>
    </>
  );
}

// function CourseCard({ course }: { course: CourseApi }) {
//   const categoryLabel =
//     typeof course.category === "object" && course.category
//       ? course.category.name
//       : course.category_name || "Course";

//   return (
//     <Link
//       href={`/course/${course.slug}`}
//       className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-[#2f5fa8]/25 hover:shadow-md"
//     >
//       <div className="h-1 bg-gradient-to-r from-[#2f5fa8] to-[#79a2d9]" />

//       <div className="p-4">
//         <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2f5fa8]">
//           {categoryLabel}
//         </p>

//         <h3 className="mt-1 min-h-[2.5rem] line-clamp-2 text-sm font-bold leading-snug text-[#1a2d49] transition-colors group-hover:text-[#2f5fa8]">
//           {course.title}
//         </h3>

//         <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2 min-h-[2.25rem]">
//           {clampText(course.description || "", 92)}
//         </p>

//         <div className="mt-3 flex justify-between text-[11px] text-slate-500">
//           <span>⏱ {course.duration}</span>
//           <span className="text-amber-600 font-semibold">
//             ⭐ {course.rating?.toFixed(1) ?? "—"}
//           </span>
//         </div>

//         <div className="mt-4 flex justify-between items-center gap-3 border-t border-slate-100 pt-3">
//           <div className="text-sm font-bold text-[#b45309]">{course.price || "Free"}</div>
//           <span className="text-[11px] font-semibold text-[#2f5fa8] underline-offset-2 group-hover:underline">
//             View course →
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// }

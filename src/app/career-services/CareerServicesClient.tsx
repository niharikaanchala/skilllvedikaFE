"use client";

import Link from "next/link";
import { useRef } from "react";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import { Home } from "lucide-react";
import type { CareerPageApi, CourseApi, BlogPostApi } from "@/app/lib/api";

function resolveCareerLink(buttonText?: string, fallback?: string) {
  const text = (buttonText ?? "").toLowerCase();
  if (text.includes("contact")) return "/contact";
  return fallback || "#";
}

type Props = {
  initialData: CareerPageApi;
  courses: CourseApi[];
  blogs: BlogPostApi[];
};

function enrollmentFromId(id: number): number {
  return 120 + (Math.abs(id * 17 + 31) % 2880);
}

function StarRating({ rating }: { rating: number }) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const filled = Math.min(5, Math.max(0, Math.round(safeRating)));
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= filled ? "text-amber-400 text-[15px] leading-none" : "text-slate-200 text-[15px] leading-none"}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-sm font-medium text-[#334155]">
        ({safeRating.toFixed(1)})
      </span>
    </div>
  );
}

export default function CareerServicesClient({ initialData, courses, blogs }: Props) {
  const data = initialData;
  const relatedCoursesRef = useRef<HTMLDivElement | null>(null);
  const recommendedBlogsRef = useRef<HTMLDivElement | null>(null);
  const currentPageName = "Career Services";
  const servicesHeading = data.services_heading?.title || data.hero?.title || "Our Career Services";
  const firstFaq = data.faqs?.[0];
  const faqSectionName =
    (typeof data.faq_heading === "object" ? data.faq_heading?.title : data.faq_heading) ||
    (typeof data.faqs_heading === "object" ? data.faqs_heading?.title : data.faqs_heading) ||
    data.faq_title ||
    data.faq_section_title ||
    firstFaq?.section_title ||
    firstFaq?.heading ||
    firstFaq?.title ||
    "FAQs";
  const relatedCourses = courses.slice(0, 6);
  const recommendedBlogs = blogs.slice(0, 6);

  const slideRelatedCourses = (direction: "left" | "right") => {
    const node = relatedCoursesRef.current;
    if (!node) return;
    const amount = 320;
    node.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const slideRecommendedBlogs = (direction: "left" | "right") => {
    const node = recommendedBlogsRef.current;
    if (!node) return;
    const amount = 320;
    node.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <main className="bg-slate-50 text-slate-900 pt-16">
      {/* Breadcrumb */}
      <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
        <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center gap-2">
          <Home className="w-4 h-4 text-slate-500 mr-1" />
          <Link href="/" className="hover:text-[#0066FF] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-[#001f3f]">
            {currentPageName}
          </span>
        </div>
      </section>

      {/* HERO */}
      <section className="bg-gradient-to-r from-sky-100 to-sky-200 text-[#0C1A35] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {data.hero?.title || "Career Services"}
          </h1>

          <p className="text-lg mb-6 opacity-90 max-w-2xl">
            {data.hero?.subtitle || ""}
          </p>

          <div className="flex gap-4 flex-wrap">
            <CounsellingModal
              buttonText={data.hero?.primary_button_text || "Get Started"}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
            />

            <Link
              href={resolveCareerLink(
                data.hero?.secondary_button_text,
                data.hero?.secondary_button_link
              )}
              className="border border-blue-500 px-6 py-2 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white transition inline-flex items-center"
            >
              {data.hero?.secondary_button_text}
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0C1A35] mb-10 text-center">
            {servicesHeading}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.services?.map((s: any) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
            >
              <div className="text-blue-600 text-3xl mb-3">
                {s.icon || "🎯"}
              </div>

              <h3 className="font-semibold text-lg mb-2">
                {s.title}
              </h3>

              <p className="text-gray-600 text-sm">
                {s.description}
              </p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* WHY CAREER SUPPORT */}
      <section className="bg-blue-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-left md:text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#0C1A35]">
            {data.support?.title}
          </h2>

          <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
            {data.support?.description}
          </p>
        </div>
      </section>

      {/* RELATED COURSES */}
      {relatedCourses.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0C1A35]">
                  Related Courses
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Explore programmes that complement our career support services.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => slideRelatedCourses("left")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0C1A35] shadow-sm transition hover:border-blue-400 hover:text-blue-600"
                  aria-label="Scroll related courses left"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => slideRelatedCourses("right")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0C1A35] shadow-sm transition hover:border-blue-400 hover:text-blue-600"
                  aria-label="Scroll related courses right"
                >
                  ›
                </button>
              </div>
            </div>
            <div
              ref={relatedCoursesRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 no-scrollbar"
            >
              {relatedCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.slug}`}
                  className="group flex min-w-[280px] flex-[0_0_100%] snap-start flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md sm:flex-[0_0_calc(50%-10px)] lg:flex-[0_0_calc(33.333%-14px)]"
                >
                  <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug text-[#0f2744] group-hover:text-[#1d4f91]">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#64748b]">
                    {enrollmentFromId(course.id).toLocaleString()} students enrolled
                  </p>
                  <div className="mt-3">
                    <StarRating rating={course.rating} />
                  </div>
                  <div className="my-4 border-t border-slate-100" />
                  <div className="mt-auto">
                    <span className="block rounded-lg bg-[#2f5fa8] py-2.5 text-center text-sm font-semibold text-white transition group-hover:opacity-95">
                      View Course
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RECOMMENDED ARTICLES */}
      {recommendedBlogs.length > 0 && (
        <section className="pb-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0C1A35]">
                  Recommended Articles
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Read career tips, placement stories, and interview guidance.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => slideRecommendedBlogs("left")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0C1A35] shadow-sm transition hover:border-blue-400 hover:text-blue-600"
                  aria-label="Scroll recommended articles left"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => slideRecommendedBlogs("right")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0C1A35] shadow-sm transition hover:border-blue-400 hover:text-blue-600"
                  aria-label="Scroll recommended articles right"
                >
                  ›
                </button>
              </div>
            </div>
            <div
              ref={recommendedBlogsRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 no-scrollbar"
            >
              {recommendedBlogs.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block min-w-[280px] flex-[0_0_100%] snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md sm:flex-[0_0_calc(50%-10px)] lg:flex-[0_0_calc(33.333%-14px)]"
                >
                  <div className="h-28 w-full bg-slate-200">
                    {post.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image_url}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        width={480}
                        height={112}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                      {post.category || "Article"}
                    </span>
                    <h3 className="mt-2 line-clamp-2 font-semibold text-[#0C1A35] group-hover:text-[#1d4f91]">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {post.excerpt || ""}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{post.date || ""}</span>
                      <span className="font-medium text-[#2f5fa8]">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-sky-200 to-sky-100 text-[#0C1A35] text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          {data.cta?.title}
        </h2>

        <p className="mb-6 opacity-90">
          {data.cta?.subtitle}
        </p>

        <Link
          href={resolveCareerLink(
            data.cta?.button_text,
            data.cta?.button_link
          )}
          className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow inline-flex items-center"
        >
          {data.cta?.button_text}
        </Link>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[#0C1A35] text-center">
          {faqSectionName}
        </h2>
        <div className="space-y-4">
          {data.faqs?.map((faq: any) => (
            <details
              key={faq.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-100"
            >
              <summary className="cursor-pointer font-medium text-lg">
                {faq.question}
              </summary>

              <p className="mt-2 text-gray-600 text-sm">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
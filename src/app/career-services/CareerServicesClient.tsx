"use client";

import Link from "next/link";
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

export default function CareerServicesClient({ initialData, courses, blogs }: Props) {
  const data = initialData;
  const servicesHeading = data.services_heading?.title || data.hero?.title || "Our Career Services";
  const relatedCourses = courses.slice(0, 6);
  const recommendedBlogs = blogs.slice(0, 6);

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
            {data.hero?.title || "Career Services"}
          </span>
        </div>
      </section>

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-200 text-[#0C1A35] py-20 px-6">
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

      {/* RELATED COURSES & RECOMMENDED BLOGS */}
      {(relatedCourses.length > 0 || recommendedBlogs.length > 0) && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2">
            {relatedCourses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0C1A35] mb-4">
                  Related Courses
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Explore programmes that complement our career support services.
                </p>
                <div className="space-y-4">
                  {relatedCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/course/${course.slug}`}
                      className="block rounded-xl border border-sky-100 bg-slate-50/70 p-4 hover:bg-white hover:border-blue-400 hover:shadow-md transition"
                    >
                      <h3 className="font-semibold text-[#0C1A35]">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {course.duration}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {recommendedBlogs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0C1A35] mb-4">
                  Recommended Blogs
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Read career tips, placement stories, and interview guidance.
                </p>
                <div className="space-y-4">
                  {recommendedBlogs.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-sky-100/40 p-4 hover:border-blue-400 hover:shadow-md transition"
                    >
                      <h3 className="font-semibold text-[#0C1A35] line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {post.category}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-400 to-blue-300 text-[#0C1A35] text-center py-16 px-6">
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
"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CourseApi } from "@/app/lib/api";
import { courseHref } from "@/app/lib/course-links";
import { courseRating } from "@/app/lib/course-home-tabs";
import CourseCardImage from "@/app/components/CourseCardImage";

const THUMB_GRADIENTS = [
  "from-[#1a237e] to-[#3949ab]",
  "from-[#006064] to-[#00acc1]",
  "from-[#1b5e20] to-[#43a047]",
  "from-[#4a148c] to-[#7b1fa2]",
  "from-[#0f2744] to-[#2b5a9e]",
  "from-[#bf360c] to-[#e64a19]",
];

function StarRating({ rating }: { rating: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex min-h-[1.25rem] items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            i <= filled
              ? "text-amber-400 text-[14px] leading-none"
              : "text-slate-200 text-[14px] leading-none"
          }
        >
          ★
        </span>
      ))}
      <span className="ml-1.5 text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
    </div>
  );
}

function clampText(text: string, maxLen: number) {
  if (!text) return "";
  return text.length <= maxLen ? text : text.slice(0, maxLen - 1) + "…";
}

/**
 * Trending strip that overlaps the hero bottom edge.
 * Client component so chevron navigation works.
 */
export function HeroTrendingCourses({ courses }: { courses: CourseApi[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trending = (Array.isArray(courses) ? courses : []).filter((c) =>
    Boolean(c.is_trending),
  );

  if (trending.length === 0) return null;

  const showArrows = trending.length > 1;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10">
      <div className="relative">
        {showArrows ? (
          <>
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute -left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0f2744] shadow-md transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8] sm:-left-2 sm:h-11 sm:w-11 md:-left-3"
              aria-label="Previous trending courses"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute -right-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0f2744] shadow-md transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8] sm:-right-2 sm:h-11 sm:w-11 md:-right-3"
              aria-label="Next trending courses"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </>
        ) : null}

        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto scroll-smooth px-8 pb-2 pt-1 no-scrollbar sm:gap-5 sm:px-10 md:gap-6 md:px-12"
        >
          {trending.map((course) => {
            const rating = courseRating(course);
            const gradient = THUMB_GRADIENTS[Math.abs(course.id) % THUMB_GRADIENTS.length];
            const duration = course.duration?.trim() || "TBA";

            return (
              <article
                key={course.id}
                className="group flex h-full w-[300px] min-w-[300px] max-w-[300px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_32px_-14px_rgba(15,39,68,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-16px_rgba(47,95,168,0.4)]"
              >
                <Link href={courseHref(course)} className="block">
                  <CourseCardImage
                    src={course.image}
                    alt={course.title}
                    fallbackGradient={gradient}
                  />
                </Link>

                <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4 pt-3 text-left">
                  <Link href={courseHref(course)}>
                    <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-bold leading-snug text-[#111827] transition group-hover:text-[#2f5fa8]">
                      {course.title}
                    </h3>
                  </Link>

                  <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-600">
                    {clampText(course.description || "", 100)}
                  </p>

                  <StarRating rating={rating} />

                  <p className="min-h-[1rem] text-xs text-slate-500">
                    Dur: <span className="font-medium text-slate-700">{duration}</span>
                  </p>

                  <Link
                    href={courseHref(course)}
                    className="mt-auto inline-flex w-full items-center justify-center rounded-md bg-[#2f5fa8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#264f8d]"
                  >
                    View Course
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

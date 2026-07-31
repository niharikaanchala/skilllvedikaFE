"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { CategoryApi, CourseApi } from "@/app/lib/api";
import { courseHref } from "@/app/lib/course-links";
import { courseRating } from "@/app/lib/course-home-tabs";
import CourseCardImage from "@/app/components/CourseCardImage";

const PRIMARY = "#2f5fa8";

const THUMB_GRADIENTS = [
  "from-[#0f2744] to-[#2b5a9e]",
  "from-[#1a237e] to-[#3949ab]",
  "from-[#004d40] to-[#00897b]",
  "from-[#311b92] to-[#5e35b1]",
  "from-[#1b5e20] to-[#43a047]",
  "from-[#bf360c] to-[#e64a19]",
];

type TabKey = "trending" | number;

function categoryIdOf(c: CourseApi): number | null {
  if (typeof c.category === "number") return c.category;
  if (typeof c.category === "object" && c.category !== null && typeof c.category.id === "number") {
    return c.category.id;
  }
  return null;
}

function clampText(text: string, maxLen: number) {
  if (!text) return "";
  return text.length <= maxLen ? text : text.slice(0, maxLen - 1) + "…";
}

function StarRating({ rating }: { rating: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            i <= filled
              ? "text-amber-400 text-[15px] leading-none"
              : "text-gray-200 text-[15px] leading-none"
          }
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-sm font-medium text-[#334155]">({rating.toFixed(1)})</span>
    </div>
  );
}

function HomeCourseCard({ c }: { c: CourseApi }) {
  const r = courseRating(c);
  const gradient = THUMB_GRADIENTS[Math.abs(c.id) % THUMB_GRADIENTS.length];

  return (
    <Link
      href={courseHref(c)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <CourseCardImage src={c.image} alt={c.title} fallbackGradient={gradient} />

      <div className="flex flex-1 flex-col p-5 text-left">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-[17px] font-semibold leading-snug text-[#0f2744]">
          {c.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-600">
          {clampText(c.description || "", 100)}
        </p>

        <div className="mt-3 min-h-[1.25rem]">
          <StarRating rating={r} />
        </div>

        <div className="my-4 border-t border-slate-100" />

        <div className="mt-auto">
          <span
            className="block rounded-lg py-2.5 text-center text-sm font-semibold text-white transition group-hover:opacity-95"
            style={{ backgroundColor: PRIMARY }}
          >
            View Course
          </span>
        </div>
      </div>
    </Link>
  );
}

function CarouselShell({
  children,
  scrollStep = 340,
  showArrows,
}: {
  children: React.ReactNode;
  scrollStep?: number;
  showArrows: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -scrollStep : scrollStep,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {showArrows ? (
        <>
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0f2744] shadow-md transition hover:border-[#2f5fa8]/40 hover:bg-slate-50 hover:text-[#2f5fa8] sm:-left-3 sm:h-11 sm:w-11"
            aria-label="Previous courses"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0f2744] shadow-md transition hover:border-[#2f5fa8]/40 hover:bg-slate-50 hover:text-[#2f5fa8] sm:-right-3 sm:h-11 sm:w-11"
            aria-label="Next courses"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </>
      ) : null}
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth no-scrollbar px-8 sm:px-10 md:px-12"
      >
        {children}
      </div>
    </div>
  );
}

type Props = {
  courses?: CourseApi[] | null;
  categories?: CategoryApi[] | null;
};

export default function CoursesSectionClient({ courses, categories }: Props) {
  const allCourses = useMemo(
    () => (Array.isArray(courses) ? courses : []),
    [courses],
  );
  const allCategories = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories],
  );

  const [activeTab, setActiveTab] = useState<TabKey>("trending");

  const list = useMemo(() => {
    if (activeTab === "trending") {
      return allCourses.filter((c) => Boolean(c.is_trending));
    }
    return allCourses.filter((c) => categoryIdOf(c) === activeTab);
  }, [allCourses, activeTab]);

  const isTrending = activeTab === "trending";
  const showArrows = list.length > 1;

  const tabButtonClass = (active: boolean) =>
    `relative shrink-0 whitespace-nowrap px-1 pb-3 text-sm font-semibold transition sm:text-[15px] ${
      active ? "text-[#2f5fa8]" : "text-[#0f172a] hover:text-[#2f5fa8]"
    }`;

  return (
    <section className="bg-white px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#1b355b] sm:text-3xl">
          Explore Skill for Changing World
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#64748b] sm:text-base">
          Choose an upskill program that aligns with your Passion & Goals
        </p>

        <div className="mt-8 overflow-x-auto no-scrollbar">
          <div
            className="mx-auto flex w-max min-w-full justify-start gap-6 border-b border-slate-200 px-1 sm:gap-8 md:justify-center"
            role="tablist"
            aria-label="Course categories"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "trending"}
              onClick={() => setActiveTab("trending")}
              className={tabButtonClass(activeTab === "trending")}
            >
              Trending
              {activeTab === "trending" ? (
                <span
                  className="absolute inset-x-0 -bottom-px h-[3px] rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
              ) : null}
            </button>
            {allCategories.map((category) => {
              const active = activeTab === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(category.id)}
                  className={tabButtonClass(active)}
                >
                  {category.name}
                  {active ? (
                    <span
                      className="absolute inset-x-0 -bottom-px h-[3px] rounded-full"
                      style={{ backgroundColor: PRIMARY }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {(list?.length ?? 0) === 0 ? (
          <p className="mt-14 py-12 text-sm text-[#64748b]">
            {activeTab === "trending"
              ? "No trending courses yet. Mark courses as trending in the admin panel."
              : "No courses in this category yet."}
          </p>
        ) : (
          <div className="relative mt-10 text-left">
            {isTrending ? (
              <CarouselShell showArrows={showArrows} scrollStep={640}>
                {/* Two-row carousel only in Courses section Trending tab */}
                <div className="grid auto-cols-[300px] grid-flow-col grid-rows-2 items-stretch gap-5 md:gap-6">
                  {list.map((c) => (
                    <div key={`trending-${c.id}`} className="flex h-full w-[300px]">
                      <HomeCourseCard c={c} />
                    </div>
                  ))}
                </div>
              </CarouselShell>
            ) : (
              <CarouselShell showArrows={showArrows} scrollStep={320}>
                <div className="flex items-stretch gap-5 md:gap-6">
                  {list.map((c) => (
                    <div
                      key={`${String(activeTab)}-${c.id}`}
                      className="flex h-full w-[300px] min-w-[300px] max-w-[300px] shrink-0"
                    >
                      <HomeCourseCard c={c} />
                    </div>
                  ))}
                </div>
              </CarouselShell>
            )}
          </div>
        )}

        <div className="mx-auto mt-8 flex max-w-6xl justify-center sm:justify-end">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-full px-8 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
            style={{ backgroundColor: PRIMARY }}
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}

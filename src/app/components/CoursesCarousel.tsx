"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CourseApi } from "@/app/lib/api";
import CourseCard from "./CourseCard";

/** Fixed card size used across course carousels */
export const COURSE_CARD_WIDTH_CLASS =
  "w-[300px] min-w-[300px] max-w-[300px] shrink-0";

export default function CoursesCarousel({
  courses,
}: {
  courses: CourseApi[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const showArrows = courses.length > 1;

  return (
    <div className="relative">
      {showArrows ? (
        <>
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8] sm:-left-3 sm:h-11 sm:w-11"
            aria-label="Scroll courses left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8] sm:-right-3 sm:h-11 sm:w-11"
            aria-label="Scroll courses right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-5 overflow-x-auto scroll-smooth no-scrollbar px-8 sm:px-10 md:px-12"
      >
        {courses.map((course) => (
          <div key={course.id} className={`flex h-full ${COURSE_CARD_WIDTH_CLASS}`}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
}

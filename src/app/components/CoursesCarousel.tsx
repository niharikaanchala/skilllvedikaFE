"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CourseApi } from "@/app/lib/api";
import CourseCard from "./CourseCard";

export default function CoursesCarousel({
  courses,
}: {
  courses: CourseApi[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  const shouldDisplayLeftButton = courses.length > 3;
  const shouldDisplayRightButton = courses.length > 3;

  return (
    <div className="relative">
      {shouldDisplayLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8] md:flex"
          aria-label="Scroll courses left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {shouldDisplayRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8] md:flex"
          aria-label="Scroll courses right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar px-1 md:px-8"
      >
        {courses.map((course) => (
          <div key={course.id} className="min-w-[310px] max-w-[310px]">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
}
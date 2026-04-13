"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CourseApi } from "@/app/lib/api";
import CourseCard from "./CourseCard"; // ❗ we will fix this below

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
      {/* LEFT */}
      {shouldDisplayLeftButton && (
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      )}
      {/* RIGHT */}
      {shouldDisplayRightButton && (
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      )}
      {/* SCROLL */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-10"
      >
        {courses.map((course) => (
          <div key={course.id} className="min-w-[300px] max-w-[300px]">
            {/* SAME CARD */}
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
}
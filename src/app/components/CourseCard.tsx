"use client";

import Link from "next/link";
import type { CourseApi } from "@/app/lib/api";
import { courseRating } from "@/app/lib/course-home-tabs";
import { courseHref } from "@/app/lib/course-links";
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
      <span className="ml-1 text-sm font-medium text-[#334155]">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

type Variant = "default" | "compact";

export default function CourseCard({
  course,
  variant = "default",
}: {
  course: CourseApi;
  variant?: Variant;
}) {
  const rating = courseRating(course);
  const gradient = THUMB_GRADIENTS[Math.abs(course.id) % THUMB_GRADIENTS.length];

  if (variant === "compact") {
    return (
      <Link
        href={courseHref(course)}
        className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <CourseCardImage
          src={course.image}
          alt={course.title}
          fallbackGradient={gradient}
        />
        <div className="flex flex-1 flex-col gap-2 p-4 text-left">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[14px] font-bold leading-snug text-[#0f2744]">
            {course.title}
          </h3>
          <StarRating rating={rating} />
        </div>
      </Link>
    );
  }

  // Same layout / size as home page course cards
  return (
    <Link
      href={courseHref(course)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <CourseCardImage
        src={course.image}
        alt={course.title}
        fallbackGradient={gradient}
      />

      <div className="flex flex-1 flex-col p-5 text-left">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-[17px] font-semibold leading-snug text-[#0f2744]">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-600">
          {clampText(course.description || "", 100)}
        </p>

        <div className="mt-3 min-h-[1.25rem]">
          <StarRating rating={rating} />
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

import Link from "next/link";
import type { CourseApi } from "@/app/lib/api";


function clampText(text: string, maxLen: number) {
  if (!text) return "";
  return text.length <= maxLen ? text : text.slice(0, maxLen - 1) + "…";
}

export default function CourseCard({ course }: { course: CourseApi }) {
  const categoryLabel =
    typeof course.category === "object" && course.category
      ? course.category.name
      : course.category_name || "Course";

  const categorySlug =categoryLabel.toLowerCase().replace(/ /g, "-");

  return (
    <Link
      href={`/courses/${categorySlug}/${course.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-[#2f5fa8]/25 hover:shadow-md"
    >
      {/* Top line */}
      <div className="h-1 bg-gradient-to-r from-[#2f5fa8] to-[#79a2d9]" />

      <div className="p-4">
        {/* Category */}
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2f5fa8]">
          {categoryLabel}
        </p>

        {/* Title */}
        <h3 className="mt-1 min-h-[2.5rem] line-clamp-2 text-sm font-bold leading-snug text-[#1a2d49] transition-colors group-hover:text-[#2f5fa8]">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2 min-h-[2.25rem]">
          {clampText(course.description || "", 92)}
        </p>

        {/* Meta */}
        <div className="mt-3 flex justify-between text-[11px] text-slate-500">
          <span>⏱ {course.duration}</span>
          <span className="text-amber-600 font-semibold">
            ⭐ {course.rating?.toFixed(1) ?? "—"}
          </span>
        </div>

        {/* Bottom */}
        <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
          <span className="text-[11px] font-semibold text-[#2f5fa8] underline-offset-2 group-hover:underline">
            View course →
          </span>
        </div>
      </div>
    </Link>
  );
}
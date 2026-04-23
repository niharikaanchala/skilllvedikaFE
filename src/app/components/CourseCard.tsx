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

  const categorySlug = categoryLabel.toLowerCase().replace(/ /g, "-");

  return (
    <Link
      href={`/courses/${categorySlug}/${course.slug}`}
      className="group block h-full overflow-hidden rounded-3xl border border-[#dbe8fb] bg-white shadow-[0_10px_32px_-24px_rgba(15,23,42,0.7)] transition duration-300 hover:-translate-y-1 hover:border-[#2f5fa8]/40 hover:shadow-[0_24px_40px_-28px_rgba(47,95,168,0.65)]"
    >
      <div className="h-1.5 bg-gradient-to-r from-[#2f5fa8] via-[#5b86ca] to-[#8cb2e6]" />

      <div className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="inline-flex max-w-[72%] truncate rounded-full bg-[#eff5ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2f5fa8]">
            {categoryLabel}
          </span>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
            ⭐ {course.rating?.toFixed(1) ?? "—"}
          </span>
        </div>

        <h3 className="min-h-[2.75rem] line-clamp-2 text-[15px] font-bold leading-snug text-[#152744] transition-colors group-hover:text-[#2f5fa8]">
          {course.title}
        </h3>

        <p className="mt-2 min-h-[2.5rem] line-clamp-2 text-xs leading-relaxed text-slate-600">
          {clampText(course.description || "", 100)}
        </p>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
          <span className="font-medium">Duration</span>
          <span className="font-semibold text-slate-700">{course.duration || "TBA"}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2f5fa8]">
            View details
          </span>
          <span className="text-lg font-semibold text-[#2f5fa8] transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
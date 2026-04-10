"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CourseApi } from "@/app/lib/api";
import { courseRating } from "@/app/lib/course-home-tabs";

const PRIMARY = "#2f5fa8";
const PAGE_SIZE = 3;

const THUMB_GRADIENTS = [
  "from-[#0f2744] to-[#2b5a9e]",
  "from-[#1a237e] to-[#3949ab]",
  "from-[#004d40] to-[#00897b]",
  "from-[#311b92] to-[#5e35b1]",
  "from-[#1b5e20] to-[#43a047]",
  "from-[#bf360c] to-[#e64a19]",
];

function enrollmentFromId(id: number): number {
  return 120 + (Math.abs(id * 17 + 31) % 2880);
}

function StarRating({ rating }: { rating: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= filled ? "text-amber-400 text-[15px] leading-none" : "text-gray-200 text-[15px] leading-none"}>
          ★
        </span>
      ))}
      <span className="text-sm text-[#334155] ml-1 font-medium">({rating.toFixed(1)})</span>
    </div>
  );
}

function CourseCard({ c }: { c: CourseApi }) {
  const r = courseRating(c);
  const enrolled = enrollmentFromId(c.id);
  const grad = THUMB_GRADIENTS[Math.abs(c.id) % THUMB_GRADIENTS.length];
  const initials = c.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  return (
    <Link
      href={`/course/${c.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-[0_6px_20px_rgba(15,39,68,0.08)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,39,68,0.14)]"
    >
      <div className={`relative flex h-44 w-full items-center justify-center bg-gradient-to-br ${grad}`}>
        <span className="text-2xl sm:text-3xl font-bold text-white/95 tracking-tight drop-shadow-sm">{initials}</span>
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h3 className="font-bold text-[#0f2744] text-base sm:text-[17px] leading-snug line-clamp-2 min-h-[2.75rem]">
          {c.title}
        </h3>
        <p className="text-sm text-[#64748b] mt-2">{enrolled.toLocaleString()} Students enrolled</p>

        <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span
            className="inline-flex w-fit items-center justify-center rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:opacity-95"
            style={{ backgroundColor: PRIMARY }}
          >
            View more
          </span>
          <StarRating rating={r} />
        </div>
      </div>
    </Link>
  );
}

type TabKey = "trending" | "popular" | "free";

type Props = {
  trending: CourseApi[];
  popular: CourseApi[];
  free: CourseApi[];
};

export default function CoursesSectionClient({ trending, popular, free }: Props) {
  const [tab, setTab] = useState<TabKey>("trending");
  const [page, setPage] = useState(0);

  const list = useMemo(() => {
    if (tab === "trending") return trending;
    if (tab === "popular") return popular;
    return free;
  }, [tab, trending, popular, free]);

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));

  useEffect(() => {
    setPage(0);
  }, [tab]);

  useEffect(() => {
    if (page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  const slice = useMemo(() => {
    const start = page * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }, [list, page]);

  const goPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const goNext = useCallback(() => setPage((p) => Math.min(pageCount - 1, p + 1)), [pageCount]);

  const tabBtn = (key: TabKey, label: string) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      className={`px-6 py-2 rounded-full text-sm font-semibold transition border ${
        tab === key
          ? "text-white border-transparent shadow-sm"
          : "bg-white text-[#0f2744] border-slate-200 hover:bg-slate-50"
      }`}
      style={tab === key ? { backgroundColor: PRIMARY } : undefined}
    >
      {label}
    </button>
  );

  return (
    <section className="bg-white px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#1b355b] sm:text-3xl">Explore Skill for Changing World</h2>
        <p className="text-sm sm:text-base text-[#64748b] mt-3 max-w-2xl mx-auto leading-relaxed">
          Choose an upskill program that aligns with your Passion & Goals
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
          {tabBtn("trending", "Trending")}
          {tabBtn("popular", "Popular")}
          {tabBtn("free", "Free")}
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-[#64748b] mt-14 py-12">
            {tab === "free"
              ? "No free courses right now. Try Trending or Popular."
              : "No courses in this section yet."}
          </p>
        ) : (
          <>
            <div className="relative mt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left">
                {slice.map((c) => (
                  <CourseCard key={`${tab}-${c.id}`} c={c} />
                ))}
              </div>

              {list.length > PAGE_SIZE && (
                <div className="flex flex-col items-center gap-4 mt-10">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={page === 0}
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white text-[#0f2744] flex items-center justify-center shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      aria-label="Previous courses"
                    >
                      <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: pageCount }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPage(i)}
                          className={`h-2.5 rounded-full transition-all ${
                            i === page ? "w-8" : "w-2.5"
                          }`}
                          style={i === page ? { backgroundColor: PRIMARY } : { backgroundColor: "#e2e8f0" }}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={page >= pageCount - 1}
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white text-[#0f2744] flex items-center justify-center shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      aria-label="Next courses"
                    >
                      <ChevronRight className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
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

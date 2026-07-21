"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  fetchCoursesPage,
  type CourseApi,
  type PaginatedResponse,
} from "@/app/lib/api";
import CoursesCarousel from "@/app/components/CoursesCarousel";

const PAGE_SIZE = 12;

function PaginationBar({
  page,
  totalPages,
  totalCount,
  onPageChange,
  disabled,
}: {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (totalCount <= 0 || totalPages <= 1) return null;
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm font-medium text-slate-600">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export function SearchableCourses({
  courses: initialCourses,
  emptyTitle = "No courses found",
  emptyHint = "Check back soon for new programmes.",
  searchPlaceholder = "Search courses...",
  inputId = "course-search",
  pageSize = PAGE_SIZE,
  categoryId,
  initialQuery = "",
}: {
  courses?: CourseApi[];
  emptyTitle?: string;
  emptyHint?: string;
  searchPlaceholder?: string;
  inputId?: string;
  pageSize?: number;
  categoryId?: number;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseApi[]>(initialCourses ?? []);
  const [totalCount, setTotalCount] = useState(initialCourses?.length ?? 0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data: PaginatedResponse<CourseApi> = await fetchCoursesPage({
        page,
        pageSize,
        search: debouncedQuery,
        category: categoryId,
        cache: "no-store",
        revalidate: false,
      });
      setCourses(data.results);
      setTotalCount(data.count);
      setTotalPages(Math.max(1, data.total_pages));
      if (data.page !== page && data.total_pages > 0) {
        setPage(data.page);
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedQuery, categoryId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="mb-8">
        <label htmlFor={inputId} className="sr-only">
          Search courses
        </label>
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#2f5fa8] focus:ring-2 focus:ring-[#2f5fa8]/20"
          />
        </div>
      </div>

      {courses.length > 0 ? (
        <>
          <CoursesCarousel courses={courses} />
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={setPage}
            disabled={loading}
          />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/50 p-12 text-center">
          <p className="font-semibold text-[#1a2d49]">
            {loading
              ? "Loading courses..."
              : query.trim()
                ? "No courses match your search"
                : emptyTitle}
          </p>
          {!loading ? (
            <p className="mt-2 text-sm text-slate-600">
              {query.trim()
                ? `No course matched "${query.trim()}". Try a different term.`
                : emptyHint}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

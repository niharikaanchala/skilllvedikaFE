"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  fetchCategoriesPage,
  type CategoryApi,
  type PaginatedResponse,
} from "@/app/lib/api";
import CategoriesCarousel from "@/app/components/CategoriesCarousel";

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

export function SearchableCategories({
  categories: initialCategories,
  pageSize = PAGE_SIZE,
}: {
  categories?: CategoryApi[];
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryApi[]>(initialCategories ?? []);
  const [totalCount, setTotalCount] = useState(initialCategories?.length ?? 0);
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
      const data: PaginatedResponse<CategoryApi> = await fetchCategoriesPage({
        page,
        pageSize,
        search: debouncedQuery,
        cache: "no-store",
        revalidate: false,
      });
      setCategories(data.results);
      setTotalCount(data.count);
      setTotalPages(Math.max(1, data.total_pages));
      if (data.page !== page && data.total_pages > 0) {
        setPage(data.page);
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedQuery]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="mb-8">
        <label htmlFor="category-search" className="sr-only">
          Search categories
        </label>
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            id="category-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#2f5fa8] focus:ring-2 focus:ring-[#2f5fa8]/20"
          />
        </div>
      </div>

      {categories.length > 0 ? (
        <>
          <CategoriesCarousel categories={categories} />
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={setPage}
            disabled={loading}
          />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#cfe0ff] bg-white p-14 text-center">
          <p className="text-lg font-semibold text-[#0f1f3a]">
            {loading
              ? "Loading categories..."
              : query.trim()
                ? "No categories match your search"
                : "No categories available"}
          </p>
          {!loading ? (
            <p className="mt-2 text-sm text-slate-500">
              {query.trim()
                ? `No category matched "${query.trim()}". Try a different term.`
                : "Categories will appear here once added."}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

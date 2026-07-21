"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchBlogsPage, type BlogPostApi } from "@/app/lib/api";
import { blogArticleMeta } from "@/app/lib/blog-utils";

export type BlogFilterArticle = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  meta: string;
  image_url?: string;
};

type Props = {
  /** Optional SSR seed; component always loads pages from the API. */
  articles?: BlogFilterArticle[];
  pageSize?: number;
};

const PAGE_SIZE = 9;

function toArticle(p: BlogPostApi): BlogFilterArticle {
  return {
    slug: p.slug,
    category: p.category,
    title: p.title,
    summary: p.excerpt,
    meta: blogArticleMeta(p),
    image_url: p.image_url,
  };
}

export default function BlogFilter({ articles: initialArticles, pageSize = PAGE_SIZE }: Props) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<BlogFilterArticle[]>(initialArticles ?? []);
  const [totalCount, setTotalCount] = useState(initialArticles?.length ?? 0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBlogsPage({
        page,
        pageSize,
        search: debouncedSearch,
        category: category === "All" ? undefined : category,
        cache: "no-store",
      });
      setArticles(data.results.map(toArticle));
      setTotalCount(data.count);
      setTotalPages(Math.max(1, data.total_pages));
      if (data.categories?.length) {
        setCategories(["All", ...data.categories]);
      }
      if (data.page !== page && data.total_pages > 0) {
        setPage(data.page);
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, category]);

  useEffect(() => {
    void load();
  }, [load]);

  const categoryChips = useMemo(() => categories, [categories]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md rounded-lg border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-[#2C6ED5] outline-none"
        />

        <div className="flex flex-wrap gap-2">
          {categoryChips.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                category === cat
                  ? "bg-[#2C6ED5] text-white"
                  : "bg-white text-[#334155] border border-slate-200 hover:bg-[#F4F7FB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-[#2C6ED5] to-[#14B8A6]" />
            {article.image_url ? (
              <div className="h-44 w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image_url}
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={176}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="p-5">
              <p className="text-xs font-semibold text-[#2C6ED5]">{article.category}</p>

              <h3 className="mt-3 font-bold text-lg">{article.title}</h3>

              <p className="mt-3 text-sm text-[#0C1A35]/70 line-clamp-4">{article.summary}</p>

              <p className="mt-4 text-xs text-[#0C1A35]/50">{article.meta}</p>

              <span className="inline-block mt-4 text-sm font-medium text-[#2C6ED5] hover:underline">
                Read More →
              </span>
            </div>
          </Link>
        ))}

        {articles.length === 0 && (
          <p className="col-span-full text-center text-[#0C1A35]/60">
            {loading ? "Loading articles..." : "No articles found."}
          </p>
        )}
      </div>

      {totalCount > 0 && totalPages > 1 ? (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#2C6ED5]/40 hover:text-[#2C6ED5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={loading || page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#2C6ED5]/40 hover:text-[#2C6ED5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type BlogFilterArticle = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  meta: string;
  image_url?: string;
};

type Props = {
  articles: BlogFilterArticle[];
};

export default function BlogFilter({ articles }: Props) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.category))).sort();
    return ["All", ...unique];
  }, [articles]);

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchCategory = category === "All" || article.category === category;
    const matchSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.summary.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

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
          {categories.map((cat) => (
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
        {filteredArticles.map((article) => (
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

        {filteredArticles.length === 0 && (
          <p className="col-span-full text-center text-[#0C1A35]/60">No articles found.</p>
        )}
      </div>
    </>
  );
}

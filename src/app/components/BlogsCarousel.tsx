"use client";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPostApi } from "@/app/lib/api";

export default function BlogsCarousel({
  blogs,
  showArrows = true,
}: {
  blogs: BlogPostApi[];
  showArrows?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    // Avoid per-click card measurement to reduce forced reflow.
    const scrollAmount = Math.max(container.clientWidth * 0.85, 280);

    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {showArrows ? (
        <>
          {/* LEFT */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* RIGHT */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      ) : null}

      {/* SCROLL */}
      <div
        ref={scrollRef}
        className={`flex gap-6 overflow-x-auto scroll-smooth no-scrollbar items-stretch ${showArrows ? "px-10" : "px-0"}`}
      >
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="min-w-[320px] max-w-[320px] flex"
          >
            <div className="flex flex-col h-full w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md transition hover:border-[#2f5fa8]/20 hover:shadow-lg">
              {blog.image_url ? (
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  loading="lazy"
                  decoding="async"
                  width={320}
                  height={144}
                  className="h-36 w-full object-cover border-b"
                />
              ) : (
                <div className="h-36 bg-gradient-to-br from-slate-100 to-sky-50 border-b" />
              )}

              <div className="p-6 flex-1 flex flex-col">
                <span className="text-xs font-bold text-[#2f5fa8]">
                  {blog.category}
                </span>

                <h3 className="mt-3 text-base font-bold text-[#1a2d49] line-clamp-2 min-h-[3rem]">
                  {blog.title}
                </h3>

                <p className="text-sm text-slate-600 mt-2 line-clamp-3 min-h-[4.5rem] flex-1">
                  {blog.excerpt}
                </p>
              </div>
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
}
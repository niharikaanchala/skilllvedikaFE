"use client";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPostApi } from "@/app/lib/api";

export default function BlogsCarousel({
  blogs,
}: {
  blogs: BlogPostApi[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
  
    const container = scrollRef.current;
  
    // get FIRST CARD WRAPPER (important fix)
    const card = container.children[0] as HTMLElement;
  
    if (!card) return;
  
    const gap = 24; // matches gap-6
    const cardWidth = card.offsetWidth + gap;
  
    container.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
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

      {/* SCROLL */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-10 items-stretch"
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
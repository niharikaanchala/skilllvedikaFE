"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryApi } from "@/app/lib/api";

export default function CategoriesCarousel({
  categories,
}: {
  categories: CategoryApi[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const node = scrollRef.current;
    if (!node) return;

    const updateScrollState = () => {
      setCanScroll(node.scrollWidth > node.clientWidth + 1);
    };

    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [categories.length]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {isMounted && canScroll && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8]"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {isMounted && canScroll && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur transition hover:border-[#2f5fa8]/40 hover:text-[#2f5fa8]"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar px-1 md:px-8"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/courses/${cat.slug}`}
            className="group relative min-w-[270px] rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5fa8]/60"
          >
            <div className="h-full rounded-3xl border border-[#dce8fb] bg-gradient-to-br from-white via-[#f8fbff] to-[#eaf2ff] p-5 shadow-[0_10px_30px_-20px_rgba(37,99,235,0.6)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]">
              <div className="mb-4 flex items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2f5fa8] to-[#4f83d2] text-base font-bold uppercase text-white shadow-md shadow-[#2f5fa8]/30">
                  {cat.name?.charAt(0)}
                </div>
              </div>
              <h3 className="text-base font-bold leading-tight text-[#142645] transition-colors group-hover:text-[#2f5fa8]">
                {cat.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
                {cat.description || "Explore focused learning paths and real-world skills."}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-[#d9e6fb] pt-3">
                <span className="text-[11px] font-semibold text-slate-500">Explore path</span>
                <span className="text-sm font-semibold text-[#2f5fa8] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryApi } from "@/app/lib/api";

const ACCENTS = [
  { from: "#1e3a5f", to: "#2f5fa8", soft: "#e8f0fb" },
  { from: "#0f4c5c", to: "#148c9c", soft: "#e6f7f8" },
  { from: "#3b1f6b", to: "#6d3cc9", soft: "#f1eafb" },
  { from: "#7a2e0e", to: "#d35400", soft: "#fff0e6" },
  { from: "#1b4332", to: "#2d6a4f", soft: "#e8f5ef" },
  { from: "#4a1942", to: "#9b2c6f", soft: "#f9eaf3" },
];

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
      left: dir === "left" ? -320 : 320,
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
        {categories.map((cat, index) => {
          const accent = ACCENTS[Math.abs(cat.id ?? index) % ACCENTS.length];
          return (
            <Link
              key={cat.id}
              href={`/courses/${cat.slug}`}
              className="group relative min-w-[280px] max-w-[280px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5fa8]/60"
            >
              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_14px_36px_-24px_rgba(15,23,42,0.55)] transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_44px_-22px_rgba(47,95,168,0.45)]">
                <div
                  className="relative h-28 px-5 pb-4 pt-5"
                  style={{
                    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                  }}
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
                  <div className="absolute bottom-3 right-4 h-14 w-14 rounded-full bg-white/10" />
                  <div
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                  >
                    {(cat.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <p className="relative mt-3 line-clamp-1 text-sm font-semibold text-white/90">
                    Explore programs
                  </p>
                </div>

                <div className="p-5" style={{ backgroundColor: accent.soft }}>
                  <h3 className="text-base font-bold leading-tight text-[#142645] transition-colors group-hover:text-[#2f5fa8]">
                    {cat.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-600">
                    {cat.description ||
                      "Explore focused learning paths and real-world skills built for career growth."}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      View courses
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#2f5fa8] shadow-sm transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

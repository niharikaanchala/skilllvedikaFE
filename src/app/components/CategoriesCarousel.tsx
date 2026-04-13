"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryApi } from "@/app/lib/api";

export default function CategoriesCarousel({
  categories,
}: {
  categories: CategoryApi[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* LEFT BUTTON */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* SCROLL AREA */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-10"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/courses/${cat.slug}`}
            className="min-w-[260px]"
          >
            <div className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex gap-4">
                <div className="h-12 w-12 flex items-center justify-center bg-blue-500 text-white rounded-xl">
                  {cat.name?.charAt(0)}
                </div>

                <div>
                  <h3 className="font-bold text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
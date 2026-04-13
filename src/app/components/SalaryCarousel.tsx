"use client";

import { useRef } from "react";

export default function SalaryCarousel({ salaries, cardBase, cyan }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const card = container.querySelector("div");

    if (!card) return;

    const cardWidth = (card as HTMLElement).offsetWidth + 16;

    container.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-6">
      {/* LEFT */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
      >
        ←
      </button>

      {/* RIGHT */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
      >
        →
      </button>

      {/* SCROLL */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-10 items-stretch"
      >
        {salaries.map((row: any) => (
          <div
            key={row.id}
            className="min-w-[240px] max-w-[240px] flex-shrink-0"
          >
            <div className={`${cardBase} h-full flex flex-col justify-center p-5 text-center hover:border-[#00aeef]/35 transition`}>
              <h3 className="font-semibold text-[#0a2540]">{row.role}</h3>
              <p className="mt-2 font-bold text-lg" style={{ color: cyan }}>
                {row.range}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
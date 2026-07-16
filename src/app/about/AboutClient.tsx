"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseLeadForm from "@/app/components/CourseLeadForm";

/* SAME TYPES (unchanged) */

type Course = {
  id: number;
  title: string;
  category_name?: string;
};

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean);
      }
    } catch {
      // Not JSON, parse as newline/comma separated text.
    }

    return raw
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export default function AboutPage({ initialData, courses }: { initialData: any, courses: Course[] }) {
  /* ✅ USE SERVER DATA INSTEAD OF FETCH */
  const data = initialData;
  const router = useRouter();
  const courseList = Array.isArray(courses) ? courses : [];
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const hero = data?.hero;
  const valuesSection = data?.values_section;
  const values = (data?.values || []).sort(
    (a: any, b: any) => (a.order ?? 9999) - (b.order ?? 9999)
  );
  const cta = data?.cta;
  const demo = data?.demo;

  const serverDemoPoints = useMemo(() => {
    if (Array.isArray(demo?.features)) {
      return demo.features
        .map((item: unknown) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);
    }
    return [];
  }, [demo?.features]);
  const demoPoints = useMemo(() => normalizeStringList(demo?.features), [demo?.features]);
  const visibleDemoPoints = isHydrated ? demoPoints : serverDemoPoints;

  if (!data)
    return <p className="text-center mt-20">Content unavailable.</p>;

  if (!hero || !valuesSection || !cta || !demo) {
    return <p className="text-center mt-20">Content unavailable.</p>;
  }
  const heroCircleText = hero.heading.split(" ");
  const mediaBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
  const heroImage =
    typeof hero?.hero_image === "string" && hero.hero_image.trim()
      ? hero.hero_image.startsWith("http")
        ? hero.hero_image
        : `${mediaBase}${hero.hero_image.startsWith("/") ? hero.hero_image : `/${hero.hero_image}`}`
      : null;

  return (
    <main className="bg-[#F4F5FC] pt-16">
      {/* Breadcrumb */}
      <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
        <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center gap-2">
          <Home className="w-4 h-4 text-slate-500 mr-1" />
          <Link href="/" className="hover:text-[#0066FF] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-[#001f3f]">About</span>
        </div>
      </section>

      {/* About Hero */}
      <section className="bg-[#EAF5FF] px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center md:justify-start">
            {heroImage ? (
              <div className="relative h-76 w-76 rounded-full bg-[#DCEBFF] p-5 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt={hero.heading || "About Hero"}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-76 h-76 rounded-full bg-[#DCEBFF] grid place-items-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#0EA5E9] shadow-lg grid place-items-center">
                  <div className="text-center text-white font-extrabold leading-none">
                    <div className="text-5xl">{heroCircleText[0] ?? ""}</div>
                    <div className="text-5xl">{heroCircleText[1] ?? ""}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#112645]">
              {hero.heading}
            </h1>
            <p className="mt-4 text-[#112645]/75 leading-7">
              {hero.paragraph_one}
            </p>
            <p className="mt-4 text-[#112645]/75 leading-7">
              {hero.paragraph_two}
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-[#111B33]">
              {valuesSection.heading}
            </h2>
            <p className="mt-3 text-[#111B33]/70 max-w-2xl mx-auto">
              {valuesSection.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {values.map((item: any, i: number) => (
              <div
                key={i}
                className="bg-[#F4F5FC] border border-slate-100 rounded-2xl p-6 hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2C6ED5] to-[#14B8A6] flex items-center justify-center text-white font-bold">
                  {i + 1}
                </div>

                <h3 className="mt-4 text-lg font-semibold text-[#111B33]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-[#111B33]/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-gradient-to-r from-[#7DD3FC] to-[#BAE6FD]">
        <div className="max-w-6xl mx-auto text-center text-black">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            {cta.heading}
          </h2>

          <p className="mt-4 text-black/90 max-w-2xl mx-auto">
            {cta.subtitle}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white text-[#2C6ED5] font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {cta.primary_button_text}
            </button>

            <button
              onClick={() => router.push("/contact")}
                className="border border-black text-black font-semibold px-6 py-3 rounded-lg hover:bg-blue-300 transition-colors"
            >
              {cta.secondary_button_text}
            </button>
          </div>
        </div>
      </section>

      {/* DEMO */}
      {/* Demo + Form */}
      <section
        id="demo-section"
        className="relative px-6 md:px-12 py-16 md:py-20 overflow-hidden"
      >
        <div className="pointer-events-none absolute left-5 top-10 w-16 h-16 rounded-full border-4 border-[#F4BF97]/70" />
        <div className="pointer-events-none absolute left-10 bottom-14 w-16 h-16 rounded-full border-4 border-[#F4BF97]/70" />
        <div className="pointer-events-none absolute -right-8 bottom-6 w-36 h-28 rounded-tl-[80px] rounded-bl-[80px] bg-[#CFCBF6]/80" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            
            {/* LEFT CONTENT */}
            <div>
            <h2 className="text-4xl font-extrabold text-[#111B33]">
                {demo.heading}
            </h2>

            <ul className="mt-5 space-y-3 text-[#111B33]/75">
                {visibleDemoPoints.map((feature: string, i: number) => (
                <li key={i}>• {feature}</li>
                ))}
            </ul>
            </div>

            {/* RIGHT FORM */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
            <h3 className="text-4xl font-extrabold text-center text-[#111B33]">
                {demo.form_title}
            </h3>

            <p className="text-center text-sm text-[#111B33]/60 mt-2">
                {demo.form_subtitle}
            </p>

            <CourseLeadForm
                  courses={courseList.map((course) => ({
                    id: course.id,
                    title: course.title,
                  }))}
                  submitLabel={demo.submit_button_text || "Submit"}
                  className="mt-6 space-y-4"
                  inputClassName="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
                  selectClassName="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
                  buttonClassName="w-full rounded-md bg-gradient-to-r from-[#2C6ED5] to-[#14B8A6] py-3 text-white font-semibold disabled:opacity-70"
                />

                <p className="text-center text-xs text-[#111B33]/55 mt-4">
                Your information is safe.
                </p>
            </div>
        </div>
      </section>
    </main>
  );
}
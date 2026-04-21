"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Mail, MapPin, Phone, SendHorizontal } from "lucide-react";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import { Home } from "lucide-react";
import Link from "next/link";
import { apiUrl } from "@/app/lib/api";

export type ContactPageData = {
  meta?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  };
  hero?: {
    title?: string;
    subtitle?: string;
    button_text?: string;
    background_color?: string;
    image?: string;
  };
  contact_info?: Array<{
    type?: "email" | "phone" | "address" | string;
    label?: string;
    value?: string;
    link?: string;
    map_embed_url?: string;
  }>;
  demo?: {
    title?: string;
    subtitle?: string;
    points?: string[];
  };
  form?: {
    title?: string;
    subtitle?: string;
    button_text?: string;
    map_embed_url?: string;
  };
};

type Props = {
  initialData: ContactPageData | null;
};

type CourseOption = {
  id: number | string;
  title: string;
};

export default function ContactClient({ initialData }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<ContactPageData | null>(initialData);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  // Keep current behavior in dev/admin workflows: if server couldn't fetch,
  // fall back to client fetch (and also refreshes if you keep the page open).
  useEffect(() => {
    if (data) return;
    fetch(apiUrl("/api/contact/contact-page/"))
      .then(async (res) => {
        if (!res.ok) return null;
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) return null;
        const json = (await res.json()) as unknown;
        if (!json || typeof json !== "object") return null;
        return json as ContactPageData;
      })
      .then((json) => {
        if (!json) return;
        setData(json);
      })
      .catch((err) => console.error("API Error:", err));
  }, [data]);

  useEffect(() => {
    let mounted = true;
    setCoursesLoading(true);
    fetch(apiUrl("/api/courses/"), { cache: "force-cache" })
      .then(async (res) => {
        if (!res.ok) return [] as CourseOption[];
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) return [] as CourseOption[];
        return json
          .map((item: Record<string, unknown>) => {
            const title =
              typeof item.title === "string"
                ? item.title
                : typeof item.name === "string"
                  ? item.name
                  : "";
            const id =
              typeof item.id === "number" || typeof item.id === "string"
                ? item.id
                : title;
            return { id, title };
          })
          .filter((item: CourseOption) => item.title.trim().length > 0);
      })
      .then((courses) => {
        if (!mounted) return;
        setCourseOptions(courses);
      })
      .catch(() => {
        if (mounted) setCourseOptions([]);
      })
      .finally(() => {
        if (mounted) setCoursesLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const contactItems = useMemo(() => data?.contact_info ?? [], [data]);
  const mapSrc = useMemo(() => {
    const fallbackMap =
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.323180100732!2d78.39097917493721!3d17.49207948341315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb918eb6921b7d%3A0x81590ec7359ee666!2sManjeera%20Majestic%20Commercial!5e0!3m2!1sen!2sin!4v1776749671762!5m2!1sen!2sin";

    const addressItem = contactItems.find((item) => item.type === "address");
    const mapFromContactInfo = addressItem?.map_embed_url?.trim() ?? "";
    const adminLink = addressItem?.link?.trim() ?? "";
    const adminAddress = addressItem?.value?.trim() ?? "";
    const mapFromForm = data?.form?.map_embed_url?.trim() ?? "";

    if (mapFromContactInfo) {
      if (mapFromContactInfo.includes("google.com/maps/embed")) return mapFromContactInfo;
      return `https://www.google.com/maps?q=${encodeURIComponent(mapFromContactInfo)}&output=embed`;
    }

    if (adminLink) {
      if (adminLink.includes("google.com/maps/embed")) return adminLink;
      return `https://www.google.com/maps?q=${encodeURIComponent(adminLink)}&output=embed`;
    }
    if (adminAddress) {
      return `https://www.google.com/maps?q=${encodeURIComponent(adminAddress)}&output=embed`;
    }
    if (mapFromForm) {
      if (mapFromForm.includes("google.com/maps/embed")) return mapFromForm;
      return `https://www.google.com/maps?q=${encodeURIComponent(mapFromForm)}&output=embed`;
    }
    return fallbackMap;
  }, [contactItems, data?.form?.map_embed_url]);

  if (!data) return <p className="text-center py-20">Loading...</p>;

  return (
    <main className="bg-[#EEF3F9] text-[#12233F] pt-16">
      {/* Breadcrumb */}
      <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
        <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center gap-2">
          {/* Home icon */}
          <Home className="w-4 h-4 text-slate-500 mr-1" />
          <Link href="/" className="hover:text-[#0066FF] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-[#001f3f]">Contact</span>
        </div>
      </section>

      {/* Hero */}
      <section
        className="px-6 md:px-12 py-14 md:py-20"
        style={{ backgroundColor: data.hero?.background_color || "#EAF2FC" }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {data.hero?.title || "Connect & Join Together"}
            </h1>

            <p className="mt-4 text-[#12233F]/70 max-w-md">
              {data.hero?.subtitle || ""}
            </p>

            <div className="mt-7">
              <CounsellingModal
                buttonText={data.hero?.button_text || "Let us connect together"}
                className="rounded-md bg-[#1E4C97] text-white px-6 py-3 text-sm font-semibold hover:bg-[#173d79] transition"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-84 h-84 rounded-full bg-blue-200 grid place-items-center relative">

              {/* outer soft glow ring */}
              <div className="absolute w-100 h-72 rounded-full bg-[#DCE9FA]/200 blur-2xl" />

              {/* middle ring */}
              <div className="w-62 h-62 rounded-full bg-white shadow-lg grid place-items-center relative z-10" >

                {/* inner image circle */}
                {data.hero?.image ? (
                  <img
                    src={apiUrl(data.hero.image)}
                    alt="Hero"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width={232}
                    height={232}
                    className="w-58 h-58 rounded-full object-cover shadow-md border-4 border-white"
                  />
                ) : (
                  <div className="w-44 h-44 rounded-full bg-gradient-to-br from-[#4B8BE6] to-[#2B6DD2]" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="px-6 md:px-12 py-14">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-[#12233F]/50">
            Ways to contact
          </p>

          <h2 className="mt-2 text-center text-3xl md:text-4xl font-extrabold">
            Get in Touch with{" "}
            <span className="text-[#2D6ED5]">SkillVedika</span>
          </h2>

          <p className="text-center text-sm text-[#12233F]/65 mt-3 max-w-2xl mx-auto">
            Reach out via email, phone, or visit our offices. We are here to help
            you with your learning journey.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-10">
            {contactItems.map((item, i) => {
              const Icon =
                item.type === "email"
                  ? Mail
                  : item.type === "phone"
                    ? Phone
                    : MapPin;

              return item.link ? (
                <a
                  key={i}
                  href={item.link}
                  className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition block"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-[#2D6ED5]" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#12233F]/55">
                        {item.label}
                      </p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  </div>
                </a>
              ) : (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <Icon size={18} className="text-[#2D6ED5] mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#12233F]/55">
                        {item.label}
                      </p>
                      <p className="font-semibold text-sm leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white overflow-hidden">
              <iframe
                src={mapSrc}
                width="100%"
                height="400"
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
                // referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </section>

      


      {/* Demo section */}
      <section className="bg-[#EAF2FC] px-6 md:px-12 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#12233F]/55">
              {data.demo?.subtitle || "Unlock your future"}
            </p>

            <h2 className="mt-3 text-4xl font-extrabold">
              {data.demo?.title || "Get a Live Free Demo"}
            </h2>

            <ul className="mt-5 space-y-2 text-[#12233F]/75">
              {(data.demo?.points || []).map((point: string, i: number) => (
                <li key={i}>• {point}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-lg">
            <h3 className="text-3xl font-extrabold text-center text-[#12233F]">
              {data.form?.title || "Book Your Free Demo"}
            </h3>

            <p className="text-center text-sm text-[#12233F]/60 mt-2 mb-6">
              {data.form?.subtitle || ""}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                required
                placeholder="Full name"
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D6ED5]"
              />

              <input
                required
                type="email"
                placeholder="Email address"
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D6ED5]"
              />

              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-md border border-slate-300 bg-slate-50 px-3 text-sm">
                  +91
                </span>
                <input
                  required
                  pattern="[0-9]{10}"
                  placeholder="Phone number"
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D6ED5]"
                />
              </div>

              <select
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D6ED5]"
              >
                <option value="">
                  {coursesLoading ? "Loading courses..." : "Choose a course"}
                </option>
                {courseOptions.map((course) => (
                  <option key={course.id} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>

              <label className="flex items-start gap-2 text-sm text-[#12233F]/70">
                <input required type="checkbox" className="mt-1" />
                <span>I agree with the Terms & Conditions.</span>
              </label>

              <button
                type="submit"
                className="w-full rounded-md bg-gradient-to-r from-[#2C6ED5] to-[#14B8A6] py-3 text-white font-semibold hover:opacity-95 transition"
              >
                {data.form?.button_text || "Submit your details"}
              </button>
            </form>

            {submitted && (
              <p className="mt-3 text-sm text-emerald-600 text-center flex items-center justify-center gap-1">
                <SendHorizontal size={15} /> Details submitted successfully.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}


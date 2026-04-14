"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { apiUrl } from "@/app/lib/api";

const EXPERIENCE_OPTIONS = ["0-1 years", "1-3 years", "3-5 years", "5-8 years", "8+ years"];
const SKILL_SUGGESTIONS = ["React", "Next.js", "Python", "Django", "JavaScript", "TypeScript", "Node.js", "SQL"];

export type InstructorPageData = {
  hero?: {
    title?: string;
    subtitle?: string;
    button_primary_text?: string;
    button_secondary_text?: string;
    background_color?: string;
    text_color?: string;
    seo_meta_title?: string;
    seo_meta_description?: string;
    seo_meta_keywords?: string;
  };
  why_section?: { title?: string; subtitle?: string };
  features?: Array<{ icon?: string; title?: string; description?: string }>;
  cta?: {
    title?: string;
    subtitle?: string;
    button_text?: string;
    background_color?: string;
    text_color?: string;
  };
  form?: { title?: string; subtitle?: string; submit_button_text?: string };
};

type Props = {
  initialData: InstructorPageData | null;
  courses: Array<{ id: number; title: string; category_name?: string }>;
};

export default function InstructorClient({ initialData, courses }: Props) {
  const data: InstructorPageData = initialData ?? {};
  const courseList = Array.isArray(courses) ? courses : [];
  const formSectionRef = useRef<HTMLElement | null>(null);
  const firstNameInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    years_of_experience: "",
    skills: "",
    message: "",
    agreed_to_terms: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    if (courseList.length > 0) {
      setSelectedCourse(courseList[0].id);
    }
  }, [courseList]);

  const selectedCourseObj = courseList.find((course) => course.id === selectedCourse);

  const onFieldChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmitApplication = async (e: any) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.years_of_experience || !formData.skills) {
      setSubmitError("Please fill all required fields.");
      return;
    }
    if (!formData.agreed_to_terms) {
      setSubmitError("Please agree to Terms & Conditions.");
      return;
    }

    setSubmitting(true);
    try {
      const combinedMessage = [formData.message, selectedCourseObj?.title ? `Interested course: ${selectedCourseObj.title}` : ""]
        .filter(Boolean)
        .join("\n");
      const res = await fetch(apiUrl("/api/instructor/applications/submit/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          message: combinedMessage,
        }),
      });

      if (!res.ok) throw new Error();
      setSubmitSuccess("Application submitted successfully.");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        years_of_experience: "",
        skills: "",
        message: "",
        agreed_to_terms: false,
      });
    } catch {
      setSubmitError("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToApplicationForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      firstNameInputRef.current?.focus();
    }, 350);
  };

  // Prevent runtime crash if backend is down / returns empty.
  if (!initialData) {
    return <p className="text-center py-20">Loading...</p>;
  }

  return (
    <main className="bg-[#F5F7FB] text-[#0C1A35] pt-16">

      {/* Breadcrumb */}
      <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs md:text-sm text-slate-500">
          <Home className="w-4 h-4 text-slate-500 mr-1" />
          <Link href="/" className="hover:text-[#0066FF] transition-colors">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-[#001f3f]">Instructor</span>
        </div>
      </section>

      {/* HERO */}
      <section className="text-center py-16 md:py-20 px-6 md:px-12" style={{ backgroundColor: data.hero?.background_color || "#EAF0F8" }}>
        <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: data.hero?.text_color || "#0C1A35" }}>{data.hero?.title}</h1>
        <p className="mt-4 max-w-2xl mx-auto leading-relaxed text-[#5B6B88]">{data.hero?.subtitle}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={scrollToApplicationForm}
            className="bg-[#0C2D57] text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-[#0A2446] transition"
          >
            {data.hero?.button_primary_text || "Apply Now"}
          </button>
          {/* <button className="border border-[#CBD5E1] bg-white px-6 py-2.5 rounded-md text-sm font-semibold text-[#0C1A35] hover:bg-slate-50 transition">{data.hero?.button_secondary_text}</button> */}
        </div>
      </section>

      {/* WHY Section */}
      <section className="py-14 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[#0C1A35]">{data.why_section?.title}</h2>
          <p className="text-[#5B6B88] mt-2">{data.why_section?.subtitle}</p>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {(data.features || []).map((item: any, i: number) => (
              <div key={i} className="bg-white rounded-lg p-6 text-left border border-slate-200 hover:shadow-sm transition">
                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#E0ECFF] text-[#2563EB] mb-4 font-bold">{item.icon || "⭐"}</div>
                <h3 className="font-semibold text-lg text-[#0C1A35]">{item.title}</h3>
                <p className="text-sm text-[#5B6B88] mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 md:px-12 text-center" style={{ backgroundColor: data.cta?.background_color || "#EAF0F8" }}>
        <h2 className="text-4xl md:text-5xl font-extrabold" style={{ color: data.cta?.text_color || "#1E3A68" }}>{data.cta?.title}</h2>
        <p className="text-[#5B6B88] mt-4 max-w-2xl mx-auto">{data.cta?.subtitle}</p>
        <button
          type="button"
          onClick={scrollToApplicationForm}
          className="mt-6 bg-[#0C2D57] text-white px-8 py-2.5 rounded-md text-sm font-semibold hover:bg-[#0A2446] transition"
        >
          {data.cta?.button_text || "Apply Now"}
        </button>
      </section>

      {/* FORM */}
      <section ref={formSectionRef} className="py-14 px-6 md:px-12 bg-white">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-3xl font-extrabold text-center text-[#0C1A35]">{data.form?.title}</h2>
          <p className="text-center text-[#5B6B88] mt-2">{data.form?.subtitle}</p>

          <form className="mt-8 space-y-5" onSubmit={onSubmitApplication}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">First Name *</label>
                <input ref={firstNameInputRef} name="first_name" value={formData.first_name} onChange={onFieldChange} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]" />
              </div>
              <div>
                <label className="text-sm font-semibold">Last Name *</label>
                <input name="last_name" value={formData.last_name} onChange={onFieldChange} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Email *</label>
              <input name="email" type="email" value={formData.email} onChange={onFieldChange} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]" />
            </div>

            <div>
              <label className="text-sm font-semibold">Phone *</label>
              <input name="phone" value={formData.phone} onChange={onFieldChange} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Years of Experience *</label>
                <select name="years_of_experience" value={formData.years_of_experience} onChange={onFieldChange} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5] bg-white">
                  <option value="">Select experience</option>
                  {EXPERIENCE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold">Skills *</label>
                <input name="skills" list="instructor-skills" value={formData.skills} onChange={onFieldChange} placeholder="Type or select your skills..." className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]" />
                <datalist id="instructor-skills">{SKILL_SUGGESTIONS.map(skill => <option key={skill} value={skill} />)}</datalist>
                <p className="text-xs text-[#5B6B88] mt-2">You can type custom skills and separate multiple by commas.</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Message (Optional)</label>
              <textarea name="message" value={formData.message} onChange={onFieldChange} placeholder="Tell us briefly about your expertise..." rows={4} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]" />
              <p className="text-xs text-[#5B6B88] mt-2">Optional - helps our team understand your profile better.</p>
            </div>
            <div>
              <label className="text-sm font-semibold">Course *</label>
              <select
                value={selectedCourse ?? ""}
                onChange={(e) => setSelectedCourse(Number(e.target.value))}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5] bg-white"
                required
              >
                <option value="">Select course</option>
                {courseList.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                    {course.category_name ? ` (${course.category_name})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="agreed_to_terms" checked={formData.agreed_to_terms} onChange={onFieldChange} className="mt-1" />
              <span>
                I agree to the <a href="/terms" className="text-[#2C6ED5] underline">Terms & Conditions</a> and <a href="/privacy" className="text-[#2C6ED5] underline">Privacy Policy</a> *
              </span>
            </label>

            {submitError && <p className="text-sm text-rose-600">{submitError}</p>}
            {submitSuccess && <p className="text-sm text-emerald-600">{submitSuccess}</p>}

            <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-[#2C6ED5] to-[#2563EB] text-white py-2.5 rounded-md font-semibold hover:opacity-95 transition disabled:opacity-70">
              {submitting ? "Submitting..." : data.form?.submit_button_text || "Submit Application"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
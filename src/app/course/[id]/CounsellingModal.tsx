"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { apiUrl } from "@/app/lib/api";
import FormLegalLinks from "@/app/components/legal/FormLegalLinks";
import {
  OTHER_COURSE_VALUE,
  SearchableCourseSelect,
} from "@/app/components/CourseLeadForm";

type Props = {
  courseId?: number;
  courseTitle?: string;
  buttonText?: string;
  className?: string;
};

type LeadForm = {
  full_name: string;
  email: string;
  phone: string;
  selected_course: string;
  other_course: string;
  agreed_to_terms: boolean;
};

type CourseOption = {
  id: number | string;
  title: string;
};

let courseOptionsCache: CourseOption[] | null = null;
let courseOptionsPromise: Promise<CourseOption[]> | null = null;

const initialForm: LeadForm = {
  full_name: "",
  email: "",
  phone: "",
  selected_course: "",
  other_course: "",
  agreed_to_terms: false,
};

async function fetchCourseOptions(): Promise<CourseOption[]> {
  if (courseOptionsCache) return courseOptionsCache;
  if (courseOptionsPromise) return courseOptionsPromise;

  courseOptionsPromise = fetch(apiUrl("/api/courses/"), { cache: "force-cache" })
    .then(async (res) => {
      if (!res.ok) return [] as CourseOption[];
      const data = await res.json();
      if (!Array.isArray(data)) return [] as CourseOption[];
      return data
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
    .catch(() => [] as CourseOption[])
    .finally(() => {
      courseOptionsPromise = null;
    });

  courseOptionsCache = await courseOptionsPromise;
  return courseOptionsCache;
}

export default function CounsellingModal({
  courseId,
  courseTitle = "General Counselling",
  buttonText = "Get Free Counselling",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [form, setForm] = useState<LeadForm>({
    ...initialForm,
    selected_course: courseTitle === "General Counselling" ? "" : courseTitle,
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    async function loadCourses() {
      if (courseOptionsCache) {
        setCourseOptions(courseOptionsCache);
        return;
      }
      setCoursesLoading(true);
      try {
        const options = await fetchCourseOptions();
        if (!mounted) return;
        setCourseOptions(options);
      } catch {
        // If API is down or proxy not configured, avoid unhandled rejection.
        if (mounted) setCourseOptions([]);
      } finally {
        if (mounted) setCoursesLoading(false);
      }
    }
    void loadCourses();
    return () => {
      mounted = false;
    };
  }, [open]);

  const selectableCourses = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    if (courseTitle && courseTitle !== "General Counselling") {
      opts.push({ value: courseTitle, label: courseTitle });
    }
    courseOptions
      .filter((course) => course.title !== courseTitle)
      .forEach((course) => {
        opts.push({ value: course.title, label: course.title });
      });
    return opts;
  }, [courseOptions, courseTitle]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    if (!form.agreed_to_terms) {
      setError("Please agree to Terms & Conditions and Privacy Policy.");
      return;
    }
    const isOther = form.selected_course === OTHER_COURSE_VALUE;
    const courseLabel = isOther
      ? form.other_course.trim() || "Other"
      : form.selected_course.trim();
    if (isOther && !form.other_course.trim()) {
      setError("Please specify the course.");
      return;
    }
    setSubmitting(true);
    try {
      const matchedCourse = courseOptions.find(
        (c) => c.title === form.selected_course,
      );
      const res = await fetch(apiUrl("/api/courses/counselling/submit/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.full_name.trim().split(/\s+/).slice(0, 1).join(""),
          last_name: form.full_name.trim().split(/\s+/).slice(1).join(" "),
          full_name: form.full_name.trim(),
          years_of_experience: "",
          skills: "",
          agreed_to_terms: form.agreed_to_terms,
          message: courseLabel ? `Interested course: ${courseLabel}` : "",
          email: form.email,
          phone: form.phone,
          course: isOther
            ? null
            : courseId ??
              (typeof matchedCourse?.id === "number" ? matchedCourse.id : null),
        }),
      });
      if (!res.ok) {
        setError("Could not submit form. Please try again.");
        return;
      }
      setSuccess("Your request has been submitted.");
      setForm({
        ...initialForm,
        selected_course: courseTitle === "General Counselling" ? "" : courseTitle,
      });
    } catch {
      setError("Network error while submitting form.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`cursor-pointer ${className}`}>
        {buttonText}
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/55">
              <div className="flex min-h-full items-start justify-center px-3 py-6 pb-12 pt-[max(1rem,env(safe-area-inset-top,0px))] md:px-4 md:py-8 md:pb-16 md:pt-[max(1.25rem,env(safe-area-inset-top,0px))]">
                <div
                  className="min-h-0 w-full max-w-xl max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl md:max-h-[calc(100dvh-3.5rem)] md:p-6"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="counselling-modal-title"
                >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="counselling-modal-title"
                  className="text-3xl md:text-4xl font-extrabold text-[#1e293b] leading-tight"
                >
                  Book Your <span className="text-[#0f6ecd]">Free Demo</span>
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Our team will contact you shortly to schedule your session.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-700"
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-base font-semibold text-[#334155]">Full Name</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={onChange}
                  placeholder="Enter your full name"
                  className="mt-2 w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f6ecd] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-base font-semibold text-[#334155]">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  className="mt-2 w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f6ecd] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-base font-semibold text-[#334155]">Phone Number</label>
                <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-300">
                  <span className="inline-flex items-center border-r border-slate-300 bg-slate-50 px-3 text-sm text-slate-600">
                    +91
                  </span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-semibold text-[#334155]">Select Courses</label>
                <div className="mt-2">
                  <SearchableCourseSelect
                    name="selected_course"
                    value={form.selected_course}
                    onChange={(v) =>
                      setForm((prev) => ({
                        ...prev,
                        selected_course: v,
                        other_course: v === OTHER_COURSE_VALUE ? prev.other_course : "",
                      }))
                    }
                    loading={coursesLoading}
                    placeholder={coursesLoading ? "Loading courses..." : "Select a course"}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6ecd] focus:border-transparent"
                    options={selectableCourses}
                  />
                </div>
                {form.selected_course === OTHER_COURSE_VALUE ? (
                  <input
                    name="other_course"
                    value={form.other_course}
                    onChange={onChange}
                    placeholder="Please specify the course"
                    className="mt-2 w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f6ecd] focus:border-transparent"
                  />
                ) : null}
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  name="agreed_to_terms"
                  checked={form.agreed_to_terms}
                  onChange={onChange}
                  className="mt-1"
                />
                <span>
                  <FormLegalLinks />
                </span>
              </label>

              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#0f6ecd] to-[#12a5df] disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

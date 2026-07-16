"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiUrl } from "@/app/lib/api";
import FormLegalLinks from "@/app/components/legal/FormLegalLinks";

export const OTHER_COURSE_VALUE = "__other__";

export type CourseLeadOption = {
  id: number | string;
  title: string;
};

export type SearchableCourseOption = {
  value: string;
  label: string;
};

type SearchableCourseSelectProps = {
  options: SearchableCourseOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  includeOther?: boolean;
  loading?: boolean;
  required?: boolean;
  name?: string;
  ariaLabel?: string;
};

export function SearchableCourseSelect({
  options,
  value,
  onChange,
  placeholder = "Select a course",
  className = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent",
  includeOther = true,
  loading = false,
  required = false,
  name = "course",
  ariaLabel = "Select course",
}: SearchableCourseSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const allOptions = useMemo(() => {
    const base = [...options];
    if (includeOther && !base.some((o) => o.value === OTHER_COURSE_VALUE)) {
      base.push({ value: OTHER_COURSE_VALUE, label: "Other" });
    }
    return base;
  }, [options, includeOther]);

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    return allOptions.find((o) => o.value === value)?.label ?? "";
  }, [allOptions, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((o) => o.label.toLowerCase().includes(q));
  }, [allOptions, query]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;
    const gap = 6;
    const menuMaxH = 240;
    const spaceBelow = viewportH - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUpward = spaceBelow < 180 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      160,
      Math.min(menuMaxH, openUpward ? spaceAbove - 8 : spaceBelow - 8),
    );
    const width = Math.min(rect.width, viewportW - 16);
    const left = Math.min(Math.max(8, rect.left), viewportW - width - 8);

    setMenuStyle({
      position: "fixed",
      top: openUpward ? undefined : rect.bottom + gap,
      bottom: openUpward ? viewportH - rect.top + gap : undefined,
      left,
      width,
      maxHeight: `${maxHeight}px`,
      zIndex: 9999,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const onReposition = () => updateMenuPosition();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
      setQuery("");
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => searchRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const dropdown = open && mounted
    ? createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="shrink-0 border-b border-slate-100 p-2">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
            />
          </div>
          <ul
            role="listbox"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1"
          >
            <li>
              <button
                type="button"
                role="option"
                aria-selected={!value}
                className={`w-full px-3 py-2.5 text-left text-sm hover:bg-slate-50 cursor-pointer ${
                  !value ? "bg-sky-50 text-[#0f6ecd] font-medium" : "text-slate-700"
                }`}
                onClick={() => {
                  onChange("");
                  setOpen(false);
                  setQuery("");
                }}
              >
                {placeholder}
              </button>
            </li>
            {filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-slate-400">No courses found</li>
            ) : (
              filtered.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === o.value}
                    className={`w-full px-3 py-2.5 text-left text-sm hover:bg-slate-50 cursor-pointer ${
                      value === o.value
                        ? "bg-sky-50 text-[#0f6ecd] font-medium"
                        : "text-slate-700"
                    }`}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    {o.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>,
        document.body,
      )
    : null;

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={`${className} flex items-center justify-between gap-2 text-left cursor-pointer`}
      >
        <span className={selectedLabel ? "text-slate-800 truncate" : "text-slate-400 truncate"}>
          {loading ? "Loading courses..." : selectedLabel || placeholder}
        </span>
        <span className="shrink-0 text-slate-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {/* Keep native select for HTML5 required validation / form semantics */}
      <select
        name={name}
        value={value}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only absolute opacity-0 pointer-events-none h-0 w-0"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {allOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {dropdown}
    </div>
  );
}

type Props = {
  courses: CourseLeadOption[];
  defaultCourseId?: number | string | null;
  defaultCourseTitle?: string;
  submitLabel?: string;
  showLegalLinks?: boolean;
  className?: string;
  inputClassName?: string;
  selectClassName?: string;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
};

function resolveCourseLabel(
  selected: string,
  customOther: string,
  courses: CourseLeadOption[],
): string {
  if (selected === OTHER_COURSE_VALUE) {
    const custom = customOther.trim();
    return custom || "Other";
  }
  const match = courses.find((c) => String(c.id) === selected);
  return match?.title?.trim() || "";
}

function resolveCourseId(
  selected: string,
): number | null {
  if (!selected || selected === OTHER_COURSE_VALUE) return null;
  const n = Number(selected);
  return Number.isFinite(n) ? n : null;
}

export default function CourseLeadForm({
  courses,
  defaultCourseId = null,
  defaultCourseTitle,
  submitLabel = "Get Free Demo",
  showLegalLinks = true,
  className = "mt-5 space-y-4",
  inputClassName = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent transition",
  selectClassName = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-sky-50/80 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent",
  buttonClassName = "w-full py-3.5 rounded-xl font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-70",
  buttonStyle,
}: Props) {
  const initialCourse =
    defaultCourseId != null && defaultCourseId !== ""
      ? String(defaultCourseId)
      : "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(initialCourse);
  const [otherCourse, setOtherCourse] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    if (!selectedCourse) {
      setError("Please select a course.");
      return;
    }
    if (showLegalLinks && !agreedToTerms) {
      setError("Please agree to Terms & Conditions and Privacy Policy.");
      return;
    }

    const courseLabel = resolveCourseLabel(selectedCourse, otherCourse, courses);
    const courseFk =
      selectedCourse === OTHER_COURSE_VALUE
        ? null
        : resolveCourseId(selectedCourse) ??
          (defaultCourseId != null && String(defaultCourseId) === selectedCourse
            ? Number(defaultCourseId)
            : null);

    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/courses/counselling/submit/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: fullName.trim().split(/\s+/).slice(0, 1).join(""),
          last_name: fullName.trim().split(/\s+/).slice(1).join(" "),
          full_name: fullName.trim(),
          years_of_experience: "",
          skills: "",
          agreed_to_terms: showLegalLinks ? agreedToTerms : true,
          message: courseLabel ? `Interested course: ${courseLabel}` : "",
          email: email.trim(),
          phone: phone.trim(),
          course: courseFk,
        }),
      });

      if (!res.ok) {
        setError("Could not submit form. Please try again.");
        return;
      }

      setSuccess("Your request has been submitted.");
      setFullName("");
      setEmail("");
      setPhone("");
      setSelectedCourse(initialCourse);
      setOtherCourse("");
      setAgreedToTerms(false);
    } catch {
      setError("Network error while submitting form.");
    } finally {
      setSubmitting(false);
    }
  }

  const courseSelectOptions: SearchableCourseOption[] = useMemo(() => {
    const sorted = [...courses].sort((a, b) => a.title.localeCompare(b.title));
    const opts: SearchableCourseOption[] = sorted.map((item) => ({
      value: String(item.id),
      label: item.title,
    }));
    if (
      defaultCourseTitle &&
      !sorted.some(
        (c) =>
          String(c.id) === String(defaultCourseId) ||
          c.title === defaultCourseTitle,
      )
    ) {
      opts.unshift({
        value: String(defaultCourseId ?? defaultCourseTitle),
        label: defaultCourseTitle,
      });
    }
    return opts;
  }, [courses, defaultCourseId, defaultCourseTitle]);

  return (
    <form className={className} onSubmit={onSubmit}>
      <input
        type="text"
        name="full_name"
        placeholder="Full Name *"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className={inputClassName}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClassName}
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number *"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={inputClassName}
        required
      />

      <SearchableCourseSelect
        name="course"
        value={selectedCourse}
        onChange={(v) => {
          setSelectedCourse(v);
          if (v !== OTHER_COURSE_VALUE) setOtherCourse("");
        }}
        options={courseSelectOptions}
        placeholder="Select a course"
        className={selectClassName}
        required
      />

      {selectedCourse === OTHER_COURSE_VALUE ? (
        <input
          type="text"
          name="other_course"
          placeholder="Please specify the course *"
          value={otherCourse}
          onChange={(e) => setOtherCourse(e.target.value)}
          className={inputClassName}
          required
        />
      ) : null}

      {showLegalLinks ? (
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1"
          />
          <span>
            <FormLegalLinks />
          </span>
        </label>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className={buttonClassName}
        style={buttonStyle}
      >
        {submitting ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}

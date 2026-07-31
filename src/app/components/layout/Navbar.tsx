"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import { useSiteBranding } from "@/app/components/layout/SiteBrandingProvider";
import { apiUrl, type CourseApi } from "@/app/lib/api";

type NavCourse = {
  id: number;
  title: string;
  href: string;
};

const SERVICE_LINKS = [
  { label: "Career Services", href: "/career-services" },
  { label: "On Job Support", href: "/on-job-support" },
  { label: "Corporate Training", href: "/corporate-training" },
] as const;

function slugifyCategory(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function courseHref(c: CourseApi): string {
  const categorySlug =
    (typeof c.category_slug === "string" && c.category_slug.trim()) ||
    (typeof c.category === "object" && c.category !== null
      ? c.category.slug?.trim() || slugifyCategory(c.category.name ?? "")
      : slugifyCategory(c.category_name ?? ""));

  if (categorySlug && c.slug) {
    return `/courses/${categorySlug}/${c.slug}`;
  }

  return `/course/${c.slug}`;
}

function mapCourses(courses: CourseApi[]): NavCourse[] {
  return courses
    .filter((c) => c?.slug && c?.title)
    .map((c) => ({
      id: c.id,
      title: c.title,
      href: courseHref(c),
    }));
}

export default function Navbar({
  hasTopBar = false,
  courses: initialCourses = [],
}: {
  hasTopBar?: boolean;
  courses?: CourseApi[];
}) {
  const { logo } = useSiteBranding();
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [navCourses, setNavCourses] = useState<NavCourse[]>(() =>
    mapCourses(Array.isArray(initialCourses) ? initialCourses : []),
  );

  const coursesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    setNavCourses(mapCourses(Array.isArray(initialCourses) ? initialCourses : []));
  }, [initialCourses]);

  useEffect(() => {
    if (navCourses.length > 0) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/courses/"));
        if (!res.ok) return;
        const data = (await res.json()) as CourseApi[] | { results?: CourseApi[] };
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        if (!cancelled) setNavCourses(mapCourses(list));
      } catch {
        // Keep empty dropdown; Courses still links to /courses.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navCourses.length]);

  useEffect(() => {
    return () => {
      if (coursesCloseTimer.current) clearTimeout(coursesCloseTimer.current);
      if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    };
  }, []);

  const sortedCourses = useMemo(
    () => [...navCourses].sort((a, b) => a.title.localeCompare(b.title)),
    [navCourses],
  );

  const logoSrc = logo
    ? logo.startsWith("http")
      ? logo
      : `${API_URL}${logo}`
    : null;

  const openCourses = () => {
    if (coursesCloseTimer.current) clearTimeout(coursesCloseTimer.current);
    setServicesOpen(false);
    setCoursesOpen(true);
  };

  const closeCourses = () => {
    if (coursesCloseTimer.current) clearTimeout(coursesCloseTimer.current);
    coursesCloseTimer.current = setTimeout(() => setCoursesOpen(false), 120);
  };

  const openServices = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    setCoursesOpen(false);
    setServicesOpen(true);
  };

  const closeServices = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    servicesCloseTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setMobileCoursesOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <nav
      className={`fixed left-0 right-0 z-50 w-full border-b border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-8 ${
        hasTopBar ? "top-9" : "top-0"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt="Logo"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={160}
              height={48}
              className="h-12 w-auto"
            />
          ) : (
            <span className="text-lg font-semibold text-slate-800">
              SkillVedika
            </span>
          )}
        </Link>

        <ul className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-slate-700">
          <li>
            <Link href="/" className="transition hover:text-[#2f5fa8]">
              Home
            </Link>
          </li>

          <li
            className="relative"
            onMouseEnter={openCourses}
            onMouseLeave={closeCourses}
          >
            <Link
              href="/courses"
              className="inline-flex items-center gap-1 transition hover:text-[#2f5fa8]"
              aria-expanded={coursesOpen}
              aria-haspopup="true"
            >
              Courses
              <ChevronDown
                className={`h-3.5 w-3.5 transition ${coursesOpen ? "rotate-180" : ""}`}
              />
            </Link>
            {coursesOpen ? (
              <div
                className="absolute left-0 top-full z-50 pt-2"
                onMouseEnter={openCourses}
                onMouseLeave={closeCourses}
              >
                <div className="max-h-[70vh] w-72 overflow-y-auto rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                  {sortedCourses.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-slate-500">
                      No courses available yet.
                    </p>
                  ) : (
                    sortedCourses.map((course) => (
                      <Link
                        key={course.id}
                        href={course.href}
                        className="block px-4 py-2 text-[13px] text-slate-700 transition hover:bg-slate-50 hover:text-[#2f5fa8]"
                      >
                        {course.title}
                      </Link>
                    ))
                  )}
                  <div className="mt-1 border-t border-slate-100 px-4 pt-2">
                    <Link
                      href="/courses"
                      className="block py-1.5 text-[12px] font-semibold text-[#2f5fa8]"
                    >
                      View all courses
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </li>

          <li
            className="relative"
            onMouseEnter={openServices}
            onMouseLeave={closeServices}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 transition hover:text-[#2f5fa8]"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <ChevronDown
                className={`h-3.5 w-3.5 transition ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen ? (
              <div
                className="absolute left-0 top-full z-50 pt-2"
                onMouseEnter={openServices}
                onMouseLeave={closeServices}
              >
                <div className="w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                  {SERVICE_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-[13px] text-slate-700 transition hover:bg-slate-50 hover:text-[#2f5fa8]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </li>

          <li>
            <Link href="/instructor" className="transition hover:text-[#2f5fa8]">
              Instructor
            </Link>
          </li>
          <li>
            <Link href="/blog" className="transition hover:text-[#2f5fa8]">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/about" className="transition hover:text-[#2f5fa8]">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="transition hover:text-[#2f5fa8]">
              Contact
            </Link>
          </li>
        </ul>

        <div className="hidden lg:flex gap-4">
          <CounsellingModal
            buttonText="Free Demo"
            className="rounded-md border border-[#2f5fa8] px-4 py-1.5 text-sm font-medium text-[#2f5fa8] transition hover:bg-[#2f5fa8] hover:text-white"
          />
        </div>

        <button
          type="button"
          className="lg:hidden flex flex-col gap-1"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="h-0.5 w-6 bg-slate-800" />
          <span className="h-0.5 w-6 bg-slate-800" />
          <span className="h-0.5 w-6 bg-slate-800" />
        </button>
      </div>

      {menuOpen ? (
        <div className="lg:hidden mt-3 border-t border-slate-200 bg-white px-4 py-4 shadow-sm">
          <ul className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            <li>
              <Link href="/" onClick={closeMobileMenu} className="block hover:text-[#2f5fa8]">
                Home
              </Link>
            </li>

            <li>
              <button
                type="button"
                className="flex w-full items-center justify-between hover:text-[#2f5fa8]"
                onClick={() => setMobileCoursesOpen((v) => !v)}
                aria-expanded={mobileCoursesOpen}
              >
                Courses
                <ChevronDown
                  className={`h-4 w-4 transition ${mobileCoursesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileCoursesOpen ? (
                <div className="mt-2 space-y-1 border-l border-slate-200 pl-3">
                  {sortedCourses.length === 0 ? (
                    <p className="py-1 text-xs text-slate-500">No courses available yet.</p>
                  ) : (
                    sortedCourses.map((course) => (
                      <Link
                        key={course.id}
                        href={course.href}
                        onClick={closeMobileMenu}
                        className="block py-1.5 text-[13px] text-slate-600 hover:text-[#2f5fa8]"
                      >
                        {course.title}
                      </Link>
                    ))
                  )}
                  <Link
                    href="/courses"
                    onClick={closeMobileMenu}
                    className="block py-1.5 text-[13px] font-semibold text-[#2f5fa8]"
                  >
                    View all courses
                  </Link>
                </div>
              ) : null}
            </li>

            <li>
              <button
                type="button"
                className="flex w-full items-center justify-between hover:text-[#2f5fa8]"
                onClick={() => setMobileServicesOpen((v) => !v)}
                aria-expanded={mobileServicesOpen}
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition ${mobileServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileServicesOpen ? (
                <div className="mt-2 space-y-1 border-l border-slate-200 pl-3">
                  {SERVICE_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block py-1.5 text-[13px] text-slate-600 hover:text-[#2f5fa8]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>

            <li>
              <Link
                href="/instructor"
                onClick={closeMobileMenu}
                className="block hover:text-[#2f5fa8]"
              >
                Instructor
              </Link>
            </li>
            <li>
              <Link href="/blog" onClick={closeMobileMenu} className="block hover:text-[#2f5fa8]">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={closeMobileMenu} className="block hover:text-[#2f5fa8]">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block hover:text-[#2f5fa8]"
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="mt-4">
            <CounsellingModal
              buttonText="Free Demo"
              className="w-full rounded-md border border-[#2f5fa8] px-4 py-2 text-sm font-medium text-[#2f5fa8] transition hover:bg-[#2f5fa8] hover:text-white"
            />
          </div>
        </div>
      ) : null}
    </nav>
  );
}

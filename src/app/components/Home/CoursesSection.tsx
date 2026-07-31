import Link from "next/link";
import {
  fetchCategories,
  fetchCourses,
  type CategoryApi,
  type CourseApi,
} from "@/app/lib/api";
import CoursesSectionClient from "./CoursesSectionClient";

export default async function CoursesSection() {
  let courses: CourseApi[] = [];
  let categories: CategoryApi[] = [];
  let loadError = false;

  try {
    const [coursesData, categoriesData] = await Promise.all([
      fetchCourses(),
      fetchCategories(),
    ]);
    courses = Array.isArray(coursesData) ? coursesData : [];
    categories = Array.isArray(categoriesData) ? categoriesData : [];
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <section className="px-4 sm:px-12 py-20 text-center bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2744]">Explore Skill for Changing World</h2>
        <p className="text-sm text-[#64748b] mt-3 max-w-lg mx-auto leading-relaxed">
          Choose an upskill program that aligns with your Passion & Goals
        </p>
        <p className="text-sm text-[#64748b] mt-6 max-w-md mx-auto">
          We couldn&apos;t load courses. Ensure Django is running and set{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">NEXT_PUBLIC_API_BASE_URL</code> or use the default API
          proxy in <code className="text-xs bg-slate-100 px-1 rounded">next.config.ts</code>.
        </p>
        <Link
          href="/courses"
          className="inline-block mt-8 rounded-full px-8 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: "#2b5a9e" }}
        >
          View All Courses
        </Link>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="px-4 sm:px-12 py-20 text-center bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2744]">Explore Skill for Changing World</h2>
        <p className="text-sm text-[#64748b] mt-3">Choose an upskill program that aligns with your Passion & Goals</p>
        <p className="text-sm text-[#64748b] mt-6">No courses in the catalog yet. Add courses in Django admin.</p>
        <Link
          href="/courses"
          className="inline-block mt-8 rounded-full px-8 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: "#2b5a9e" }}
        >
          Browse Courses
        </Link>
      </section>
    );
  }

  // Show every active category from admin (not only ones that already have courses).
  const allCategories = [...categories].sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" }),
  );

  return (
    <CoursesSectionClient
      courses={courses}
      categories={allCategories}
    />
  );
}

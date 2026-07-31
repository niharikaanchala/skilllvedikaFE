"use server";

import { redirect } from "next/navigation";
import {
  fetchCategories,
  fetchCourses,
  type CategoryApi,
  type CourseApi,
} from "@/app/lib/api";
import { courseHref } from "@/app/lib/course-links";

function normalizeSearchText(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function compactSearchKey(value: string): string {
  return normalizeSearchText(value).replace(/[^a-z0-9]/g, "");
}

function searchPathSegment(value: string): string {
  return encodeURIComponent(normalizeSearchText(value).replace(/\s+/g, "-"));
}

export async function handleHeroSearch(formData: FormData) {
  const rawQuery = String(formData.get("q") ?? "").trim();
  if (!rawQuery) {
    redirect("/courses");
  }

  const [courses, categories] = await Promise.all([
    fetchCourses().catch(() => [] as CourseApi[]),
    fetchCategories().catch(() => [] as CategoryApi[]),
  ]);
  const compactQ = compactSearchKey(rawQuery);

  const exactMatch = courses.find((course) => {
    return (
      compactSearchKey(course.title || "") === compactQ ||
      compactSearchKey(course.slug || "") === compactQ
    );
  });

  if (exactMatch) {
    redirect(courseHref(exactMatch));
  }

  const exactCategoryMatch = categories.find((category) => {
    return (
      compactSearchKey(category.name || "") === compactQ ||
      compactSearchKey(category.slug || "") === compactQ
    );
  });

  if (exactCategoryMatch?.slug?.trim()) {
    redirect(`/courses/${exactCategoryMatch.slug.trim()}`);
  }

  redirect(`/courses/search/${searchPathSegment(rawQuery)}`);
}

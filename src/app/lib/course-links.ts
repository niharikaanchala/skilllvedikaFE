import type { CourseApi } from "@/app/lib/api";

function slugifyCategory(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function courseHref(course: CourseApi): string {
  const categorySlug =
    (typeof course.category_slug === "string" && course.category_slug.trim()) ||
    (typeof course.category === "object" && course.category !== null
      ? course.category.slug?.trim() || slugifyCategory(course.category.name ?? "")
      : slugifyCategory(course.category_name ?? ""));

  if (categorySlug && course.slug) {
    return `/courses/${categorySlug}/${course.slug}`;
  }

  return `/course/${course.slug}`;
}

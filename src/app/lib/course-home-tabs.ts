import type { CourseApi } from "./api";

/** Normalize rating from API (number or string). */
export function courseRating(c: CourseApi): number {
  const r = c.rating as unknown;
  if (typeof r === "number" && Number.isFinite(r)) return r;
  const n = Number(r);
  return Number.isFinite(n) ? n : 0;
}

/** Detect free / zero-priced courses from backend string fields. */
export function isFreeCoursePrice(price: string | undefined | null): boolean {
  const v = (price ?? "").toLowerCase().trim();
  if (!v) return false;
  if (v.includes("free")) return true;
  const digits = v.replace(/[^\d.]/g, "");
  if (digits === "" || digits === "0" || digits === "0.0" || digits === "0.00") return true;
  const num = parseFloat(digits);
  return Number.isFinite(num) && num === 0;
}

/**
 * Split courses into Trending / Popular / Free for the home page.
 * Uses rating sort + non-overlapping thirds so tabs stay populated with real DB data
 * (strict rating thresholds often leave every tab empty).
 */
export function splitCoursesForHomeTabs(courses: CourseApi[]): {
  trending: CourseApi[];
  popular: CourseApi[];
  free: CourseApi[];
} {
  if (!courses.length) {
    return { trending: [], popular: [], free: [] };
  }

  const sorted = [...courses].sort((a, b) => courseRating(b) - courseRating(a));
  const free = sorted.filter((c) => isFreeCoursePrice(c.price));

  const n = sorted.length;
  const third = Math.max(1, Math.ceil(n / 3));
  const twoThird = Math.ceil((2 * n) / 3);

  let trending = sorted.slice(0, third);
  let popular = sorted.slice(third, twoThird);

  if (popular.length === 0 && n > 1) {
    popular = sorted.slice(third);
  }
  if (popular.length === 0 && n === 1) {
    popular = [...trending];
  }

  return { trending, popular, free };
}

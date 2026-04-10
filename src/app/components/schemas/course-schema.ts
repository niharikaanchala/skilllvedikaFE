import type { CourseApi } from "@/app/lib/api";

const SITE_URL = "https://skillvedika.com";

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim();
}

function toAbsoluteUrl(pathOrUrl: string): string {
  const value = normalizeText(pathOrUrl);
  if (!value) return SITE_URL;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function parsePrice(raw: string | undefined): string | undefined {
  const value = normalizeText(raw);
  if (!value) return undefined;
  const only = value.replace(/[^0-9.]/g, "");
  return only || undefined;
}

function courseCore(course: CourseApi, url: string) {
  const description =
    normalizeText(course.description) || "Professional course by SkillVedika.";
  const provider = {
    "@type": "Organization",
    name: "SkillVedika",
    url: SITE_URL,
  };
  const price = parsePrice(course.price);

  return {
    "@type": "Course",
    name: normalizeText(course.title) || "Course",
    description,
    provider,
    url,
    ...(Number.isFinite(course.rating)
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(course.rating),
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price,
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {}),
  };
}

export function buildCourseListSchema(courses: CourseApi[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SkillVedika Courses",
    itemListElement: courses.map((course, index) => {
      const url = toAbsoluteUrl(`/course/${course.slug}`);
      return {
        "@type": "ListItem",
        position: index + 1,
        url,
        item: courseCore(course, url),
      };
    }),
  };
}

export function buildCourseDetailSchema(course: CourseApi) {
  const url = toAbsoluteUrl(`/course/${course.slug}`);
  return {
    "@context": "https://schema.org",
    ...courseCore(course, url),
  };
}

import type { CategoryApi, CourseApi } from "@/app/lib/api";

const SITE_URL = "https://skillvedika.com";

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim();
}

function toAbsoluteUrl(pathOrUrl: string | undefined): string | undefined {
  const value = normalizeText(pathOrUrl);
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function categoryCore(category: CategoryApi, url: string) {
  const description =
    normalizeText(category.description) || `${normalizeText(category.name) || "Category"} courses on SkillVedika.`;

  return {
    "@type": "CollectionPage",
    name: normalizeText(category.name) || "Course Category",
    description,
    url,
    about: {
      "@type": "Thing",
      name: normalizeText(category.name) || "Category",
    },
  };
}

export function buildCategoryListSchema(categories: CategoryApi[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Course Categories",
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: toAbsoluteUrl(`/courses/${category.slug}`) || `${SITE_URL}/courses`,
      name: normalizeText(category.name) || "Category",
      description: normalizeText(category.description) || undefined,
    })),
  };
}

export function buildCategoryDetailSchema(
  category: CategoryApi,
  courses: CourseApi[] = [],
) {
  const url = toAbsoluteUrl(`/courses/${category.slug}`) || `${SITE_URL}/courses`;
  return {
    "@context": "https://schema.org",
    ...categoryCore(category, url),
    ...(courses.length
      ? {
          hasPart: {
            "@type": "ItemList",
            name: `${normalizeText(category.name) || "Category"} Courses`,
            itemListElement: courses.map((course, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url:
                toAbsoluteUrl(`/course/${course.slug}`) || `${SITE_URL}/courses/${category.slug}`,
              item: {
                "@type": "Course",
                name: normalizeText(course.title) || "Course",
                description: normalizeText(course.description) || undefined,
              },
            })),
          },
        }
      : {}),
  };
}

import type { HomeHeroApi } from "@/app/lib/home-page";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import {
  fetchCategories,
  fetchCourses,
  fetchHomeCourseScrollingItems,
  type CategoryApi,
  type CourseApi,
} from "@/app/lib/api";
import { redirect } from "next/navigation";

type Props = {
  data?: HomeHeroApi | null;
};

function headingSegments(heading: string): string[] {
  const parts = heading
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) return parts;
  const idx = heading.indexOf(".");
  if (idx > 0 && idx < heading.length - 1) {
    return [heading.slice(0, idx + 1).trim(), heading.slice(idx + 1).trim()];
  }
  return [heading];
}

function highlightLines(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function tagList(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function courseHref(course: CourseApi): string {
  const categorySlug =
    typeof course.category === "object" && course.category !== null
      ? (course.category.slug || "").trim()
      : "";
  const fallbackCategory =
    course.category_name?.trim() ||
    (typeof course.category === "object" && course.category !== null
      ? course.category.name?.trim()
      : "") ||
    "course";

  return `/courses/${categorySlug || slugifyCategory(fallbackCategory)}/${course.slug}`;
}

function courseCategoryFields(course: CourseApi): { name: string; slug: string } {
  if (typeof course.category === "object" && course.category !== null) {
    return {
      name: (course.category.name || course.category_name || "").trim(),
      slug: (course.category.slug || "").trim(),
    };
  }
  return {
    name: (course.category_name || "").trim(),
    slug: "",
  };
}

function normalizeSearchText(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function compactSearchKey(value: string): string {
  return normalizeSearchText(value).replace(/[^a-z0-9]/g, "");
}

function searchPathSegment(value: string): string {
  return encodeURIComponent(normalizeSearchText(value).replace(/\s+/g, "-"));
}

/**
 * Home hero: only fields returned by the API (Django). No fallback marketing copy.
 */
export default async function HeroSection({ data }: Props) {
  async function handleHeroSearch(formData: FormData) {
    "use server";
    const rawQuery = String(formData.get("q") ?? "").trim();
    if (!rawQuery) {
      redirect("/courses");
    }

    const [courses, categories] = await Promise.all([
      fetchCourses().catch(() => [] as CourseApi[]),
      fetchCategories().catch(() => [] as CategoryApi[]),
    ]);
    const normalizedQ = normalizeSearchText(rawQuery);
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

  if (!data?.heading?.trim()) {
    return null;
  }

  const heading = data.heading.trim();
  const headingParts = headingSegments(heading);
  const secondLineIndex = headingParts.length >= 2 ? 1 : -1;
  const subheading = data.subheading?.trim();
  const highlights = highlightLines(data.highlights);
  const tags = tagList(data.popular_tags);
  const searchPh = data.search_placeholder?.trim();
  const ctaText = data.cta_text?.trim();
  const cardTitle = data.right_card_title?.trim();
  const cardSubtitle = data.right_card_subtitle?.trim();

  const showRightCard = Boolean(cardTitle || cardSubtitle);
  const showRightVisual = Boolean(data.image) || showRightCard;
  const categoriesPromise = fetchCategories().catch(() => [] as CategoryApi[]);
  const categories = await categoriesPromise;
  const movingTags = categories.length > 0
    ? categories.map((category) => category.name)
    : tags;
  const homeScrollingItems = await fetchHomeCourseScrollingItems().catch(() => [] as string[]);
  const marqueeTags =
   movingTags.length > 0 ? [...movingTags, ...movingTags] : [];
  const bottomHeroScrollingItems = homeScrollingItems;

  return (
    <section className="relative overflow-hidden border-b border-slate-200/60 bg-[#eaf0f7] pt-12 pb-24 md:pt-16 md:pb-28">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-6 md:px-10 md:py-12">
      <div className="w-full max-w-none">
        <h1 className="text-2xl font-extrabold leading-[1.15] tracking-tight text-[#152c4e] sm:text-3xl md:text-5xl">
          {headingParts.map((line, index) => (
            <span key={`${line}-${index}`} className={index === secondLineIndex ? "text-[#2d5fa8]" : undefined}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h1>
        {subheading ? <p className="mt-4 text-sm text-slate-600 sm:text-[15px] md:text-base">{subheading}</p> : null}

        {/* {highlights.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
            {highlights.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        ) : null} */}

        {searchPh ? (
          <form action={handleHeroSearch} className="mt-6 flex w-full max-w-xl flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm sm:flex-row">
            <input
              type="search"
              name="q"
              placeholder={searchPh}
              className="w-full border-0 bg-white px-4 py-2.5 text-sm outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#2f5fa8] px-4 py-2.5 text-sm font-medium text-white sm:py-0"
              aria-label="Search courses"
            >
              <span className="sm:hidden">Search</span>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>
        ) : null}

        {marqueeTags.length > 0 ? (
          <div className="hero-categories mt-4">
            <div className="hero-categories-track text-xs">
              {marqueeTags.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="cursor-default rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {ctaText ? (
          <div className="mt-7">
            <CounsellingModal buttonText={ctaText} className="inline-flex w-full items-center justify-center rounded-md bg-[#2f5fa8] px-6 py-2.5 text-sm font-semibold text-white sm:inline-flex sm:w-auto" />
          </div>
        ) : null}
      </div>

      {showRightVisual ? (
        <div className="relative mx-auto flex h-[240px] w-full max-w-[280px] items-center justify-center sm:h-[280px] sm:max-w-[320px] md:ml-auto md:h-[420px] md:max-w-[380px]">
          <div className="absolute h-full w-full rounded-full bg-gradient-to-br from-[#f8fbff] to-[#d9e7f7] shadow-inner" />
          {data.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.image}
              alt={heading}
              className="relative z-10 max-h-[220px] max-w-[240px] rounded-3xl object-contain sm:max-h-[250px] sm:max-w-[270px] md:max-h-[390px] md:max-w-[390px]"
            />
          ) : showRightCard ? (
            <div className="relative z-10 grid h-[180px] w-[180px] max-w-[240px] place-items-center rounded-3xl border border-white bg-white/80 p-5 shadow-lg backdrop-blur sm:h-[210px] sm:w-[210px] md:h-[260px] md:w-[260px] md:p-6">
              <div className="text-center">
                {cardTitle ? (
                  <div className="text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">{cardTitle}</div>
                ) : null}
                {cardSubtitle ? (
                  <div className="mt-3 text-sm text-slate-600">{cardSubtitle}</div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      </div>
      {bottomHeroScrollingItems.length > 0 ? (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-[#ffcc00] border-t-2 border-yellow-400 py-4 shadow-lg">
          <div className="hero-marquee w-max">
            {[...bottomHeroScrollingItems, ...bottomHeroScrollingItems, ...bottomHeroScrollingItems, ...bottomHeroScrollingItems].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="mx-10 inline-flex items-center whitespace-nowrap text-xl md:text-2xl font-bold text-[#0a2540]"
              >
                ⭐ {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

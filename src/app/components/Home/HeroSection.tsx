import type { HomeHeroApi } from "@/app/lib/home-page";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import {
  fetchCategories,
  fetchCourses,
  fetchHomeCourseScrollingItems,
  type CategoryApi,
  type CourseApi,
} from "@/app/lib/api";
import { courseHref } from "@/app/lib/course-links";
import Link from "next/link";
import { handleHeroSearch } from "./hero-actions";
import { HeroTrendingCourses } from "./HeroTrendingCourses";

type Props = {
  data?: HomeHeroApi | null;
};

type HeroTag = {
  label: string;
  href: string;
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

function tagList(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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

function resolveHeroTags(
  categories: CategoryApi[],
  courses: CourseApi[],
  fallbackTags: string[],
): HeroTag[] {
  if (categories.length > 0) {
    return categories
      .filter((category) => category.slug?.trim() && category.name?.trim())
      .map((category) => ({
        label: category.name.trim(),
        href: `/courses/${category.slug.trim()}`,
      }));
  }

  return fallbackTags.map((label) => {
    const compact = compactSearchKey(label);
    const matchedCourse = courses.find(
      (course) =>
        compactSearchKey(course.title || "") === compact ||
        compactSearchKey(course.slug || "") === compact,
    );
    if (matchedCourse) {
      return { label, href: courseHref(matchedCourse) };
    }

    return { label, href: `/courses/search/${searchPathSegment(label)}` };
  });
}

/**
 * Home hero banner + overlapping trending course cards (reference layout).
 */
export default async function HeroSection({ data }: Props) {
  if (!data?.heading?.trim()) {
    return null;
  }

  const heading = data.heading.trim();
  const headingParts = headingSegments(heading);
  const secondLineIndex = headingParts.length >= 2 ? 1 : -1;
  const subheading = data.subheading?.trim();
  const tags = tagList(data.popular_tags);
  const searchPh = data.search_placeholder?.trim();
  const ctaText = data.cta_text?.trim();
  const cardTitle = data.right_card_title?.trim();
  const cardSubtitle = data.right_card_subtitle?.trim();

  const showRightCard = Boolean(cardTitle || cardSubtitle);
  const showRightVisual = Boolean(data.image) || showRightCard;
  const [categories, courses] = await Promise.all([
    fetchCategories().catch(() => [] as CategoryApi[]),
    fetchCourses().catch(() => [] as CourseApi[]),
  ]);
  const heroTags = resolveHeroTags(categories, courses, tags);
  const marqueeTags = heroTags.length > 0 ? [...heroTags, ...heroTags] : [];
  const homeScrollingItems = await fetchHomeCourseScrollingItems().catch(() => [] as string[]);
  const bottomHeroScrollingItems = homeScrollingItems;
  const trendingCount = courses.filter((c) => Boolean(c.is_trending)).length;
  const hasTrending = trendingCount > 0;

  return (
    <div className="relative">
      {/* Hero banner only — trending cards sit below and overlap this edge */}
      <section
        className={`relative bg-[#eaf0f7] pt-[calc(var(--sv-nav-offset)+0.75rem)] ${
          hasTrending ? "pb-28 md:pb-32" : "pb-0"
        }`}
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-6 md:px-10 md:pb-10 md:pt-12">
          <div className="w-full max-w-none">
            <h1 className="text-2xl font-extrabold leading-[1.15] tracking-tight text-[#152c4e] sm:text-3xl md:text-5xl">
              {headingParts.map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={index === secondLineIndex ? "text-[#2d5fa8]" : undefined}
                >
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </h1>
            {subheading ? (
              <p className="mt-4 text-sm text-slate-600 sm:text-[15px] md:text-base">
                {subheading}
              </p>
            ) : null}

            {searchPh ? (
              <form
                action={handleHeroSearch}
                className="mt-6 flex w-full max-w-xl flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm sm:flex-row"
              >
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
                    <Link
                      key={`${item.label}-${index}`}
                      href={item.href}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-[#2f5fa8] hover:text-[#2f5fa8]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {ctaText ? (
              <div className="mt-7">
                <CounsellingModal
                  buttonText={ctaText}
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#2f5fa8] px-6 py-2.5 text-sm font-semibold text-white sm:inline-flex sm:w-auto"
                />
              </div>
            ) : null}
          </div>

          {showRightVisual ? (
            <div className="relative mx-auto flex h-[240px] w-full max-w-[280px] items-center justify-center sm:h-[280px] sm:max-w-[320px] md:ml-auto md:h-[360px] md:max-w-[380px]">
              <div className="absolute h-full w-full rounded-full bg-gradient-to-br from-[#f8fbff] to-[#d9e7f7] shadow-inner" />
              {data.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.image}
                  alt={heading}
                  className="relative z-10 max-h-[220px] max-w-[240px] rounded-3xl object-contain sm:max-h-[250px] sm:max-w-[270px] md:max-h-[340px] md:max-w-[360px]"
                />
              ) : showRightCard ? (
                <div className="relative z-10 grid h-[180px] w-[180px] max-w-[240px] place-items-center rounded-3xl border border-white bg-white/80 p-5 shadow-lg backdrop-blur sm:h-[210px] sm:w-[210px] md:h-[260px] md:w-[260px] md:p-6">
                  <div className="text-center">
                    {cardTitle ? (
                      <div className="text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">
                        {cardTitle}
                      </div>
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
          <div className="relative z-10 w-full overflow-hidden border-t-2 border-yellow-400 bg-[#ffcc00] py-3 shadow-md">
            <div className="hero-marquee w-max">
              {[
                ...bottomHeroScrollingItems,
                ...bottomHeroScrollingItems,
                ...bottomHeroScrollingItems,
                ...bottomHeroScrollingItems,
              ].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="mx-10 inline-flex items-center whitespace-nowrap text-lg font-bold text-[#0a2540] md:text-xl"
                >
                  ⭐ {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Overlap strip: top of cards sits on hero, bottom sits on white */}
      {hasTrending ? (
        <div className="relative z-30 -mt-24 bg-gradient-to-b from-transparent via-white to-white pb-8 pt-0 md:-mt-28 md:pb-10">
          <HeroTrendingCourses courses={courses} />
        </div>
      ) : null}
    </div>
  );
}

import type { HomeHeroApi } from "@/app/lib/home-page";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import { fetchCategories, type CategoryApi } from "@/app/lib/api";
import { redirect } from "next/navigation";

type Props = {
  data?: HomeHeroApi | null;
};

function headingLines(heading: string): [string, string | null] {
  const parts = heading
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(" ")];
  const idx = heading.indexOf(".");
  if (idx > 0 && idx < heading.length - 1) {
    return [heading.slice(0, idx + 1).trim(), heading.slice(idx + 1).trim()];
  }
  return [heading, null];
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

/**
 * Home hero: only fields returned by the API (Django). No fallback marketing copy.
 */
export default async function HeroSection({ data }: Props) {
  async function handleHeroSearch(formData: FormData) {
    "use server";
    const rawQuery = String(formData.get("q") ?? "").trim();
    const categorySlug = String(formData.get("category") ?? "").trim();
    const query = rawQuery ? `?q=${encodeURIComponent(rawQuery)}` : "";
    const target = categorySlug ? `/courses/${categorySlug}${query}` : `/courses${query}`;
    redirect(target);
  }

  if (!data?.heading?.trim()) {
    return null;
  }

  const heading = data.heading.trim();
  const [line1, line2] = headingLines(heading);
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

  return (
    <section className="border-b border-slate-200/60 bg-[#eaf0f7] pt-12 md:pt-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-6 md:px-10 md:py-12">
      <div className="w-full max-w-none">
        <h1 className="text-2xl font-extrabold leading-[1.15] tracking-tight text-[#152c4e] sm:text-3xl md:text-5xl">
          {line1}
          {line2 ? (
            <>
              <br />
              <span className="text-[#2d5fa8]">{line2}</span>
            </>
          ) : null}
        </h1>
        {subheading ? <p className="mt-4 text-sm text-slate-600 sm:text-[15px] md:text-base">{subheading}</p> : null}

        {highlights.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
            {highlights.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        ) : null}

        {searchPh ? (
          <form action={handleHeroSearch} className="mt-6 flex w-full max-w-xl flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm sm:flex-row">
            <select
              name="category"
              className="w-full border-0 border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none sm:max-w-[42%] sm:border-b-0 sm:border-r"
              defaultValue=""
              aria-label="Select category"
            >
              <option value="">All categories</option>
              {(await categoriesPromise).map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
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

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {tags.map((item) => (
              <span
                key={item}
                className="cursor-default rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600"
              >
                {item}
              </span>
            ))}
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
              alt=""
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
    </section>
  );
}

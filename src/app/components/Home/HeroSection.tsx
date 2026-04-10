import type { HomeHeroApi } from "@/app/lib/home-page";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";

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
export default function HeroSection({ data }: Props) {
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

  return (
    <section className="border-b border-slate-200/60 bg-[#eaf0f7] pt-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-10 md:grid-cols-[1.15fr_0.85fr] md:gap-6 md:px-10 md:py-12">
      <div className="w-full max-w-none">
        <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-[#152c4e] md:text-5xl">
          {line1}
          {line2 ? (
            <>
              <br />
              <span className="text-[#2d5fa8]">{line2}</span>
            </>
          ) : null}
        </h1>
        {subheading ? <p className="mt-4 text-[15px] text-slate-600 md:text-base">{subheading}</p> : null}

        {highlights.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
            {highlights.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        ) : null}

        {searchPh ? (
          <form action="/courses" method="GET" className="mt-6 flex w-full max-w-xl rounded-md border border-slate-200 bg-white shadow-sm">
            <input
              type="search"
              name="q"
              placeholder={searchPh}
              className="w-full rounded-l-md border-0 bg-white px-4 py-2.5 text-sm outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-r-md bg-[#2f5fa8] px-4 text-white"
              aria-label="Search courses"
            >
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
            <CounsellingModal buttonText={ctaText} className="inline-block rounded-md bg-[#2f5fa8] px-6 py-2.5 text-sm font-semibold text-white" />
          </div>
        ) : null}
      </div>

      {showRightVisual ? (
        <div className="relative ml-auto flex h-[320px] w-full max-w-[360px] items-center justify-center md:h-[420px] md:max-w-[380px]">
          <div className="absolute h-full w-full rounded-full bg-gradient-to-br from-[#f8fbff] to-[#d9e7f7] shadow-inner" />
          {data.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.image}
              alt=""
              className="relative z-10 max-h-[290px] max-w-[310px] rounded-3xl object-contain md:max-h-[390px] md:max-w-[390px]"
            />
          ) : showRightCard ? (
            <div className="relative z-10 grid h-[220px] w-[220px] max-w-[280px] place-items-center rounded-3xl border border-white bg-white/80 p-6 shadow-lg backdrop-blur md:h-[260px] md:w-[260px]">
              <div className="text-center">
                {cardTitle ? (
                  <div className="text-xl font-extrabold leading-tight text-slate-900">{cardTitle}</div>
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

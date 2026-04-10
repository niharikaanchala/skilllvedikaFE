import CounsellingModal from "@/app/course/[id]/CounsellingModal";

type Props = {
  heading: string;
  intro: string;
  tabs: string[];
  ctaText: string;
  ctaLink: string | null;
};

export default function SupportSection({ heading, intro, tabs, ctaText, ctaLink }: Props) {
  const h = heading.trim();
  if (!h) {
    return null;
  }

  const introT = intro.trim();
  const introLines = introT
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const tabList = tabs.map((t) => t.trim()).filter(Boolean);
  const cta = ctaText.trim();

  return (
    <section
      className="relative bg-cover bg-center py-24 text-center text-white md:py-28"
      style={{
        backgroundImage:
          "linear-gradient(rgba(6, 14, 27, 0.74), rgba(6, 14, 27, 0.74)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4">
      <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">{h}</h2>
      {introT ? (
        <p className="mx-auto mt-4 max-w-[560px] text-sm leading-6 text-white/90 md:text-base">
          {introLines.length > 0
            ? introLines.map((line, idx) => (
                <span key={`${line}-${idx}`} className="block">
                  {line}
                </span>
              ))
            : introT}
        </p>
      ) : null}

      {tabList.length > 0 ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {tabList.slice(0, 4).map((item) => (
            <span
              key={item}
              className="min-w-[88px] rounded-sm border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-[#2f5fa8] shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {cta ? (
        <div className="mt-5">
          <CounsellingModal
            buttonText={cta}
            className="inline-block rounded-sm bg-[#2f5fa8] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#264f8d]"
          />
        </div>
      ) : null}
      </div>
    </section>
  );
}

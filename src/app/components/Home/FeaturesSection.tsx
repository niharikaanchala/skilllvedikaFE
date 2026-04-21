type Item = { title: string; description?: string; icon?: string };

type Props = {
  heading: string;
  intro: string;
  items: Item[];
};

export default function FeaturesSection({ heading, intro, items }: Props) {
  const h = heading.trim();
  const introT = intro.trim();
  const hasItems = items.length > 0;

  if (!h && !introT && !hasItems) {
    return null;
  }

  const showCopy = Boolean(h || introT);

  return (
    <section className="bg-gradient-to-b from-[#eef5fc] to-[#e3edf8] px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-2 items-center">

        {/* LEFT CONTENT */}
        {showCopy ? (
          <div className="space-y-4">
            {h && (
              <h2 className="text-3xl md:text-4xl font-bold text-[#183760] leading-snug">
                {h.split(" ").map((word, i, arr) => {
                  const isLast = i === arr.length - 1;

                  return (
                    <span
                      key={i}
                      className={isLast ? "text-[#2f5fa8]" : ""}
                    >
                      {word}
                      {i !== arr.length - 1 && " "}
                    </span>
                  );
                })}
              </h2>
            )}

            {introT && (
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-md">
                {introT}
              </p>
            )}
          </div>
        ) : (
          <div />
        )}

        {/* RIGHT FEATURES */}
        {hasItems ? (
          <div className="grid gap-4">
            {items.slice(0, 4).map((f, i) => (
              <div
                key={`${f.title}-${i}`}
                className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-[#e6f0ff]"
              >
                {/* NUMBER BADGE */}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2f5fa8]/10 text-sm font-bold text-[#2f5fa8] group-hover:bg-[#2f5fa8] group-hover:text-white transition">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* TEXT */}
                <div>
                  <p className="text-sm md:text-base font-semibold text-slate-800">
                    {f.title}
                  </p>
                  {f.description && (
                    <p className="mt-1 text-xs md:text-sm text-slate-500 leading-relaxed">
                      {f.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}

      </div>
    </section>
  );
}
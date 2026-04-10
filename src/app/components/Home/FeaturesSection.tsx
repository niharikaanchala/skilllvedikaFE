import { CheckCircle } from "lucide-react";

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
    <section className="bg-[#e8f0f8] px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.1fr_220px_1.1fr]">
        {showCopy ? (
          <div>
            {h ? <h2 className="text-3xl font-bold leading-snug text-[#183760]">{h}</h2> : null}
            {introT ? <p className="mt-4 text-sm leading-relaxed text-slate-600">{introT}</p> : null}
          </div>
        ) : (
          <div />
        )}

        <div className="mx-auto hidden h-44 w-44 place-items-center rounded-full border-2 border-[#2f5fa8]/50 bg-[#f2f7fd] shadow-inner md:grid">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-[#2f5fa8] shadow-sm">
            <CheckCircle size={34} aria-hidden />
          </div>
        </div>

        {hasItems ? (
          <div className="space-y-3">
            {items.slice(0, 4).map((f, i) => (
              <div
                key={`${f.title}-${i}`}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2f5fa8]/10 text-xs font-bold text-[#2f5fa8]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{f.title}</p>
                  {f.description ? (
                    <p className="mt-0.5 text-xs text-slate-500">{f.description}</p>
                  ) : null}
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

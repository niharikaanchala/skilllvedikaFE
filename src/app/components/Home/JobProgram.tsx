type JobItem = { title: string; description: string };
import {
  GraduationCap,
  Brain,
  MessageSquareText,
  FileText,
  Star,
  UserRound,
} from "lucide-react";

type Props = {
  heading: string;
  intro: string;
  items: JobItem[];
};

export default function JobProgram({ heading, intro, items }: Props) {
  const h = heading.trim();
  const introT = intro.trim();
  const hasItems = items.length > 0;

  if (!h && !introT && !hasItems) {
    return null;
  }

  const iconForTitle = (title: string, idx: number) => {
    const key = title.toLowerCase();
    if (key.includes("course") || key.includes("completion")) return GraduationCap;
    if (key.includes("quiz")) return Brain;
    if (key.includes("mock") || key.includes("interview")) return MessageSquareText;
    if (key.includes("resume")) return FileText;
    if (key.includes("rating")) return Star;
    if (key.includes("profile") || key.includes("market")) return UserRound;
    const fallback = [GraduationCap, Brain, MessageSquareText, FileText, Star, UserRound];
    return fallback[idx % fallback.length];
  };

  return (
    <section className="bg-[#edf1f7] px-6 py-14 text-center md:px-10 md:py-16">
      {h ? <h2 className="text-3xl font-bold text-[#173765]">{h}</h2> : null}
      {introT ? <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">{introT}</p> : null}

      {hasItems ? (
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 text-left md:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,39,68,0.06)] transition hover:shadow-[0_6px_14px_rgba(15,39,68,0.12)]"
            >
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c7d6ea] bg-[#eef4fb] text-[#2c4f86]">
                {(() => {
                  const Icon = iconForTitle(item.title, i);
                  return <Icon size={16} strokeWidth={2} aria-hidden />;
                })()}
              </div>
              <div>
                <p className="font-semibold text-[#1a2d49]">{item.title}</p>
                {item.description ? <p className="mt-1 text-sm leading-5 text-slate-600">{item.description}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

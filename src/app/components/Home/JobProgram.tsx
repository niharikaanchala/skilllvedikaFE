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
    <section className="bg-gradient-to-b from-[#f3f7fc] to-[#e9f0f8] px-6 py-16 md:px-10 text-center">
      
      {/* HEADER */}
      {h ? (
        <h2 className="text-3xl md:text-4xl font-bold text-[#173765]">
          {h}
        </h2>
      ) : null}

      {introT ? (
        <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-slate-600 leading-relaxed">
          {introT}
        </p>
      ) : null}

      {/* ITEMS */}
      {hasItems ? (
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 text-left md:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-[#f0f6ff]"
            >
              
              {/* ICON */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c7d6ea] bg-[#eef4fb] text-[#2c4f86] transition group-hover:bg-[#2f5fa8] group-hover:text-white">
                {(() => {
                  const Icon = iconForTitle(item.title, i);
                  return <Icon size={18} strokeWidth={2} aria-hidden />;
                })()}
              </div>

              {/* TEXT */}
              <div>
                <p className="text-base font-semibold text-[#1a2d49]">
                  {item.title}
                </p>
                {item.description ? (
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                ) : null}
              </div>

            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
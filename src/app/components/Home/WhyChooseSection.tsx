type Item = { title: string; description: string; icon?: string };

type Props = {
  heading: string;
  intro: string;
  items: Item[];
};

function badgeText(item: Item): string {
  const ic = item.icon?.trim();
  if (ic) return ic.slice(0, 2);
  const t = item.title?.trim();
  if (t) return t.charAt(0).toUpperCase();
  return "•";
}

export default function WhyChooseSection({ heading, intro, items }: Props) {
  const h = heading.trim();
  const introT = intro.trim();
  const hasItems = items.length > 0;

  if (!h && !introT && !hasItems) {
    return null;
  }

  return (
    <section className="bg-white px-6 py-12 md:px-12 md:py-14">
      {(h || introT) && (
        <div className="text-center">
          {h ? <h2 className="text-3xl font-semibold text-gray-900">{h}</h2> : null}
          {introT ? <p className="mx-auto mt-3 max-w-2xl text-gray-600">{introT}</p> : null}
        </div>
      )}

      {hasItems ? (
        <div className="mx-auto mt-8 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className="rounded-xl bg-[#EEF3F8] p-6 text-left transition hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#3B6CB7] text-sm font-bold text-white">
                {badgeText(item)}
              </div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

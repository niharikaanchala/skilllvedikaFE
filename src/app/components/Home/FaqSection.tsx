"use client";

import { useState } from "react";

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

type Props = {
  heading: string;
  intro: string;
  items: FaqItem[];
};

export default function FaqSection({ heading, intro, items }: Props) {
  const h = heading.trim();
  const introT = intro.trim();
  const list = items.filter((i) => i.question?.trim() && i.answer?.trim());
  const showHeader = Boolean(h || introT);

  if (!showHeader && list.length === 0) {
    return null;
  }

  const [openId, setOpenId] = useState<number | null>(list[0]?.id ?? null);

  return (
    <section className="bg-white px-6 py-16 md:px-12 md:py-20">
      {showHeader ? (
        <div className="text-center">
          {h ? <h2 className="text-3xl font-semibold text-gray-900">{h}</h2> : null}
          {introT ? <p className="mx-auto mt-2 max-w-2xl text-gray-600">{introT}</p> : null}
        </div>
      ) : null}

      {list.length > 0 ? (
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {list.map((faq) => (
            <div
              key={faq.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                <span className="text-xl text-blue-600" aria-hidden>
                  {openId === faq.id ? "−" : "+"}
                </span>
              </button>
              {openId === faq.id ? (
                <div className="border-t border-gray-100 px-6 pb-5 text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

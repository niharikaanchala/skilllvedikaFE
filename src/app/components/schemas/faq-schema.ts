const SITE_URL = "https://skillvedika.com";

export type FaqSchemaItem = {
  question: string;
  answer: string;
};

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim();
}

function toAbsoluteUrl(pathOrUrl: string | undefined): string | undefined {
  const value = normalizeText(pathOrUrl);
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function toQuestionEntity(item: FaqSchemaItem) {
  return {
    "@type": "Question",
    name: normalizeText(item.question),
    acceptedAnswer: {
      "@type": "Answer",
      text: normalizeText(item.answer),
    },
  };
}

function cleanFaqs(items: FaqSchemaItem[]): FaqSchemaItem[] {
  return items.filter(
    (item) => normalizeText(item.question) && normalizeText(item.answer),
  );
}

export function buildFaqPageSchema(
  items: FaqSchemaItem[],
  options?: { url?: string; name?: string },
) {
  const faqs = cleanFaqs(items);
  const url = toAbsoluteUrl(options?.url);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(normalizeText(options?.name)
      ? { name: normalizeText(options?.name) }
      : {}),
    ...(url ? { url } : {}),
    mainEntity: faqs.map(toQuestionEntity),
  };
}

export function buildFaqListSchema(items: FaqSchemaItem[]) {
  const faqs = cleanFaqs(items);
  return faqs.map(toQuestionEntity);
}

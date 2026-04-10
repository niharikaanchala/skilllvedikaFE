const SITE_URL = "https://skillvedika.com";

export type BreadcrumbSchemaItem = {
  name: string;
  url?: string;
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

export function buildBreadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  const clean = items.filter((item) => normalizeText(item.name));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: clean.map((item, index) => {
      const absoluteUrl = toAbsoluteUrl(item.url);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: normalizeText(item.name),
        ...(absoluteUrl
          ? {
              item: absoluteUrl,
            }
          : {}),
      };
    }),
  };
}

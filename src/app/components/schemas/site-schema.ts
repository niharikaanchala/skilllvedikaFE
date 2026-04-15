const SITE_URL = "https://skillvedika.com";

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: "SkillVedika",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-logo.ico`,
    email: "support@skillvedika.com",
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: "SkillVedika",
    publisher: {
      "@id": `${SITE_URL}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/courses/search/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildHomePageSchema(options?: {
  title?: string;
  description?: string;
  image?: string;
}) {
  const normalizedImage = (() => {
    const value = (options?.image ?? "").trim();
    if (!value) return undefined;
    return /^https?:\/\//i.test(value)
      ? value
      : `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
  })();

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: (options?.title ?? "").trim() || "SkillVedika",
    description: (options?.description ?? "").trim() || undefined,
    isPartOf: {
      "@id": `${SITE_URL}#website`,
    },
    about: {
      "@id": `${SITE_URL}#organization`,
    },
    ...(normalizedImage ? { primaryImageOfPage: normalizedImage } : {}),
  };
}

// lib/home-page.ts
import { apiUrl } from "./api";

/** Types from API */
export type HomeHeroApi = {
  id: number;
  heading: string;
  subheading?: string;
  image: string | null;
  cta_text: string;
  cta_link: string | null;
  highlights?: string;
  popular_tags?: string;
  right_card_title?: string;
  right_card_subtitle?: string;
  search_placeholder?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
};

export type HomePageBundleApi = {
  hero: HomeHeroApi | null;
  features: { id: number; title: string; description: string; icon: string }[];
  why_choose: { id: number; title: string; description: string; icon: string }[];
  job_program: { id: number; title: string; description: string }[];
  section_copy: Record<string, { heading: string; intro: string }>;
  support: {
    id: number;
    heading: string;
    plan_tabs: string;
    cta_text: string;
    cta_link: string | null;
    tabs: string[];
  } | null;
  faq: { id: number; question: string; answer: string }[];
};

export type ResolvedHomeContent = {
  hero: HomeHeroApi | null;
  whyHeading: string;
  whyIntro: string;
  whyItems: { title: string; description: string; icon?: string }[];
  featuresHeading: string;
  featuresIntro: string;
  featureItems: { title: string; description?: string; icon?: string }[];
  jobHeading: string;
  jobIntro: string;
  jobItems: { title: string; description: string }[];
  support: {
    heading: string;
    intro: string;
    tabs: string[];
    ctaText: string;
    ctaLink: string | null;
  } | null;
  faqHeading: string;
  faqIntro: string;
  faqItems: { id: number; question: string; answer: string }[];
};

function emptyResolved(): ResolvedHomeContent {
  return {
    hero: null,
    whyHeading: "",
    whyIntro: "",
    whyItems: [],
    featuresHeading: "",
    featuresIntro: "",
    featureItems: [],
    jobHeading: "",
    jobIntro: "",
    jobItems: [],
    support: null,
    faqHeading: "",
    faqIntro: "",
    faqItems: [],
  };
}

/** Fetch the homepage bundle from API */
export async function fetchHomePageBundle(): Promise<HomePageBundleApi | null> {
  try {
    const res = await fetch(apiUrl("/api/home/bundle/"), { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as HomePageBundleApi;
  } catch {
    return null;
  }
}

/** Resolve API bundle into frontend-friendly content */
export function resolveHomeContent(
  bundle: HomePageBundleApi | null,
): ResolvedHomeContent {
  if (!bundle) return emptyResolved();

  // Section copy
  const sc = bundle.section_copy ?? {};
  const featuresBlock = sc.features;
  const whyBlock = sc.why_choose;
  const jobBlock = sc.job_program;
  const faqBlock = sc.faq;
  const support = bundle.support;

  const supportResolved =
    support && support.heading?.trim()
      ? {
          heading: support.heading.trim(),
          intro: (sc.support?.intro ?? "").trim(),
          tabs: (support.tabs ?? []).map((t) => t.trim()).filter(Boolean),
          ctaText: (support.cta_text ?? "").trim(),
          ctaLink: support.cta_link?.trim() || null,
        }
      : null;

  return {
    hero: bundle.hero,
    whyHeading: (whyBlock?.heading ?? "").trim() || "",
    whyIntro: (whyBlock?.intro ?? "").trim() || "",
    whyItems: (bundle.why_choose ?? []).map((row) => ({
      title: row.title,
      description: row.description,
      icon: row.icon?.trim() || undefined,
    })),
    featuresHeading: (featuresBlock?.heading ?? "").trim() || "",
    featuresIntro: (featuresBlock?.intro ?? "").trim() || "",
    featureItems: (bundle.features ?? []).map((row) => ({
      title: row.title,
      description: row.description?.trim() || undefined,
      icon: row.icon?.trim() || undefined,
    })),
    jobHeading: (jobBlock?.heading ?? "").trim() || "",
    jobIntro: (jobBlock?.intro ?? "").trim() || "",
    jobItems: (bundle.job_program ?? []).map((row) => ({
      title: row.title,
      description: row.description?.trim() || "",
    })),
    support: supportResolved,
    faqHeading: (faqBlock?.heading ?? "").trim() || "FAQs",
    faqIntro: (faqBlock?.intro ?? "").trim() || "",
    faqItems: (bundle.faq ?? []).map((row) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
    })),
  };
}
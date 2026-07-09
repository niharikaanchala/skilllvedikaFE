/**
 * Base URL for Django (no trailing slash).
 *
 * - Set `NEXT_PUBLIC_API_BASE_URL` to your API origin (e.g. `http://127.0.0.1:8000`).
 * - If unset: **server** (RSC/SSR) uses `http://127.0.0.1:8000` because Node `fetch` cannot use
 *   relative URLs like `/api/...` (Invalid URL). **Browser** uses relative `/api/...` so Next
 *   `rewrites` can proxy when you fetch from the client.
 */
const ENV_API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
const DEFAULT_SERVER_API = (process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

function apiOrigin(): string {
  // If explicitly configured, always use it.
  if (ENV_API_BASE) return ENV_API_BASE;
  // For SSR/RSC, we must use an absolute URL.
  if (typeof window === "undefined") return DEFAULT_SERVER_API;
  // In the browser, default to relative URLs so Next rewrites can proxy (/api/*).
  return "";
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = apiOrigin();
  // console.log("origin: ", origin)
  // console.log("p: ", p)
  return origin ? `${origin}${p}` : p;
}

export type CategoryApi = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string | null;
};

export type SiteSettingApi = {
  id: number;
  google_analytics_id?: string | null;
  whatsapp_number?: string | null;
  whatsapp_message?: string | null;
};

export type SiteBrandingApi = {
  brand_name?: string;
  logo?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  youtube_url?: string | null;
};

export type LegalPageApi = {
  id?: number;
  page_type?: "terms" | "privacy" | "disclaimer" | "editorial-policy";
  title?: string;
  content?: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
  seo_meta_keywords?: string;
};

export type CourseApi = {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: string;
  rating: number;
  seo_meta_title?: string;
  seo_meta_description?: string;
  seo_meta_keywords?: string;
  category: number | CategoryApi;
  category_name?: string;
};

export type CourseSkillApi = { id: number; course: number; name: string; description?: string };
export type CourseToolApi = { id: number; course: number; name: string };
export type CourseCurriculumApi = {
  id: number;
  course: number;
  title: string;
  content: string;
};
export type CourseProjectApi = {
  id: number;
  course: number;
  title: string;
  description: string;
};
export type CourseSalaryApi = {
  id: number;
  course: number;
  role: string;
  range: string;
};
export type CourseFaqApi = {
  id: number;
  course: number;
  question: string;
  answer: string;
};
export type CourseBatchApi = {
  id: number;
  course: number;
  date: string;
  mode: string;
  seats: string;
  limited: boolean;
};
export type CourseBlogLinkApi = {
  id: number;
  course: number;
  title: string;
  date: string;
};
export type CourseTrainerApi = {
  id: number;
  course: number;
  name: string;
  company: string;
  exp: string;
  skills: string;
};

export type CourseAboutApi = { id: number; course: number; heading?: string; content: string };
export type CoursePlacementSupportApi = { id: number; course: number; heading?: string; content: string };
export type CourseCorporateTrainingApi = { id: number; course: number; heading?: string; content: string };

export type CourseSectionMetaApi = {
  id: number;
  course: number;
  about_heading?: string;
  skills_heading?: string;
  tools_heading?: string;
  curriculum_heading?: string;
  projects_heading?: string;
  salary_heading?: string;
  placement_support_heading?: string;
  corporate_training_heading?: string;
  trainers_heading?: string;
  batches_heading?: string;
  blogs_heading?: string;
  faqs_heading?: string;

  // Scrolling marquee (hero bottom)
  scrolling_enabled?: boolean;
  scrolling_location?: "course" | "home" | "both";
  scrolling_items?: string;
};

async function fetchJsonOptionalArray<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(apiUrl(path), { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchCourseById(id: number): Promise<CourseApi | null> {
  try {
    const res = await fetch(apiUrl(`/api/courses/${id}/`), { next: { revalidate: 300 } });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Course row from course-details slug endpoint (minimal); use with fetchCourseById for full row. */
export async function fetchCourseIdBySlug(slug: string): Promise<number | null> {
  try {
    const res = await fetch(
      apiUrl(`/api/course-details/course/${encodeURIComponent(slug)}/`),
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: number };
    return typeof data.id === "number" ? data.id : null;
  } catch {
    return null;
  }
}

export async function fetchCourseSkills(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/skills/`
      : `/api/course-details/courses/${courseRef}/skills/`;
  return fetchJsonOptionalArray<CourseSkillApi>(path);
}

export async function fetchCourseTools(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/tools/`
      : `/api/course-details/courses/${courseRef}/tools/`;
  return fetchJsonOptionalArray<CourseToolApi>(path);
}

export async function fetchCourseCurriculum(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/curriculum/`
      : `/api/course-details/courses/${courseRef}/curriculum/`;
  return fetchJsonOptionalArray<CourseCurriculumApi>(path);
}

export async function fetchCourseProjects(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/projects/`
      : `/api/course-details/courses/${courseRef}/projects/`;
  return fetchJsonOptionalArray<CourseProjectApi>(path);
}

export async function fetchCourseSalaries(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/salary/`
      : `/api/course-details/courses/${courseRef}/salary/`;
  return fetchJsonOptionalArray<CourseSalaryApi>(path);
}

export async function fetchCourseFaqs(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/faqs/`
      : `/api/course-details/courses/${courseRef}/faqs/`;
  return fetchJsonOptionalArray<CourseFaqApi>(path);
}

export async function fetchCourseBatches(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/batches/`
      : `/api/course-details/courses/${courseRef}/batches/`;
  return fetchJsonOptionalArray<CourseBatchApi>(path);
}

export async function fetchCourseBlogsForCourse(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/blogs/`
      : `/api/course-details/courses/${courseRef}/blogs/`;
  return fetchJsonOptionalArray<CourseBlogLinkApi>(path);
}

export async function fetchCourseTrainers(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/trainers/`
      : `/api/course-details/courses/${courseRef}/trainers/`;
  return fetchJsonOptionalArray<CourseTrainerApi>(path);
}

export async function fetchCourseAbout(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/about/`
      : `/api/course-details/courses/${courseRef}/about/`;
  return fetchJsonOptionalArray<CourseAboutApi>(path);
}

export async function fetchCoursePlacementSupport(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/placement-support/`
      : `/api/course-details/courses/${courseRef}/placement-support/`;
  return fetchJsonOptionalArray<CoursePlacementSupportApi>(path);
}

export async function fetchCourseCorporateTraining(courseRef: number | string) {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/corporate-training/`
      : `/api/course-details/courses/${courseRef}/corporate-training/`;
  return fetchJsonOptionalArray<CourseCorporateTrainingApi>(path);
}

export async function fetchCourseSectionMeta(courseRef: number | string): Promise<CourseSectionMetaApi | null> {
  const path =
    typeof courseRef === "string"
      ? `/api/course-details/course/${encodeURIComponent(courseRef)}/meta/`
      : `/api/course-details/courses/${courseRef}/meta/`;
  try {
    const res = await fetch(apiUrl(path), { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchHomeCourseScrollingItems(): Promise<string[]> {
  try {
    const res = await fetch(apiUrl("/api/course-details/home-scrolling/"), {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map((x) => String(x)) : [];
  } catch {
    return [];
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }

  return res.json();
}

export function fetchCategories(): Promise<CategoryApi[]> {
  return fetchJson<CategoryApi[]>("/api/categories/").catch(() => []);
}

export function fetchCourses(): Promise<CourseApi[]> {
  return fetchJson<CourseApi[]>("/api/courses/").catch(() => []);
}

export async function fetchCoursesByCategory(
  categoryId: number,
): Promise<CourseApi[]> {
  const res = await fetch(
    apiUrl(`/api/courses/category/${categoryId}/`),
    { next: { revalidate: 300 } },
  );
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(
      `Failed to fetch courses by category ${categoryId}: ${res.status}`,
    );
  }
  return res.json();
}

export type CoursesPageFaqItemApi = {
  id?: number;
  question?: string;
  answer?: string;
};

export type CoursesPageContentApi = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  hero_cta_link?: string;
  hero_cta_text?: string;
  heroCtaButtons?: { text?: string; link?: string; variant?: string }[];
  whyTitle?: string;
  whyIntro?: string;
  whyPoints?: string[];
  whyPointsHtml?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtons?: { text?: string; link?: string; variant?: string }[];
  /** Legacy keys used by some pages */
  ctaHeading?: string;
  ctaText?: string;
  faqHeading?: string;
  faqIntro?: string;
  faqItems?: CoursesPageFaqItemApi[];
};

export type CategoryPageFaqItemApi = {
  question?: string;
  answer?: string;
};

export type CategoryPageContentApi = {
  category?: number;
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  hero_cta_link?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  why_title?: string;
  why_points?: string[];
  cta_title?: string;
  cta_subtitle?: string;
  cta_buttons?: { text?: string; link?: string; variant?: string }[];
  faq_heading?: string;
  faq_intro?: string;
  faq_items?: CategoryPageFaqItemApi[];
};

export type BlogParagraphApi = { content: string };
export type BlogTocApi = { title: string };

export type BlogPostApi = {
  id: number;
  slug: string;
  category: string;
  title: string;
  author: string;
  date: string;
  read_time: string;
  excerpt: string;
  image_url?: string;
  paragraphs: BlogParagraphApi[];
  toc: BlogTocApi[];
};

export function fetchBlogs(): Promise<BlogPostApi[]> {
  return fetch(apiUrl("/api/blog/"), { cache: "no-store" }).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch /api/blog/: ${res.status}`);
    }
    return res.json() as Promise<BlogPostApi[]>;
  });
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPostApi | null> {
  const res = await fetch(apiUrl(`/api/blog/${encodeURIComponent(slug)}/`), {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch blog: ${res.status}`);
  }
  return res.json();
}

export async function fetchCoursesPageContent(): Promise<CoursesPageContentApi | null> {
  try {
    const res = await fetch(
      apiUrl("/api/courses/courses-page-content/"),
      { next: { revalidate: 300 } },
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const raw = (await res.json()) as CoursesPageContentApi & {
      faqItems?: CoursesPageContentApi["faqItems"] | string;
      faq_items?: CoursesPageContentApi["faqItems"] | string;
      whyPoints?: CoursesPageContentApi["whyPoints"] | string;
      why_points?: CoursesPageContentApi["whyPoints"] | string;
    };

    const faqRaw = raw.faqItems ?? raw.faq_items;
    let faqItems: CoursesPageContentApi["faqItems"] = Array.isArray(faqRaw) ? faqRaw : [];
    if (!Array.isArray(faqRaw) && typeof faqRaw === "string") {
      try {
        const parsed = JSON.parse(faqRaw);
        if (Array.isArray(parsed)) faqItems = parsed;
      } catch {
        faqItems = [];
      }
    }

    const whyRaw = raw.whyPoints ?? raw.why_points;
    let whyPoints: CoursesPageContentApi["whyPoints"] = Array.isArray(whyRaw)
      ? whyRaw.filter((x): x is string => typeof x === "string")
      : [];
    let whyPointsHtml = "";
    const whyPointsRaw = whyRaw as unknown;
    if (!Array.isArray(whyPointsRaw) && typeof whyPointsRaw === "string") {
      const normalizedWhy = whyPointsRaw.trim();
      const hasHtml = /<[^>]+>/.test(normalizedWhy);
      if (hasHtml) {
        whyPointsHtml = normalizedWhy;
        whyPoints = [];
      } else {
        whyPoints = normalizedWhy
          .split("\n")
          .map((x: string) => x.trim())
          .filter(Boolean);
      }
    }

    return {
      ...raw,
      faqItems,
      whyPoints,
      whyPointsHtml,
    };
  } catch {
    return null;
  }
}

export async function fetchCategoryPageContent(categoryId: number): Promise<CategoryPageContentApi | null> {
  try {
    const res = await fetch(apiUrl(`/api/categories/${categoryId}/page-content/`), {
      next: { revalidate: 300 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const raw = (await res.json()) as CategoryPageContentApi & {
      faq_items?: CategoryPageContentApi["faq_items"] | string;
      faqItems?: CategoryPageContentApi["faq_items"] | string;
      why_points?: CategoryPageContentApi["why_points"] | string;
      whyPoints?: CategoryPageContentApi["why_points"] | string;
      cta_buttons?: CategoryPageContentApi["cta_buttons"] | string;
      ctaButtons?: CategoryPageContentApi["cta_buttons"] | string;
    };

    let faq_items: CategoryPageContentApi["faq_items"] = [];
    const faqRaw = raw.faq_items ?? raw.faqItems;
    if (Array.isArray(faqRaw)) {
      faq_items = faqRaw;
    } else if (typeof faqRaw === "string") {
      try {
        const parsed = JSON.parse(faqRaw);
        if (Array.isArray(parsed)) faq_items = parsed;
      } catch {
        faq_items = [];
      }
    }

    let why_points: CategoryPageContentApi["why_points"] = [];
    const whyRaw = raw.why_points ?? raw.whyPoints;
    if (Array.isArray(whyRaw)) {
      why_points = whyRaw.filter((x): x is string => typeof x === "string");
    } else if (typeof whyRaw === "string") {
      try {
        const parsed = JSON.parse(whyRaw);
        if (Array.isArray(parsed)) {
          why_points = parsed.filter((x): x is string => typeof x === "string");
        } else {
          why_points = whyRaw
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean);
        }
      } catch {
        why_points = whyRaw
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean);
      }
    }

    let cta_buttons: CategoryPageContentApi["cta_buttons"] = [];
    const ctaRaw = raw.cta_buttons ?? raw.ctaButtons;
    if (Array.isArray(ctaRaw)) {
      cta_buttons = ctaRaw;
    } else if (typeof ctaRaw === "string") {
      try {
        const parsed = JSON.parse(ctaRaw);
        if (Array.isArray(parsed)) cta_buttons = parsed;
      } catch {
        cta_buttons = [];
      }
    }

    return { ...raw, faq_items, why_points, cta_buttons };
  } catch {
    return null;
  }
}

export async function fetchSiteSettings(): Promise<SiteSettingApi[]> {
  try {
    const res = await fetch(apiUrl("/api/settings_app/"), { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    // console.log("data: ", data)
    return Array.isArray(data) ? (data as SiteSettingApi[]) : [];
  } catch {
    return [];
  }
}

export async function fetchSiteBranding(): Promise<SiteBrandingApi | null> {
  try {
    const res = await fetch(apiUrl("/api/home/branding/"), { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<SiteBrandingApi>;
    return {
      brand_name: typeof data.brand_name === "string" ? data.brand_name : undefined,
      logo: typeof data.logo === "string" ? data.logo : null,
      facebook_url: typeof data.facebook_url === "string" ? data.facebook_url : null,
      instagram_url: typeof data.instagram_url === "string" ? data.instagram_url : null,
      linkedin_url: typeof data.linkedin_url === "string" ? data.linkedin_url : null,
      youtube_url: typeof data.youtube_url === "string" ? data.youtube_url : null,
    };
  } catch {
    return null;
  }
}

export async function fetchLegalPage(
  pageType: "terms" | "privacy" | "disclaimer" | "editorial-policy",
): Promise<LegalPageApi | null> {
  try {
    const res = await fetch(apiUrl(`/api/legal/${pageType}/`), {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as unknown;
    if (Array.isArray(raw)) {
      const first = raw[0] as LegalPageApi | undefined;
      return first ?? null;
    }
    if (raw && typeof raw === "object") {
      return raw as LegalPageApi;
    }
    return null;
  } catch {
    return null;
  }
}



// 🔷 CAREER PAGE API
export type CareerHeroApi = {
  title: string;
  subtitle: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
};

export type CareerServiceApi = {
  id: number;
  title: string;
  description: string;
  icon?: string;
};

export type CareerSupportApi = {
  title: string;
  description: string;
};

export type CareerCTAApi = {
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
};

export type CareerFAQApi = {
  id: number;
  question: string;
  answer: string;
  section_title?: string;
  heading?: string;
  title?: string;
};

export type CareerPageApi = {
  meta?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  };
  hero?: CareerHeroApi;
  services?: CareerServiceApi[];
  services_heading?: {
    title?: string;
  };
  faq_heading?: {
    title?: string;
  } | string;
  faqs_heading?: {
    title?: string;
  } | string;
  faq_title?: string;
  faq_section_title?: string;
  support?: CareerSupportApi;
  cta?: CareerCTAApi;
  faqs?: CareerFAQApi[];
};

export async function fetchCareerPage(): Promise<CareerPageApi> {
  const res = await fetch(apiUrl("/api/career/page/"), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch career page: ${res.status}`);
  }

  return res.json();
}
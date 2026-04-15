import type { Metadata } from "next";
import ContactClient, { type ContactPageData } from "./ContactClient";
import { apiUrl } from "@/app/lib/api";

async function fetchContactPageData(): Promise<ContactPageData | null> {
  try {
    const res = await fetch(apiUrl("/api/contact/contact-page/"), {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    if (!json || typeof json !== "object") return null;
    return json as ContactPageData;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchContactPageData();
  const meta = data?.meta ?? {};

  const title =
    meta.meta_title?.trim() ||
    "Contact | SkillVedika";

  const description =
    meta.meta_description?.trim() ||
    "Contact SkillVedika for course enquiries, counselling, and training support.";

  const keywords = (meta.meta_keywords ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const url = "https://skillvedika.com/contact";

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "SkillVedika",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ContactPage() {
  const initialData = await fetchContactPageData();
  return <ContactClient initialData={initialData} />;
}

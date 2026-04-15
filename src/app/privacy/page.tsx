import type { Metadata } from "next";
import { fetchLegalPage } from "@/app/lib/api";
import LegalDocumentLayout from "@/app/components/legal/LegalDocumentLayout";

async function getPrivacyPage() {
  return fetchLegalPage("privacy");
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPrivacyPage();
  const title = page?.seo_meta_title?.trim() || page?.title?.trim() || "Privacy Policy";
  const description = page?.seo_meta_description?.trim() || "Read SkillVedika privacy policy.";
  const keywords = (page?.seo_meta_keywords ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: "https://skillvedika.com/privacy" },
  };
}

export default async function PrivacyPage() {
  const page = await getPrivacyPage();
  const title = page?.title?.trim() || "Privacy Policy";
  const content = page?.content?.trim() || "Privacy Policy content will be available soon.";

  return <LegalDocumentLayout title={title} content={content} />;
}


import type { Metadata } from "next";
import { fetchLegalPage } from "@/app/lib/api";
import LegalDocumentLayout from "@/app/components/legal/LegalDocumentLayout";

async function getTermsPage() {
  return fetchLegalPage("terms");
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getTermsPage();
  const title = page?.seo_meta_title?.trim() || page?.title?.trim() || "Terms & Conditions";
  const description = page?.seo_meta_description?.trim() || "Read SkillVedika terms and conditions.";
  const keywords = (page?.seo_meta_keywords ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: "https://skillvedika.com/terms" },
  };
}

export default async function TermsPage() {
  const page = await getTermsPage();
  const title = page?.title?.trim() || "Terms & Conditions";
  const content = page?.content?.trim() || "Terms & Conditions content will be available soon.";

  return <LegalDocumentLayout title={title} content={content} />;
}


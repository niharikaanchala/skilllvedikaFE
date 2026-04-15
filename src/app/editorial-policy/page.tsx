import type { Metadata } from "next";
import { fetchLegalPage } from "@/app/lib/api";
import LegalDocumentLayout from "@/app/components/legal/LegalDocumentLayout";

async function getEditorialPolicyPage() {
  return fetchLegalPage("editorial-policy");
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getEditorialPolicyPage();
  const title = page?.seo_meta_title?.trim() || page?.title?.trim() || "Editorial Policy";
  const description = page?.seo_meta_description?.trim() || "Read SkillVedika editorial policy.";
  const keywords = (page?.seo_meta_keywords ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: "https://skillvedika.com/editorial-policy" },
  };
}

export default async function EditorialPolicyPage() {
  const page = await getEditorialPolicyPage();
  const title = page?.title?.trim() || "Editorial Policy";
  const content = page?.content?.trim() || "Editorial Policy content will be available soon.";

  return <LegalDocumentLayout title={title} content={content} />;
}

import type { Metadata } from "next";
import { fetchLegalPage } from "@/app/lib/api";

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

  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <section className="mx-auto w-full max-w-4xl px-6 md:px-8">
        <h1 className="text-3xl font-extrabold text-[#001f3f] md:text-4xl">{title}</h1>
        <div
          className="prose prose-slate mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>
    </main>
  );
}


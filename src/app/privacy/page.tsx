import type { Metadata } from "next";
import { fetchLegalPage } from "@/app/lib/api";

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


import type { Metadata } from "next";
import { Suspense } from "react";
import HeroSection from "./components/Home/HeroSection";
import CoursesSection from "./components/Home/CoursesSection";
import FeaturesSection from "./components/Home/FeaturesSection";
import JobProgram from "./components/Home/JobProgram";
import SupportSection from "./components/Home/SupportSection";
import BlogSection from "./components/Home/BlogSection";
import FaqSection from "./components/Home/FaqSection";
import WhyChooseSection from "./components/Home/WhyChooseSection";
import { fetchHomePageBundle, resolveHomeContent } from "./lib/home-page";
import { buildFaqPageSchema } from "./components/schemas/faq-schema";
import { buildHomePageSchema } from "./components/schemas/site-schema";

export async function generateMetadata(): Promise<Metadata> {
  const bundle = await fetchHomePageBundle();
  const hero = bundle?.hero;

  const title = hero?.meta_title?.trim() || hero?.heading?.trim() || undefined;
  const description = hero?.meta_description?.trim() || hero?.subheading?.trim() || undefined;
  const keywords = (hero?.meta_keywords ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  
  
  
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      images: hero?.image ? [hero.image.trim()] : undefined,
    },  
  };
  
  
  
}


export default async function Home() {
  const bundle = await fetchHomePageBundle();
  const c = resolveHomeContent(bundle);
  const hero = c.hero;
  const pageSchema = buildHomePageSchema({
    title: hero?.meta_title || hero?.heading || "SkillVedika",
    description: hero?.meta_description || hero?.subheading || "",
    image: hero?.image || "",
  });
  const faqSchema =
    c.faqItems.length > 0
      ? buildFaqPageSchema(c.faqItems, {
          url: "/",
          name: c.faqHeading || "Frequently Asked Questions",
        })
      : null;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema).replace(/<\/script/gi, "<\\/script"),
        }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/<\/script/gi, "<\\/script"),
          }}
        />
      ) : null}
      <HeroSection data={c.hero} />
      <Suspense fallback={<section className="bg-white px-6 py-12 md:px-12 md:py-14" />}>
        <CoursesSection />
      </Suspense>
      <Suspense fallback={<section className="bg-white px-6 py-12 md:px-12 md:py-14" />}>
        <WhyChooseSection
          heading={c.whyHeading}
          intro={c.whyIntro}
          items={c.whyItems}
        />
      </Suspense>
      <Suspense fallback={<section className="bg-[#EEF3F8] px-6 py-12 md:px-12 md:py-14" />}>
        <FeaturesSection
          heading={c.featuresHeading}
          intro={c.featuresIntro}
          items={c.featureItems}
        />
      </Suspense>
      <Suspense fallback={<section className="bg-white px-6 py-12 md:px-12 md:py-14" />}>
        <JobProgram heading={c.jobHeading} intro={c.jobIntro} items={c.jobItems} />
      </Suspense>
      <Suspense fallback={<section className="bg-[#EEF3F8] px-6 py-12 md:px-12 md:py-14" />}>
        <BlogSection />
      </Suspense>
      <Suspense fallback={<section className="bg-white px-6 py-12 md:px-12 md:py-14" />}>
        {c.support ? (
          <SupportSection
            heading={c.support.heading}
            intro={c.support.intro}
            tabs={c.support.tabs}
            ctaText={c.support.ctaText}
            ctaLink={c.support.ctaLink}
          />
        ) : null}
      </Suspense>
      <Suspense fallback={<section className="bg-white px-6 py-12 md:px-12 md:py-14" />}>
        <FaqSection
          heading={c.faqHeading}
          intro={c.faqIntro}
          items={c.faqItems}
        />
      </Suspense>
    </main>
  );
}

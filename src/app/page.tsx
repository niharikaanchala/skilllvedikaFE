import type { Metadata } from "next";
import HeroSection from "./components/Home/HeroSection";
import CoursesSection from "./components/Home/CoursesSection";
import FeaturesSection from "./components/Home/FeaturesSection";
import JobProgram from "./components/Home/JobProgram";
import SupportSection from "./components/Home/SupportSection";
import BlogSection from "./components/Home/BlogSection";
import FaqSection from "./components/Home/FaqSection";
import WhyChooseSection from "./components/Home/WhyChooseSection";
import { fetchHomePageBundle, resolveHomeContent } from "./lib/home-page";

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

  return (
    <main>
      <HeroSection data={c.hero} />
      <CoursesSection />
      <WhyChooseSection
        heading={c.whyHeading}
        intro={c.whyIntro}
        items={c.whyItems}
      />
      <FeaturesSection
        heading={c.featuresHeading}
        intro={c.featuresIntro}
        items={c.featureItems}
      />
      <JobProgram heading={c.jobHeading} intro={c.jobIntro} items={c.jobItems} />
      <BlogSection />
      {c.support ? (
        <SupportSection
          heading={c.support.heading}
          intro={c.support.intro}
          tabs={c.support.tabs}
          ctaText={c.support.ctaText}
          ctaLink={c.support.ctaLink}
        />
      ) : null}
      <FaqSection
        heading={c.faqHeading}
        intro={c.faqIntro}
        items={c.faqItems}
      />
    </main>
  );
}

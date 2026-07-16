"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Home } from "lucide-react";
import Link from "next/link";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import CourseLeadForm from "@/app/components/CourseLeadForm";

/* TYPES (unchanged) */
type Hero = {
  title: string;
  highlight: string;
  subtitle: string;
  button_text: string;
  image?: string | null;
};

type Empower = {
  title: string;
  description: string;
  description2?: string;
  image?: string | null;
};

type PortfolioItem = {
  title: string;
  description: string;
};

type AdvantageItem = {
  icon?: string;
  title: string;
  description: string;
};

type ProcessStep = {
  icon?: string;
  title: string;
  description: string;
};

type Demo = {
  title: string;
  features: string[];
  form_title: string;
  form_subtitle: string;
  courses: string[];
  button_text: string;
};

type SectionTitles = {
  empower: string;
  empowerSubtitle: string;
  portfolio: string;
  portfolioSubtitle: string;
  advantage: string;
  advantageSubtitle: string;
  process: string;
  processSubtitle: string;
  demo: string;
  demoSubtitle: string;
};

type Props = {
  initialData: any;
  courses: any[];
};

export default function CorporateTrainingClient({ initialData, courses }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hero, setHero] = useState<Hero | null>(null);
  const [empower, setEmpower] = useState<Empower | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [advantage, setAdvantage] = useState<AdvantageItem[]>([]);
  const [process, setProcess] = useState<ProcessStep[]>([]);
  const [demo, setDemo] = useState<Demo | null>(null);

  const defaultSectionTitles: SectionTitles = {
    empower: "Empower Your Workforce",
    empowerSubtitle: "",
    portfolio: "Our Comprehensive Corporate Training Portfolio",
    portfolioSubtitle: "Unlock your team's potential with tailored training topics",
    advantage: "The SkillVedika Advantage",
    advantageSubtitle: "",
    process: "SkillVedika for Talent Development",
    processSubtitle: "",
    demo: "Request a Demo Now ",
    demoSubtitle: "",
  };
  

  const [sectionTitles, setSectionTitles] =
    useState<SectionTitles>(defaultSectionTitles);

  /* ✅ Use SSR data (no functionality change) */
  useEffect(() => {
    if (initialData) {
      setHero(initialData.hero ?? null);
      setEmpower(initialData.empower ?? null);
      setPortfolio(initialData.portfolio ?? []);
      setAdvantage(initialData.advantage ?? []);
      setProcess(initialData.process ?? []);
      setDemo(initialData.demo ?? null);
      setSectionTitles({
        empower:
          initialData?.section_titles?.empower ??
          initialData?.empower_title ??
          defaultSectionTitles.empower,
        empowerSubtitle:
          initialData?.section_titles?.empowerSubtitle ??
          defaultSectionTitles.empowerSubtitle,
        portfolio:
          initialData?.section_titles?.portfolio ??
          initialData?.portfolio_title ??
          defaultSectionTitles.portfolio,
        portfolioSubtitle:
          initialData?.section_titles?.portfolioSubtitle ??
          initialData?.portfolio_subtitle ??
          defaultSectionTitles.portfolioSubtitle,
        advantage:
          initialData?.section_titles?.advantage ??
          initialData?.advantage_title ??
          defaultSectionTitles.advantage,
        advantageSubtitle:
          initialData?.section_titles?.advantageSubtitle ??
          defaultSectionTitles.advantageSubtitle,
        process:
          initialData?.section_titles?.process ??
          initialData?.process_title ??
          defaultSectionTitles.process,
        processSubtitle:
          initialData?.section_titles?.processSubtitle ??
          initialData?.process_subtitle ??
          defaultSectionTitles.processSubtitle,
        demo:
          initialData?.section_titles?.demo ??
          initialData?.demo_title ??
          defaultSectionTitles.demo,
        demoSubtitle:
          initialData?.section_titles?.demoSubtitle ??
          defaultSectionTitles.demoSubtitle,
      });

      setIsLoading(false);
    }
  }, [initialData]);

  if (isLoading)
    return <p className="text-center mt-20">Loading...</p>;

  if (!hero || !empower || !demo) {
    return <p className="text-center mt-20">Content unavailable.</p>;
  }

  const courseOptions = (Array.isArray(courses) ? courses : []).map(
    (course: any) => ({
      id: course.id,
      title: course.title,
    }),
  );

  return (
    <div className="bg-[#f4f8fc] pt-16">
      {/* Breadcrumb */}
      <section className="border-b border-slate-200/70 bg-white/80 px-6 py-4 md:px-12">
        <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center gap-2">
          <Home className="w-4 h-4 text-slate-500 mr-1" />
          <Link href="/" className="transition-colors hover:text-[#2f5fa8]">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-[#1b355b]">
            Corporate Training
          </span>
        </div>
      </section>

      

      {/* HERO */}
      <section className="bg-[#eaf0f7] px-6 py-16 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-[#152c4e]">
              {hero.title} <br />
              <span className="text-[#2f5fa8]">
                {hero.highlight}
              </span>
            </h1>
            <p className="mt-4 max-w-md text-slate-600">
              {hero.subtitle}
            </p>
            <CounsellingModal
              buttonText={hero.button_text || "Get Started"}
              className="mt-6 rounded-lg bg-[#2f5fa8] px-6 py-3 font-medium text-white transition hover:bg-[#264f8d] cursor-pointer"
            />
          </div>

          <div className="flex justify-center">
            {hero.image ? (
              <Image
                src={hero.image}
                alt={hero.title}
                width={350}
                height={350}
                unoptimized
              />
            ) : (
              <div className="h-[350px] w-[350px] rounded-2xl bg-[#dbe7f8]" />
            )}
          </div>
        </div>
      </section>

      {/* EMPOWER */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            {empower.image ? (
              <Image
                src={empower.image}
                alt={empower.title}
                width={280}
                height={280}
                unoptimized
              />
            ) : (
              <div className="w-[280px] h-[280px] rounded-2xl bg-[#dbe7f8]" />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#2f5fa8]">
              {sectionTitles.empower}
            </h2>
            {sectionTitles.empowerSubtitle ? (
              <p className="mt-2 leading-relaxed text-slate-600">
                {sectionTitles.empowerSubtitle}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#2f5fa8]">
            {sectionTitles.portfolio}
          </h2>
          <p className="mt-3 text-slate-600">
            {sectionTitles.portfolioSubtitle}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {portfolio.map((item, i) => (
              <div key={i} className="rounded-xl bg-[#f6f9fd] p-6 shadow-sm transition hover:shadow-md">
                <div className="text-lg font-semibold text-[#1a2d49]">
                  {item.title}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGE */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1a2d49]">
            {sectionTitles.advantage}
          </h2>
          {sectionTitles.advantageSubtitle ? (
            <p className="mt-3 text-slate-600">
              {sectionTitles.advantageSubtitle}
            </p>
          ) : null}

          <div className="grid md:grid-cols-2 gap-6 mt-10 text-left">
            {advantage.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f5fa8]/10 text-lg text-[#2f5fa8]">
                  {item.icon || ""}
                </div>
                <div>
                  <p className="font-semibold text-[#1a2d49]">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1a2d49]">
            {sectionTitles.process}
          </h2>
          {sectionTitles.processSubtitle ? (
            <p className="mt-3 text-slate-600">{sectionTitles.processSubtitle}</p>
          ) : null}

          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {process.map((step, i) => (
              <div key={i} className="text-center px-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#2f5fa8] font-bold text-[#2f5fa8]">
                  {step.icon || String(i + 1).padStart(2, "0")}
                </div>
                <p className="mt-4 font-semibold text-[#1a2d49]">
                  {step.title}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="bg-[#f4f8fc] px-6 py-16 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
        <div className="space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#1a2d49]">
            {sectionTitles.demo}
          </h2>

          {sectionTitles.demoSubtitle ? (
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {sectionTitles.demoSubtitle}
            </p>
          ) : null}
        </div>

        {demo.title && (
          <p className="text-xl md:text-2xl font-bold leading-8 md:leading-9 text-[#1a2d49]">

            {demo.title}
          </p>
        )}

        <ul className="space-y-5">
          {demo.features.map((f, i) => (
            <li key={i} className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f5fa8] text-sm font-semibold text-white">
                {i + 1}
              </div>

              <p className="text-base leading-7 text-slate-700">
                {f}
              </p>
            </li>
          ))}
        </ul>
      </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold text-center">
              {demo.form_title}
            </h3>
            <p className="text-center text-sm mt-1 mb-6">
              {demo.form_subtitle}
            </p>

            <CourseLeadForm
              courses={courseOptions}
              submitLabel={demo.button_text || "Submit"}
              className="space-y-4"
              inputClassName="w-full border p-3 rounded-md"
              selectClassName="w-full border p-3 rounded-md"
              buttonClassName="w-full rounded-lg bg-[#2f5fa8] py-3 text-white disabled:opacity-70"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

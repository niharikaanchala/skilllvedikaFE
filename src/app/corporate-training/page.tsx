// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Home } from "lucide-react";
// import Link from "next/link";
  
// type Hero = {
//   title: string;
//   highlight: string;
//   subtitle: string;
//   button_text: string;
//   image?: string | null;
// };

// type Empower = {
//   title: string;
//   description: string;
//   description2?: string;
//   image?: string | null;
// };

// type PortfolioItem = {
//   title: string;
//   description: string;
// };

// type AdvantageItem = {
//   title: string;
//   description: string;
// };

// type ProcessStep = {
//   title: string;
//   description: string;
// };

// type Demo = {
//   title: string;
//   features: string[];
//   form_title: string;
//   form_subtitle: string;
//   courses: string[];
//   button_text: string;
// };

// type Seo = {
//   meta_title?: string;
//   meta_description?: string;
//   meta_keywords?: string;
// };

// type SectionTitles = {
//   empower: string;
//   portfolio: string;
//   portfolioSubtitle: string;
//   advantage: string;
//   process: string;
//   demo: string;
// };

// export default function CorporateTrainingPage() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [hero, setHero] = useState<Hero | null>(null);
//   const [empower, setEmpower] = useState<Empower | null>(null);
//   const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
//   const [advantage, setAdvantage] = useState<AdvantageItem[]>([]);
//   const [process, setProcess] = useState<ProcessStep[]>([]);
//   const [demo, setDemo] = useState<Demo | null>(null);
//   const [seo, setSeo] = useState<Seo | null>(null);

//   const defaultSectionTitles: SectionTitles = {
//     empower: "Empower Your Workforce",
//     portfolio: "Our Comprehensive Corporate Training Portfolio",
//     portfolioSubtitle: "Unlock your team's potential with tailored training topics",
//     advantage: "The SkillVedika Advantage",
//     process: "SkillVedika for Talent Development",
//     demo: "Request a Demo Now ",
//   };
//   const [sectionTitles, setSectionTitles] = useState<SectionTitles>(defaultSectionTitles);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/corporate-training/"); // API endpoint
//         if (!res.ok) throw new Error("Failed to fetch corporate content");
//         const data = await res.json();

//         setHero(data.hero ?? null);
//         setEmpower(data.empower ?? null);
//         setPortfolio(data.portfolio ?? []);
//         setAdvantage(data.advantage ?? []);
//         setProcess(data.process ?? []);
//         setDemo(data.demo ?? null);
//         setSeo(data.meta ?? null);
//         setSectionTitles({
//           empower: data?.section_titles?.empower ?? data?.empower_title ?? defaultSectionTitles.empower,
//           portfolio: data?.section_titles?.portfolio ?? data?.portfolio_title ?? defaultSectionTitles.portfolio,
//           portfolioSubtitle:
//             data?.section_titles?.portfolioSubtitle ??
//             data?.portfolio_subtitle ??
//             defaultSectionTitles.portfolioSubtitle,
//           advantage: data?.section_titles?.advantage ?? data?.advantage_title ?? defaultSectionTitles.advantage,
//           process: data?.section_titles?.process ?? data?.process_title ?? defaultSectionTitles.process,
//           demo: data?.section_titles?.demo ?? data?.demo_title ?? defaultSectionTitles.demo,
//         });
//       } catch (err) {
//         console.error("Error fetching corporate content:", err);
//         setHero(null);
//         setEmpower(null);
//         setDemo(null);
//           setSeo(null);
//         setSectionTitles(defaultSectionTitles);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (isLoading)
//     return <p className="text-center mt-20">Loading...</p>;
//   if (!hero || !empower || !demo) {
//     return <p className="text-center mt-20">Content unavailable.</p>;
//   }

//   return (
//     <div className="bg-[#F4F7FB] pt-16">
//       {/* Breadcrumb */}
//       <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
//         <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center gap-2">
//           {/* Home icon */}
//           <Home className="w-4 h-4 text-slate-500 mr-1" />
//           <Link href="/" className="hover:text-[#0066FF] transition-colors">
//             Home
//           </Link>
//           <span className="mx-2 text-slate-400">/</span>
//           <span className="font-semibold text-[#001f3f]">Corporate Training</span>
//         </div>
        
//       </section>

//       {/* SEO info (from admin) */}
//       {seo?.meta_title ? (
//         <section className="px-6 md:px-12 py-4 bg-white border-b border-slate-200/60">
//           <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-600 space-y-1">
//             <p className="font-semibold text-slate-800">{seo.meta_title}</p>
//             {seo.meta_description ? <p className="text-slate-600">{seo.meta_description}</p> : null}
//             {seo.meta_keywords ? (
//               <p className="text-[11px] md:text-xs text-slate-500">
//                 <span className="font-semibold">Keywords:</span> {seo.meta_keywords}
//               </p>
//             ) : null}
//           </div>
//         </section>
//       ) : null}

//       {/* HERO */}
//       <section className="bg-[#EAF0F6] py-16 px-6 md:px-12">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
//           <div>
//             <h1 className="text-4xl font-bold text-[#0C1A35] leading-tight">
//               {hero.title} <br />
//               <span className="text-[#2C6ED5]">{hero.highlight}</span>
//             </h1>
//             <p className="mt-4 text-[#0C1A35]/70 max-w-md">{hero.subtitle}</p>
//             <button className="mt-6 bg-[#2C6ED5] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1f57ad] transition">
//               {hero.button_text}
//             </button>
//           </div>
//           <div className="flex justify-center">
//             {hero.image ? (
//               <Image src={hero.image} alt={hero.title} width={350} height={350} />
//             ) : (
//               <div className="w-[350px] h-[350px] rounded-2xl bg-[#dbe7f8]" />
//             )}
//           </div>
//         </div>
//       </section>

//       {/* EMPOWER */}
//       <section className="py-16 px-6 md:px-12">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
//           <div className="flex justify-center">
//             {empower.image ? (
//               <Image src={empower.image} alt={empower.title} width={280} height={280} />
//             ) : (
//               <div className="w-[280px] h-[280px] rounded-2xl bg-[#dbe7f8]" />
//             )}
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-[#2C6ED5]">{sectionTitles.empower}</h2>
//             {empower.title && (
//               <p className="mt-2 text-lg font-semibold text-[#0C1A35]">{empower.title}</p>
//             )}
//             <p className="mt-4 text-[#0C1A35]/70 leading-relaxed">{empower.description}</p>
//             {empower.description2 && <p className="mt-4 text-[#0C1A35]/70 leading-relaxed">{empower.description2}</p>}
//           </div>
//         </div>
//       </section>

//       {/* PORTFOLIO */}
//       <section className="py-16 px-6 md:px-12 bg-white">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-[#2C6ED5]">{sectionTitles.portfolio}</h2>
//           <p className="text-[#0C1A35]/70 mt-3">{sectionTitles.portfolioSubtitle}</p>
//           <div className="grid md:grid-cols-3 gap-6 mt-10">
//             {portfolio.map((item, i) => (
//               <div key={i} className="bg-[#F4F7FB] p-6 rounded-xl shadow-sm hover:shadow-md transition">
//                 <div className="text-lg font-semibold text-[#0C1A35]">{item.title}</div>
//                 <p className="text-sm text-[#0C1A35]/60 mt-2">{item.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ADVANTAGE */}
//       <section className="py-16 px-6 md:px-12">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-[#0C1A35]">{sectionTitles.advantage}</h2>
//           <div className="grid md:grid-cols-2 gap-6 mt-10 text-left">
//             {advantage.map((item, i) => (
//               <div key={i} className="flex gap-4">
//                 <div className="w-10 h-10 bg-[#2C6ED5]/10 rounded-full"></div>
//                 <div>
//                   <p className="font-semibold text-[#0C1A35]">{item.title}</p>
//                   <p className="text-sm text-[#0C1A35]/60">{item.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* PROCESS */}
//       <section className="py-16 px-6 md:px-12 bg-white">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-[#0C1A35]">{sectionTitles.process}</h2>
//           <div className="grid md:grid-cols-4 gap-8 mt-12">
//             {process.map((step, i) => (
//               <div key={i} className="text-center px-4">
//                 <div className="w-14 h-14 mx-auto rounded-full border-2 border-[#2C6ED5] flex items-center justify-center font-bold text-[#2C6ED5]">
//                   {String(i + 1).padStart(2, "0")}
//                 </div>
//                 <p className="mt-4 font-semibold text-[#0C1A35]">{step.title}</p>
//                 <p className="text-sm text-[#0C1A35]/70 mt-2 leading-relaxed">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* DEMO */}
//       <section className="py-16 px-6 md:px-12 bg-[#F4F7FB]">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
//           <div>
//             <h2 className="text-3xl font-bold text-[#0C1A35]">{sectionTitles.demo}</h2>
//             {demo.title && (
//               <p className="mt-2 text-[#0C1A35] font-medium">{demo.title}</p>
//             )}
//             <ul className="mt-4 text-[#0C1A35]/70 space-y-2">
//               {demo.features.map((feature, i) => (
//                 <li key={i}>• {feature}</li>
//               ))}
//             </ul>
//           </div>
//           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
//             <h3 className="text-xl font-semibold text-center text-[#0C1A35]">{demo.form_title}</h3>
//             <p className="text-center text-sm text-[#0C1A35]/60 mt-1 mb-6">{demo.form_subtitle}</p>

//             <label className="text-sm font-medium text-[#0C1A35]">Full Name</label>
//             <input type="text" className="w-full border border-gray-300 p-3 rounded-lg mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2C6ED5]" />

//             <label className="text-sm font-medium text-[#0C1A35]">Email Address</label>
//             <input type="email" className="w-full border border-gray-300 p-3 rounded-lg mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2C6ED5]" />

//             <label className="text-sm font-medium text-[#0C1A35]">Phone Number</label>
//             <div className="flex gap-2 mt-1 mb-4">
//               <span className="px-3 flex items-center border border-gray-300 rounded-lg bg-gray-50 text-sm">+91</span>
//               <input type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C6ED5]" />
//             </div>

//             <label className="text-sm font-medium text-[#0C1A35]">* Select Courses</label>
//             <select className="w-full border border-gray-300 p-3 rounded-lg mt-1 mb-4 text-[#0C1A35]/70 focus:outline-none focus:ring-2 focus:ring-[#2C6ED5]">
//               {(demo.courses.length > 0 ? demo.courses : ["Select a course"]).map((course, i) => (
//                 <option key={i}>{course}</option>
//               ))}
//             </select>

//             <div className="flex items-start gap-2 mb-4">
//               <input type="checkbox" className="mt-1" />
//               <p className="text-sm text-[#0C1A35]/70">
//                 I agree with the <span className="text-[#2C6ED5] cursor-pointer">Terms & Conditions</span>.
//               </p>
//             </div>

//             <button className="w-full bg-gradient-to-r from-[#2C6ED5] to-[#1FA2FF] text-white py-3 rounded-lg font-medium hover:opacity-90 transition">
//               {demo.button_text}
//             </button>

//             <p className="text-xs text-center text-[#0C1A35]/50 mt-3">🔒 Your information is secure.</p>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }


import type { Metadata } from "next";
import CorporateTrainingClient from "./CorporateTrainingClient";
import { apiUrl } from "../lib/api";

type CorporateTrainingData = Record<string, unknown> & {
  meta?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  };
};

const FALLBACK_META: Metadata = {
  title: "Corporate Training | SkillVedika",
  description: "Corporate training programs to upskill your workforce.",
  keywords: ["corporate training", "employee training", "skill development"],
  alternates: {
    canonical: "https://skillvedika.com/corporate-training",
  },
};

async function fetchCorporateTrainingData(): Promise<CorporateTrainingData> {
  try {
    const res = await fetch(apiUrl("/api/corporate-training/"), {
      next: { revalidate: 300 },
    });
    if (!res.ok) return {};
    const data = (await res.json()) as unknown;
    if (!data || typeof data !== "object") return {};
    return data as CorporateTrainingData;
  } catch {
    return {};
  }
}

async function fetchCoursesSafe(): Promise<unknown[]> {
  try {
    const res = await fetch(apiUrl("/api/courses/"), {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray((data as { results?: unknown[] }).results)) {
      return (data as { results: unknown[] }).results;
    }
    return [];
  } catch {
    return [];
  }
}

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await fetchCorporateTrainingData();
  const meta = data.meta || {};

  return {
    title: meta.meta_title || FALLBACK_META.title,
    description: meta.meta_description || FALLBACK_META.description,
    keywords: meta.meta_keywords
      ? meta.meta_keywords.split(",").map((k: string) => k.trim())
      : FALLBACK_META.keywords,
    alternates: FALLBACK_META.alternates,
    openGraph: {
      title: meta.meta_title || String(FALLBACK_META.title),
      description: meta.meta_description || String(FALLBACK_META.description),
      url: "https://skillvedika.com/corporate-training",
      siteName: "SkillVedika",
      type: "website",
    },
  };
};

export default async function Page() {
  const [data, courses] = await Promise.all([
    fetchCorporateTrainingData(),
    fetchCoursesSafe(),
  ]);

  return <CorporateTrainingClient initialData={data} courses={courses} />;
}
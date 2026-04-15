// import Image from "next/image";

// export default function OnJobSupportPage() {
//   return (
//     <main className="bg-[#F5F7FB] text-[#0C1A35]">

//       {/* HERO */}
//       <section className="bg-[#EAF0F8] px-6 md:px-12 py-16 md:py-20">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
          
//           <div>
//             <h1 className="text-4xl md:text-5xl font-extrabold">On Job Support</h1>

//             <p className="mt-4 text-[#5B6B88] max-w-md leading-relaxed">
//               Get real-time expert support to solve your day-to-day technical challenges.
//               Our mentors help you perform better, faster, and smarter on the job.
//             </p>

//             <button className="mt-6 bg-[#0C2D57] text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-[#0A2446] transition">
//               Get Support
//             </button>
//           </div>

//           <div className="flex justify-center">
//             <div className="w-72 h-72 bg-[#DDE7F5] rounded-full flex items-center justify-center">
//               <Image
//                 src="/images/support-hero.png"
//                 alt="support"
//                 width={200}
//                 height={200}
//               />
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* REAL TIME HELP */}
//       <section className="px-6 md:px-12 py-14 bg-white">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

//           <div className="flex justify-center">
//             <div className="w-60 h-60 rounded-full border-[12px] border-[#D9E4F5] flex items-center justify-center">
//               <Image src="/images/project.png" alt="" width={140} height={140} />
//             </div>
//           </div>

//           <div>
//             <h2 className="text-4xl font-extrabold leading-snug">
//               <span className="text-[#2563EB]">Real-Time Project Help</span><br />
//               <span className="text-[#0B5F53]">From Industry Experts</span>
//             </h2>

//             <p className="mt-4 text-[#5B6B88] leading-relaxed">
//               At SkillVedika, we understand real-time project challenges can be overwhelming.
//               Our experts guide you through issues instantly.
//             </p>

//             <div className="flex gap-10 mt-6 text-sm">
//               <div>
//                 <p className="font-semibold text-[#2563EB]">✔ Expert Guidance</p>
//                 <p className="text-[#5B6B88]">Industry professionals</p>
//               </div>

//               <div>
//                 <p className="font-semibold text-[#2563EB]">✔ Instant Solutions</p>
//                 <p className="text-[#5B6B88]">Real-time problem solving</p>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* TARGET AUDIENCE */}
//       <section className="px-6 md:px-12 py-16">
//         <div className="max-w-6xl mx-auto text-center">

//           <h2 className="text-4xl font-extrabold">Who Is This For?</h2>
//           <p className="text-[#5B6B88] mt-2">
//             Professional on-job support designed for every career stage
//           </p>

//           <div className="grid md:grid-cols-2 gap-6 mt-10">

//             {audience.map((item, i) => (
//               <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 text-left shadow-sm">
//                 <p className="inline-block text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-[#EAF0F8] text-[#2C6ED5]">
//                   {item.tag}
//                 </p>
//                 <h3 className="font-semibold text-lg mt-2">{item.title}</h3>
//                 <p className="text-sm text-[#5B6B88] mt-2">{item.desc}</p>
//               </div>
//             ))}

//           </div>
//         </div>
//       </section>

//       {/* HOW WE HELP */}
//       <section className="px-6 md:px-12 py-16 bg-[#EEF3FB]">
//         <div className="max-w-6xl mx-auto text-center">

//           <h2 className="text-4xl font-extrabold">How We Help</h2>

//           <div className="grid md:grid-cols-3 gap-6 mt-10">
//             {help.map((item, i) => (
//               <div key={i} className="bg-white border border-slate-200 rounded-lg p-5 text-center shadow-sm">
//                 <div className="text-3xl">{item.icon}</div>
//                 <h3 className="mt-3 font-semibold">{item.title}</h3>
//                 <p className="text-sm text-[#5B6B88] mt-2">{item.desc}</p>
//               </div>
//             ))}
//           </div>

//         </div>
//       </section>

//       {/* PROCESS */}
//       <section className="px-6 md:px-12 py-20">
//         <div className="max-w-4xl mx-auto text-center">

//           <h2 className="text-4xl font-extrabold">Our Process</h2>

//           <div className="mt-10 space-y-6">
//             {steps.map((step, i) => (
//               <div key={i} className="flex items-center gap-4 justify-center">
//                 <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
//                   {i + 1}
//                 </div>
//                 <div className="bg-white p-4 rounded-lg shadow-sm border w-[280px] text-sm">
//                   {step}
//                 </div>
//               </div>
//             ))}
//           </div>

//         </div>
//       </section>

//       {/* WHY CHOOSE */}
//       <section className="px-6 md:px-12 py-20 bg-[#F5F7FB]">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">

//           <div className="flex justify-center">
//             <div className="w-60 h-60 rounded-full border-[10px] border-[#E0E7FF] flex items-center justify-center">
//               <Image src="/images/why.png" width={120} height={120} alt="" />
//             </div>
//           </div>

//           <div>
//             <h2 className="text-4xl font-extrabold">
//               Why Choose <span className="text-[#2563EB]">SkillVedika?</span>
//             </h2>

//             <ul className="mt-6 space-y-3 text-[#5B6B88]">
//               <li>✔ Real-Time Working Professionals as Mentors</li>
//               <li>✔ Deep expertise across 40+ technologies</li>
//               <li>✔ Personalized guidance for your exact project context</li>
//             </ul>
//           </div>

//         </div>
//       </section>

//       {/* DEMO + FORM */}
//       <section className="px-6 md:px-12 py-20 bg-[#EAF0F8]">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

//           <div>
//             <h2 className="text-3xl font-bold">
//               Get a Live <span className="text-[#2563EB]">Free Demo</span>
//             </h2>

//             <p className="text-[#5B6B88] mt-4">
//               Experience firsthand how SkillVedika can enhance your learning.
//             </p>

//             <ul className="mt-6 space-y-3 text-sm text-[#5B6B88]">
//               <li>✔ Explore trending courses</li>
//               <li>✔ Flexible learning plans</li>
//               <li>✔ Instant access</li>
//             </ul>
//           </div>

//           <form className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-4">

//             <h3 className="font-extrabold text-2xl text-center">
//               Book Your Free Demo
//             </h3>

//             <input className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]" placeholder="Full Name" />
//             <input className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]" placeholder="Email Address" />
//             <input className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]" placeholder="Phone Number" />

//             <select className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]">
//               <option>Select Course</option>
//             </select>

//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" />
//               Agree with Terms & Conditions
//             </label>

//             <button className="w-full bg-gradient-to-r from-[#2C6ED5] to-[#14B8A6] text-white py-2.5 rounded-md font-semibold hover:opacity-95 transition">
//               Submit Your Details
//             </button>

//           </form>

//         </div>
//       </section>

//     </main>
//   );
// }


// /* DATA */

// const audience = [
//   {
//     tag: "TECHNICAL EXPERTS",
//     title: "Software Professionals",
//     desc: "Support for QA Engineers, Data Scientists, DevOps and more."
//   },
//   {
//     tag: "CAREER STARTERS",
//     title: "Fresh Graduates",
//     desc: "Bridge gap between learning and real-world experience."
//   },
//   {
//     tag: "CAREER TRANSITIONS",
//     title: "Technology Switchers",
//     desc: "Transition into new tech roles confidently."
//   },
//   {
//     tag: "INDEPENDENT",
//     title: "Freelancers & Consultants",
//     desc: "Backup and expert consultation for projects."
//   }
// ];

// const help = [
//   {
//     icon: "🧑‍💻",
//     title: "Hands-on Help",
//     desc: "Solve real issues with experts"
//   },
//   {
//     icon: "⚡",
//     title: "Fast Resolution",
//     desc: "Instant solutions to problems"
//   },
//   {
//     icon: "📊",
//     title: "Career Growth",
//     desc: "Improve your skills"
//   }
// ];

// const steps = [
//   "Share details of your project",
//   "We assign a qualified expert",
//   "Schedule sessions",
//   "Continuous support provided"
// ];






// import Image from "next/image";
// import DemoForm from "../components/DemoForm";
// import Link from "next/link";
// import { Home } from "lucide-react";
// import Head from "next/head";

// // Fetch helper
// async function fetchJson(url: string) {
//   const res = await fetch(url, { cache: "no-store" });
//   if (!res.ok) {
//     console.error("Failed to fetch", url);
//     return [];
//   }
//   return res.json();
// }

// export default async function OnJobSupportPage() {
//   const base = "http://localhost:8000/api/on-job-support";

//   const [
//     metaData,
//     heroData,
//     realtimeHelpData,
//     audienceData,
//     helpData,
//     stepsData,
//     whyChooseData,
//     demoData,
//     coursesData
//   ] = await Promise.all([
//     fetchJson(`${base}/meta-tags/`),
//     fetchJson(`${base}/hero/`),
//     fetchJson(`${base}/realtime-help/`),
//     fetchJson(`${base}/audience/`),
//     fetchJson(`${base}/help/`),
//     fetchJson(`${base}/steps/`),
//     fetchJson(`${base}/why-choose/`),
//     fetchJson(`${base}/demo/`),
//     fetchJson("http://localhost:8000/api/courses/")
//   ]);

//   const meta = Array.isArray(metaData) ? metaData[0] || {} : metaData || {};
//   const hero = heroData[0] || {};
//   const realtimeHelp = realtimeHelpData[0] || {};
//   const audience = audienceData || [];
//   const help = helpData || [];
//   const steps = stepsData || [];
//   const whyChoose = whyChooseData[0] || {};
//   const demo = Array.isArray(demoData) ? demoData[0] : demoData || {};  const courses = coursesData || [];
//   let features: Array<{ title?: string; desc?: string; text?: string }> = [];
//   let whyChoosePoints: string[] = [];

//   try {
//     const rawFeatures =
//       typeof demo.features === "string"
//         ? JSON.parse(demo.features)
//         : demo.features || [];
//     features = Array.isArray(rawFeatures)
//       ? rawFeatures.map((item: unknown) => {
//           if (typeof item === "string") return { text: item };
//           if (item && typeof item === "object") {
//             const obj = item as { title?: unknown; desc?: unknown; text?: unknown };
//             return {
//               title: typeof obj.title === "string" ? obj.title : undefined,
//               desc: typeof obj.desc === "string" ? obj.desc : undefined,
//               text: typeof obj.text === "string" ? obj.text : undefined,
//             };
//           }
//           return {};
//         })
//       : [];
//   } catch (err) {
//     console.error("Features parse error", err);
//   }

//   try {
//     const rawPoints =
//       typeof whyChoose.points === "string"
//         ? JSON.parse(whyChoose.points)
//         : whyChoose.points || [];
//     whyChoosePoints = Array.isArray(rawPoints)
//       ? rawPoints
//           .map((p: unknown) => (typeof p === "string" ? p : ""))
//           .filter(Boolean)
//       : [];
//   } catch (err) {
//     console.error("WhyChoose points parse error", err);
//   }

//   const fixImageUrl = (url: string | null) =>
//     url ? `http://localhost:8000${url}` : "";

//   return (
//     <main className="bg-[#F5F7FB] text-[#0C1A35] pt-16"> 
//       <Head>
//         {meta?.meta_title ? <title>{meta.meta_title}</title> : null}
//         {meta?.meta_description ? (
//           <meta name="description" content={meta.meta_description} />
//         ) : null}
//         {meta?.meta_keywords ? (
//           <meta name="keywords" content={meta.meta_keywords} />
//         ) : null}
//       </Head>
//       {/* Breadcrumb */}
//       <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
//         <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center">
//           {/* Home icon */}
//           <Home className="w-4 h-4 text-slate-500 mr-1" />

//           <Link href="/" className="hover:text-[#0066FF] transition-colors">
//             Home
//           </Link>

//           {/* Right arrow */}
//           <span className="mx-2 text-slate-400">{">"}</span>

//           <span className="font-semibold text-[#001f3f]">
//             {hero.title || meta?.meta_title || "On Job Support"}
//           </span>
//         </div>
//       </section>

//       {/* HERO */}
//       <section className="bg-[#EAF0F8] px-6 md:px-12 py-16 md:py-20">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
//           <div>
//             <h1 className="text-4xl md:text-5xl font-extrabold">
//               {hero.title || meta?.meta_title || "On Job Support"}
//             </h1>
//             <p className="mt-4 text-[#5B6B88] max-w-md">{hero.subtitle || ""}</p>
//             <a href={hero.button_link || "#"} className="mt-6 inline-block bg-[#0C2D57] text-white px-6 py-2.5 rounded-md text-sm font-semibold">
//               {hero.button_text}
//             </a>
//           </div>
//           <div className="flex justify-center">
//             <div className="w-72 h-72 bg-[#DDE7F5] rounded-full flex items-center justify-center">
//               {hero.image && (
//                 <Image src={fixImageUrl(hero.image)} alt="" width={200} height={200} />
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* REAL TIME HELP */}
//       <section className="px-6 md:px-12 py-14 bg-white">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
//           <div className="flex justify-center">
//             <div className="w-60 h-60 rounded-full border-[12px] border-[#D9E4F5] flex items-center justify-center">
//               {realtimeHelp.image && (
//                 <Image src={fixImageUrl(realtimeHelp.image)} width={140} height={140} alt="" />
//               )}
//             </div>
//           </div>
//           <div>
//             <h2 className="text-4xl font-extrabold">
//               <span className="text-[#2563EB]">{realtimeHelp.title_main}</span><br />
//               <span className="text-[#0B5F53]">{realtimeHelp.title_sub}</span>
//             </h2>
//             <p className="mt-4 text-[#5B6B88]">{realtimeHelp.description}</p>
//           </div>
//         </div>
//       </section>

//       {/* AUDIENCE */}
//       <section className="px-6 md:px-12 py-16">
//         <div className="max-w-6xl mx-auto text-center">
//           <div className="grid md:grid-cols-2 gap-6 mt-10">
//             {audience.map((item: any) => (
//               <div key={item.id} className="bg-white rounded-xl border p-5 shadow-sm text-left">
//                 <p className="text-xs bg-[#EAF0F8] px-2 py-1 rounded">{item.tag}</p>
//                 <h3 className="mt-2 font-semibold">{item.title}</h3>
//                 <p className="text-sm text-[#5B6B88]">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* HELP */}
//       <section className="px-6 md:px-12 py-16 bg-[#EEF3FB]">
//         <div className="max-w-6xl mx-auto text-center">
//           <div className="grid md:grid-cols-3 gap-6 mt-10">
//             {help.map((item: any) => (
//               <div key={item.id} className="bg-white p-5 rounded-lg border shadow-sm">
//                 {item.icon ? (
//                   <div className="text-3xl mb-2">{item.icon}</div>
//                 ) : null}
//                 <h3 className="font-semibold">{item.title}</h3>
//                 <p className="text-sm text-[#5B6B88]">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* PROCESS */}
//       <section className="px-6 md:px-12 py-20">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="mt-10 space-y-6">
//             {steps.map((step: any, i: number) => (
//               <div key={step.id} className="flex justify-center gap-4">
//                 <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
//                   {i + 1}
//                 </div>
//                 <div className="bg-white p-4 rounded border w-[280px]">
//                   {step.desc}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* WHY CHOOSE */}
//       <section className="px-6 md:px-12 py-20 bg-[#F5F7FB]">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
//           <div>
//             <h2 className="text-4xl font-extrabold">{whyChoose.title}</h2>
//             {whyChoose.subtitle ? (
//               <p className="mt-3 text-[#5B6B88] leading-relaxed">{whyChoose.subtitle}</p>
//             ) : null}
//             <ul className="mt-6 space-y-3">
//               {whyChoosePoints.map((p: string, i: number) => (
//                 <li key={i}>✔ {p}</li>
//               ))}
//             </ul>
//           </div>
//           <div className="flex justify-center">
//             {whyChoose.image && (
//               <Image src={fixImageUrl(whyChoose.image)} width={120} height={120} alt="" />
//             )}
//           </div>
//         </div>
//       </section>

//       {/* DEMO */}
//       <section className="px-6 md:px-12 py-20 bg-[#EAF0F8]">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

//           <div>
//             {demo.badge && <span className="text-xs bg-[#DCE6F8] px-3 py-1 rounded">{demo.badge}</span>}
//             <h2 className="text-4xl font-extrabold mt-4">
//               {demo.title_main} <br />
//               <span className="text-blue-500">{demo.title_highlight}</span>
//             </h2>
//             <p className="mt-4 text-[#5B6B88]">{demo.description}</p>

//             <div className="mt-6 space-y-4">
//               {features.map((f: any, i: number) => (
//                 <div key={i}>
//                   {f.text ? (
//                     <p className="font-semibold">✔ {f.text}</p>
//                   ) : (
//                     <>
//                       <p className="font-semibold">✔ {f.title || "Feature"}</p>
//                       {f.desc ? <p className="text-sm text-gray-500">{f.desc}</p> : null}
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <DemoForm demo={demo} courses={courses} />

//         </div>
//       </section>

//     </main>
//   );
// } 




import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import type { Metadata } from "next";
import OnJobSupportClient from "./OnJobSupportClient"; // CSR Component
import { apiUrl } from "@/app/lib/api";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";

type FeatureData = { title?: string; desc?: string; text?: string };
type AudienceItem = { id: number; tag: string; title: string; desc: string };
type HelpItem = { id: number; icon?: string; title: string; desc: string };
type StepItem = { id: number; desc: string };
type WhyChooseData = { title?: string; subtitle?: string; points?: unknown; image?: string | null };
type DemoData = { badge?: string; title_main?: string; title_highlight?: string; description?: string; features?: unknown };
type SectionContentData = {
  audience_eyebrow?: string;
  audience_title?: string;
  audience_description?: string;
  help_title?: string;
  process_title?: string;
};

// Fetch helper
async function fetchJson(path: string) {
  const res = await fetch(apiUrl(path), { next: { revalidate: 300 } });
  if (!res.ok) {
    console.error("Failed to fetch", path);
    return [];
  }
  return res.json();
}

async function getOnJobMeta() {
  const metaData = await fetchJson("/api/on-job-support/meta-tags/");
  return Array.isArray(metaData) ? metaData[0] || {} : metaData || {};
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getOnJobMeta();
  const title = typeof meta?.meta_title === "string" && meta.meta_title.trim()
    ? meta.meta_title.trim()
    : "On Job Support";
  const description =
    typeof meta?.meta_description === "string" && meta.meta_description.trim()
      ? meta.meta_description.trim()
      : "Get real-time on job support from SkillVedika experts.";
  const keywords = (typeof meta?.meta_keywords === "string" ? meta.meta_keywords : "")
    .split(",")
    .map((k: string) => k.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: "https://skillvedika.com/on-job-support" },
  };
}

export default async function OnJobSupportPage() {
  const [
    metaData,
    heroData,
    realtimeHelpData,
    sectionContentData,
    audienceData,
    helpData,
    stepsData,
    whyChooseData,
    demoData,
    coursesData
  ] = await Promise.all([
    fetchJson("/api/on-job-support/meta-tags/"),
    fetchJson("/api/on-job-support/hero/"),
    fetchJson("/api/on-job-support/realtime-help/"),
    fetchJson("/api/on-job-support/section-content/"),
    fetchJson("/api/on-job-support/audience/"),
    fetchJson("/api/on-job-support/help/"),
    fetchJson("/api/on-job-support/steps/"),
    fetchJson("/api/on-job-support/why-choose/"),
    fetchJson("/api/on-job-support/demo/"),
    fetchJson("/api/courses/")
  ]);

  const meta = Array.isArray(metaData) ? metaData[0] || {} : metaData || {};
  const hero = heroData[0] || {};
  const realtimeHelp = realtimeHelpData[0] || {};
  const sectionContent: SectionContentData = Array.isArray(sectionContentData)
    ? sectionContentData[0] || {}
    : sectionContentData || {};
  const audience: AudienceItem[] = Array.isArray(audienceData) ? audienceData as AudienceItem[] : [];
  const help: HelpItem[] = Array.isArray(helpData) ? helpData as HelpItem[] : [];
  const steps: StepItem[] = Array.isArray(stepsData) ? stepsData as StepItem[] : [];
  const whyChoose: WhyChooseData = (Array.isArray(whyChooseData) ? whyChooseData[0] : whyChooseData) || { title: "Why Choose", points: [] };
  const demo: DemoData = (Array.isArray(demoData) ? demoData[0] : demoData) || {};
  const courses = coursesData || [];

  let features: FeatureData[] = [];
  let whyChoosePoints: string[] = [];

  // Parse features JSON
  try {
    const rawFeatures =
      typeof demo.features === "string"
        ? JSON.parse(demo.features)
        : demo.features || [];
    features = Array.isArray(rawFeatures)
      ? rawFeatures.map((item: unknown) => {
          if (typeof item === "string") return { text: item };
          if (item && typeof item === "object") {
            const obj = item as { title?: unknown; desc?: unknown; text?: unknown };
            return {
              title: typeof obj.title === "string" ? obj.title : undefined,
              desc: typeof obj.desc === "string" ? obj.desc : undefined,
              text: typeof obj.text === "string" ? obj.text : undefined,
            };
          }
          return {};
        })
      : [];
  } catch (err) {
    console.error("Features parse error", err);
  }

  // Parse WhyChoose points
  try {
    const rawPoints =
      typeof whyChoose.points === "string"
        ? JSON.parse(whyChoose.points)
        : whyChoose.points || [];
    whyChoosePoints = Array.isArray(rawPoints)
      ? rawPoints.map((p: unknown) => (typeof p === "string" ? p : "")).filter(Boolean)
      : [];
  } catch (err) {
    console.error("WhyChoose points parse error", err);
  }

  const fixImageUrl = (raw: string | null) => {
    const u = (raw ?? "").trim();
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    const path = u.startsWith("/") ? u : `/${u}`;
    return apiUrl(path);
  };

  return (
      <main className="bg-[#F5F7FB] text-[#0C1A35] pt-16">

        {/* Breadcrumb */}
        <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
          <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center">
            <Home className="w-4 h-4 text-slate-500 mr-1" />
            <Link href="/" className="hover:text-[#0066FF] transition-colors">Home</Link>
            <span className="mx-2 text-slate-400">{">"}</span>
            <span className="font-semibold text-[#001f3f]">
              {hero.title || meta?.meta_title || "On Job Support"}
            </span>
          </div>
        </section>

        {/* HERO */}
        <section className="bg-[#EAF0F8] px-6 md:px-12 py-16 md:py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold">
                {hero.title || meta?.meta_title || "On Job Support"}
              </h1>
              <p className="mt-4 text-[#5B6B88] max-w-md">{hero.subtitle || ""}</p>
              <CounsellingModal
                buttonText={hero.button_text || "Get Support"}
                className="mt-6 inline-block bg-[#0C2D57] text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-[#0A2446] transition"
              />
            </div>
            <div className="flex justify-center">
              <div className="w-72 h-72 bg-[#DDE7F5] rounded-full flex items-center justify-center">
                {hero.image && (
                  <Image
                    src={fixImageUrl(hero.image)}
                    alt=""
                    width={200}
                    height={200}
                    priority
                    sizes="(max-width: 768px) 200px, 200px"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* REAL TIME HELP */}
        <section className="px-6 md:px-12 py-14 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="w-70 h-70 rounded-full border-[12px] border-[#D9E4F5] flex items-center justify-center">
                {realtimeHelp.image && (
                  <Image
                    src={fixImageUrl(realtimeHelp.image)}
                    width={230}
                    height={140}
                    alt=""
                    sizes="(max-width: 768px) 230px, 230px"
                  />
                )}
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-extrabold">
                <span className="text-[#2563EB]">{realtimeHelp.title_main}</span><br />
                <span className="text-[#0B5F53]">{realtimeHelp.title_sub}</span>
              </h2>
              <p className="mt-4 text-[#5B6B88]">{realtimeHelp.description}</p>
              {(realtimeHelp.icon_1_title || realtimeHelp.icon_2_title) && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  {realtimeHelp.icon_1_title && (
                    <div>
                      <p className="font-semibold text-[#2563EB]">✔ {realtimeHelp.icon_1_title}</p>
                      {realtimeHelp.icon_1_desc ? (
                        <p className="text-sm text-[#5B6B88]">{realtimeHelp.icon_1_desc}</p>
                      ) : null}
                    </div>
                  )}
                  {realtimeHelp.icon_2_title && (
                    <div>
                      <p className="font-semibold text-[#2563EB]">✔ {realtimeHelp.icon_2_title}</p>
                      {realtimeHelp.icon_2_desc ? (
                        <p className="text-sm text-[#5B6B88]">{realtimeHelp.icon_2_desc}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#5B6B88]">
              {sectionContent.audience_eyebrow || "Target Audience"}
            </p>
            <h2 className="text-4xl font-extrabold">
              {sectionContent.audience_title || "Who Is This For?"}
            </h2>
            {sectionContent.audience_description ? (
              <p className="mt-3 text-[#5B6B88] max-w-3xl mx-auto text-lg leading-relaxed">
                {sectionContent.audience_description}
              </p>
            ) : null}
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              {audience.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 px-8 py-7 shadow-sm text-left">
                  <p className="inline-block text-[11px] font-semibold tracking-[0.08em] uppercase text-[#2C6ED5] bg-[#EAF0F8] px-2.5 py-1 rounded">
                    {item.tag}
                  </p>
                  <h3 className="mt-3 text-[2rem] leading-tight font-extrabold text-[#0C1A35]">
                    {item.title}
                  </h3>
                  <div className="mt-3 h-[2px] w-16 bg-[#dbeafe]" />
                  <p className="mt-4 text-lg leading-relaxed text-[#5B6B88]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HELP */}
        <section className="px-6 md:px-12 py-16 bg-[#EEF3FB]">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold">
              {sectionContent.help_title || "How We Help"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {help.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-lg border shadow-sm">
                  {item.icon && <div className="text-3xl mb-2">{item.icon}</div>}
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-[#5B6B88]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="px-6 md:px-12 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold">
              {sectionContent.process_title || "Our Process"}
            </h2>
            <div className="mt-10 space-y-6">
              {steps.map((step, i: number) => (
                <div key={step.id} className="flex justify-center gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                    {i + 1}
                  </div>
                  <div className="bg-white p-4 rounded border w-[280px]">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section className="px-6 md:px-12 py-20 bg-[#F5F7FB]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-4xl font-extrabold">{whyChoose.title}</h2>
              {whyChoose.subtitle && (
                <p className="mt-3 text-[#5B6B88] leading-relaxed">{whyChoose.subtitle}</p>
              )}
              <ul className="mt-6 space-y-3">
                {whyChoosePoints.map((p, i) => <li key={i}>✔ {p}</li>)}
              </ul>
            </div>
            <div className="flex justify-center">
              {whyChoose.image && (
                <Image
                  src={fixImageUrl(whyChoose.image)}
                  width={280}
                  height={200}
                  alt=""
                  sizes="(max-width: 768px) 280px, 280px"
                />
              )}
            </div>
          </div>
        </section>

        {/* DEMO (CSR Component) */}
        <OnJobSupportClient demo={demo} courses={courses} features={features} />
      </main>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import { Home } from "lucide-react";
// import Link from "next/link";

// type AboutHero = {
//   heading: string;
//   paragraph_one: string;
//   paragraph_two: string;
// };

// type ValuesSection = {
//   heading: string;
//   subtitle: string;
// };

// type ValueItem = {
//   title: string;
//   description: string;
//   order?: number;
// };

// type CtaSection = {
//   heading: string;
//   subtitle: string;
//   primary_button_text: string;
//   secondary_button_text: string;
// };

// type DemoSection = {
//   heading: string;
//   features: string[];
//   form_title: string;
//   form_subtitle: string;
//   courses: string[];
//   submit_button_text: string;
// };

// type AboutResponse = {
//   meta?: {
//     meta_title?: string;
//     meta_description?: string;
//     meta_keywords?: string;
//   };
//   hero?: AboutHero | null;
//   values_section?: ValuesSection | null;
//   values?: ValueItem[];
//   cta?: CtaSection | null;
//   demo?: DemoSection | null;
// };

// export default function AboutPage() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [hero, setHero] = useState<AboutHero | null>(null);
//   const [valuesSection, setValuesSection] = useState<ValuesSection | null>(null);
//   const [values, setValues] = useState<ValueItem[]>([]);
//   const [cta, setCta] = useState<CtaSection | null>(null);
//   const [demo, setDemo] = useState<DemoSection | null>(null);
//   const [meta, setMeta] = useState<AboutResponse["meta"] | null>(null);

//   useEffect(() => {
//     const fetchAboutContent = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/about/");
//         if (!res.ok) throw new Error("Failed to fetch about content");

//         const data: AboutResponse = await res.json();

//         if (data.meta) setMeta(data.meta);
//         if (data.hero) {
//           setHero(data.hero);
//         }

//         if (data.values_section) {
//           setValuesSection(data.values_section);
//         }

//         if (Array.isArray(data.values)) {
//           setValues(
//             [...data.values]
//               .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
//               .map((item) => ({
//                 title: item.title,
//                 description: item.description,
//                 order: item.order,
//               }))
//           );
//         }

//         if (data.cta) {
//           setCta(data.cta);
//         }

//         if (data.demo) {
//           setDemo(data.demo);
//         }
//       } catch {
//         setHero(null);
//         setValuesSection(null);
//         setValues([]);
//         setCta(null);
//         setDemo(null);
//         setMeta(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAboutContent();
//   }, []);

//   // Apply admin SEO to the document head.
//   useEffect(() => {
//     if (!meta?.meta_title) return;
//     document.title = meta.meta_title;

//     const ensureMetaTag = (name: string) => {
//       let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
//       if (!el) {
//         el = document.createElement("meta");
//         el.setAttribute("name", name);
//         document.head.appendChild(el);
//       }
//       return el;
//     };

//     if (typeof meta.meta_description === "string" && meta.meta_description) {
//       ensureMetaTag("description").setAttribute("content", meta.meta_description);
//     }
//     if (typeof meta.meta_keywords === "string" && meta.meta_keywords) {
//       ensureMetaTag("keywords").setAttribute("content", meta.meta_keywords);
//     }
//   }, [meta]);

//   if (isLoading) return <p className="text-center mt-20">Loading...</p>;
//   if (!hero || !valuesSection || !cta || !demo) {
//     return <p className="text-center mt-20">Content unavailable.</p>;
//   }

//   const heroCircleText = hero.heading.split(" ");
//   return (
//     <main className="bg-[#F4F5FC] pt-16">
//       {/* Breadcrumb */}
//       <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
//         <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center gap-2">
//           {/* Home icon */}
//           <Home className="w-4 h-4 text-slate-500 mr-1" />
//           <Link href="/" className="hover:text-[#0066FF] transition-colors">
//             Home
//           </Link>
//           <span className="mx-2 text-slate-400">/</span>
//           <span className="font-semibold text-[#001f3f]">About</span>
//         </div>
//       </section>

//       {/* About Hero */}
//       <section className="bg-[#EAF5FF] px-6 md:px-12 py-16 md:py-20">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
//           <div className="flex justify-center md:justify-start">
//             <div className="relative w-56 h-56 rounded-full bg-[#DCEBFF] grid place-items-center">
//               <div className="w-44 h-44 rounded-full bg-gradient-to-br from-[#1F77D0] to-[#2C6ED5] shadow-lg grid place-items-center">
//                 <div className="text-center text-white font-extrabold leading-none">
//                   <div className="text-5xl">{heroCircleText[0] ?? ""}</div>
//                   <div className="text-5xl">{heroCircleText[1] ?? ""}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h1 className="text-4xl md:text-5xl font-extrabold text-[#112645]">{hero.heading}</h1>
//             <p className="mt-4 text-[#112645]/75 leading-7">
//               {hero.paragraph_one}
//             </p>
//             <p className="mt-4 text-[#112645]/75 leading-7">
//               {hero.paragraph_two}
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* OUR VALUES */}
//       <section className="px-6 md:px-12 py-16 md:py-20 bg-white">
//         <div className="max-w-6xl mx-auto">

//           {/* HEADING */}
//           <div className="text-center">
//             <h2 className="text-4xl font-extrabold text-[#111B33]">
//               {valuesSection.heading}
//             </h2>
//             <p className="mt-3 text-[#111B33]/70 max-w-2xl mx-auto">
//               {valuesSection.subtitle}
//             </p>
//           </div>

//           {/* VALUES GRID */}
//           <div className="grid md:grid-cols-2 gap-6 mt-12">

//             {values.map((item, i) => (
//               <div
//                 key={i}
//                 className="bg-[#F4F5FC] border border-slate-100 rounded-2xl p-6 hover:shadow-md transition"
//               >
//                 {/* ICON CIRCLE */}
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2C6ED5] to-[#14B8A6] flex items-center justify-center text-white font-bold">
//                   {i + 1}
//                 </div>

//                 {/* TITLE */}
//                 <h3 className="mt-4 text-lg font-semibold text-[#111B33]">
//                   {item.title}
//                 </h3>

//                 {/* DESC */}
//                 <p className="mt-2 text-sm text-[#111B33]/70 leading-relaxed">
//                   {item.description}
//                 </p>
//               </div>
//             ))}

//           </div>
//         </div>
//       </section>

//       {/* CTA SECTION */}
//       <section className="px-6 md:px-12 py-16 md:py-20 bg-gradient-to-r from-[#2C6ED5] to-[#14B8A6]">
//         <div className="max-w-6xl mx-auto text-center text-white">

//           {/* HEADING */}
//           <h2 className="text-3xl md:text-4xl font-extrabold">
//             {cta.heading}
//           </h2>

//           {/* SUBTEXT */}
//           <p className="mt-4 text-white/90 max-w-2xl mx-auto">
//             {cta.subtitle}
//           </p>

//           {/* BUTTONS */}
//           <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">

//             <button className="bg-white text-[#2C6ED5] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
//               {cta.primary_button_text}
//             </button>

//             <button className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-[#2C6ED5] transition">
//               {cta.secondary_button_text}
//             </button>

//           </div>

//         </div>
//       </section>

//       {/* Demo + Form */}
//       <section className="relative px-6 md:px-12 py-16 md:py-20 overflow-hidden">
//         <div className="pointer-events-none absolute left-5 top-10 w-16 h-16 rounded-full border-4 border-[#F4BF97]/70" />
//         <div className="pointer-events-none absolute left-10 bottom-14 w-16 h-16 rounded-full border-4 border-[#F4BF97]/70" />
//         <div className="pointer-events-none absolute -right-8 bottom-6 w-36 h-28 rounded-tl-[80px] rounded-bl-[80px] bg-[#CFCBF6]/80" />

//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
//           <div>
//             <h2 className="text-4xl font-extrabold text-[#111B33]">{demo.heading}</h2>
//             <ul className="mt-5 space-y-3 text-[#111B33]/75">
//               {demo.features.map((feature, i) => (
//                 <li key={i}>• {feature}</li>
//               ))}
//             </ul>
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
//             <h3 className="text-4xl font-extrabold text-center text-[#111B33]">{demo.form_title}</h3>
//             <p className="text-center text-sm text-[#111B33]/60 mt-2">{demo.form_subtitle}</p>

//             <form className="mt-6 space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-[#111B33]">Full Name</label>
//                 <input
//                   type="text"
//                   placeholder="Enter your full name"
//                   className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-[#111B33]">Email Address</label>
//                 <input
//                   type="email"
//                   placeholder="you@example.com"
//                   className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-[#111B33]">Phone Number</label>
//                 <div className="mt-1 flex gap-2">
//                   <span className="inline-flex items-center rounded-md border border-slate-300 bg-slate-50 px-3 text-sm">
//                     +91
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="Enter your phone number"
//                     className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-[#111B33]">* Select Courses</label>
//                 <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]">
//                   {demo.courses.map((course, i) => (
//                     <option key={i}>{course}</option>
//                   ))}
//                 </select>
//               </div>

//               <label className="flex items-start gap-2 text-sm text-[#111B33]/70">
//                 <input type="checkbox" className="mt-1" />
//                 <span>
//                   I agree with the <span className="text-[#2C6ED5]">Terms & Conditions</span>.
//                 </span>
//               </label>

//               <button
//                 type="button"
//                 className="w-full rounded-md bg-gradient-to-r from-[#2C6ED5] to-[#14B8A6] py-3 text-white font-semibold hover:opacity-95 transition"
//               >
//                 {demo.submit_button_text}
//               </button>

//               <p className="text-center text-xs text-[#111B33]/55">Your information is safe.</p>
//             </form>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }



// import AboutClient from "./AboutClient";

// /* ✅ SERVER FETCH */
// async function getAboutData() {
//   try {
//     const res = await fetch("http://127.0.0.1:8000/api/about/", {
//       cache: "no-store",
//     });

//     if (!res.ok) return null;

//     return res.json();
//   } catch {
//     return null;
//   }
// }

// /* ✅ SEO (VISIBLE IN VIEW SOURCE) */
// export async function generateMetadata() {
//   const data = await getAboutData();
//   const meta = data?.meta;

//   return {
//     title: meta?.meta_title || "About",
//     description: meta?.meta_description || "",
//     keywords: meta?.meta_keywords
//       ? meta.meta_keywords.split(",").map((k: string) => k.trim())
//       : undefined,

//     alternates: {
//       canonical: "https://yourdomain.com/about",
//     },

//     openGraph: {
//       title: meta?.meta_title,
//       description: meta?.meta_description,
//     },

//     twitter: {
//       card: "summary_large_image",
//       title: meta?.meta_title,
//       description: meta?.meta_description,
//     },
//   };
// }

// /* ✅ SSR PAGE */
// export default async function Page() {
//   const data = await getAboutData();

//   return <AboutClient initialData={data} />;
// }



import AboutClient from "./AboutClient";
import { apiUrl } from "../lib/api";

/* ✅ SERVER FETCH */
async function getAboutData() {
  try {
    const res = await fetch(apiUrl("/api/about/"), {
      cache: "no-store",
    });
    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

async function getCourses() {
  try {
    const res = await fetch(apiUrl("/api/courses/"), {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
/* ✅ SEO (VISIBLE IN VIEW SOURCE) */
export async function generateMetadata() {
  const data = await getAboutData();
  const meta = data?.meta;

  return {
    title: meta?.meta_title || "About",
    description: meta?.meta_description || "",
    keywords: meta?.meta_keywords
      ? meta.meta_keywords.split(",").map((k: string) => k.trim())
      : undefined,

    alternates: {
      canonical: "https://skillvedika.com/about",
    },

    openGraph: {
      title: meta?.meta_title,
      description: meta?.meta_description,
    },

    twitter: {
      card: "summary_large_image",
      title: meta?.meta_title,
      description: meta?.meta_description,
    },
  };
}

/* ✅ SSR PAGE */
export default async function Page() {
 const [data, coursesData] = await Promise.all([getAboutData(), getCourses()]);

  return <AboutClient initialData={data} courses={coursesData} />;
}




 

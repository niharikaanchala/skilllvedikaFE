import type { Metadata } from "next";
import InstructorClient, { type InstructorPageData } from "./InstructorClient";
import { apiUrl } from "@/app/lib/api";

async function fetchInstructorPageData(): Promise<InstructorPageData | null> {
  try {
    const res = await fetch(apiUrl("/api/instructor/instructor-page/"), {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    if (!json || typeof json !== "object") return null;
    return json as InstructorPageData;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchInstructorPageData();
  const hero = data?.hero ?? {};

  const title =
    hero.seo_meta_title?.trim() ||
    hero.title?.trim() ||
    "Instructor | SkillVedika";

  const description =
    hero.seo_meta_description?.trim() ||
    hero.subtitle?.trim() ||
    "Become an instructor at SkillVedika. Share your expertise and help learners grow.";

  const keywords = (hero.seo_meta_keywords ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const url = "https://skillvedika.com/instructor";

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "SkillVedika",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function InstructorPage() {
  const initialData = await fetchInstructorPageData();
  return <InstructorClient initialData={initialData} />;
}

//   useEffect(() => {
//     fetch(apiUrl("/api/instructor/instructor-page/"))
//       .then((res) => res.json() as Promise<InstructorPageData>)
//       .then((json) => {
//         setData(json);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("API Error:", err);
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (!data?.hero) return;
//     const seoTitle = data.hero.seo_meta_title?.trim() || data.hero.title?.trim();
//     const seoDescription =
//       data.hero.seo_meta_description?.trim() || data.hero.subtitle?.trim() || "";
//     const seoKeywords = data.hero.seo_meta_keywords?.trim() || "";

//     if (seoTitle) {
//       document.title = seoTitle;
//     }

//     const ensureMeta = (name: string) => {
//       let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
//       if (!tag) {
//         tag = document.createElement("meta");
//         tag.setAttribute("name", name);
//         document.head.appendChild(tag);
//       }
//       return tag;
//     };

//     if (seoDescription) {
//       ensureMeta("description").setAttribute("content", seoDescription);
//     }
//     if (seoKeywords) {
//       ensureMeta("keywords").setAttribute("content", seoKeywords);
//     }
//   }, [data]);

//   if (loading) return <p className="text-center py-20">Loading...</p>;
//   if (!data) return <p className="text-center py-20">No data found</p>;

//   const onFieldChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? Boolean(checked) : value,
//     }));
//   };

//   const onSubmitApplication = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSubmitError("");
//     setSubmitSuccess("");

//     if (
//       !formData.first_name.trim() ||
//       !formData.last_name.trim() ||
//       !formData.email.trim() ||
//       !formData.phone.trim() ||
//       !formData.years_of_experience.trim() ||
//       !formData.skills.trim()
//     ) {
//       setSubmitError("Please fill all required fields.");
//       return;
//     }
//     if (!formData.agreed_to_terms) {
//       setSubmitError("Please agree to Terms & Conditions and Privacy Policy.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const payload: InstructorApplicationPayload = {
//         ...formData,
//         skills: formData.skills
//           .split(",")
//           .map((x) => x.trim())
//           .filter(Boolean)
//           .join(", "),
//       };
//       const res = await fetch(apiUrl("/api/instructor/applications/submit/"), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const body = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         const errorText =
//           typeof body?.detail === "string"
//             ? body.detail
//             : "Could not submit application. Please try again.";
//         setSubmitError(errorText);
//         return;
//       }
//       setSubmitSuccess("Application submitted successfully.");
//       setFormData({
//         first_name: "",
//         last_name: "",
//         email: "",
//         phone: "",
//         years_of_experience: "",
//         skills: "",
//         message: "",
//         agreed_to_terms: false,
//       });
//     } catch {
//       setSubmitError("Network error while submitting application.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <main className="bg-[#F5F7FB] text-[#0C1A35] pt-16">
//       {/* Breadcrumb */}
//       <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
//         <div className="max-w-6xl mx-auto text-xs md:text-sm text-slate-500 flex items-center gap-2">
//           {/* Home icon */}
//           <Home className="w-4 h-4 text-slate-500 mr-1" />
//           <Link href="/" className="hover:text-[#0066FF] transition-colors">
//             Home
//           </Link>
//           <span className="mx-2 text-slate-400">/</span>
//           <span className="font-semibold text-[#001f3f]">Instructor</span>
//         </div>
//       </section>

//       {/* HERO */}
//       <section
//         className="text-center py-16 md:py-20 px-6 md:px-12"
//         style={{ backgroundColor: data.hero?.background_color || "#EAF0F8" }}
//       >
//         <h1
//           className="text-4xl md:text-5xl font-extrabold"
//           style={{ color: data.hero?.text_color || "#0C1A35" }}
//         >
//           {data.hero?.title || "Become an Instructor"}
//         </h1>

//         <p className="mt-4 max-w-2xl mx-auto leading-relaxed text-[#5B6B88]">
//           {data.hero?.subtitle || ""}
//         </p>

//         <div className="mt-6 flex justify-center gap-4">
//           <button className="bg-[#0C2D57] text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-[#0A2446] transition">
//             {data.hero?.button_primary_text || "Apply Now"}
//           </button>

//           <button className="border border-[#CBD5E1] bg-white px-6 py-2.5 rounded-md text-sm font-semibold text-[#0C1A35] hover:bg-slate-50 transition">
//             {data.hero?.button_secondary_text || "Learn More"}
//           </button>
//         </div>
//       </section>

//       {/* WHY SECTION */}
//       <section className="py-14 px-6 md:px-12 bg-white">
//         <div className="max-w-6xl mx-auto text-center">
//           <h2 className="text-4xl font-extrabold text-[#0C1A35]">
//             {data.why_section?.title || "Why Become an Instructor?"}
//           </h2>

//           <p className="text-[#5B6B88] mt-2">
//             {data.why_section?.subtitle ||
//               "Join our community of expert instructors and enjoy these amazing benefits"}
//           </p>

//           <div className="grid md:grid-cols-3 gap-6 mt-10">
//             {(data.features || []).map((item: InstructorFeature, i: number) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-lg p-6 text-left border border-slate-200 hover:shadow-sm transition"
//               >
//                 <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#E0ECFF] text-[#2563EB] mb-4 font-bold">
//                   {item.icon || "⭐"}
//                 </div>

//                 <h3 className="font-semibold text-lg text-[#0C1A35]">
//                   {item.title}
//                 </h3>

//                 <p className="text-sm text-[#5B6B88] mt-2">
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section
//         className="py-14 px-6 md:px-12 text-center"
//         style={{ backgroundColor: data.cta?.background_color || "#EAF0F8" }}
//       >
//         <h2
//           className="text-4xl md:text-5xl font-extrabold"
//           style={{ color: data.cta?.text_color || "#1E3A68" }}
//         >
//           {data.cta?.title || "Ready to Start Your Teaching Journey?"}
//         </h2>

//         <p className="text-[#5B6B88] mt-4 max-w-2xl mx-auto">
//           {data.cta?.subtitle || ""}
//         </p>

//         <button className="mt-6 bg-[#0C2D57] text-white px-8 py-2.5 rounded-md text-sm font-semibold hover:bg-[#0A2446] transition">
//           {data.cta?.button_text || "Apply Now"}
//         </button>
//       </section>

//       {/* FORM */}
//       <section className="py-14 px-6 md:px-12 bg-white">
//         <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
//           <h2 className="text-3xl font-extrabold text-center text-[#0C1A35]">
//             {data.form?.title || "Apply to Become an Instructor"}
//           </h2>

//           <p className="text-center text-[#5B6B88] mt-2">
//             {data.form?.subtitle || ""}
//           </p>

//           <form className="mt-8 space-y-5" onSubmit={onSubmitApplication}>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-semibold">First Name *</label>
//                 <input
//                   name="first_name"
//                   value={formData.first_name}
//                   onChange={onFieldChange}
//                   className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-semibold">Last Name *</label>
//                 <input
//                   name="last_name"
//                   value={formData.last_name}
//                   onChange={onFieldChange}
//                   className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-semibold">Email *</label>
//               <input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={onFieldChange}
//                 className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-semibold">Phone *</label>
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={onFieldChange}
//                 className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
//               />
//             </div>

//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-semibold">Years of Experience *</label>
//                 <select
//                   name="years_of_experience"
//                   value={formData.years_of_experience}
//                   onChange={onFieldChange}
//                   className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5] bg-white"
//                 >
//                   <option value="">Select experience</option>
//                   {EXPERIENCE_OPTIONS.map((opt) => (
//                     <option key={opt} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="text-sm font-semibold">Skills *</label>
//                 <input
//                   name="skills"
//                   list="instructor-skills"
//                   value={formData.skills}
//                   onChange={onFieldChange}
//                   placeholder="Type or select your skills..."
//                   className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
//                 />
//                 <datalist id="instructor-skills">
//                   {SKILL_SUGGESTIONS.map((skill) => (
//                     <option key={skill} value={skill} />
//                   ))}
//                 </datalist>
//                 <p className="text-xs text-[#5B6B88] mt-2">
//                   You can type custom skills and separate multiple by commas.
//                 </p>
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-semibold">Message (Optional)</label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={onFieldChange}
//                 placeholder="Tell us briefly about your expertise or availability..."
//                 rows={4}
//                 className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2C6ED5]"
//               />
//               <p className="text-xs text-[#5B6B88] mt-2">
//                 Optional - helps our team understand your profile better.
//               </p>
//             </div>

//             <label className="flex items-start gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 name="agreed_to_terms"
//                 checked={formData.agreed_to_terms}
//                 onChange={onFieldChange}
//                 className="mt-1"
//               />
//               <span>
//                 I agree to the{" "}
//                 <a href="/terms" className="text-[#2C6ED5] underline">
//                   Terms & Conditions
//                 </a>{" "}
//                 and{" "}
//                 <a href="/privacy" className="text-[#2C6ED5] underline">
//                   Privacy Policy
//                 </a>
//                 *
//               </span>
//             </label>

//             {submitError ? (
//               <p className="text-sm text-rose-600">{submitError}</p>
//             ) : null}
//             {submitSuccess ? (
//               <p className="text-sm text-emerald-600">{submitSuccess}</p>
//             ) : null}

//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full bg-gradient-to-r from-[#2C6ED5] to-[#2563EB] text-white py-2.5 rounded-md font-semibold hover:opacity-95 transition disabled:opacity-70"
//             >
//               {submitting
//                 ? "Submitting..."
//                 : data.form?.submit_button_text || "Submit Application"}
//             </button>
//           </form>
//         </div>
//       </section>
//     </main>
//   );
// }
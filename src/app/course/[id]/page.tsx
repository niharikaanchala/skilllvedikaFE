

import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CounsellingModal from "./CounsellingModal";
import {
  fetchCourses,
  fetchCourseById,
  fetchCourseIdBySlug,
  fetchCourseSkills,
  fetchCourseTools,
  fetchCourseCurriculum,
  fetchCourseProjects,
  fetchCourseSalaries,
  fetchCourseAbout,
  fetchCoursePlacementSupport,
  fetchCourseCorporateTraining,
  fetchCourseSectionMeta,
  fetchCourseFaqs,
  fetchCourseBatches,
  fetchCourseBlogsForCourse,
  fetchCourseTrainers,
  fetchBlogs,
  type BlogPostApi,
  type CourseApi,
} from "@/app/lib/api";
import { buildCourseDetailSchema } from "@/app/components/schemas/course-schema";
import { buildBreadcrumbSchema } from "@/app/components/schemas/breadcrumb-schema";
import { buildFaqPageSchema } from "@/app/components/schemas/faq-schema";
import { enforcePoppinsHtml } from "@/app/lib/html";
import { Home } from "lucide-react";


/** Reference palette: deep navy, sky cyan, gold accents */
const navy = {
  deep: "#0a2540",
  mid: "#102a43",
  card: "#0d2137",
};
const cyan = "#00aeef";
const gold = "#ffcc00";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const slug = id;
  const courseId = await fetchCourseIdBySlug(slug);
  if (!courseId) {
    return {
      title: "Course not found",
    };
  }

  const course = await fetchCourseById(courseId);
  if (!course) {
    return {
      title: "Course not found",
    };
  }

  const keywords = (course.seo_meta_keywords ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title: course.seo_meta_title?.trim() || course.title,
    description:
      course.seo_meta_description?.trim() || course.description,
    keywords: keywords.length ? keywords : undefined,
  };
}

function formatRating(rating: number) {
  return Number.isFinite(rating) ? rating.toFixed(1) : "0.0";
}

function categoryIdOf(course: CourseApi): number {
  if (typeof course.category === "object" && course.category !== null) {
    return (course.category as { id: number }).id;
  }
  return course.category as number;
}

function formatBlogDate(iso: string) {
  const d = new Date(iso.includes("T") ? iso : `${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function normalizeCategoryKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugifyCategory(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}



function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-[#0a2540] tracking-tight">
      {children}
    </h2>
  );
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const slug = id;

  const courseId = await fetchCourseIdBySlug(slug);
  if (!courseId) notFound();

  const [
    course,
    allCourses,
    sectionMeta,
    aboutSections,
    skills,
    tools,
    curriculum,
    projects,
    salaries,
    placementSupportSections,
    corporateTrainingSections,
    faqs,
    batches,
    blogs,
    trainers,
    allBlogPosts,
  ] = await Promise.all([
    fetchCourseById(courseId),
    fetchCourses(),
    fetchCourseSectionMeta(slug),
    fetchCourseAbout(slug),
    fetchCourseSkills(slug),
    fetchCourseTools(slug),
    fetchCourseCurriculum(slug),
    fetchCourseProjects(slug),
    fetchCourseSalaries(slug),
    fetchCoursePlacementSupport(slug),
    fetchCourseCorporateTraining(slug),
    fetchCourseFaqs(slug),
    fetchCourseBatches(slug),
    fetchCourseBlogsForCourse(slug),
    fetchCourseTrainers(slug),
    fetchBlogs().catch(() => [] as BlogPostApi[]),
  ]);


  if (!course) notFound();

  const catId = categoryIdOf(course);
  const categoryLabel =
    course.category_name ??
    (typeof course.category === "object" && course.category !== null
      ? (course.category as { name?: string }).name
      : undefined);
  const categorySlug =
    typeof course.category === "object" && course.category !== null
      ? ((course.category as { slug?: string }).slug ?? "")
      : "";
  const categoryHref =
    categoryLabel && (categorySlug || slugifyCategory(categoryLabel))
      ? `/courses/${categorySlug || slugifyCategory(categoryLabel)}`
      : null;

  const relatedFromCategory = allCourses.filter((c) => {
    if (c.slug === slug) return false;
    return categoryIdOf(c) === catId;
  });

  const relatedCourses = relatedFromCategory.slice(0, 6);

  const categoryKey = normalizeCategoryKey(categoryLabel ?? "");
  const relatedBlogs = allBlogPosts
    .filter((post) => normalizeCategoryKey(post.category ?? "") === categoryKey)
    .slice(0, 6);

  const courseHref = (c: CourseApi) => `/course/${c.slug}`;

  const cardBase =
    "bg-white rounded-2xl border border-sky-100/80 shadow-lg shadow-[#0a2540]/[0.06]";

  const aboutText =
    aboutSections?.[0]?.content?.trim() || course.description;
  const aboutHeading =
    aboutSections?.[0]?.heading?.trim() ||
    sectionMeta?.about_heading?.trim() ||
    "About This Course";
  const placementSupportText =
    placementSupportSections?.[0]?.content?.trim() || "";
  const placementSupportHeading =
    placementSupportSections?.[0]?.heading?.trim() ||
    sectionMeta?.placement_support_heading?.trim() ||
    "Placement Support";
  const corporateTrainingText =
    corporateTrainingSections?.[0]?.content?.trim() || "";
  const corporateTrainingHeading =
    corporateTrainingSections?.[0]?.heading?.trim() ||
    sectionMeta?.corporate_training_heading?.trim() ||
    "Corporate Training";
  const aboutHtml = enforcePoppinsHtml(aboutText);
  const placementSupportHtml = enforcePoppinsHtml(placementSupportText);
  const corporateTrainingHtml = enforcePoppinsHtml(corporateTrainingText);

  const skillsHeading = sectionMeta?.skills_heading?.trim() || "Skills You’ll Learn";
  const toolsHeading = sectionMeta?.tools_heading?.trim() || "Tools & Technologies";
  const curriculumHeading = sectionMeta?.curriculum_heading?.trim() || "Course Curriculum";
  const projectsHeading = sectionMeta?.projects_heading?.trim() || "Live Projects";
  const salaryHeading = sectionMeta?.salary_heading?.trim() || "Career Opportunities";
  const trainersHeading = sectionMeta?.trainers_heading?.trim() || "Meet Your Trainers";
  const batchesHeading = sectionMeta?.batches_heading?.trim() || "Upcoming Batches";
  const blogsHeading = sectionMeta?.blogs_heading?.trim() || "Recommended Reads";
  const faqsHeading = sectionMeta?.faqs_heading?.trim() || "FAQs";
  const courseSchema = buildCourseDetailSchema(course);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
    ...(categoryLabel
      ? [{ name: categoryLabel, url: categoryHref || undefined }]
      : []),
    { name: course.title, url: `/course/${course.slug}` },
  ]);
  const faqSchema = faqs.length
    ? buildFaqPageSchema(
        faqs
          .filter((f) => f.question?.trim() && f.answer?.trim())
          .map((f) => ({ question: f.question, answer: f.answer })),
        {
          name: faqsHeading,
          url: `/course/${course.slug}`,
        },
      )
    : null;

const handleSubmit=async()=>{

}

  // console.log("Curriculum Data:", curriculum);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/<\/script/gi, "<\\/script"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseSchema).replace(/<\/script/gi, "<\\/script"),
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
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/40 to-white text-slate-800 pt-16">
      <section className="px-6 md:px-12 py-4 border-b border-sky-100/80 bg-white/70">
        <div className="max-w-7xl mx-auto text-xs md:text-sm text-slate-500 flex flex-wrap items-center gap-1.5">
          {/* Home icon */}
          <Home className="w-4 h-4 text-slate-500 mr-1" />
          <Link href="/" className="hover:text-[#0066FF] transition-colors">
            Home
          </Link> 
          <span className="mx-2 text-slate-400">/</span>
          
          <Link href="/courses" className="hover:text-[#0066FF] transition-colors">
            Courses
          </Link>
          {categoryLabel ? (
            <>
              <span>/</span>
              {categoryHref ? (
                <Link href={categoryHref} className="hover:text-[#0066FF] transition-colors">
                  {categoryLabel}
                </Link>
              ) : (
                <span>{categoryLabel}</span>
              )}
            </>
          ) : null}
          <span>/</span>
          <span className="font-semibold text-[#001f3f]">{course.title}</span>
        </div>
      </section>

      {/* Hero — deep navy + cyan accents (reference UI) */}
      <section
        className="relative overflow-hidden text-white px-6 md:px-12 py-14 md:py-20"
        style={{
          background: `linear-gradient(135deg, ${navy.deep} 0%, ${navy.mid} 45%, #0f3460 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 20% 0%, ${cyan}, transparent 55%)`,
          }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">
          <div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-[#0a2540]"
              style={{ backgroundColor: gold }}
            >
              {categoryLabel ?? "SkillVedika programme"}
            </span>

            {course.duration ? (
              <p className="mt-4 text-sm font-medium text-white/80">{course.duration}</p>
            ) : null}

            <h1 className="text-3xl md:text-5xl font-extrabold mt-3 leading-[1.1] tracking-tight">
              {course.title}
            </h1>

            <p className="mt-5 text-white/85 max-w-xl leading-relaxed text-base md:text-lg">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              {course.duration ? (
                <div
                  className="px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10"
                  style={{ backgroundColor: navy.card }}
                >
                  ⏱ {course.duration}
                </div>
              ) : null}
              <div
                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10"
                style={{ backgroundColor: navy.card }}
              >
                ⭐ {formatRating(course.rating)} Rating
              </div>
            </div>

            <div className="mt-8 flex items-baseline gap-3 flex-wrap">
              <span className="text-sm text-white/70 uppercase tracking-wide font-semibold">
                Fee
              </span>
              <span
                className="text-3xl md:text-4xl font-extrabold"
                style={{ color: gold }}
              >
                {course.price}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <CounsellingModal
                courseId={course.id}
                courseTitle={course.title}
                buttonText="Enroll Now"
                className="font-bold px-7 py-3.5 rounded-xl shadow-lg transition hover:brightness-110 text-[#0a2540] bg-[#ffcc00]"
              />

              <CounsellingModal
                courseId={course.id}
                courseTitle={course.title}
                buttonText="Get Free Counselling"
                className="border-2 border-white/40 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/25 ring-1 ring-sky-100">
            <h3 className="text-lg font-bold text-[#0a2540]">
              Get Course Details
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Book a free counselling call — we&apos;ll get back to you shortly.
            </p>

            <form className="mt-5 space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent transition"
              />

              <input
                type="email"
                placeholder="Email Address *"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
              />

              <input
                type="tel"
                placeholder="Phone Number *"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
              />

              <select
                name="course"
                defaultValue={String(course.id)}
                aria-label="Select course"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-sky-50/80 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
              >
                {[...allCourses]
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.title}
                    </option>
                  ))}
              </select>

              <button
              
                className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition hover:brightness-105"
                style={{
                  background: `linear-gradient(90deg, ${cyan} 0%, #0090c9 100%)`,
                }}
              >
                Get Free Counselling
              </button>
            </form>

            <p className="text-xs text-slate-500 mt-4 text-center leading-relaxed">
              No spam. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 space-y-14 md:space-y-16">
        <div className={`${cardBase} p-6 md:p-8`}>
          <SectionTitle>{aboutHeading}</SectionTitle>
          <div
            className="text-slate-600 mt-4 leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: aboutHtml }}
          />
        </div>

        {skills.length > 0 ? (
          <div>
            <SectionTitle>{skillsHeading}</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className={`${cardBase} p-5 flex items-center gap-3 hover:border-[#00aeef]/40 transition-colors`}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white text-sm font-bold"
                    style={{ background: `linear-gradient(135deg, ${cyan}, #0090c9)` }}
                  >
                    ✓
                  </span>
                  <span className="min-w-0">
                    <span className="font-medium text-[#0a2540] block">{s.name}</span>
                    {s.description?.trim() ? (
                      <span className="text-xs text-slate-600 block mt-1 whitespace-pre-line">
                        {s.description.trim()}
                      </span>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tools.length > 0 ? (
          <div>
            <SectionTitle>{toolsHeading}</SectionTitle>
            <div className="flex flex-wrap gap-3 mt-6">
              {tools.map((t) => (
                <span
                  key={t.id}
                  className="bg-white px-4 py-2 rounded-full border border-sky-200/90 text-sm font-medium text-[#0a2540] shadow-sm hover:border-[#00aeef]/50 hover:bg-sky-50/80 transition"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {curriculum.length > 0 ? (
          <div>
            <SectionTitle>{curriculumHeading}</SectionTitle>
            <div className="space-y-3 mt-6">
              {curriculum.map((item) => (
                <details 
                  open
                  key={item.id}
                  className={`${cardBase} p-4 md:p-5 group open:ring-2 open:ring-[#00aeef]/25`}
                >
                  <summary className="cursor-pointer font-semibold text-[#0a2540] list-none flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
                    {item.title}
                    <span className="text-[#00aeef] text-lg font-light group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div
                    className="mt-3 text-slate-600 text-sm leading-relaxed border-t border-sky-100 pt-3 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: enforcePoppinsHtml(item.content || "") }}
                  />
                </details>
              ))}
            </div>
          </div>
        ) : null}

        {projects.length > 0 ? ( 
          <div>
            <SectionTitle>{projectsHeading}</SectionTitle>
            <div className="grid md:grid-cols-3 gap-5 mt-6">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className={`${cardBase} p-5 hover:shadow-xl hover:border-[#00aeef]/30 transition-all`}
                >
                  <div
                    className="h-1 w-12 rounded-full mb-4"
                    style={{ background: `linear-gradient(90deg, ${cyan}, transparent)` }}
                  />
                  <h3 className="font-semibold text-[#0a2540]">{p.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {salaries.length > 0 ? (
          <div>
            <SectionTitle>{salaryHeading}</SectionTitle>
            <div className="grid md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {salaries.map((row) => (
                <div
                  key={row.id}
                  className={`${cardBase} p-5 text-center hover:border-[#00aeef]/35 transition`}
                >
                  <h3 className="font-semibold text-[#0a2540]">{row.role}</h3>
                  <p
                    className="mt-2 font-bold text-lg"
                    style={{ color: cyan }}
                  >
                    {row.range}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {placementSupportText ? (
          <div
            className={`${cardBase} p-6 md:p-8 bg-gradient-to-br from-white via-sky-50/50 to-white`}
          >
            <SectionTitle>{placementSupportHeading}</SectionTitle>
            <div
              className="mt-4 text-sm text-slate-600 max-w-2xl leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: placementSupportHtml }}
            />
          </div>
        ) : (
          <div
            className={`${cardBase} p-6 md:p-8 bg-gradient-to-br from-white via-sky-50/50 to-white`}
          >
            <SectionTitle>{placementSupportHeading}</SectionTitle>
            <p className="mt-4 text-sm text-slate-600 max-w-2xl leading-relaxed">
              We provide career guidance, interview preparation, and connections
              to hiring partners. Speak to counselling for details tailored to{" "}
              <span className="font-semibold text-[#0a2540]">{course.title}</span>
              .
            </p>
          </div>
        )}

        {corporateTrainingText ? (
          <div className={`${cardBase} p-6 md:p-8`}>
            <SectionTitle>{corporateTrainingHeading}</SectionTitle>
            <div
              className="text-slate-600 mt-4 leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: corporateTrainingHtml }}
            />
          </div>
        ) : null}

<div
          className="rounded-2xl text-white py-14 px-6 md:px-12 text-center shadow-xl overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${navy.deep} 0%, ${navy.mid} 50%, #0f3460 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 70% 20%, ${cyan}, transparent 50%)`,
            }}
            aria-hidden
          />
          <div className="relative max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Book a free demo for {course.title}
            </h2>

            <p className="mt-4 text-sm md:text-base text-white/85 leading-relaxed">
              See how we teach and get your questions answered by our team.
            </p>

            <div className="mt-8">
              <CounsellingModal
                courseId={course.id}
                courseTitle={course.title}
                buttonText="Get Free Counselling"
                className="inline-flex items-center justify-center font-bold px-8 py-3.5 rounded-xl text-[#0a2540] shadow-lg transition hover:brightness-110 bg-[#ffcc00]"
              />
            </div>
          </div>
        </div>

        {trainers.length > 0 ? (
          <div>
            <SectionTitle>{trainersHeading}</SectionTitle>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
              {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className={`${cardBase} p-6 text-center hover:shadow-xl hover:border-[#00aeef]/25 transition-all`}
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 ring-4 ring-sky-100"
                    style={{
                      background: `linear-gradient(145deg, ${cyan}33, #e0f2fe)`,
                    }}
                  />

                  <h3 className="font-semibold text-[#0a2540] text-lg">
                    {trainer.name}
                  </h3>

                  {trainer.company ? (
                    <p
                      className="text-sm font-semibold mt-2"
                      style={{ color: cyan }}
                    >
                      {trainer.company}
                    </p>
                  ) : null}

                  {trainer.exp ? (
                    <p className="text-xs text-slate-500 mt-2">{trainer.exp}</p>
                  ) : null}

                  {trainer.skills ? (
                    <p className="text-sm text-slate-600 mt-2">{trainer.skills}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {batches.length > 0 ? (
          <div className={`${cardBase} p-6 md:p-8`}>
            <SectionTitle>{batchesHeading}</SectionTitle>

            <div className="mt-8 grid md:grid-cols-3 gap-5">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="border border-sky-100 rounded-2xl p-5 bg-gradient-to-b from-sky-50/60 to-white hover:shadow-md hover:border-[#00aeef]/30 transition flex flex-col justify-between"
                >
                  <h3 className="text-lg font-bold text-[#0a2540]">
                    {batch.date}
                  </h3>

                  <p className="text-sm text-slate-600 mt-2">
                    {batch.mode} · {batch.seats}
                  </p>

                  {batch.limited ? (
                    <span className="mt-3 inline-block text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full w-fit">
                      Limited Seats!
                    </span>
                  ) : null}

                  <button
                    type="button"
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-white transition hover:brightness-105"
                    style={{
                      background: `linear-gradient(90deg, ${cyan}, #0090c9)`,
                    }}
                  >
                    Enroll
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {relatedCourses.length > 0 ? (
          <div className={`${cardBase} p-6 md:p-8`}>
            <SectionTitle>Related Courses</SectionTitle>

            <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {relatedCourses.map((c) => (
                <div
                  key={c.id}
                  className="border border-sky-100 rounded-2xl p-5 bg-slate-50/80 hover:bg-white hover:border-[#00aeef]/35 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-[#0a2540]">{c.title}</h3>

                    <p className="text-sm text-slate-600 mt-2">
                      {c.duration} · ⭐ {formatRating(c.rating)}
                    </p>
                  </div>

                  <Link
                    href={courseHref(c)}
                    className="mt-4 text-sm font-bold text-[#00aeef] hover:text-[#0090c9] inline-flex items-center gap-1"
                  >
                    View Course →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {(relatedBlogs.length > 0 || blogs.length > 0) ? (
          <div className={`${cardBase} p-6 md:p-8`}>
            <SectionTitle>{blogsHeading}</SectionTitle>

            <div className="mt-8 grid md:grid-cols-3 gap-5">
              {(relatedBlogs.length > 0
                ? relatedBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="border border-sky-100 rounded-2xl p-5 bg-gradient-to-br from-white to-sky-50/40 hover:shadow-md hover:border-[#00aeef]/30 transition block"
                    >
                      <h3 className="font-semibold text-[#0a2540]">{blog.title}</h3>

                      <p className="text-xs text-slate-500 mt-3">
                        {formatBlogDate(blog.date)}
                      </p>
                    </Link>
                  ))
                : blogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="border border-sky-100 rounded-2xl p-5 bg-gradient-to-br from-white to-sky-50/40 hover:shadow-md hover:border-[#00aeef]/30 transition"
                    >
                      <h3 className="font-semibold text-[#0a2540]">{blog.title}</h3>

                      <p className="text-xs text-slate-500 mt-3">
                        {formatBlogDate(blog.date)}
                      </p>
                    </div>
                  )))}
            </div>
          </div>
        ) : null}

        

        <section
          className="rounded-2xl text-white text-center py-14 px-6 md:px-16 shadow-xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #071a2e 0%, ${navy.deep} 40%, ${navy.mid} 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              background: `radial-gradient(ellipse at 30% 80%, ${cyan}, transparent 55%)`,
            }}
            aria-hidden
          />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ready to Start Your Journey?
            </h2>

            <p className="mt-4 text-sm md:text-base text-white/85 leading-relaxed">
              Enroll in {course.title} and take the next step in your career.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <CounsellingModal
                courseId={course.id}
                courseTitle={course.title}
                buttonText="Enroll Now"
                className="w-full sm:w-auto font-bold px-8 py-3.5 rounded-xl shadow-lg transition hover:brightness-110 text-[#0a2540] bg-[#ffcc00]"
              />

              <CounsellingModal
                courseId={course.id}
                courseTitle={course.title}
                buttonText="Talk to Expert"
                className="w-full sm:w-auto border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition backdrop-blur-sm"
              />
            </div>
          </div>
        </section>

        {faqs.length > 0 ? (
          <div>
            <SectionTitle>{faqsHeading}</SectionTitle>
            <div className="space-y-3 mt-6">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className={`${cardBase} p-4 md:p-5 group open:ring-2 open:ring-[#00aeef]/20`}
                >
                  <summary className="cursor-pointer font-semibold text-[#0a2540] list-none flex justify-between gap-2 items-center [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="text-[#00aeef] text-lg shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-slate-600 text-sm whitespace-pre-line leading-relaxed border-t border-sky-100 pt-3">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ) : null}
      </section>
      </main>
    </>
  );
}

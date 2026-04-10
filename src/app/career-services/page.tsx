import { fetchCareerPage, fetchCourses, fetchBlogs, type BlogPostApi } from "@/app/lib/api";
import CareerServicesClient from "./CareerServicesClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchCareerPage();

  const keywords = (data.meta?.meta_keywords ?? "")
    .split(",")
    .map((k: string) => k.trim())
    .filter(Boolean);

  return {
    title: data.meta?.meta_title || "Career Services",
    description: data.meta?.meta_description || "Career support services",
    keywords: keywords.length ? keywords : undefined,

    alternates: {
      canonical: "https://yourdomain.com/career-services",
    },

    openGraph: {
      title: data.meta?.meta_title,
      description: data.meta?.meta_description,
    },
  };
}

export default async function Page() {
  const [data, courses, blogs] = await Promise.all([
    fetchCareerPage(),
    fetchCourses(),
    fetchBlogs().catch(() => [] as BlogPostApi[]),
  ]);

  return <CareerServicesClient initialData={data} courses={courses} blogs={blogs} />;
}
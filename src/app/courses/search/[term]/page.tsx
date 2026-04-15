import CoursesPage from "../../page";

type SearchPageProps = {
  params: Promise<{ term: string }>;
};

function normalizeTermFromPath(term: string): string {
  return decodeURIComponent(term).replace(/-/g, " ").trim();
}

export default async function CourseSearchPage({ params }: SearchPageProps) {
  const { term } = await params;
  const q = normalizeTermFromPath(term);
  return CoursesPage({
    searchParams: Promise.resolve({
      q,
    }),
  });
}

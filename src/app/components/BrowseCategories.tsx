import Link from "next/link";
import { fetchCategories, type CategoryApi } from "@/app/lib/api";

export default async function BrowseCategories() {
  const categories = await fetchCategories();

  return (
    <section className="px-12 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900">Browse by Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((cat: CategoryApi) => (
            <Link key={cat.id} href={`/courses/${cat.slug}`} className="block">
              <div className="cursor-pointer text-left rounded-xl border bg-white px-4 py-4 transition hover:shadow-lg hover:-translate-y-1 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#3B6CB7]/10 flex items-center justify-center text-xs font-semibold text-[#3B6CB7]">
                    {cat.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 leading-tight">{cat.name}</div>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{cat.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
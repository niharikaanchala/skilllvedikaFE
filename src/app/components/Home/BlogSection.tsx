import Link from "next/link";
import { fetchBlogs } from "@/app/lib/api";
import { formatBlogDate } from "@/app/lib/blog-utils";

export default async function BlogSection() {
  let posts: Awaited<ReturnType<typeof fetchBlogs>> = [];
  try {
    const all = await fetchBlogs();
    posts = all.slice(0, 3);
  } catch {
    posts = [];
  }

  return (
    <section className="relative px-6 md:px-12 py-16 md:py-20 bg-gradient-to-b from-[#EEF3F8] to-white">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Latest Articles & Insights
        </h2>
        <p className="text-gray-600 mt-3 text-base md:text-lg">
          Stay updated with industry trends, tips, and learning guides
        </p>
      </div>

      {/* Empty State */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 mt-12 text-sm">
          No articles yet. Check back soon.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14 max-w-7xl mx-auto">
          {posts.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                {blog.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={160}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-44 bg-gray-200" />
                )}

                {/* Category Badge */}
                <span className="absolute top-3 left-3 text-xs bg-white/90 backdrop-blur px-3 py-1 rounded-full text-gray-700 shadow-sm">
                  {blog.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 text-left">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#3B6CB7] transition">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-5 text-xs text-gray-400">
                  <span>{formatBlogDate(blog.date)}</span>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-[#3B6CB7] font-medium hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#3B6CB7]/5 to-transparent" />
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-12">
        <Link href="/blog">
          <button className="bg-gradient-to-r from-[#3B6CB7] to-[#6FA4FF] text-white px-7 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition hover:scale-105">
            View All Articles
          </button>
        </Link>
      </div>
    </section>
  );
}
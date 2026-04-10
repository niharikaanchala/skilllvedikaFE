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
    <section className="px-12 py-20 bg-[#EEF3F8]">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-900">Latest Articles & Insights</h2>
        <p className="text-sm text-gray-500 mt-2">
          Stay updated with industry trends, tips, and learning guides
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500 mt-12 text-sm">
          No articles yet. Check back soon.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {posts.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {blog.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 bg-gray-200" />
              )}

              <div className="p-4 text-left">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{blog.category}</span>

                <h3 className="font-semibold mt-2 text-gray-900">{blog.title}</h3>

                <p className="text-sm text-gray-500 mt-1 line-clamp-3">{blog.excerpt}</p>

                <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                  <span>{formatBlogDate(blog.date)}</span>
                  <Link href={`/blog/${blog.slug}`} className="text-[#3B6CB7] font-medium">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link href="/blog">
          <button className="bg-[#3B6CB7] text-white px-6 py-2 rounded-full">View All Articles</button>
        </Link>
      </div>
    </section>
  );
}

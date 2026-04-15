import Link from "next/link";

type Props = {
  title: string;
  content: string;
};

export default function LegalDocumentLayout({ title, content }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <section className="mx-auto w-full max-w-5xl px-6 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#2f5fa8] hover:text-[#2f5fa8]"
        >
          <span aria-hidden>←</span>
          Back to Home
        </Link>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <h1 className="text-3xl font-extrabold text-[#001f3f] md:text-4xl">{title}</h1>
          <div
            className="prose prose-slate mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>
    </main>
  );
}

"use client";
import DemoForm from "../components/DemoForm";

type DemoData = {
  badge?: string;
  title_main?: string;
  title_highlight?: string;
  description?: string;
};

type FeatureData = {
  title?: string;
  desc?: string;
  text?: string;
};

type Props = {
  demo: DemoData;
  courses: unknown[];
  features: FeatureData[];
};

export default function OnJobSupportClient({ demo, courses, features }: Props) {
  return (
    <section className="px-6 md:px-12 py-20 bg-[#EAF0F8]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        <div>
          {demo.badge && (
            <span className="text-xs bg-[#DCE6F8] px-3 py-1 rounded">{demo.badge}</span>
          )}
          <h2 className="text-4xl font-extrabold mt-4">
            {demo.title_main} <br />
            <span className="text-blue-500">{demo.title_highlight}</span>
          </h2>
          <p className="mt-4 text-[#5B6B88]">{demo.description}</p>

          <div className="mt-6 space-y-4">
            {features.map((f: FeatureData, i: number) => (
              <div key={i}>
                {f.text ? (
                  <p className="font-semibold">✔ {f.text}</p>
                ) : (
                  <>
                    <p className="font-semibold">✔ {f.title || "Feature"}</p>
                    {f.desc && <p className="text-sm text-gray-500">{f.desc}</p>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <DemoForm demo={demo} courses={courses} />
      </div>
    </section>
  );
}
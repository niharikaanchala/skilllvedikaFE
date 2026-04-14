"use client";

import { useEffect, useState } from "react";

export default function DemoForm({ demo, courses }: any) {
  const courseList = Array.isArray(courses) ? courses : [];
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    agreed_to_terms: false,
    years_of_experience: "",
    skills: "",
    message: "",
  });
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  useEffect(() => {
    if (courseList.length > 0) {
      setSelectedCourse(courseList[0].id);
    }
  }, [courseList]);

  const selectedCourseObj = courseList.find(
    (c: any) => c.id === selectedCourse
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("form : ",JSON.stringify({
      first_name: form.name.trim().split(/\s+/).slice(0, 1).join(""),
      last_name: form.name.trim().split(/\s+/).slice(1).join(" "),
      full_name: form.name.trim(),
      years_of_experience: "",
      skills: "",
      agreed_to_terms: form.agreed_to_terms,
      message: selectedCourseObj?.title.trim()
        ? `Interested course: ${selectedCourseObj?.title.trim()}`
        : "",
      email: form.email,
      phone: form.phone,
      course: selectedCourseObj?.id ?? null,
    }));
    

const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/on-job-support/demo-request/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: form.name.trim().split(/\s+/).slice(0, 1).join(""),
        last_name: form.name.trim().split(/\s+/).slice(1).join(" "),
        full_name: form.name.trim(),
        years_of_experience: "",
        skills: "",
        agreed_to_terms: form.agreed_to_terms,
        message: selectedCourseObj?.title.trim()
          ? `Interested course: ${selectedCourseObj?.title.trim()}`
          : "",
        email: form.email,
        phone: form.phone,
        course: selectedCourseObj?.id ?? null,
      })
    });

    if (res.ok) {
      alert("✅ Submitted successfully!");
      setForm({ name: "", email: "", phone: "", agreed_to_terms: false, years_of_experience: "", skills: "", message: "" });
    } else {
      alert("❌ Submission failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg border space-y-5"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#2563EB]">
          {demo.form_title || "Book Your Free Demo"}
        </h3>
        <p className="text-sm text-gray-500">
          {demo.form_subtitle || "Our team will contact you shortly."}
        </p>
      </div>

      <input
        type="text"
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border px-4 py-2 rounded-md"
        required
      />

      <input
        type="email"
        placeholder="Email Address"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border px-4 py-2 rounded-md"
        required
      />

      <div className="flex">
        <span className="px-3 bg-gray-100 border flex items-center">
          🇮🇳 +91
        </span>
        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border px-4 py-2"
          required
        />
      </div>

      <select
  value={selectedCourse ?? ""}
  onChange={(e) => setSelectedCourse(Number(e.target.value))}
  className="w-full border px-4 py-2 rounded-md"
  required
>
  <option value="">Choose course</option>
  {courseList.map((course: any) => (
    <option key={course.id} value={course.id}>
      {course.title}
      {course.category_name ? ` (${course.category_name})` : ""}
    </option>
  ))}
</select>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="agreed_to_terms"
          checked={form.agreed_to_terms}
          onChange={(e) => setForm({ ...form, agreed_to_terms: e.target.checked })}
        />
         <span>
                  I agree to the{" "}
                  <a href="/terms" className="text-[#0066FF] underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-[#0066FF] underline">
                    Privacy Policy
                  </a>
                  *
                </span>
      </label>

      <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md">
        Submit Your Details
      </button>
    </form>
  );
}
"use client";

import { useEffect, useState } from "react";
import FormLegalLinks from "@/app/components/legal/FormLegalLinks";
import { apiUrl } from "@/app/lib/api";
import {
  OTHER_COURSE_VALUE,
  SearchableCourseSelect,
} from "@/app/components/CourseLeadForm";

export default function DemoForm({ demo, courses }: any) {
  const courseList = Array.isArray(courses) ? courses : [];
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    agreed_to_terms: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [otherCourse, setOtherCourse] = useState("");

  useEffect(() => {
    if (courseList.length > 0 && !selectedCourse) {
      setSelectedCourse(String(courseList[0].id));
    }
  }, [courseList, selectedCourse]);

  const selectedCourseObj = courseList.find(
    (c: any) => String(c.id) === selectedCourse,
  );
  const courseLabel =
    selectedCourse === OTHER_COURSE_VALUE
      ? otherCourse.trim() || "Other"
      : selectedCourseObj?.title?.trim() || "";

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (selectedCourse === OTHER_COURSE_VALUE && !otherCourse.trim()) {
      alert("Please specify the course");
      return;
    }

    const res = await fetch(apiUrl("/api/on-job-support/demo-request/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: form.name.trim(),
        email: form.email,
        phone: form.phone,
        course: courseLabel,
        agree_terms: form.agreed_to_terms,
      }),
    });

    if (res.ok) {
      alert("✅ Submitted successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        agreed_to_terms: false,
      });
      setSelectedCourse(courseList.length > 0 ? String(courseList[0].id) : "");
      setOtherCourse("");
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

      <SearchableCourseSelect
        value={selectedCourse}
        onChange={(v) => {
          setSelectedCourse(v);
          if (v !== OTHER_COURSE_VALUE) setOtherCourse("");
        }}
        className="w-full border px-4 py-2 rounded-md bg-white"
        required
        placeholder="Choose course"
        options={courseList.map((course: any) => ({
          value: String(course.id),
          label: course.category_name
            ? `${course.title} (${course.category_name})`
            : course.title,
        }))}
      />

      {selectedCourse === OTHER_COURSE_VALUE ? (
        <input
          type="text"
          placeholder="Please specify the course *"
          value={otherCourse}
          onChange={(e) => setOtherCourse(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
          required
        />
      ) : null}

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="agreed_to_terms"
          checked={form.agreed_to_terms}
          onChange={(e) => setForm({ ...form, agreed_to_terms: e.target.checked })}
        />
        <span>
          <FormLegalLinks />
        </span>
      </label>

      <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md">
        Submit Your Details
      </button>
    </form>
  );
}

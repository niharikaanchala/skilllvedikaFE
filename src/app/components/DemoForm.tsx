"use client";

import { useState } from "react";

export default function DemoForm({ demo, courses }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: ""
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/on-job-support/demo-request/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("✅ Submitted successfully!");
      setForm({ name: "", email: "", phone: "", course: "" });
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
        value={form.course}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
        className="w-full border px-4 py-2 rounded-md"
        required
      >
        <option value="">Choose course</option>
        {courses.map((course: any) => (
          <option key={course.id} value={course.name || course.title}>
            {course.name || course.title}
          </option>
        ))}
      </select>

      <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md">
        Submit Your Details
      </button>
    </form>
  );
}
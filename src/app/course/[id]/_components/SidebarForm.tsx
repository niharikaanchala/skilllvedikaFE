    "use client"

    import { useState } from "react"

    const SidebarForm =({course}: {course: any})=>{
        const [formData, setFormData] = useState({
            name: "",
            email: "",
            phone: "",
            course: course.title,
            agreed_to_terms: false,
            years_of_experience: "",
          skills: "",
          message: "",
        })
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.checked })
        }
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            // console.log(formData)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/counselling/submit/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
                },
                body: JSON.stringify({
                    first_name: formData.name.trim().split(/\s+/).slice(0, 1).join(""),
                    last_name: formData.name.trim().split(/\s+/).slice(1).join(" "),
                    full_name: formData.name.trim(),
                    years_of_experience: "",
                    skills: "",
                    agreed_to_terms: formData.agreed_to_terms,
                    message: formData.course.trim()
                      ? `Interested course: ${formData.course.trim()}`
                      : "",
                    email: formData .email,
                    phone: formData.phone,
                    course: course.id ?? null,
                  }),
            })
            if (res.ok) {
                alert("✅ Submitted successfully!");
            } else {
                alert("❌ Submission failed");
            }
        }
        return(
            
            <>


    <div className="bg-white text-slate-900 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/25 ring-1 ring-sky-100">
                <h3 className="text-lg font-bold text-[#0a2540]">
                Get Course Details
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                Book a free counselling call — we&apos;ll get back to you shortly.
                </p>

                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent transition"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="course"
                    value={course.title}
                    readOnly
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-sky-50/80 text-slate-700"
                />
                 <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  name="agreed_to_terms"
                  checked={formData.agreed_to_terms}
                  onChange={onChange}
                  className="mt-1"
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

                <button
                
                    className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition hover:brightness-105"
                    style={{
                    background: `linear-gradient(90deg, #00aeef 0%, #0090c9 100%)`,
                    }}
                >
                    Get Free Counselling
                </button>
                </form>

                <p className="text-xs text-slate-500 mt-4 text-center leading-relaxed">
                No spam. We respect your privacy.
                </p>
            </div>
            
            </>
        )
    }
    export default SidebarForm

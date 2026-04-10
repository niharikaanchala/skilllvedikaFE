"use client";

import Link from "next/link";
import { useSiteBranding } from "@/app/components/layout/SiteBrandingProvider";

export default function Footer() {
  const branding = useSiteBranding();

  const brandLabel = branding?.brand_name?.trim() || "SkillVedika";
  const logo = branding?.logo || null;

  return (
    <footer className="bg-[#0f2d56] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-8 md:px-10">

        {/* Top */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-white/15 pb-6 md:flex-row md:items-center">
          <p className="text-sm font-medium text-slate-100 md:text-base">
            Get in touch with us.
          </p>

          <form className="flex w-full max-w-md items-center rounded-full bg-white/95 p-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-full bg-transparent px-4 py-2 text-sm text-slate-700 outline-none"
              aria-label="Enter your email"
            />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2f5fa8] text-white"
              aria-label="Submit"
            >
              →
            </button>
          </form>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              {logo && (
                <img
                  src={logo}
                  alt={brandLabel}
                  className="h-12 w-auto max-w-[140px] object-contain object-left"
                />
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              High-quality training institute helping learners succeed.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
              Explore
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/courses" className="hover:text-white transition">
                  All courses
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>

              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
              Support
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/on-job-support" className="hover:text-white transition">
                  Job support
                </Link>
              </li>

              <li>
                <Link href="/instructor" className="hover:text-white transition">
                  Instructor
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/corporate-training" className="hover:text-white transition">
                  Corporate Training
                </Link>
              </li>
              <li>
                <Link href="/career-services" className="hover:text-white transition">
                  Career Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
              Contact
            </h3>

            <p className="mt-3 text-sm text-slate-300">
              <Link href="mailto:support@skillvedika.com" className="hover:text-white transition">
                support@skillvedika.com
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-400 md:text-sm">
          © {new Date().getFullYear()} {brandLabel} - All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
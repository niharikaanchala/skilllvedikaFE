"use client";

import Link from "next/link";
import { useSiteBranding } from "@/app/components/layout/SiteBrandingProvider";

type SocialIconProps = { size?: number };

function FacebookIcon({ size = 16 }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.25.2 2.25.2v2.46H15.2c-1.25 0-1.64.78-1.64 1.57V12h2.8l-.45 2.89h-2.35v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44ZM8.5 9.75H5.38V19h3.12V9.75Zm5 0h-3v9.25h3v-4.86c0-2.7 3.5-2.92 3.5 0V19H20v-5.84c0-4.54-5.2-4.37-6.5-2.14V9.75Z" />
    </svg>
  );
}

function YouTubeIcon({ size = 16 }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M23 12s0-3.2-.4-4.74a2.9 2.9 0 0 0-2.03-2.03C19.03 4.83 12 4.83 12 4.83s-7.03 0-8.57.4A2.9 2.9 0 0 0 1.4 7.26C1 8.8 1 12 1 12s0 3.2.4 4.74a2.9 2.9 0 0 0 2.03 2.03c1.54.4 8.57.4 8.57.4s7.03 0 8.57-.4a2.9 2.9 0 0 0 2.03-2.03C23 15.2 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

function normalizeExternalUrl(url?: string | null): string | null {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function Footer() {
  const branding = useSiteBranding();

  const brandLabel = branding?.brand_name?.trim() || "SkillVedika";
  const logo = branding?.logo || null;
  const socialItems = [
    {
      key: "facebook",
      label: "Facebook",
      href: normalizeExternalUrl(branding?.facebook_url),
      icon: FacebookIcon,
    },
    {
      key: "instagram",
      label: "Instagram",
      href: normalizeExternalUrl(branding?.instagram_url),
      icon: InstagramIcon,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: normalizeExternalUrl(branding?.linkedin_url),
      icon: LinkedInIcon,
    },
    {
      key: "youtube",
      label: "YouTube",
      href: normalizeExternalUrl(branding?.youtube_url),
      icon: YouTubeIcon,
    },
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  return (
    <footer className="bg-[#0f2d56] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-8 md:px-10">

        {/* Top */}
        {/* <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-white/15 pb-6 md:flex-row md:items-center">
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
        </div> */}

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-5">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              {logo && (
                <img
                  src={`${API_URL}${logo}`}
                  alt={brandLabel}
                  loading="lazy"
                  decoding="async"
                  width={140}
                  height={48}
                  className="h-12 w-auto max-w-[140px] object-contain object-left"
                />
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              High-quality training institute helping learners succeed.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {socialItems.map((item) => {
                const Icon = item.icon;
                if (item.href) {
                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-slate-200 transition hover:border-white hover:text-white"
                    >
                      <Icon size={16} />
                    </a>
                  );
                }
                return (
                  <span
                    key={item.key}
                    aria-label={`${item.label} link not set`}
                    title={`${item.label} link not set`}
                    className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-white/10 text-slate-500"
                  >
                    <Icon size={16} />
                  </span>
                );
              })}
            </div>
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
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
              Legal
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/disclaimer" className="hover:text-white transition">
                  Disclaimer
                </Link>
              </li>
            </ul>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/editorial-policy" className="hover:text-white transition">
                  Editorial Policy
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
          © 2026 skillvedika.com. All Rights Reserved. Skillvedika is owned and operated by TutorKhoj Private Limited.
        </p>
      </div>
    </footer>
  );
}
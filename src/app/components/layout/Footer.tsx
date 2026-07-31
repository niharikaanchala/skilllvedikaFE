"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSiteBranding } from "@/app/components/layout/SiteBrandingProvider";
import type { FooterLinkApi, SiteFooterApi } from "@/app/lib/api";
import { apiUrl } from "@/app/lib/api";

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

function resolveMediaUrl(path?: string | null): string | null {
  const value = (path ?? "").trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  if (value.startsWith("/")) return `${API_URL}${value}`;
  return `${API_URL}/${value}`;
}

const DEFAULT_EXPLORE: FooterLinkApi[] = [
  { label: "All courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const DEFAULT_SUPPORT: FooterLinkApi[] = [
  { label: "Job support", href: "/on-job-support" },
  { label: "Instructor", href: "/instructor" },
  { label: "Contact", href: "/contact" },
  { label: "Corporate Training", href: "/corporate-training" },
  { label: "Career Services", href: "/career-services" },
];

const DEFAULT_LEGAL: FooterLinkApi[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Editorial Policy", href: "/editorial-policy" },
];

function LinkList({ links }: { links: FooterLinkApi[] }) {
  return (
    <ul className="mt-3 space-y-2 text-sm text-slate-300">
      {links.map((item) => {
        const href = item.href.trim();
        const external = /^https?:\/\//i.test(href);
        if (external) {
          return (
            <li key={`${item.label}-${href}`}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                {item.label}
              </a>
            </li>
          );
        }
        return (
          <li key={`${item.label}-${href}`}>
            <Link href={href || "/"} className="transition hover:text-white">
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Footer({ initialFooter = null }: { initialFooter?: SiteFooterApi | null }) {
  const branding = useSiteBranding();
  const [footer, setFooter] = useState<SiteFooterApi | null>(initialFooter);

  useEffect(() => {
    setFooter(initialFooter ?? null);
  }, [initialFooter]);

  useEffect(() => {
    if (footer && Object.keys(footer).length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/home/footer/"));
        if (!res.ok) return;
        const data = (await res.json()) as SiteFooterApi;
        if (!cancelled && data && Object.keys(data).length > 0) {
          setFooter(data);
        }
      } catch {
        // Keep defaults.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [footer]);

  const brandLabel = branding?.brand_name?.trim() || "SkillVedika";
  const logoSrc =
    resolveMediaUrl(footer?.logo) || resolveMediaUrl(branding?.logo) || null;

  const tagline =
    footer?.tagline?.trim() ||
    "High-quality training institute helping learners succeed.";
  const contactEmail = footer?.contact_email?.trim() || "support@skillvedika.com";
  const copyrightText =
    footer?.copyright_text?.trim() ||
    "© 2026 skillvedika.com. All Rights Reserved. Skillvedika is owned and operated by TutorKhoj Private Limited.";

  const exploreLinks =
    footer?.explore_links && footer.explore_links.length > 0
      ? footer.explore_links
      : DEFAULT_EXPLORE;
  const supportLinks =
    footer?.support_links && footer.support_links.length > 0
      ? footer.support_links
      : DEFAULT_SUPPORT;
  const legalLinks =
    footer?.legal_links && footer.legal_links.length > 0 ? footer.legal_links : DEFAULT_LEGAL;

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

  return (
    <footer className="bg-[#0f2d56] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-8 md:px-10">
        <div className="grid gap-6 md:grid-cols-5">
          <div>
            <div className="flex items-center gap-2">
              {logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoSrc}
                  alt={brandLabel}
                  loading="lazy"
                  decoding="async"
                  width={140}
                  height={48}
                  className="h-12 w-auto max-w-[140px] object-contain object-left"
                />
              ) : (
                <span className="text-lg font-semibold text-white">{brandLabel}</span>
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">{tagline}</p>
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

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
              {footer?.explore_heading?.trim() || "Explore"}
            </h3>
            <LinkList links={exploreLinks} />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
              {footer?.support_heading?.trim() || "Support"}
            </h3>
            <LinkList links={supportLinks} />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
              {footer?.legal_heading?.trim() || "Legal"}
            </h3>
            <LinkList links={legalLinks} />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-100">
              {footer?.contact_heading?.trim() || "Contact"}
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              <Link href={`mailto:${contactEmail}`} className="transition hover:text-white">
                {contactEmail}
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-400 md:text-sm">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}

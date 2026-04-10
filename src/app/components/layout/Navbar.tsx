"use client";

import Link from "next/link";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import { useSiteBranding } from "@/app/components/layout/SiteBrandingProvider";

export default function Navbar() {
  const { logo } = useSiteBranding();

  const API_URL = "http://127.0.0.1:8000";

  const menu = [
    "Home",
    "Courses",
    "Career Services",
    "Instructor",
    "On Job Support",
    "Blog",
    "Corporate Training",
    "About",
    "Contact",
  ];

  const getHref = (item: string) => {
    if (item === "Home") return "/";
    return `/${item.toLowerCase().replace(/\s+/g, "-")}`;
  };

  // DEBUG (optional but VERY useful)
  console.log("Branding logo from API:", logo);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            <img
              src={
                logo.startsWith("http")
                  ? `${logo}?v=${Date.now()}`
                  : `${API_URL}${logo}?v=${Date.now()}`
              }
              alt="Logo"
              className="h-12 w-auto"
              onError={(e) => {
                console.error("Logo failed to load:", logo);
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-lg font-semibold text-slate-800">
              SkillVedika
            </span>
          )}
        </Link>

        {/* MENU */}
        <ul className="hidden items-center gap-6 text-[13px] font-medium text-slate-700 lg:flex">
          {menu.map((item, i) => (
            <li key={i}>
              <Link
                href={getHref(item)}
                className="transition hover:text-[#2f5fa8]"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* BUTTON */}
        <div className="flex gap-4">
          <CounsellingModal
            buttonText="Book Demo"
            className="rounded-md border border-[#2f5fa8] px-4 py-1.5 text-sm font-medium text-[#2f5fa8] transition hover:bg-[#2f5fa8] hover:text-white"
          />
        </div>

      </div>
    </nav>
  );
}
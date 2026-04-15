// "use client";

// import Link from "next/link";
// import CounsellingModal from "@/app/course/[id]/CounsellingModal";
// import { useSiteBranding } from "@/app/components/layout/SiteBrandingProvider";

// export default function Navbar() {
//   const { logo } = useSiteBranding();

//   const API_URL = "http://127.0.0.1:8000";

//   const menu = [
//     "Home",
//     "Courses",
//     "Career Services",
//     "Instructor",
//     "On Job Support",
//     "Blog",
//     "Corporate Training",
//     "About",
//     "Contact",
//   ];

//   const getHref = (item: string) => {
//     if (item === "Home") return "/";
//     return `/${item.toLowerCase().replace(/\s+/g, "-")}`;
//   };

//   // DEBUG (optional but VERY useful)
//   console.log("Branding logo from API:", logo);

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-8">
//       <div className="mx-auto flex w-full max-w-7xl items-center justify-between">

//         {/* LOGO */}
//         <Link href="/" className="flex items-center gap-2">
//           {logo ? (
//             <img
//               src={
//                 logo.startsWith("http")
//                   ? `${logo}?v=${Date.now()}`
//                   : `${API_URL}${logo}?v=${Date.now()}`
//               }
//               alt="Logo"
//               className="h-12 w-auto"
//               onError={(e) => {
//                 console.error("Logo failed to load:", logo);
//                 (e.currentTarget as HTMLImageElement).style.display = "none";
//               }}
//             />
//           ) : (
//             <span className="text-lg font-semibold text-slate-800">
//               SkillVedika
//             </span>
//           )}
//         </Link>

//         {/* MENU */}
//         <ul className="hidden items-center gap-6 text-[13px] font-medium text-slate-700 lg:flex">
//           {menu.map((item, i) => (
//             <li key={i}>
//               <Link
//                 href={getHref(item)}
//                 className="transition hover:text-[#2f5fa8]"
//               >
//                 {item}
//               </Link>
//             </li>
//           ))}
//         </ul>

//         {/* BUTTON */}
//         <div className="flex gap-4">
//           <CounsellingModal
//             buttonText="Book Demo"
//             className="rounded-md border border-[#2f5fa8] px-4 py-1.5 text-sm font-medium text-[#2f5fa8] transition hover:bg-[#2f5fa8] hover:text-white"
//           />
//         </div>

//       </div>
//     </nav>
//   );
// }


// "use client";

// import Link from "next/link";
// import CounsellingModal from "@/app/course/[id]/CounsellingModal";
// import { useSiteBranding } from "@/app/components/layout/SiteBrandingProvider";

// export default function Navbar() {
//   const { logo } = useSiteBranding();

//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

//   const menu = [
//     "Home",
//     "Courses",
//     "Career Services",
//     "Instructor",
//     "On Job Support",
//     "Blog",
//     "Corporate Training",
//     "About",
//     "Contact",
//   ];

//   const getHref = (item: string) => {
//     if (item === "Home") return "/";
//     return `/${item.toLowerCase().replace(/\s+/g, "-")}`;
//   };

//   // DEBUG (optional but VERY useful)
//   console.log("Branding logo from API:", logo);

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-8">
//       <div className="mx-auto flex w-full max-w-7xl items-center justify-between">

//         {/* LOGO */}
//         <Link href="/" className="flex items-center gap-2">
//           {logo ? (
//             <img
//               src={
//                 logo.startsWith("http")
//                   ? `${logo}?v=${Date.now()}`
//                   : `${API_URL}${logo}?v=${Date.now()}`
//               }
//               alt="Logo"
//               className="h-12 w-auto"
//               onError={(e) => {
//                 console.error("Logo failed to load:", logo);
//                 (e.currentTarget as HTMLImageElement).style.display = "none";
//               }}
//             />
//           ) : (
//             <span className="text-lg font-semibold text-slate-800">
//               SkillVedika
//             </span>
//           )}
//         </Link>

//         {/* MENU */}
//         <ul className="hidden items-center gap-6 text-[13px] font-medium text-slate-700 lg:flex">
//           {menu.map((item, i) => (
//             <li key={i}>
//               <Link
//                 href={getHref(item)}
//                 className="transition hover:text-[#2f5fa8]"
//               >
//                 {item}
//               </Link>
//             </li>
//           ))}
//         </ul>

//         {/* BUTTON */}
//         <div className="flex gap-4">
//           <CounsellingModal
//             buttonText="Book Demo"
//             className="rounded-md border border-[#2f5fa8] px-4 py-1.5 text-sm font-medium text-[#2f5fa8] transition hover:bg-[#2f5fa8] hover:text-white"
//           />
//         </div>

//       </div>
//     </nav>
//   );
// }


"use client";

import Link from "next/link";
import { useState } from "react";
import CounsellingModal from "@/app/course/[id]/CounsellingModal";
import { useSiteBranding } from "@/app/components/layout/SiteBrandingProvider";

export default function Navbar() {
  const { logo } = useSiteBranding();
  const [menuOpen, setMenuOpen] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

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

  const logoSrc = logo
    ? logo.startsWith("http")
      ? logo
      : `${API_URL}${logo}`
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Logo"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={160}
              height={48}
              className="h-12 w-auto"
            />
          ) : (
            <span className="text-lg font-semibold text-slate-800">
              SkillVedika
            </span>
          )}
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-slate-700">
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

        {/* BUTTON (desktop) */}
        <div className="hidden lg:flex gap-4">
          <CounsellingModal
            buttonText="Book Demo"
            className="rounded-md border border-[#2f5fa8] px-4 py-1.5 text-sm font-medium text-[#2f5fa8] transition hover:bg-[#2f5fa8] hover:text-white"
          />
        </div>

        {/* HAMBURGER (mobile + tablet) */}
        <button
          className="lg:hidden flex flex-col gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="h-0.5 w-6 bg-slate-800"></span>
          <span className="h-0.5 w-6 bg-slate-800"></span>
          <span className="h-0.5 w-6 bg-slate-800"></span>
        </button>
      </div>

      {/* MOBILE / TABLET MENU */}
      {menuOpen && (
        <div className="lg:hidden mt-3 border-t border-slate-200 bg-white px-4 py-4 shadow-sm">
          <ul className="flex flex-col gap-4 text-sm font-medium text-slate-700">
            {menu.map((item, i) => (
              <li key={i}>
                <Link
                  href={getHref(item)}
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-[#2f5fa8]"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* mobile CTA */}
          <div className="mt-4">
            <CounsellingModal
              buttonText="Book Demo"
              className="w-full rounded-md border border-[#2f5fa8] px-4 py-2 text-sm font-medium text-[#2f5fa8] transition hover:bg-[#2f5fa8] hover:text-white"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";

// export type SiteBranding = {
//   brand_name?: string;
//   logo?: string | null;
// };

// type SiteBrandingContextType = SiteBranding & {
//   refreshBranding: () => Promise<void>;
// };

// const API_URL = "http://127.0.0.1:8000";

// const SiteBrandingContext = createContext<SiteBrandingContextType>({
//   brand_name: undefined,
//   logo: null,
//   refreshBranding: async () => {},
// });

// export function SiteBrandingProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [branding, setBranding] = useState<SiteBranding>({});

//   const fetchBranding = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/home/branding/`, {
//         cache: "no-store",
//       });

//       if (!res.ok) {
//         console.error("Branding API failed:", res.status);
//         return;
//       }

//       const data = await res.json();

//       console.log("RAW branding API response:", data);

//       setBranding({
//         brand_name:
//           typeof data.brand_name === "string"
//             ? data.brand_name
//             : undefined,
//         logo:
//           typeof data.logo === "string"
//             ? data.logo
//             : null,
//       });
//     } catch (err) {
//       console.error("Branding fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchBranding();
//   }, []);

//   const refreshBranding = async () => {
//     await fetchBranding();
//   };

//   return (
//     <SiteBrandingContext.Provider
//       value={{
//         ...branding,
//         refreshBranding,
//       }}
//     >
//       {children}
//     </SiteBrandingContext.Provider>
//   );
// }

// export function useSiteBranding() {
//   return useContext(SiteBrandingContext);
// }



"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { apiUrl } from "../../lib/api";

export type SiteBranding = {
  brand_name?: string;
  logo?: string | null;
};

type SiteBrandingContextType = SiteBranding & {
  refreshBranding: () => Promise<void>;
};

let brandingCache: SiteBranding | null = null;

const SiteBrandingContext = createContext<SiteBrandingContextType>({
  brand_name: undefined,
  logo: null,
  refreshBranding: async () => { },
});

export function SiteBrandingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [branding, setBranding] = useState<SiteBranding>({});

  const fetchBranding = async () => {
    try {
      const res = await fetch(apiUrl(`/api/home/branding/`), {
        cache: "force-cache",
      });

      if (!res.ok) {
        console.error("Branding API failed:", res.status);
        return;
      }

      const data = await res.json();
      const normalizedBranding = {
        brand_name:
          typeof data.brand_name === "string"
            ? data.brand_name
            : undefined,
        logo:
          typeof data.logo === "string"
            ? data.logo
            : null,
      };
      brandingCache = normalizedBranding;
      setBranding(normalizedBranding);
    } catch (err) {
      console.error("Branding fetch error:", err);
    }
  };

  useEffect(() => {
    if (brandingCache) {
      setBranding(brandingCache);
      return;
    }
    const run = () => {
      void fetchBranding();
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = globalThis.setTimeout(run, 500);
    return () => globalThis.clearTimeout(timer);
  }, []);

  const refreshBranding = async () => {
    await fetchBranding();
  };

  return (
    <SiteBrandingContext.Provider
      value={{
        ...branding,
        refreshBranding,
      }}
    >
      {children}
    </SiteBrandingContext.Provider>
  );
}

export function useSiteBranding() {
  return useContext(SiteBrandingContext);
}
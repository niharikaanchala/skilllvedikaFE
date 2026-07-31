import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import TopBar, { parseTopBarFromSettings } from "./components/layout/TopBar";
import FloatingContactButtons from "./components/layout/FloatingContactButtons";
import { SiteBrandingProvider } from "./components/layout/SiteBrandingProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { fetchCourses, fetchSiteBranding, fetchSiteFooter, fetchSiteSettings } from "./lib/api";
import { buildOrganizationSchema, buildWebsiteSchema } from "./components/schemas/site-schema";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skillvedika.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon-logo.ico",
  },
};

function googleTagId(value: unknown, pattern: RegExp): string {
  const id = String(value ?? "").trim().toUpperCase();
  return pattern.test(id) ? id : "";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, branding, navCourses, footer] = await Promise.all([
    fetchSiteSettings(),
    fetchSiteBranding(),
    fetchCourses(),
    fetchSiteFooter(),
  ]);
  const gaId = googleTagId(
    settings
      .map((s) => String(s.google_analytics_id ?? "").trim())
      .find((id) => id.length > 0),
    /^(?:G-[A-Z0-9]+|GT-[A-Z0-9]+|UA-\d+-\d+)$/,
  );
  const googleAdsTagId = googleTagId(
    settings
      .map((s) => String(s.google_ads_tag_id ?? "").trim())
      .find((id) => id.length > 0),
    /^(?:AW-\d+|GT-[A-Z0-9]+)$/,
  );
  const googleTagLoaderId = gaId || googleAdsTagId;
  const whatsappNumber =
    settings
      .map((s) => String(s.whatsapp_number ?? "").trim().replace(/\D/g, ""))
      .find((n) => n.length > 0) ??
    String(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").trim().replace(/\D/g, "");
  const whatsappMessage =
    (settings
      .map((s) => String(s.whatsapp_message ?? "").trim())
      .find((m) => m.length > 0) ??
      String(process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "").trim()) ||
    "Hi I am interested in Skillvedika courses";
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : "";
  const topBar = parseTopBarFromSettings(
    settings as unknown as Array<Record<string, unknown>>,
  );
  const hasTopBar = Boolean(topBar);
  const organizationSchema = buildOrganizationSchema();
  const websiteSchema = buildWebsiteSchema();

  return (
    <html lang="en" className={`${poppins.variable} ${poppins.className}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--sv-nav-offset:${hasTopBar ? "6.75rem" : "4.5rem"};}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/<\/script/gi, "<\\/script"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/<\/script/gi, "<\\/script"),
          }}
        />
        {googleTagLoaderId ? (
          <>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagLoaderId)}`}
            />
            <Script
              id="google-tag"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  ${gaId ? `gtag('config', ${JSON.stringify(gaId)});` : ""}
                  ${googleAdsTagId ? `gtag('config', ${JSON.stringify(googleAdsTagId)});` : ""}
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        <SiteBrandingProvider initialBranding={branding ?? undefined}>
          {topBar ? (
            <div className="fixed left-0 right-0 top-0 z-[60]">
              <TopBar data={topBar} />
            </div>
          ) : null}
          <Navbar
            hasTopBar={hasTopBar}
            courses={Array.isArray(navCourses) ? navCourses : []}
          />
          {children}
          <Footer initialFooter={footer} />
          <FloatingContactButtons whatsappHref={whatsappHref} />
        </SiteBrandingProvider>
      </body>
    </html>
  );
}

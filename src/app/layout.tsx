import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { SiteBrandingProvider } from "./components/layout/SiteBrandingProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { fetchSiteBranding, fetchSiteSettings } from "./lib/api";
import { buildOrganizationSchema, buildWebsiteSchema } from "./components/schemas/site-schema";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skillvedika.com"),
  icons: {
    icon: "/favicon-logo.ico",
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, branding] = await Promise.all([
    fetchSiteSettings(),
    fetchSiteBranding(),
  ]);
  // console.log("settings: ", settings)
  const gaId =
    settings
      .map((s) => String(s.google_analytics_id ?? "").trim())
      .find((id) => id.length > 0) ?? "";
  const hasGaId = Boolean(gaId);
  const organizationSchema = buildOrganizationSchema();
  const websiteSchema = buildWebsiteSchema();

  return (
    <html lang="en" className={`${poppins.variable} ${poppins.className}`}>
      <head>
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
        {hasGaId ? (
          <>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
            />
            <Script
              id="google-analytics"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        <SiteBrandingProvider initialBranding={branding ?? undefined}>
          <Navbar />
          {children}
          <Footer />
          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 z-50"
          >
            <img
              src="/whatsapp_icon.png"
              alt="WhatsApp"
              className="w-14 h-14 shadow-lg rounded-xl animate-bounce"
            />
          </a>
        </SiteBrandingProvider>
      </body>
    </html>
  );
}
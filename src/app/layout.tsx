import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { SiteBrandingProvider } from "./components/layout/SiteBrandingProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { fetchSiteSettings } from "./lib/api";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
  const settings = await fetchSiteSettings();
  const gaId =
    settings
      .map((s) => String(s.google_analytics_id ?? "").trim())
      .find((id) => id.length > 0) ?? "";
  const hasGaId = Boolean(gaId);

  return (
    <html lang="en" className={`${poppins.variable} ${poppins.className}`}>
      <head>
        {hasGaId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
            />
            <script
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
        <SiteBrandingProvider>
          <Navbar />
          {children}
          <Footer />
        </SiteBrandingProvider>
      </body>
    </html>
  );
}
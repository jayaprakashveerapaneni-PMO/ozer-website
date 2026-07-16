import type { Metadata } from "next";
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
import RisingParticles from "@/components/layout/RisingParticles";
import { SITE } from "@/lib/site";
import "./globals.css";

// Weights audited against actual usage: the display font is only ever used
// at semibold/bold (headings default to bold via the UA stylesheet).
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Elegant display serif for the hero headline only (reference aesthetic).
const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s | Ozer",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "home services Hyderabad",
    "book maid online Hyderabad",
    "house cleaning",
    "home cook",
    "laundry service",
    "elder care",
    "verified maid",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ozer — Daily Help, Delivered",
    description:
      "Police-verified cleaners, cooks, laundry and caregivers in Hyderabad — booked in about two minutes with upfront pricing and secure payment.",
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ozer — Daily Help, Delivered",
    description:
      "Verified home services in Hyderabad. Upfront pricing, secure payment, money-back promise.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${inter.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <RisingParticles />
        {children}
      </body>
    </html>
  );
}

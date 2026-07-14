import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
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
    "voice booking",
    "Alexa home services",
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
      "The voice-first home services platform. Speak Telugu, Hindi, Tamil or English — verified help arrives. Works with Alexa, Siri & Google Assistant.",
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ozer — Daily Help, Delivered",
    description:
      "Voice-first verified home services in Hyderabad. Works with Alexa, Siri & Google Assistant. Pay after service.",
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
      className={`${grotesk.variable} ${inter.variable} h-full antialiased`}
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

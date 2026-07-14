import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import RisingParticles from "@/components/RisingParticles";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ozer — Daily Help, Delivered | Voice-first Home Services",
  description:
    "Book police-verified house cleaners, home cooks, laundry and child & elder care in Hyderabad — by voice, in Telugu, Hindi, Tamil or English. Works with Alexa, Siri & Google Assistant. Pay after service.",
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
  openGraph: {
    title: "Ozer — Daily Help, Delivered",
    description:
      "The voice-first home services platform. Speak Telugu, Hindi, Tamil or English — verified help arrives. Works with Alexa, Siri & Google Assistant.",
    type: "website",
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
        <RisingParticles />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HelperApp from "@/features/helper/HelperApp";

export const metadata: Metadata = {
  title: "Helper app — Ozer",
  description:
    "The Ozer helper portal: job offers near you, OTP arrival verification, daily payouts. Free verification, your hours, your area.",
};

export default function HelperPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <HelperApp />
      </main>
      <Footer />
    </>
  );
}

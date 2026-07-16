import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingWizard from "@/features/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book a service",
  description:
    "Book verified house cleaning, home cook, laundry or care in Hyderabad. Transparent pricing, secure payment.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl px-4 py-20 text-center text-foreground/50">
              Loading booking…
            </div>
          }
        >
          <BookingWizard />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

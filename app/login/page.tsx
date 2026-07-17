import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SilkWave from "@/components/layout/SilkWave";
import RisingParticles from "@/components/layout/RisingParticles";
import LoginExperience from "@/features/auth/LoginExperience";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Ozer with Google or an emailed one-time code. Your bookings, receipts and live tracking — all in one account.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="relative isolate overflow-hidden">
          <RisingParticles />

          <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col justify-center px-4 pb-44 pt-14 sm:px-6">
            <div className="text-center">
              <span className="glass inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-primary">
                Your Ozer account
              </span>
              {/* LCP element — never opacity-animate it. */}
              <h1
                className="mt-5 text-balance text-4xl leading-tight text-foreground sm:text-5xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Help that knows <em className="italic text-primary">you.</em>
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-base text-muted">
                One account for your bookings, receipts and live tracking —
                separate and private to you.
              </p>
            </div>

            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="glass rounded-3xl p-8 text-center text-sm text-muted">
                    Loading…
                  </div>
                }
              >
                <LoginExperience />
              </Suspense>
            </div>
          </div>

          <SilkWave />
        </section>
      </main>
      <Footer />
    </>
  );
}

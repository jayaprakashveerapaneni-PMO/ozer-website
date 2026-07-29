import type { Metadata } from "next";
import Link from "next/link";
import { Mic, ShieldCheck, KeyRound, Smartphone, Speaker } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Voice booking with Alexa & Siri",
  description:
    "Start an Ozer booking from Amazon Alexa or Siri. Your assistant drafts it; you confirm and pay securely on Ozer.",
  alternates: { canonical: `${SITE.url}/assistants` },
};

const SIRI_BODY = `{"code": "YOUR-PAIRING-CODE", "service": "cleaning", "hours": 2, "zone": "Madhapur"}`;

export default function AssistantsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-14 sm:px-6">
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full glass px-4 py-1.5 text-xs font-semibold text-primary">
          <Mic className="h-3.5 w-3.5" aria-hidden /> Voice booking
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-serif)" }}>
          Book with your voice
        </h1>
        <p className="mt-4 text-muted">
          Alexa and Siri can <strong className="text-foreground/80">start</strong> an Ozer booking
          for you. To keep your money safe, voice never completes one — the draft appears on{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            your account
          </Link>{" "}
          where you review, pay, and only then is a helper booked.
        </p>

        <section className="glass mt-10 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <KeyRound className="h-5 w-5 text-primary" aria-hidden /> Step 1 — Get your pairing code
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Sign in on{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              your account page
            </Link>{" "}
            and press <em>Generate pairing code</em>{" "}
            under “Voice assistants”. This 6-digit code is
            how your speaker proves it&apos;s you. Treat it like a house key — anyone who has it can
            start drafts on your account (they still can&apos;t pay or book).
          </p>
        </section>

        <section className="glass mt-6 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Speaker className="h-5 w-5 text-primary" aria-hidden /> Amazon Alexa
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
            <li>
              Open the Ozer skill: <em>“Alexa, open Ozer”</em>. (Pilot phase — the skill is being
              rolled out; if Alexa doesn&apos;t find it yet, it hasn&apos;t reached your region.)
            </li>
            <li>
              Pair once: <em>“pair 5 1 2 3 4 5”</em> — speaking your code digit by digit.
            </li>
            <li>
              Book any time: <em>“Alexa, ask Ozer to book two hours of cleaning in Madhapur”</em>.
              Works for cleaning, cooking, laundry and care, in any of our zones.
            </li>
            <li>
              The draft appears on your account page instantly — confirm &amp; pay there.
            </li>
          </ol>
        </section>

        <section className="glass mt-6 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Smartphone className="h-5 w-5 text-primary" aria-hidden /> Siri (Apple Shortcut)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Two-minute setup in the Shortcuts app on iPhone:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
            <li>New Shortcut → add the action <em>Get contents of URL</em>.</li>
            <li>
              URL: <code className="rounded bg-surface px-1.5 py-0.5 text-xs">{SITE.url}/api/assistant/siri</code>{" "}
              · Method <em>POST</em> · Request body <em>JSON</em>:
              <pre className="mt-2 overflow-x-auto rounded-xl bg-surface p-3 text-xs">{SIRI_BODY}</pre>
            </li>
            <li>
              Add <em>Show Result</em> (or <em>Speak Text</em>) so Siri reads Ozer&apos;s reply.
            </li>
            <li>
              Name it <em>“Ozer cleaning”</em> — then just say <em>“Hey Siri, Ozer cleaning”</em>.
              Duplicate the shortcut with a different <code className="rounded bg-surface px-1 text-xs">service</code>{" "}
              for cooking, laundry or care.
            </li>
          </ol>
        </section>

        <section className="mt-6 rounded-3xl border border-line p-6">
          <h2 className="font-display text-xl font-bold">Google Assistant</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Google retired voice apps for websites in 2023, so an honest Google integration needs
            our Android app — it&apos;s on the roadmap. Until then: <em>“Hey Google, open ozer
            website dot vercel dot app”</em> gets you here.
          </p>
        </section>

        <p className="mt-8 flex items-center gap-2 rounded-2xl bg-surface p-4 text-sm text-muted">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          Voice never books alone: no payment, no OTP, and no personal details ever pass through
          your assistant. A draft just waits on your account — nothing happens until you confirm.
        </p>
      </main>
      <Footer />
    </>
  );
}

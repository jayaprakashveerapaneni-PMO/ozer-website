import Link from "next/link";
import { ZONES } from "@/lib/domain";
import Logo from "@/components/layout/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Daily help, delivered. Verified helpers, upfront prices,
              protected payments and a money-back promise on every job.
            </p>
            <p className="mt-4 text-xs text-muted">
              Launching next: Bengaluru · Chennai
            </p>
          </div>

          <nav aria-label="Services">
            <p className="text-sm font-semibold">Services</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/book?service=cleaning" className="transition-colors hover:text-primary">House Cleaning</Link></li>
              <li><Link href="/book?service=cook" className="transition-colors hover:text-primary">Home Cook</Link></li>
              <li><Link href="/book?service=laundry" className="transition-colors hover:text-primary">Laundry & Ironing</Link></li>
              <li><Link href="/book?service=care" className="transition-colors hover:text-primary">Child & Elder Care</Link></li>
            </ul>
          </nav>

          <nav aria-label="Explore">
            <p className="text-sm font-semibold">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/#highlights" className="transition-colors hover:text-primary">How booking works</Link></li>
              <li><Link href="/#pricing" className="transition-colors hover:text-primary">Instant price estimate</Link></li>
              <li><Link href="/#trust" className="transition-colors hover:text-primary">Trust & safety</Link></li>
              <li><Link href="/#faq" className="transition-colors hover:text-primary">FAQ</Link></li>
              <li><Link href="/helper" className="transition-colors hover:text-primary">Helper app</Link></li>
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold">Serving Hyderabad</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {ZONES.join(" · ")}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Ozer. All rights reserved.</p>
          <p>Prices shown are standard Hyderabad rates, confirmed before you pay.</p>
        </div>
      </div>
    </footer>
  );
}

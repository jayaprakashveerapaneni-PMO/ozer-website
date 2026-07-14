import Link from "next/link";
import { ZONES } from "@/lib/domain";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 font-display text-lg font-bold text-white glow-primary">
                O
              </span>
              <span className="font-display text-xl font-semibold">Ozer</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Daily help, delivered. The voice-first home services platform —
              verified helpers, pay after service, money-back promise.
            </p>
            <p className="mt-4 text-xs text-muted">
              Launching next: Bengaluru · Chennai
            </p>
          </div>

          <nav aria-label="Services">
            <h3 className="text-sm font-semibold">Services</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/book?service=cleaning" className="transition-colors hover:text-primary">House Cleaning</Link></li>
              <li><Link href="/book?service=cook" className="transition-colors hover:text-primary">Home Cook</Link></li>
              <li><Link href="/book?service=laundry" className="transition-colors hover:text-primary">Laundry & Ironing</Link></li>
              <li><Link href="/book?service=care" className="transition-colors hover:text-primary">Child & Elder Care</Link></li>
            </ul>
          </nav>

          <nav aria-label="Voice">
            <h3 className="text-sm font-semibold">Voice</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/#voice" className="transition-colors hover:text-primary">Live voice demo</Link></li>
              <li><Link href="/#assistants" className="transition-colors hover:text-primary">Alexa integration</Link></li>
              <li><Link href="/#assistants" className="transition-colors hover:text-primary">Siri Shortcuts</Link></li>
              <li><Link href="/#assistants" className="transition-colors hover:text-primary">Google Assistant</Link></li>
              <li><Link href="/flow" className="transition-colors hover:text-primary">The build story</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold">Serving Hyderabad</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {ZONES.join(" · ")}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Ozer. All rights reserved.</p>
          <p>Demo site built from the Ozer v1 requirements suite — pricing directional, pending launch.</p>
        </div>
      </div>
    </footer>
  );
}

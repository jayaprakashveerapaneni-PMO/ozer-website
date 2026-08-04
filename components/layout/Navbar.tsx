"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui";
import Logo from "@/components/layout/Logo";
import AccountChip from "@/components/layout/AccountChip";
import { NOCTURNE } from "@/lib/design";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How booking works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#personas", label: "Who it's for" },
  { href: "/helper", label: "Helper app" },
];

/** Pass `overDark` on pages that open on the hero's nocturne stage: the bar
 *  then rides that stage in ivory-on-dark until you scroll past it, and
 *  settles into the normal ivory bar over the page below. Legibility, not
 *  decoration — so it is NOT gated behind cinemaEnabled(); without JS the
 *  bar simply stays in its ivory state, which is legible over the stage too.
 *  The dark bar is 86% opaque so its contrast holds however a checker
 *  resolves the layer underneath it. */
export default function Navbar({ overDark = false }: { overDark?: boolean }) {
  const [open, setOpen] = useState(false);
  // Starts ON the stage when the page opens on one, so the dark bar is in the
  // server HTML: initialising to false renders an ivory bar that snaps dark
  // once the observer fires, which is a visible flash on every load.
  const [onStage, setOnStage] = useState(overDark);

  useEffect(() => {
    if (!overDark) return;
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;
    // All setState happens in the observer callback (async), never in the
    // effect body — house rule, avoids cascading synchronous re-renders.
    const io = new IntersectionObserver(
      ([e]) => setOnStage(e.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [overDark]);

  const dark = overDark && onStage;
  const shell = dark
    ? { background: "rgba(36,28,21,0.86)", borderColor: "rgba(251,191,110,0.20)" }
    : undefined;
  const linkColor = dark ? { color: NOCTURNE.textSoft } : undefined;

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500 ${
        dark ? "" : "border-line bg-background/70"
      }`}
      style={shell}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main"
      >
        <Link href="/" className="group flex items-center gap-2">
          <Logo />
          <span
            className={`ml-1 hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline ${
              dark ? "border" : "glass text-primary"
            }`}
            style={
              dark
                ? { color: NOCTURNE.gold, borderColor: "rgba(251,191,110,0.3)" }
                : undefined
            }
          >
            Hyderabad
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                dark ? "hover:!text-white" : "text-muted hover:text-primary"
              }`}
              style={linkColor}
            >
              {l.label}
            </Link>
          ))}
          <AccountChip />
          <Button href="/book" variant={dark ? "pillInvert" : "pill"} size="sm">
            Book now
          </Button>
        </div>

        <button
          type="button"
          className={`rounded-lg p-2 transition-colors md:hidden ${
            dark ? "" : "text-muted hover:text-foreground"
          }`}
          style={linkColor}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div
          className={`px-4 pb-4 backdrop-blur-xl md:hidden ${
            dark ? "border-t" : "border-t border-line bg-background/95"
          }`}
          style={dark ? { background: "rgba(36,28,21,0.96)", borderColor: "rgba(251,191,110,0.2)" } : undefined}
        >
          {[...links, { href: "/login", label: "Sign in / account" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block border-b py-3 text-sm font-medium ${
                dark ? "" : "border-line text-foreground/80"
              }`}
              style={dark ? { color: NOCTURNE.text, borderColor: "rgba(251,191,110,0.16)" } : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Button
            href="/book"
            variant={dark ? "pillInvert" : "primary"}
            fullWidth
            className="mt-3"
            onClick={() => setOpen(false)}
          >
            Book now
          </Button>
        </div>
      )}
    </header>
  );
}

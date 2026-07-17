"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui";
import Logo from "@/components/layout/Logo";
import AccountChip from "@/components/layout/AccountChip";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#highlights", label: "How booking works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#personas", label: "Who it's for" },
  { href: "/helper", label: "Helper app" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/70 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main"
      >
        <Link href="/" className="group flex items-center gap-2">
          <Logo />
          <span className="ml-1 hidden rounded-full glass px-2 py-0.5 text-xs font-medium text-primary sm:inline">
            Hyderabad
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <AccountChip />
          <Button href="/book" variant="pill" size="sm">
            Book now
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-muted transition-colors hover:text-foreground md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-background/95 px-4 pb-4 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block border-b border-line py-3 text-sm font-medium text-foreground/80"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="block border-b border-line py-3 text-sm font-medium text-foreground/80"
            onClick={() => setOpen(false)}
          >
            Sign in / account
          </Link>
          <Button href="/book" fullWidth className="mt-3" onClick={() => setOpen(false)}>
            Book now
          </Button>
        </div>
      )}
    </header>
  );
}

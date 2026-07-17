"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOutUser, customerNameFromUser } from "@/lib/services/auth-service";
import { useAuthUser } from "@/lib/services/use-auth";

/** Navbar account entry: a "Sign in" link when signed out, the customer's
 *  chip (linking to their account on /login) + sign-out when signed in. */
export default function AccountChip() {
  const user = useAuthUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
      >
        Sign in
      </Link>
    );
  }

  const name = customerNameFromUser(user);
  return (
    <span className="flex items-center gap-1.5">
      <Link
        href="/login"
        title="Your account"
        className="glass flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-semibold transition-transform duration-200 hover:scale-[1.04]"
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-display text-[11px] font-bold text-on-primary"
          aria-hidden
        >
          {name.charAt(0).toUpperCase()}
        </span>
        {name}
      </Link>
      <button
        type="button"
        onClick={() => void signOutUser()}
        aria-label="Sign out"
        title="Sign out"
        className="rounded-full p-2 text-muted transition-colors hover:text-destructive"
      >
        <LogOut className="h-4 w-4" aria-hidden />
      </button>
    </span>
  );
}

"use client";

import { LogOut } from "lucide-react";
import { signOutUser, customerNameFromUser } from "@/lib/services/auth-service";
import { useAuthUser } from "@/lib/services/use-auth";

/** Signed-in customer chip for the navbar; renders nothing when signed out
 *  (sign-in lives inside the booking flow, where it's actually needed). */
export default function AccountChip() {
  const user = useAuthUser();
  if (!user) return null;
  const name = customerNameFromUser(user);
  return (
    <span className="flex items-center gap-1.5">
      <span className="glass flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-semibold">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-display text-[11px] font-bold text-on-primary"
          aria-hidden
        >
          {name.charAt(0).toUpperCase()}
        </span>
        {name}
      </span>
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

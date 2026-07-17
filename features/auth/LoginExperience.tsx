"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { useAuthUser } from "@/lib/services/use-auth";
import { customerNameFromUser, signOutUser } from "@/lib/services/auth-service";
import LoginCard from "./LoginCard";
import MyBookings from "./MyBookings";
import { sanitizeNextPath } from "./next-path";

/** /login orchestrator: signed out → LoginCard; signed in → account panel
 *  with this customer's own bookings. A sanitized ?next= path redirects
 *  right after sign-in (used by flows that send people here mid-task). */
export default function LoginExperience() {
  const user = useAuthUser();
  const router = useRouter();
  const next = sanitizeNextPath(useSearchParams().get("next"));

  useEffect(() => {
    if (user && next) router.replace(next);
  }, [user, next, router]);

  if (user && next) {
    return <p className="text-center text-sm font-medium text-muted">Signed in — taking you back…</p>;
  }

  if (!user) return <LoginCard nextPath={next ?? "/login"} />;

  const name = customerNameFromUser(user);
  return (
    <div className="glass animate-fade-up rounded-3xl p-6 shadow-xl sm:p-8">
      <div className="flex items-center gap-4">
        <span
          className="glow-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-on-primary"
          aria-hidden
        >
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-display text-xl font-bold">Welcome, {name}</h2>
          <p className="truncate text-sm text-muted">{user.email}</p>
        </div>
        <Badge variant="glass" className="ml-auto hidden sm:inline-flex">
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Signed in
        </Badge>
      </div>

      <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-muted">
        Your bookings
      </h3>
      <MyBookings user={user} />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button href="/book" className="flex-1">
          Book a service
        </Button>
        <button
          type="button"
          onClick={() => void signOutUser()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-muted transition-colors hover:text-destructive"
        >
          <LogOut className="h-4 w-4" aria-hidden /> Sign out
        </button>
      </div>
    </div>
  );
}

"use client";

import { Zap } from "lucide-react";
import { ZONES } from "@/lib/domain";

/** Interstitial shown while an instant (one-tap) booking is being placed. */
export default function InstantScreen({ serviceName }: { serviceName: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <div className="relative mx-auto h-24 w-24">
        <span className="sonar-ring" aria-hidden />
        <span className="sonar-ring delay" aria-hidden />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 animate-breathe">
          <Zap className="h-9 w-9 text-white" aria-hidden />
        </span>
      </div>
      <h1 className="mt-6 text-2xl font-bold">
        Instant booking <span className="gradient-text">{serviceName}</span>
      </h1>
      <p className="mt-2 text-muted">
        ASAP slot · {ZONES[0]}, Hyderabad · offering to verified helpers…
      </p>
    </div>
  );
}

"use client";

import { ShieldCheck, Star, MapPin, BellRing, GraduationCap } from "lucide-react";
import { eligibleHelpers, type Helper, type ServiceId } from "@/lib/domain";

export default function HelperStep({
  service,
  helper,
  onSelect,
}: {
  service: ServiceId;
  helper: Helper | null;
  onSelect: (h: Helper) => void;
}) {
  const available = eligibleHelpers(service);

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold">Choose your verified helper</h1>
      <p className="mt-1 text-sm text-muted">
        Only background-verified helpers are ever shown.{" "}
        {service === "care" && "Care bookings additionally require certification."}
      </p>
      {available.length === 0 ? (
        <div className="glass mt-8 rounded-3xl border-dashed p-8 text-center">
          <p className="font-semibold">No verified helpers free for this slot</p>
          <p className="mt-1 text-sm text-muted">
            Try the next slot, or tap notify-me and we&apos;ll alert you the moment one
            frees up.
          </p>
          <button
            type="button"
            className="mt-4 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary-soft"
          >
            <BellRing className="mr-1.5 inline h-4 w-4" aria-hidden /> Notify me
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {available.map((h) => {
            const selected = helper?.id === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => onSelect(h)}
                aria-pressed={selected}
                className={`tilt-card rounded-3xl border p-5 text-left transition-all duration-200 ${
                  selected
                    ? "border-primary bg-primary/10 glow-ring"
                    : "border-line glass hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                    style={{ background: `hsl(${h.hue} 70% 45%)` }}
                    aria-hidden
                  >
                    {h.initials}
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      {h.name}
                      <ShieldCheck className="h-4 w-4 text-success" aria-label="Police verified" />
                      {h.certified && (
                        <GraduationCap className="h-4 w-4 text-accent" aria-label="Care certified" />
                      )}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-sm text-muted">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3.5 w-3.5 fill-primary-soft text-primary-soft" aria-hidden />{" "}
                        {h.rating}
                      </span>
                      · {h.jobs} jobs
                    </span>
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="flex items-center gap-1 rounded-full bg-surface px-2 py-0.5">
                    <MapPin className="h-3 w-3" aria-hidden /> {h.distanceBand}
                  </span>
                  <span className="rounded-full bg-surface px-2 py-0.5">
                    {h.languages.join(", ")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

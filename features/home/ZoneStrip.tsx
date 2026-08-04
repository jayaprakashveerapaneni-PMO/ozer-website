import { ZONES } from "@/lib/domain";

// The first thing the ivory page says after the nocturne dawns: where this
// actually works. It lives here rather than in the hero because the hero's
// lower half is the pool and the dawn ramp — type over that ramp would lose
// its contrast as the background lifts.

export default function ZoneStrip() {
  return (
    <div className="relative z-10 -mt-4 px-4 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Serving households across
      </p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
        {ZONES.slice(0, 6).map((z) => (
          <li key={z} className="font-display text-sm font-semibold text-foreground/70">
            {z}
          </li>
        ))}
      </ul>
    </div>
  );
}

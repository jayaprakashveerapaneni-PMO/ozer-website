"use client";

import { SERVICES, type ServiceId } from "@/lib/domain";
import { SERVICE_ICONS } from "../booking.constants";

export default function ServiceStep({
  service,
  onSelect,
}: {
  service: ServiceId;
  onSelect: (s: ServiceId) => void;
}) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold">What do you need help with?</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const Icon = SERVICE_ICONS[s.id];
          const selected = service === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-pressed={selected}
              className={`tilt-card rounded-3xl border p-5 text-left transition-all duration-200 ${
                selected
                  ? "border-primary bg-primary/10 glow-ring"
                  : "border-line glass hover:border-primary/40"
              }`}
            >
              <Icon className={`h-7 w-7 ${selected ? "text-primary-soft" : "text-muted"}`} aria-hidden />
              <p className="mt-2 font-semibold">{s.name}</p>
              <p className="mt-0.5 text-sm text-muted">{s.pricing}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

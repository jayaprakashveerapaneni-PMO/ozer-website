"use client";

import { Zap, CalendarDays } from "lucide-react";
import { SLOT_PRESETS, type SlotOption } from "../booking.constants";

export default function SlotStep({
  slot,
  onSelect,
  customDate,
  onCustomDate,
}: {
  slot: SlotOption | null;
  onSelect: (s: SlotOption) => void;
  customDate: string;
  onCustomDate: (d: string) => void;
}) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold">When should we come?</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {SLOT_PRESETS.map((s) => {
          const selected = slot?.id === s.id;
          const Icon = s.asap ? Zap : CalendarDays;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              aria-pressed={selected}
              className={`tilt-card flex items-center gap-3 rounded-3xl border p-4 text-left transition-all duration-200 ${
                selected
                  ? "border-primary bg-primary/10 glow-ring"
                  : "border-line glass hover:border-primary/40"
              }`}
            >
              <Icon className={`h-6 w-6 ${selected ? "text-primary" : "text-muted"}`} aria-hidden />
              <span>
                <span className="block font-semibold">{s.label}</span>
                <span className="block text-sm text-muted">{s.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
      {slot?.id === "custom" && (
        <div className="mt-4">
          <label htmlFor="bw-date" className="mb-1 block text-sm font-medium">
            Choose date & time
          </label>
          <input
            id="bw-date"
            type="datetime-local"
            value={customDate}
            onChange={(e) => onCustomDate(e.target.value)}
            className="rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-foreground [color-scheme:light]"
          />
          <p className="mt-1 text-xs text-muted">Bookable up to 14 days ahead.</p>
        </div>
      )}
    </div>
  );
}

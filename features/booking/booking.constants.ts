import { Sparkles, CookingPot, Shirt, HeartHandshake } from "lucide-react";
import type { ServiceId } from "@/lib/domain";

export const SERVICE_ICONS: Record<
  ServiceId,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  cleaning: Sparkles,
  cook: CookingPot,
  laundry: Shirt,
  care: HeartHandshake,
};

export const WIZARD_STEPS = ["Service", "Details", "Slot", "Helper", "Confirm"] as const;

export interface SlotOption {
  id: string;
  label: string;
  sub: string;
  asap?: boolean;
}

/** FR-7: ASAP plus scheduled slots (custom picker allows ≤ 14 days ahead). */
export const SLOT_PRESETS: SlotOption[] = [
  { id: "asap", label: "ASAP", sub: "Earliest available helper", asap: true },
  { id: "today-pm", label: "Today, 4–6 PM", sub: "Evening slot" },
  { id: "tom-am", label: "Tomorrow, 8–10 AM", sub: "Morning slot" },
  { id: "tom-pm", label: "Tomorrow, 4–6 PM", sub: "Evening slot" },
  { id: "custom", label: "Pick a date", sub: "Up to 14 days ahead" },
];

export const CONFETTI = [
  { l: "6%", c: "#f97316", d: 0 }, { l: "14%", c: "#22d3ee", d: 0.2 },
  { l: "24%", c: "#a78bfa", d: 0.05 }, { l: "33%", c: "#34d399", d: 0.35 },
  { l: "42%", c: "#fb923c", d: 0.15 }, { l: "51%", c: "#f472b6", d: 0.4 },
  { l: "60%", c: "#22d3ee", d: 0.1 }, { l: "69%", c: "#f97316", d: 0.3 },
  { l: "78%", c: "#34d399", d: 0.2 }, { l: "86%", c: "#a78bfa", d: 0.45 },
  { l: "93%", c: "#fb923c", d: 0.08 }, { l: "48%", c: "#f97316", d: 0.55 },
  { l: "20%", c: "#f472b6", d: 0.6 }, { l: "72%", c: "#fb923c", d: 0.5 },
];

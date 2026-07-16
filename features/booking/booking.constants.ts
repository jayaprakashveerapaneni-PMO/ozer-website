import { Sparkles, CookingPot, Shirt, HeartHandshake } from "lucide-react";
import type { ServiceId } from "@/lib/domain";
import { CONFETTI_COLORS } from "@/lib/design";

export const SERVICE_ICONS: Record<
  ServiceId,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  cleaning: Sparkles,
  cook: CookingPot,
  laundry: Shirt,
  care: HeartHandshake,
};

export const WIZARD_STEPS = ["Service", "Details", "Slot", "Helper", "Review & pay"] as const;

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

// 14 confetti pieces: fixed positions/delays, colors cycled from the token set.
const CONFETTI_POS = [
  { l: "6%", d: 0 }, { l: "14%", d: 0.2 }, { l: "24%", d: 0.05 }, { l: "33%", d: 0.35 },
  { l: "42%", d: 0.15 }, { l: "51%", d: 0.4 }, { l: "60%", d: 0.1 }, { l: "69%", d: 0.3 },
  { l: "78%", d: 0.2 }, { l: "86%", d: 0.45 }, { l: "93%", d: 0.08 }, { l: "48%", d: 0.55 },
  { l: "20%", d: 0.6 }, { l: "72%", d: 0.5 },
];

export const CONFETTI = CONFETTI_POS.map((p, i) => ({
  ...p,
  c: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

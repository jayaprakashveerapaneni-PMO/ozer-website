// Ozer v1 — service catalog, rate card and mocked data.
// Rates mirror the published concept-site rate card (FR-5 parity).
// Only the 4 in-scope v1 services are listed (Safe Ride / Grocery Runner cut).

export type ServiceId = "cleaning" | "cook" | "laundry" | "care";

export interface Service {
  id: ServiceId;
  name: string;
  tagline: string;
  pricing: string;
  minNote: string;
  bullets: string[];
}

export const SERVICES: Service[] = [
  {
    id: "cleaning",
    name: "House Cleaning",
    tagline: "Daily maid, vessel wash or full deep-clean",
    pricing: "₹80–₹120/hr · Deep clean ₹400 flat",
    minNote: "Minimum 1 hour booking",
    bullets: [
      "Mopping, dusting, bathroom & vessel checklist",
      "Regular, vessel-only or full-house hourly types",
      "Deep-clean flat package for move-ins & festivals",
    ],
  },
  {
    id: "cook",
    name: "Home Cook",
    tagline: "Daily meals, party dishes or tiffin plans",
    pricing: "₹50–₹80/person · ₹80–₹250/dish",
    minNote: "South, North or mixed cuisine",
    bullets: [
      "Per-person or per-dish pricing modes",
      "Daily menu notes for your cook",
      "Tiffin subscription with pause & skip",
    ],
  },
  {
    id: "laundry",
    name: "Laundry & Ironing",
    tagline: "Pickup, wash, fold & return in 24–48h",
    pricing: "₹60/kg wash · ₹8/piece ironing",
    minNote: "Doorstep pickup & delivery",
    bullets: [
      "Item & weight confirmed with you at pickup",
      "Tracked: picked up → processing → delivered",
      "Delicates & stain-treatment flags",
    ],
  },
  {
    id: "care",
    name: "Child & Elder Care",
    tagline: "Certified, background-verified caregivers",
    pricing: "₹100–₹150/hr · ₹600/day",
    minNote: "Service window 6 AM – 10 PM",
    bullets: [
      "First-aid trained & certification-verified carers",
      "Timestamped check-ins with photo updates",
      "Care-recipient profile shared only after assignment",
    ],
  },
];

// ---- Estimator logic (FR-6): clamped inputs, estimate visible pre-login ----

export interface EstimateInput {
  service: ServiceId;
  // cleaning
  hours?: number;
  cleaningType?: "regular" | "vessel" | "deep";
  // cook
  cookMode?: "person" | "dish";
  people?: number;
  dishes?: number;
  // laundry
  laundryMode?: "kg" | "piece";
  kg?: number;
  pieces?: number;
  // care
  careMode?: "hourly" | "day";
  careHours?: number;
  days?: number;
}

export interface Estimate {
  low: number;
  high: number;
  label: string;
  note?: string;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(Math.round(v) || lo, lo), hi);

export function estimate(input: EstimateInput): Estimate {
  switch (input.service) {
    case "cleaning": {
      if (input.cleaningType === "deep") {
        return { low: 400, high: 400, label: "Deep clean — flat package" };
      }
      const hours = clamp(input.hours ?? 1, 1, 8);
      const note =
        (input.hours ?? 1) > 8
          ? "For jobs above 8 hours we suggest the deep-clean package."
          : undefined;
      return {
        low: 80 * hours,
        high: 120 * hours,
        label: `${hours} hr ${input.cleaningType === "vessel" ? "vessel wash" : "regular cleaning"}`,
        note,
      };
    }
    case "cook": {
      if (input.cookMode === "dish") {
        const dishes = clamp(input.dishes ?? 1, 1, 20);
        return {
          low: 80 * dishes,
          high: 250 * dishes,
          label: `${dishes} dish${dishes > 1 ? "es" : ""}`,
        };
      }
      const people = clamp(input.people ?? 2, 1, 20);
      return {
        low: 50 * people,
        high: 80 * people,
        label: `Meal for ${people}`,
      };
    }
    case "laundry": {
      if (input.laundryMode === "piece") {
        const pieces = clamp(input.pieces ?? 10, 1, 200);
        return {
          low: 8 * pieces,
          high: 8 * pieces,
          label: `Ironing — ${pieces} pieces`,
        };
      }
      const kg = clamp(input.kg ?? 4, 1, 50);
      return { low: 60 * kg, high: 60 * kg, label: `Wash & fold — ${kg} kg` };
    }
    case "care": {
      if (input.careMode === "day") {
        const days = clamp(input.days ?? 1, 1, 14);
        return {
          low: 600 * days,
          high: 600 * days,
          label: `Full day care × ${days}`,
          note: "Care window 6 AM – 10 PM",
        };
      }
      const hours = clamp(input.careHours ?? 4, 1, 12);
      return {
        low: 100 * hours,
        high: 150 * hours,
        label: `${hours} hr certified care`,
        note: "Care window 6 AM – 10 PM",
      };
    }
  }
}

// ---- Mocked verified helpers (FR-8: only VERIFIED surfaced) ----

export interface Helper {
  id: string;
  name: string;
  services: ServiceId[];
  rating: number;
  jobs: number;
  distanceBand: string;
  languages: string[];
  certified?: boolean; // care certification (FR-37)
  initials: string;
  hue: number;
}

export const HELPERS: Helper[] = [
  { id: "h1", name: "Meena K.", services: ["cleaning", "laundry"], rating: 4.9, jobs: 412, distanceBand: "< 2 km", languages: ["Telugu", "Hindi"], initials: "MK", hue: 24 },
  { id: "h2", name: "Lakshmi D.", services: ["cleaning", "cook"], rating: 4.8, jobs: 356, distanceBand: "2–4 km", languages: ["Telugu", "English"], initials: "LD", hue: 152 },
  { id: "h3", name: "Fatima S.", services: ["cook"], rating: 5.0, jobs: 208, distanceBand: "< 2 km", languages: ["Hindi", "English"], initials: "FS", hue: 210 },
  { id: "h4", name: "Radha P.", services: ["care", "cleaning"], rating: 4.9, jobs: 287, distanceBand: "2–4 km", languages: ["Telugu", "Tamil"], certified: true, initials: "RP", hue: 280 },
  { id: "h5", name: "Sunitha V.", services: ["care"], rating: 4.8, jobs: 174, distanceBand: "< 2 km", languages: ["Telugu", "Hindi", "English"], certified: true, initials: "SV", hue: 330 },
  { id: "h6", name: "Anand R.", services: ["laundry"], rating: 4.7, jobs: 391, distanceBand: "4–6 km", languages: ["Tamil", "English"], initials: "AR", hue: 190 },
];

export const ZONES = [
  "Madhapur",
  "Gachibowli",
  "Kondapur",
  "Kukatpally",
  "Hitech City",
  "Jubilee Hills",
  "Banjara Hills",
  "Miyapur",
];

export const TESTIMONIALS = [
  {
    name: "Divya R.",
    area: "Madhapur",
    role: "IT professional, mother of two",
    quote:
      "My cook arrives on time every single day, and I paid only after the first meal was done. The verification badge is what convinced my husband.",
    service: "Home Cook",
  },
  {
    name: "Rahul T.",
    area: "Gachibowli",
    role: "Product designer",
    quote:
      "Post-party cleanup booked in about two minutes, no monthly commitment. Laundry picked up the same evening and back in a day.",
    service: "House Cleaning",
  },
  {
    name: "Anjali M.",
    area: "Kondapur",
    role: "Caring for her father-in-law",
    quote:
      "The carer's check-in photos while I'm at work are everything. She's first-aid certified and it shows on her profile — verified, not just claimed.",
    service: "Elder Care",
  },
];

export const FAQS = [
  {
    q: "How are helpers verified?",
    a: "Every helper completes government-ID KYC and a police verification before they can receive a single job. Verification is free for helpers and typically completes within 48 hours of document submission. Only verified helpers ever appear in your search results.",
  },
  {
    q: "When do I pay?",
    a: "After the job is done, to your satisfaction. Pay via UPI, card or netbanking once you confirm completion. If something isn't right, raise it within 48 hours — you choose a full refund or a replacement helper under our money-back promise.",
  },
  {
    q: "Can I book in Telugu, Hindi or Tamil?",
    a: "Yes. The Ozer app supports voice booking in Telugu, Hindi, Tamil and English — speak your request, review the read-back summary in your language, and confirm. Nothing is ever booked on voice alone; you always confirm before it's placed.",
  },
  {
    q: "How do I know who is arriving?",
    a: "You see your helper's photo, rating and verification badge at booking, track them live from 'en route', and confirm their identity with an OTP handshake at your door before the job starts.",
  },
  {
    q: "Which areas do you serve?",
    a: "We're launching across Hyderabad — Madhapur, Gachibowli, Kondapur, Kukatpally, Hitech City, Jubilee Hills, Banjara Hills and Miyapur first, with more zones opening monthly. Bengaluru and Chennai are next.",
  },
  {
    q: "What if my helper cancels?",
    a: "We automatically rematch you with the next best verified helper at the same price, with your promo preserved. If no replacement is found, you get an instant full refund plus a goodwill credit.",
  },
];

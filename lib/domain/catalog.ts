// Static catalog data: services, verified helpers (mock supply until the
// real helper onboarding pipeline exists), serviceable zones, and marketing
// content. Rates mirror the published concept-site rate card (FR-5 parity).

import type { Helper, Service } from "./types";

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

/** Helpers eligible for a service (FR-8 verified-only; FR-37 certified care). */
export function eligibleHelpers(service: Service["id"]): Helper[] {
  return HELPERS.filter(
    (h) => h.services.includes(service) && (service !== "care" || h.certified)
  );
}

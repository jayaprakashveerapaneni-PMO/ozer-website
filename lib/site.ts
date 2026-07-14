// Canonical site metadata — single source for URL, name, and routes so
// robots, sitemap, metadata, and structured data never drift apart.

export const SITE = {
  name: "Ozer",
  title: "Ozer — Daily Help, Delivered | Voice-first Home Services",
  description:
    "Book police-verified house cleaners, home cooks, laundry and child & elder care in Hyderabad — by voice, in Telugu, Hindi, Tamil or English. Works with Alexa, Siri & Google Assistant. Pay after service.",
  /** Production origin. Override with NEXT_PUBLIC_SITE_URL for previews. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ozer-website.vercel.app",
  locale: "en_IN",
  city: "Hyderabad",
} as const;

/** Public routes for the sitemap (ordered by priority). */
export const ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/book", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/helper", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/flow", priority: 0.5, changeFrequency: "monthly" as const },
];

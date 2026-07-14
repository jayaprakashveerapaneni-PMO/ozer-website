import type { MetadataRoute } from "next";
import { ROUTES, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static build — stamp a fixed date (Date.now() is unavailable at module eval
  // in some runtimes and would also churn the sitemap on every build).
  const lastModified = new Date("2026-07-14");
  return ROUTES.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

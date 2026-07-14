import { SITE } from "@/lib/site";
import { SERVICES, ZONES } from "@/lib/domain";

/**
 * JSON-LD structured data (schema.org) — helps search engines render rich
 * results for a local services business. Rendered once on the home page.
 */
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    areaServed: {
      "@type": "City",
      name: SITE.city,
      containsPlace: ZONES.map((z) => ({ "@type": "Place", name: z })),
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    availableLanguage: ["Telugu", "Hindi", "Tamil", "English"],
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.tagline,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is data, not user content; serialization is safe here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Social share card (1200×630), generated at build time — no static asset.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ozer — Daily Help, Delivered. Voice-first verified home services in Hyderabad.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(1000px circle at 85% 0%, #fff1e6 0%, transparent 55%), linear-gradient(160deg, #fffdf9 0%, #fdf3ff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #fb923c, #c2410c)",
              color: "#fff",
              fontSize: 44,
              fontWeight: 700,
              borderRadius: 18,
            }}
          >
            O
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#1e1b2e" }}>Ozer</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", gap: 18, fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            <span style={{ color: "#1e1b2e" }}>Daily help,</span>
            <span style={{ color: "#c2410c" }}>delivered.</span>
          </div>
          <div style={{ fontSize: 30, color: "#4b4860", maxWidth: 900, lineHeight: 1.35 }}>
            {`Voice-first, verified home services in ${SITE.city} — book by voice in Telugu, Hindi, Tamil or English. Works with Alexa, Siri & Google.`}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["Police-verified", "Pay after service", "Money-back promise"].map((t) => (
            <div
              key={t}
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: "#c2410c",
                background: "rgba(194,65,12,0.08)",
                border: "1px solid rgba(194,65,12,0.25)",
                borderRadius: 999,
                padding: "10px 24px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}

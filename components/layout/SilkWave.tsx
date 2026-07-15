// The silk wave — a broad, luminous ribbon of layered gradient wave-bands
// flowing behind the hero (Lumina-style AI hero aesthetic). Each band is a
// wide bezier fill that loops horizontally (marquee-style translateX of a
// 2×-width path) while the whole band slowly breathes vertically, so the
// layers shimmer over each other like silk catching light.
//
// Motion is transform-only; the soft edge comes from one blur per band
// (three composited layers total on desktop, two on mobile).

interface Band {
  /** Wave fill path spanning a 2880×360 tile (repeats seamlessly at x=1440). */
  d: string;
  gradient: "silk-ember" | "silk-aurora" | "silk-iris";
  top: string;
  height: number;
  opacity: number;
  blur: number;
  driftDuration: number;
  breatheDuration: number;
  breatheDelay: number;
  desktopOnly?: boolean;
}

// Each path starts and ends at the same y with matching slope so the
// 1440-unit tile tessellates: f(0) == f(1440) == f(2880).
// Bands are dense at the top and bottom; the central text zone is protected
// by the container mask below, so waves can crash without touching words.
const BANDS: Band[] = [
  {
    d: "M0,180 C240,100 480,260 720,180 S1200,100 1440,180 S1920,260 2160,180 S2640,100 2880,180 L2880,360 L0,360 Z",
    gradient: "silk-ember",
    top: "4%", height: 300, opacity: 0.5, blur: 24,
    driftDuration: 38, breatheDuration: 11, breatheDelay: 0,
  },
  {
    d: "M0,200 C320,280 560,120 880,200 S1200,300 1440,200 S1760,280 2000,120 S2560,300 2880,200 L2880,360 L0,360 Z",
    gradient: "silk-aurora",
    top: "16%", height: 320, opacity: 0.45, blur: 30,
    driftDuration: 52, breatheDuration: 14, breatheDelay: -5,
  },
  {
    d: "M0,160 C360,240 600,80 960,160 S1240,240 1440,160 S1800,240 2040,80 S2520,240 2880,160 L2880,360 L0,360 Z",
    gradient: "silk-iris",
    top: "30%", height: 300, opacity: 0.4, blur: 32,
    driftDuration: 64, breatheDuration: 17, breatheDelay: -9,
    desktopOnly: true,
  },
  {
    d: "M0,190 C260,270 520,110 780,190 S1180,290 1440,190 S1700,270 1960,110 S2620,290 2880,190 L2880,360 L0,360 Z",
    gradient: "silk-aurora",
    top: "48%", height: 320, opacity: 0.45, blur: 26,
    driftDuration: 44, breatheDuration: 12, breatheDelay: -3,
  },
  {
    d: "M0,170 C300,90 620,250 940,170 S1220,90 1440,170 S1740,250 2060,90 S2580,250 2880,170 L2880,360 L0,360 Z",
    gradient: "silk-ember",
    top: "60%", height: 340, opacity: 0.5, blur: 28,
    driftDuration: 56, breatheDuration: 15, breatheDelay: -7,
  },
  {
    d: "M0,210 C340,130 640,290 980,210 S1260,130 1440,210 S1780,290 2120,130 S2540,290 2880,210 L2880,360 L0,360 Z",
    gradient: "silk-iris",
    top: "74%", height: 300, opacity: 0.42, blur: 30,
    driftDuration: 48, breatheDuration: 13, breatheDelay: -10,
    desktopOnly: true,
  },
];

const STOPS: Record<Band["gradient"], [string, string, string, string]> = {
  "silk-ember": ["#fdba74", "#fb7185", "#f0abfc", "#fdba74"],
  "silk-aurora": ["#67e8f9", "#818cf8", "#c4b5fd", "#67e8f9"],
  "silk-iris": ["#c4b5fd", "#f0abfc", "#fda4af", "#c4b5fd"],
};

// Fades all bands to nothing over the central text column: waves stay
// full-bleed and dense at the edges, words always sit on clear ground.
const TEXT_SAFE_MASK =
  "radial-gradient(ellipse 46% 38% at 50% 40%, transparent 42%, rgba(0,0,0,0.55) 68%, black 88%)";

export default function SilkWave() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ maskImage: TEXT_SAFE_MASK, WebkitMaskImage: TEXT_SAFE_MASK }}
      aria-hidden
    >
      {BANDS.map((b, i) => (
        <div
          key={i}
          className={`silk-breathe absolute left-0 w-full ${b.desktopOnly ? "hidden md:block" : ""}`}
          style={{
            top: b.top,
            height: b.height,
            opacity: b.opacity,
            filter: `blur(${b.blur}px)`,
            animationDuration: `${b.breatheDuration}s`,
            animationDelay: `${b.breatheDelay}s`,
            willChange: "transform",
          }}
        >
          {/* 200%-wide tile translating -50% for a seamless horizontal loop */}
          <svg
            className="silk-drift absolute h-full"
            style={{ width: "200%", animationDuration: `${b.driftDuration}s` }}
            viewBox="0 0 2880 360"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id={`sw-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={STOPS[b.gradient][0]} />
                <stop offset="35%" stopColor={STOPS[b.gradient][1]} />
                <stop offset="70%" stopColor={STOPS[b.gradient][2]} />
                <stop offset="100%" stopColor={STOPS[b.gradient][3]} />
              </linearGradient>
            </defs>
            <path d={b.d} fill={`url(#sw-${i})`} />
          </svg>
        </div>
      ))}
    </div>
  );
}

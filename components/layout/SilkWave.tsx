// The silk-dune field (LuminaAI-reference): one cohesive wave landscape
// anchored to the bottom of the hero — layered ivory/lavender silk ridges
// swept by a hot amber-coral ridge, with a glowing core behind the crest.
// Text lives in the clear canvas above; no mask needed.
//
// Motion: each ridge tiles seamlessly (2×-width path translating -50%) and
// breathes vertically at its own rhythm. Transform-only; one blur per layer.

interface Ridge {
  /** Wave fill spanning a 2880×360 tile (tessellates at x=1440). */
  d: string;
  from: string;
  via: string;
  to: string;
  bottom: string;
  height: number;
  opacity: number;
  blur: number;
  driftDuration: number;
  breatheDuration: number;
  breatheDelay: number;
  desktopOnly?: boolean;
}

const RIDGES: Ridge[] = [
  // back silk — pale grey-lavender, tall and soft
  {
    d: "M0,150 C300,70 620,230 940,150 S1220,70 1440,150 S1740,230 2060,70 S2580,230 2880,150 L2880,360 L0,360 Z",
    from: "#d9d4d6", via: "#e9e2d8", to: "#cfc9cd",
    bottom: "14%", height: 300, opacity: 0.55, blur: 26,
    driftDuration: 58, breatheDuration: 16, breatheDelay: -6,
  },
  // mid silk — warm golden cream
  {
    d: "M0,180 C240,100 480,260 720,180 S1200,100 1440,180 S1920,260 2160,180 S2640,100 2880,180 L2880,360 L0,360 Z",
    from: "#f3d9a8", via: "#f7e7c6", to: "#eecf9d",
    bottom: "6%", height: 300, opacity: 0.7, blur: 20,
    driftDuration: 44, breatheDuration: 13, breatheDelay: -3,
  },
  // deep amber underlayer
  {
    d: "M0,190 C260,270 520,110 780,190 S1180,290 1440,190 S1700,270 1960,110 S2620,290 2880,190 L2880,360 L0,360 Z",
    from: "#f59e0b", via: "#fbbf77", to: "#f97316",
    bottom: "-4%", height: 280, opacity: 0.55, blur: 22,
    driftDuration: 50, breatheDuration: 14, breatheDelay: -9,
    desktopOnly: true,
  },
  // the hot ridge — coral/orange crest sweeping the front
  {
    d: "M0,200 C320,280 560,120 880,200 S1200,300 1440,200 S1760,280 2000,120 S2560,300 2880,200 L2880,360 L0,360 Z",
    from: "#ea580c", via: "#fb923c", to: "#fda4af",
    bottom: "-8%", height: 260, opacity: 0.75, blur: 16,
    driftDuration: 36, breatheDuration: 11, breatheDelay: 0,
  },
];

export default function SilkWave() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] overflow-hidden" aria-hidden>
      {/* glowing amber core behind the crest (reference: lit silk fold) */}
      <div
        className="silk-breathe absolute left-[18%] bottom-[8%] h-[240px] w-[46%] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 40% 60%, rgba(249,115,22,0.5) 0%, rgba(251,146,60,0.28) 45%, transparent 75%)",
          filter: "blur(34px)",
          animationDuration: "12s",
          willChange: "transform",
        }}
      />
      {RIDGES.map((rg, i) => (
        <div
          key={i}
          className={`silk-breathe absolute left-0 w-full ${rg.desktopOnly ? "hidden md:block" : ""}`}
          style={{
            bottom: rg.bottom,
            height: rg.height,
            opacity: rg.opacity,
            filter: `blur(${rg.blur}px)`,
            animationDuration: `${rg.breatheDuration}s`,
            animationDelay: `${rg.breatheDelay}s`,
            willChange: "transform",
          }}
        >
          <svg
            className="silk-drift absolute h-full"
            style={{ width: "200%", animationDuration: `${rg.driftDuration}s` }}
            viewBox="0 0 2880 360"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id={`dune-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={rg.from} />
                <stop offset="45%" stopColor={rg.via} />
                <stop offset="100%" stopColor={rg.to} />
              </linearGradient>
            </defs>
            <path d={rg.d} fill={`url(#dune-${i})`} />
          </svg>
        </div>
      ))}
    </div>
  );
}

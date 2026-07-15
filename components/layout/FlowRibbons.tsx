// Flowing light-strings — long bezier strands sweeping across the section
// with pulses of light traveling along them, gently swaying so the strands
// weave over each other. Pure SVG + CSS (stroke-dashoffset + transform):
// GPU-friendly, honored by prefers-reduced-motion, no JS per frame.

interface Strand {
  d: string;
  gradient: "aurora" | "ember" | "iris";
  width: number;
  baseOpacity: number;
  /** Traveling light pulse: comet length + gap (dasharray) and speed. */
  cometLen: number;
  flowDuration: number;
  flowDelay: number;
  /** Sway group: which drift class + timing. */
  sway: "sway-a" | "sway-b" | "sway-c";
  swayDuration: number;
  desktopOnly?: boolean;
}

// Paths span a 1440×640 stage; curves cross in the upper/right zones so the
// headline (left) stays clean.
const STRANDS: Strand[] = [
  {
    d: "M-60,120 C280,20 560,300 880,180 S1280,60 1520,200",
    gradient: "ember", width: 2.4, baseOpacity: 0.5,
    cometLen: 180, flowDuration: 9, flowDelay: 0, sway: "sway-a", swayDuration: 13,
  },
  {
    d: "M-60,320 C240,420 620,80 940,240 S1340,420 1520,300",
    gradient: "aurora", width: 2, baseOpacity: 0.45,
    cometLen: 220, flowDuration: 12, flowDelay: -4, sway: "sway-b", swayDuration: 17,
  },
  {
    d: "M-60,520 C360,560 680,360 1000,470 S1360,560 1520,440",
    gradient: "iris", width: 2.2, baseOpacity: 0.4,
    cometLen: 160, flowDuration: 10, flowDelay: -7, sway: "sway-c", swayDuration: 15,
  },
  {
    d: "M-60,40 C400,140 760,-20 1080,120 S1400,260 1520,80",
    gradient: "iris", width: 1.6, baseOpacity: 0.35,
    cometLen: 140, flowDuration: 14, flowDelay: -2, sway: "sway-b", swayDuration: 19,
    desktopOnly: true,
  },
  {
    d: "M-60,420 C300,240 700,600 1060,340 S1380,180 1520,360",
    gradient: "ember", width: 1.4, baseOpacity: 0.3,
    cometLen: 200, flowDuration: 11, flowDelay: -9, sway: "sway-a", swayDuration: 21,
    desktopOnly: true,
  },
];

const STOPS: Record<Strand["gradient"], [string, string, string]> = {
  ember: ["#fb923c", "#f43f5e", "#f0abfc"],
  aurora: ["#22d3ee", "#818cf8", "#c4b5fd"],
  iris: ["#a78bfa", "#f0abfc", "#fb923c"],
};

// One fixed dash period for every animated path: comet + gap always sum to
// this, so a single shared keyframe (stroke-dashoffset: -PERIOD) loops all
// strands seamlessly and halo/comet pairs stay in lockstep.
const DASH_PERIOD = 2200;

export default function FlowRibbons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 640"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {(Object.keys(STOPS) as Array<keyof typeof STOPS>).map((k) => (
            <linearGradient key={k} id={`fr-${k}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={STOPS[k][0]} />
              <stop offset="50%" stopColor={STOPS[k][1]} />
              <stop offset="100%" stopColor={STOPS[k][2]} />
            </linearGradient>
          ))}
        </defs>

        {STRANDS.map((s, i) => (
          <g
            key={i}
            className={`${s.sway} ${s.desktopOnly ? "hidden md:inline" : ""}`}
            style={{ animationDuration: `${s.swayDuration}s` }}
          >
            {/* base string */}
            <path d={s.d} stroke={`url(#fr-${s.gradient})`} strokeWidth={s.width} strokeLinecap="round" opacity={s.baseOpacity} />
            {/* wide soft halo under the comet */}
            <path
              d={s.d}
              className="ribbon-flow"
              stroke={`url(#fr-${s.gradient})`}
              strokeWidth={s.width * 4}
              strokeLinecap="round"
              opacity={0.18}
              strokeDasharray={`${s.cometLen} ${DASH_PERIOD - s.cometLen}`}
              style={{ animationDuration: `${s.flowDuration}s`, animationDelay: `${s.flowDelay}s` }}
            />
            {/* the traveling light itself */}
            <path
              d={s.d}
              className="ribbon-flow"
              stroke="#ffffff"
              strokeWidth={s.width * 1.1}
              strokeLinecap="round"
              opacity={0.9}
              strokeDasharray={`${s.cometLen * 0.55} ${DASH_PERIOD - s.cometLen * 0.55}`}
              style={{ animationDuration: `${s.flowDuration}s`, animationDelay: `${s.flowDelay}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

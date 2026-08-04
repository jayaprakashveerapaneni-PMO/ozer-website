import { NOCTURNE } from "@/lib/design";
import { WIDE, TALL, type StageArt } from "@/components/layout/heroStageArt";

// The nocturne stage in plain SVG + CSS. This is the hero everyone gets: it
// ships in the server HTML, so no-JS, reduced-motion, phones and automated
// agents see a finished composition rather than an empty dark box — the WebGL
// field (HeroField) only layers on top for desktop users who allow motion.
// Same shot either way: satin ribbons streaming out of a lit heart, a pool
// catching them below, and the dawn handing off to the ivory page.
//
// Two cuts (see heroStageArt): a slice-to-cover crop of the wide artwork
// would show a phone only the pinched middle, where there is no silk.

function Art({ art, id }: { art: StageArt; id: string }) {
  const { heart, ripple, horizon } = art;
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={art.viewBox}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        {/* across-the-ribbon satin ramp: dark lip → hot core → mid gold */}
        <linearGradient id={`${id}-satin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a4f1c" />
          <stop offset="34%" stopColor="#ffe9c2" />
          <stop offset="58%" stopColor="#d9a04c" />
          <stop offset="100%" stopColor="#6b4318" />
        </linearGradient>
        <linearGradient id={`${id}-filament`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d9a04c" stopOpacity="0" />
          <stop offset="32%" stopColor="#ffe9c2" />
          <stop offset="70%" stopColor="#fbbf6e" />
          <stop offset="100%" stopColor="#d9a04c" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id={`${id}-heart`}>
          <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.85" />
          <stop offset="30%" stopColor="#f5c66e" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#d9a04c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the light the whole composition streams out of */}
      <circle cx={heart.cx} cy={heart.cy} r={heart.r} fill={`url(#${id}-heart)`} />

      {/* --- sky --- */}
      {art.bands.map((b, i) => (
        <path key={`b${i}`} d={b.d} fill={`url(#${id}-satin)`} opacity={b.o} style={{ filter: `blur(${b.b}px)` }} />
      ))}
      {art.filaments.map((f, i) => (
        <path
          key={`f${i}`}
          d={f.d}
          stroke={`url(#${id}-filament)`}
          strokeWidth={f.w}
          strokeLinecap="round"
          opacity={f.o}
          style={{ filter: `blur(${f.b}px)` }}
        />
      ))}
      {art.dust.map(([cx, cy, r], i) => (
        <circle key={`d${i}`} cx={cx} cy={cy} r={r} fill="#ffe9c2" opacity={0.5} />
      ))}

      {/* --- pool: the sky again, mirrored and quieted --- */}
      <g
        transform={`translate(0,${horizon * 2}) scale(1,-1)`}
        opacity="0.3"
        style={{ filter: "blur(3px)" }}
      >
        <circle cx={heart.cx} cy={heart.cy} r={heart.r} fill={`url(#${id}-heart)`} />
        {art.bands.map((b, i) => (
          <path key={`rb${i}`} d={b.d} fill={`url(#${id}-satin)`} opacity={b.o * 0.8} />
        ))}
        {art.filaments.slice(0, 4).map((f, i) => (
          <path
            key={`rf${i}`}
            d={f.d}
            stroke={`url(#${id}-filament)`}
            strokeWidth={f.w}
            strokeLinecap="round"
            opacity={f.o * 0.7}
          />
        ))}
      </g>

      {/* rings spreading under the light — kept faint and slightly blurred so
          they read as water rather than as drawn ellipses */}
      <g stroke="#ffd9a0" fill="none" style={{ filter: "blur(1.4px)" }}>
        {ripple.rx.map((rx, i) => (
          <ellipse
            key={`r${i}`}
            cx={ripple.cx}
            cy={ripple.cy}
            rx={rx}
            ry={rx * ripple.ry}
            strokeWidth={i < 3 ? 1.5 : 1}
            opacity={0.22 - i * 0.03}
          />
        ))}
      </g>

      {/* the water's edge catching the light */}
      <rect
        x="0"
        y={horizon - 8}
        width="100%"
        height="16"
        fill="#ffe9c2"
        opacity="0.2"
        style={{ filter: "blur(7px)" }}
      />
    </svg>
  );
}

export default function HeroStage() {
  return (
    <div
      data-hero-stage
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        backgroundColor: NOCTURNE.bg,
        backgroundImage: `radial-gradient(58% 42% at 50% 46%, ${NOCTURNE.bgLift} 0%, transparent 72%)`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 md:hidden">
        <Art art={TALL} id="hst" />
      </div>
      <div className="absolute inset-0 hidden md:block">
        <Art art={WIDE} id="hsw" />
      </div>

      {/* the chamber falling into shadow above the light — composition only;
          text contrast is owned by the scrim around the copy in Hero.tsx */}
      <div
        className="absolute inset-x-0 top-0 h-[58%]"
        style={{
          background: `linear-gradient(180deg, ${NOCTURNE.bg}b3 0%, ${NOCTURNE.bg}59 46%, transparent 100%)`,
        }}
      />

      {/* dawn — the stage becomes the page */}
      <div
        className="absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${NOCTURNE.bg}b3 26%, var(--background) 92%)`,
        }}
      />
    </div>
  );
}

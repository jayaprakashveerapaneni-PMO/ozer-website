// SilkDivider — a slim flowing golden band that carries the hero's dune
// language through the page. Two seamless ridges (2×-width tiles translating
// -50%) drift at different speeds and breathe vertically; transform-only, so
// it can never cause layout shift. Fixed height keeps content-visibility
// sizing exact (see .silk-divider in globals.css).

const TILE = "M0,70 C240,20 520,110 760,70 S1180,20 1440,70 S1900,110 2160,40 S2640,110 2880,70 L2880,140 L0,140 Z";
const TILE_B = "M0,80 C300,110 600,30 900,80 S1240,120 1440,80 S1800,30 2100,90 S2600,40 2880,80 L2880,140 L0,140 Z";

export default function SilkDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`silk-divider pointer-events-none relative h-[120px] overflow-hidden ${flip ? "-scale-x-100" : ""}`}
      aria-hidden
    >
      {/* golden cream back ridge */}
      <div
        className="silk-breathe absolute inset-x-0 bottom-[-10px] h-[110px] opacity-80"
        style={{ filter: "blur(9px)", animationDuration: "15s", willChange: "transform" }}
      >
        <svg
          className="silk-drift absolute h-full"
          style={{ width: "200%", animationDuration: "52s" }}
          viewBox="0 0 2880 140"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="silk-div-a" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f3d9a8" />
              <stop offset="50%" stopColor="#f7e7c6" />
              <stop offset="100%" stopColor="#eecf9d" />
            </linearGradient>
          </defs>
          <path d={TILE} fill="url(#silk-div-a)" />
        </svg>
      </div>
      {/* amber crest — desktop only (compositing cost on throttled phones) */}
      <div
        className="silk-breathe absolute inset-x-0 bottom-[-26px] hidden h-[100px] opacity-60 md:block"
        style={{ filter: "blur(8px)", animationDuration: "12s", animationDelay: "-4s", willChange: "transform" }}
      >
        <svg
          className="silk-drift absolute h-full"
          style={{ width: "200%", animationDuration: "38s" }}
          viewBox="0 0 2880 140"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="silk-div-b" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <path d={TILE_B} fill="url(#silk-div-b)" />
        </svg>
      </div>
    </div>
  );
}

// Flowing crystal ambience — elongated translucent prisms that drift across
// each other on slow, crossing paths. Pure SVG + transform-only CSS animation
// (GPU-composited, no layout/paint per frame). Deterministic → SSR-safe.

interface Shard {
  /** viewBox-independent placement (percent of container). */
  left: string;
  top: string;
  width: number;
  rotate: number;
  gradient: "dawn" | "lagoon" | "orchid";
  drift: "crystal-a" | "crystal-b" | "crystal-c";
  duration: number;
  delay: number;
  opacity: number;
  /** Hide on small screens to keep mobile compositing lean. */
  desktopOnly?: boolean;
}

const SHARDS: Shard[] = [
  { left: "-4%", top: "6%", width: 520, rotate: -24, gradient: "dawn", drift: "crystal-a", duration: 34, delay: -6, opacity: 0.55 },
  { left: "58%", top: "-6%", width: 620, rotate: 18, gradient: "lagoon", drift: "crystal-b", duration: 42, delay: -18, opacity: 0.5 },
  { left: "30%", top: "44%", width: 460, rotate: -58, gradient: "orchid", drift: "crystal-c", duration: 38, delay: -11, opacity: 0.45, desktopOnly: true },
  { left: "74%", top: "52%", width: 380, rotate: 40, gradient: "dawn", drift: "crystal-a", duration: 46, delay: -27, opacity: 0.4, desktopOnly: true },
  { left: "8%", top: "62%", width: 300, rotate: 74, gradient: "lagoon", drift: "crystal-b", duration: 30, delay: -3, opacity: 0.4, desktopOnly: true },
];

const GRADIENT_STOPS: Record<Shard["gradient"], [string, string, string]> = {
  dawn: ["#fdba74", "#fda4af", "#f0abfc"],
  lagoon: ["#67e8f9", "#a5b4fc", "#f9fafb"],
  orchid: ["#c4b5fd", "#f0abfc", "#fdba74"],
};

/** One faceted prism: an elongated gem outline with inner facet lines. */
function Prism({ shard, uid }: { shard: Shard; uid: string }) {
  const [c1, c2, c3] = GRADIENT_STOPS[shard.gradient];
  const gid = `cg-${uid}`;
  return (
    <div
      className={`absolute ${shard.drift} ${shard.desktopOnly ? "hidden md:block" : ""}`}
      style={{
        left: shard.left,
        top: shard.top,
        width: shard.width,
        opacity: shard.opacity,
        animationDuration: `${shard.duration}s`,
        animationDelay: `${shard.delay}s`,
        rotate: `${shard.rotate}deg`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 200 64" fill="none" style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
            <stop offset="55%" stopColor={c2} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c3} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* gem body: elongated hexagonal prism */}
        <polygon
          points="14,32 46,6 168,14 194,32 160,58 34,52"
          fill={`url(#${gid})`}
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="1"
        />
        {/* facet lines — the crystal cut */}
        <path d="M46,6 L78,32 L34,52 M78,32 L160,58 M78,32 L168,14" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  );
}

/** Drop inside any `relative overflow-hidden` section. */
export default function CrystalField({ id = "hero" }: { id?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {SHARDS.map((s, i) => (
        <Prism key={i} shard={s} uid={`${id}-${i}`} />
      ))}
    </div>
  );
}

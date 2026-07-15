// The Ozer mark: a gem-cut "O" — hexagonal crystal with prismatic facets.
// Single source for navbar, footer and (mirrored by) app/icon.tsx.

export function OzerMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Ozer logo"
    >
      <defs>
        <linearGradient id="ozer-gem" x1="8" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="52%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="ozer-sheen" x1="10" y1="6" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gem body — hexagonal crystal */}
      <path
        d="M24 3.5 L41 13 L41 35 L24 44.5 L7 35 L7 13 Z"
        fill="url(#ozer-gem)"
      />
      {/* top-light sheen */}
      <path d="M24 3.5 L41 13 L24 20.5 L7 13 Z" fill="url(#ozer-sheen)" />
      {/* facet lines */}
      <path
        d="M24 3.5 L24 20.5 M7 13 L24 20.5 L41 13 M24 20.5 L24 44.5 M7 35 L24 20.5 M41 35 L24 20.5"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1"
      />
      {/* the "O" window cut into the gem */}
      <circle cx="24" cy="27.5" r="8.5" fill="none" stroke="#ffffff" strokeWidth="4.5" />
    </svg>
  );
}

export default function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6">
        <OzerMark />
      </span>
      {withWordmark && (
        <span className="font-display text-xl font-semibold tracking-tight">Ozer</span>
      )}
    </span>
  );
}

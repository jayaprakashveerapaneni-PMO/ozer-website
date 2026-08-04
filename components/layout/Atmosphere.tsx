// Atmosphere — the page's evolving light. Three fixed full-viewport washes
// sit behind everything; HomeCinema cross-fades them with scroll so the
// canvas moves through a day: ivory dawn (base, body::before) → warm amber
// noon over the services acts → a rose-violet dusk approaching the proof act
// → clear again for the finale. Opacity-only (compositor-friendly, zero
// layout risk). Static default is all-transparent — reduced-motion users and
// no-JS keep the committed ivory canvas, which is a complete design.

const WASHES = [
  {
    id: "noon",
    background:
      "radial-gradient(90% 70% at 50% 10%, rgba(253, 186, 116, 0.16) 0%, transparent 60%), radial-gradient(60% 50% at 12% 55%, rgba(251, 146, 60, 0.10) 0%, transparent 65%)",
  },
  {
    id: "dusk",
    background:
      "radial-gradient(80% 65% at 78% 20%, rgba(253, 164, 175, 0.14) 0%, transparent 60%), radial-gradient(70% 60% at 25% 80%, rgba(109, 40, 217, 0.07) 0%, transparent 65%)",
  },
  {
    id: "ember",
    background:
      "radial-gradient(100% 80% at 50% 100%, rgba(249, 115, 22, 0.12) 0%, transparent 60%)",
  },
];

export default function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {WASHES.map((w) => (
        <div
          key={w.id}
          data-atmo={w.id}
          className="absolute inset-0 opacity-0"
          style={{ background: w.background }}
        />
      ))}
    </div>
  );
}

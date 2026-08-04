// The traveling sun — the one light source the whole page shares. At rest it
// is the warm core glowing behind the hero's dune crest. When the cinema is
// enabled, HomeCinema promotes it to a fixed layer and walks it through the
// acts as you scroll: over the services headline, across the how-it-works
// stage, into the dusk act (where the shader sun takes over), and finally
// setting behind the closing dunes. Pure radial gradient — no blur filter,
// transform/opacity only, so it composites for free.
//
// Static / reduced-motion / no-JS: it simply stays put behind the hero crest,
// where it reads as the hero's glow — a deliberate, complete state.

export default function Sun() {
  return (
    <div
      data-sun
      className="pointer-events-none absolute left-[14%] top-[46vh] z-0 h-[34rem] w-[34rem] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(251,146,60,0.28) 0%, rgba(249,115,22,0.14) 38%, rgba(253,164,175,0.06) 60%, transparent 72%)",
      }}
      aria-hidden
    />
  );
}

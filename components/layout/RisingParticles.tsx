// Ambient rising particles — the slow up-and-down futuristic flow layer.
// Deterministic values (SSR-safe), negative delays pre-distribute them.
const DOTS = [
  { left: "6%", size: 7, color: "rgba(249,115,22,0.35)", dur: 18, delay: -2 },
  { left: "16%", size: 5, color: "rgba(8,145,178,0.3)", dur: 24, delay: -9 },
  { left: "27%", size: 8, color: "rgba(249,115,22,0.25)", dur: 20, delay: -14 },
  { left: "38%", size: 4, color: "rgba(124,58,237,0.3)", dur: 26, delay: -5 },
  { left: "52%", size: 6, color: "rgba(249,115,22,0.3)", dur: 22, delay: -18 },
  { left: "64%", size: 5, color: "rgba(8,145,178,0.35)", dur: 19, delay: -11 },
  { left: "76%", size: 8, color: "rgba(124,58,237,0.25)", dur: 25, delay: -3 },
  { left: "87%", size: 5, color: "rgba(249,115,22,0.35)", dur: 21, delay: -16 },
  { left: "95%", size: 6, color: "rgba(8,145,178,0.28)", dur: 23, delay: -7 },
];

export default function RisingParticles() {
  return (
    <div aria-hidden>
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="rise-dot"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.color,
            boxShadow: `0 0 ${d.size * 2}px ${d.color}`,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { isAutomatedAgent, prefersReducedMotion } from "@/lib/motion";
import { NOCTURNE } from "@/lib/design";

// Completes the hero sentence: "Daily Help That Flows With ___".
// Words stay short so the headline never reflows between rotations.
const WORDS = ["Care.", "You.", "Trust.", "Ease."];

/** Cycles hero words with a blur-slide swap. */
export default function WordRotate() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion() || isAutomatedAgent()) return;
    const id = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    // Gold, not --primary: this sits on the hero's nocturne stage, where the
    // ink-dark primary would vanish. AA-enforced in contrast.test.ts.
    <span key={i} className="word-swap inline-block" style={{ color: NOCTURNE.gold }}>
      {WORDS[i]}
    </span>
  );
}

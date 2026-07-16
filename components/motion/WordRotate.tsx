"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Completes the hero sentence: "Daily Help That Flows With ___".
// Words stay short so the headline never reflows between rotations.
const WORDS = ["You.", "Trust.", "Ease.", "Care."];

/** Cycles hero words with a blur-slide swap. */
export default function WordRotate() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span key={i} className="word-swap inline-block text-primary">
      {WORDS[i]}
    </span>
  );
}

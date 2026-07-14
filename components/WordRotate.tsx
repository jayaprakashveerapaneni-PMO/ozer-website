"use client";

import { useEffect, useState } from "react";

const WORDS = ["delivered.", "verified.", "tracked.", "in Telugu.", "on demand."];

/** Cycles hero words with a blur-slide swap. */
export default function WordRotate() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span key={i} className="word-swap gradient-text text-glow inline-block">
      {WORDS[i]}
    </span>
  );
}

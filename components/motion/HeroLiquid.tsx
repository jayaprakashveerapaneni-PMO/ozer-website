"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { glSceneEnabled } from "@/lib/motion/webgl";

// Loads the three.js chunk (~150KB) only where it earns its keep: desktop
// pointers, motion allowed, real users, WebGL present. Everyone else keeps
// the static ivory hero — the dunes render either way, so nothing is lost.

const LiquidGradient = dynamic(() => import("./LiquidGradient"), { ssr: false });

export default function HeroLiquid() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled && glSceneEnabled()) setShow(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return show ? <LiquidGradient /> : null;
}

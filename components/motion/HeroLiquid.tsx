"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion, isAutomatedAgent } from "@/lib/motion";

// Loads the three.js chunk (~150KB) only where it earns its keep: desktop
// pointers, motion allowed, real users, WebGL present. Everyone else keeps
// the static ivory hero — the dunes render either way, so nothing is lost.

const LiquidGradient = dynamic(() => import("./LiquidGradient"), { ssr: false });

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroLiquid() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled || prefersReducedMotion() || isAutomatedAgent()) return;
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      if (!webglAvailable()) return;
      setShow(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return show ? <LiquidGradient /> : null;
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { glSceneEnabled } from "@/lib/motion/webgl";

// Loads the three.js chunk (~150KB) only where it earns its keep: desktop
// pointers, motion allowed, real users, WebGL present. Everyone else keeps
// HeroStage's server-rendered composition, which is the same shot — so the
// hero is never an empty box while this decides.

const HeroField = dynamic(() => import("./HeroField"), { ssr: false });

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

  return show ? <HeroField /> : null;
}

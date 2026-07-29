"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap, gsap, ScrollTrigger, cinemaEnabled } from "@/lib/motion/cinema";

/** Lenis inertia scrolling, driven by the GSAP ticker so ScrollTrigger and
 *  the scroll position share one clock. Renders nothing; native scrolling
 *  (and sticky positioning) stays intact. Disabled for reduced-motion users
 *  and automated agents. */
export default function SmoothScroll() {
  useEffect(() => {
    if (!cinemaEnabled()) return;
    ensureGsap();

    const lenis = new Lenis({
      lerp: 0.115,
      wheelMultiplier: 1,
      anchors: true,
    });
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}

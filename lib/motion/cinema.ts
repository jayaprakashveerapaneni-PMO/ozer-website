"use client";

// GSAP hub — single registration point for the cinematic engine.
// Everything scroll-choreographed imports gsap from here so plugins are
// registered exactly once and the enablement rules stay in one place.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { isAutomatedAgent, prefersReducedMotion } from "@/lib/motion";

let registered = false;

export function ensureGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
    registered = true;
  }
  return gsap;
}

/** Master switch for JS-driven cinema. Off for reduced-motion users (they
 *  get the static page) and automated agents (Lighthouse NO_FCP protection —
 *  see the CI saga in docs/SESSION-HANDOFF.md §7). */
export function cinemaEnabled(): boolean {
  return typeof window !== "undefined" && !prefersReducedMotion() && !isAutomatedAgent();
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

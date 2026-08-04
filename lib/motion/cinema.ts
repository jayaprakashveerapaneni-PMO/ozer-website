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
    // Verification hook, only under the same ?cinema opt-in: exposes the hub
    // so webdriver tooling can hand-step the ticker (background tabs freeze
    // rAF, so scrubbed scenes can't otherwise be asserted from automation).
    if (new URLSearchParams(window.location.search).has("cinema")) {
      (window as unknown as Record<string, unknown>).__cinema = { gsap, ScrollTrigger };
    }
  }
  return gsap;
}

/** Master switch for JS-driven cinema. Off for reduced-motion users (they
 *  get the static page) and automated agents (Lighthouse NO_FCP protection —
 *  see the CI saga in docs/SESSION-HANDOFF.md §7). `?cinema=1` is a manual
 *  opt-in so the film can be verified from webdriver tooling (the browser
 *  pane is a webdriver session); reduced-motion still wins over it. */
export function cinemaEnabled(): boolean {
  if (typeof window === "undefined" || prefersReducedMotion()) return false;
  const params = new URLSearchParams(window.location.search);
  if (params.has("cinema")) return true;
  // ?nocinema previews the static (reduced-motion) design in a normal browser.
  if (params.has("nocinema")) return false;
  return !isAutomatedAgent();
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

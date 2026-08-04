"use client";

import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, cinemaEnabled } from "@/lib/motion/cinema";

/** The pointer director (fine pointers only): magnetic CTAs pull toward the
 *  cursor and the hero's silk carries a cursor-tracked light. Split from
 *  HomeCinema so each director stays a readable scene. Renders nothing. */
export default function PointerCinema() {
  useGSAP(() => {
    if (!cinemaEnabled()) return;
    ensureGsap();
    const mm = gsap.matchMedia();
    const removers: Array<() => void> = [];

    mm.add("(pointer: fine)", () => {
      // Magnetic CTAs
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo(gsap.utils.clamp(-12, 12, (e.clientX - r.left - r.width / 2) * 0.28));
          yTo(gsap.utils.clamp(-10, 10, (e.clientY - r.top - r.height / 2) * 0.34));
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        removers.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });

      // Cursor-tracked light over the hero silk
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const glow = document.querySelector<HTMLElement>("[data-hero-glow]");
      if (hero && glow) {
        const half = glow.offsetWidth / 2;
        const gx = gsap.quickTo(glow, "x", { duration: 0.8, ease: "power2.out" });
        const gy = gsap.quickTo(glow, "y", { duration: 0.8, ease: "power2.out" });
        const move = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          gx(e.clientX - r.left - half);
          gy(e.clientY - r.top - half);
          gsap.to(glow, { autoAlpha: 1, duration: 0.5, overwrite: "auto" });
        };
        const leave = () => gsap.to(glow, { autoAlpha: 0, duration: 0.8, overwrite: "auto" });
        hero.addEventListener("pointermove", move);
        hero.addEventListener("pointerleave", leave);
        removers.push(() => {
          hero.removeEventListener("pointermove", move);
          hero.removeEventListener("pointerleave", leave);
        });
      }

      return () => {
        while (removers.length) removers.pop()?.();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return null;
}

"use client";

import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, ScrollTrigger, SplitText, cinemaEnabled } from "@/lib/motion/cinema";

/** The homepage film director. One client component orchestrates every
 *  scroll scene against server-rendered markup via data-attributes:
 *  layered dune parallax, headline drift, word-level h2 reveals, the pinned
 *  How-It-Works sequence, velocity-reactive marquee, ambient parallax orbs,
 *  magnetic CTAs and the cursor-tracked hero light. Renders nothing.
 *  Everything no-ops for reduced-motion users and automated agents. */
export default function HomeCinema() {
  useGSAP((_context, contextSafe) => {
    if (!cinemaEnabled() || !contextSafe) return;
    ensureGsap();
    const mm = gsap.matchMedia();

    // The page-entrance transform skews measurements for ~0.9s — re-measure after.
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1200);

    /* ---- HERO: take ownership of dune parallax; add depth per ridge ---- */
    document.querySelector(".silk-parallax")?.classList.remove("silk-parallax");
    const heroScrub = {
      trigger: "[data-hero]",
      start: "top top",
      end: "bottom top",
      scrub: true,
    } as const;
    const ridges = gsap.utils.toArray<HTMLElement>("[data-ridge]");
    ridges.forEach((ridge, i) => {
      gsap.to(ridge, {
        yPercent: 7 + i * (30 / Math.max(1, ridges.length - 1)),
        ease: "none",
        scrollTrigger: { ...heroScrub },
      });
    });
    gsap.to("[data-dune-glow]", { yPercent: 36, ease: "none", scrollTrigger: { ...heroScrub } });
    gsap.to("[data-hero-copy]", {
      yPercent: -13,
      autoAlpha: 0.3,
      ease: "none",
      scrollTrigger: { ...heroScrub },
    });
    gsap.to("[data-shafts]", { autoAlpha: 0, ease: "none", scrollTrigger: { ...heroScrub } });

    /* ---- H2s: word-level masked rises as each section enters ---- */
    void document.fonts.ready.then(
      contextSafe(() => {
        gsap.utils.toArray<HTMLElement>("main h2").forEach((h2) => {
          const split = new SplitText(h2, { type: "words,lines", mask: "lines" });
          gsap.from(split.words, {
            yPercent: 120,
            rotate: 2,
            duration: 0.9,
            stagger: 0.05,
            ease: "power4.out",
            scrollTrigger: { trigger: h2, start: "top 84%", once: true },
          });
        });
        ScrollTrigger.refresh();
      })
    );

    /* ---- HOW IT WORKS: pinned scrub on desktop, batch rise on mobile ---- */
    mm.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-hiw-card]");
      if (!cards.length) return;
      gsap.set("[data-hiw-grid]", { perspective: 900 });
      gsap.set(cards, { yPercent: 26, autoAlpha: 0, rotationX: 14, transformOrigin: "50% 100%" });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-hiw]",
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      cards.forEach((card, i) => {
        tl.to(card, { yPercent: 0, autoAlpha: 1, rotationX: 0, duration: 1, ease: "power2.out" }, i * 0.85);
      });
      tl.to({}, { duration: 0.7 }); // hold the finished composition before unpinning
    });
    mm.add("(max-width: 1023px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-hiw-card]");
      if (!cards.length) return;
      gsap.set(cards, { y: 44, autoAlpha: 0 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }),
      });
    });

    /* ---- MARQUEE: skew + speed react to scroll velocity ---- */
    const track = document.querySelector<HTMLElement>("[data-marquee-track]");
    const trackAnim = track?.getAnimations()[0];
    const skewTo = gsap.quickTo("[data-marquee-skew]", "skewX", { duration: 0.5, ease: "power3.out" });
    let marqueeBoost = 0;
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-2400, 2400, self.getVelocity());
        skewTo(v / -320);
        marqueeBoost = Math.min(2.6, Math.abs(v) / 900);
      },
    });
    const settle = () => {
      marqueeBoost *= 0.94;
      if (trackAnim) trackAnim.playbackRate = 1 + marqueeBoost;
    };
    gsap.ticker.add(settle);

    /* ---- AMBIENT ORBS: slow counter-parallax through the page ---- */
    gsap.utils.toArray<HTMLElement>("[data-orb]").forEach((orb, i) => {
      gsap.to(orb, {
        yPercent: i % 2 ? -36 : 30,
        ease: "none",
        scrollTrigger: { trigger: orb, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    /* ---- POINTER CINEMA (fine pointers only) ---- */
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
      clearTimeout(refreshTimer);
      gsap.ticker.remove(settle);
      mm.revert();
    };
  }, []);

  return null;
}

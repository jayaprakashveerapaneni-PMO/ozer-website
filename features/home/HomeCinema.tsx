"use client";

import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, ScrollTrigger, SplitText, cinemaEnabled } from "@/lib/motion/cinema";
import { HIW_STEP_EVENT } from "@/lib/motion";

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

    /* ---- HERO: the nocturne recedes as the page dawns ----
       The WebGL field runs its own dawn off field.heroScroll; this moves the
       server-rendered stage and the copy with it so both layers travel as
       one shot whether or not the canvas mounted. */
    const heroScrub = {
      trigger: "[data-hero]",
      start: "top top",
      end: "bottom top",
      scrub: true,
    } as const;
    gsap.to("[data-hero-stage] svg", { yPercent: 14, scale: 1.06, ease: "none", scrollTrigger: { ...heroScrub } });
    gsap.to("[data-hero-copy]", {
      yPercent: -13,
      autoAlpha: 0.3,
      ease: "none",
      scrollTrigger: { ...heroScrub },
    });

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

    /* ---- HOW IT WORKS: pinned scrub on desktop, batch rise on mobile.
       The scrub also broadcasts the active step so the phone stage plays
       the matching app screen — cards and product move as one shot. ---- */
    mm.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-hiw-card]");
      if (!cards.length) return;
      let lastStep = -1;
      gsap.set("[data-hiw-grid]", { perspective: 900 });
      gsap.set(cards, { yPercent: 26, autoAlpha: 0, rotationX: 14, transformOrigin: "50% 100%" });
      gsap.set("[data-hiw-phone]", { yPercent: 10, autoAlpha: 0 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-hiw]",
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            // card i enters at timeline time i*0.85 of 4.25 total → i*0.2
            const step = Math.min(cards.length - 1, Math.floor(self.progress / 0.2));
            if (step !== lastStep) {
              lastStep = step;
              window.dispatchEvent(new CustomEvent(HIW_STEP_EVENT, { detail: { step } }));
            }
          },
        },
      });
      tl.to("[data-hiw-phone]", { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: "power2.out" }, 0);
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

    /* ---- DEPTH DRIFT: any [data-drift="0.15"] floats at its own depth.
       Wrappers only (never elements with CSS transform transitions). ---- */
    gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
      const depth = parseFloat(el.dataset.drift ?? "0.1");
      gsap.fromTo(
        el,
        { yPercent: depth * 60 },
        {
          yPercent: depth * -60,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });

    /* ---- AMBIENT ORBS: slow counter-parallax through the page ---- */
    gsap.utils.toArray<HTMLElement>("[data-orb]").forEach((orb, i) => {
      gsap.to(orb, {
        yPercent: i % 2 ? -36 : 30,
        ease: "none",
        scrollTrigger: { trigger: orb, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    /* (Pointer choreography — magnetic CTAs, hero cursor light — lives in
       PointerCinema.tsx to keep each director a readable scene.) */

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(settle);
      mm.revert();
    };
  }, []);

  return null;
}

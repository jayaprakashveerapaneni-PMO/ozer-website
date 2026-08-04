"use client";

import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, ScrollTrigger, cinemaEnabled } from "@/lib/motion/cinema";
import { field } from "@/lib/motion/field";

/** The light director. Where HomeCinema choreographs the actors, this
 *  conducts the light itself: it streams scroll depth / pointer / velocity
 *  into the shared field state (read by the WebGL shaders each frame),
 *  cross-fades the fixed Atmosphere washes so the page moves through a day,
 *  and walks the traveling Sun between the acts' [data-sun-stop] waypoints.
 *  Renders nothing; no-ops entirely for reduced motion and automated agents. */
export default function LightDirector() {
  useGSAP(() => {
    if (!cinemaEnabled()) return;
    ensureGsap();

    /* ---- FIELD: hero depth, page depth, pointer, scroll energy ---- */
    ScrollTrigger.create({
      trigger: "[data-hero]",
      start: "top top",
      end: "bottom top",
      onUpdate: (s) => {
        field.heroScroll = s.progress;
      },
    });
    ScrollTrigger.create({
      onUpdate: (s) => {
        field.pageScroll = s.progress;
        field.energy = Math.max(
          field.energy,
          Math.min(1, Math.abs(s.getVelocity()) / 2400)
        );
      },
    });
    const decay = () => {
      field.energy *= 0.94;
    };
    gsap.ticker.add(decay);

    const onPointer = (e: PointerEvent) => {
      field.pointerX = e.clientX / window.innerWidth;
      field.pointerY = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    /* ---- ATMOSPHERE: the day passing over the page ---- */
    const wash = (
      id: string,
      trigger: string,
      opacity: number,
      start = "top 85%",
      end = "top 25%"
    ) => {
      if (!document.querySelector(trigger)) return;
      gsap.to(`[data-atmo="${id}"]`, {
        opacity,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger, start, end, scrub: true },
      });
    };
    wash("noon", "#services", 1);
    wash("noon", "[data-dusk]", 0, "top bottom", "top 40%");
    wash("dusk", "[data-dusk]", 1, "top bottom", "top 40%");
    wash("dusk", "[data-finale]", 0);
    wash("ember", "[data-finale]", 1);

    /* ---- THE SUN: one light source walks the whole film ---- */
    const sun = document.querySelector<HTMLElement>("[data-sun]");
    const stops = gsap.utils.toArray<HTMLElement>("[data-sun-stop]");
    if (sun && stops.length > 1) {
      const half = sun.offsetWidth / 2;
      const pos = (el: HTMLElement) => {
        const [fx = "0.5", fy = "0.5", scale = "1", opacity = "1"] = (
          el.dataset.sunStop ?? ""
        ).split(",");
        return {
          x: parseFloat(fx) * window.innerWidth - half,
          y: parseFloat(fy) * window.innerHeight - half,
          scale: parseFloat(scale),
          opacity: parseFloat(opacity),
        };
      };
      gsap.set(sun, { position: "fixed", left: 0, top: 0, ...pos(stops[0]) });
      stops.slice(1).forEach((stop) => {
        gsap.to(sun, {
          ...pos(stop),
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: stop,
            start: "top bottom",
            end: "top 30%",
            scrub: true,
          },
        });
      });
    }

    return () => {
      gsap.ticker.remove(decay);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return null;
}

"use client";

import { useRef } from "react";
import WordRotate from "@/components/motion/WordRotate";
import { ensureGsap, gsap, SplitText, useGSAP, cinemaEnabled } from "@/lib/motion/cinema";

/** The hero headline as a title sequence: serif chars climb out of
 *  line-level masks with a per-char stagger, then the rotating word rises
 *  behind them. Server-rendered text stays fully visible for no-JS,
 *  reduced-motion, and automated agents — GSAP only takes over when the
 *  cinema is enabled, and splits only after fonts resolve so glyph metrics
 *  are final. */
export default function HeroTitle() {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      if (!cinemaEnabled() || !ref.current || !contextSafe) return;
      ensureGsap();

      const run = contextSafe(() => {
        if (!ref.current) return;
        const splits = Array.from(
          ref.current.querySelectorAll<HTMLElement>("[data-split]")
        ).map((el) => new SplitText(el, { type: "chars,lines", mask: "lines" }));

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        splits.forEach((split, line) => {
          tl.from(
            split.chars,
            { yPercent: 130, rotate: 5, duration: 1.25, stagger: 0.02 },
            line * 0.16
          );
        });
        tl.from("[data-hero-rotate]", { yPercent: 130, duration: 1.15 }, 0.5);
      });

      void document.fonts.ready.then(run);
    },
    { scope: ref }
  );

  return (
    <h1
      ref={ref}
      className="mx-auto max-w-4xl text-6xl leading-[1.02] tracking-tight text-foreground sm:text-7xl lg:text-8xl"
      style={{ fontFamily: "var(--font-serif)" }}
    >
      <span className="block" data-split>
        Daily Help That
      </span>
      <span className="block">
        <span className="inline-block" data-split>
          Flows With
        </span>{" "}
        <span className="inline-block overflow-hidden align-bottom">
          <span className="inline-block" data-hero-rotate>
            <em className="not-italic">
              <WordRotate />
            </em>
          </span>
        </span>
      </span>
    </h1>
  );
}

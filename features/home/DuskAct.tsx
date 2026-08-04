"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/motion/Reveal";
import { ensureGsap, gsap, ScrollTrigger, SplitText, cinemaEnabled } from "@/lib/motion/cinema";
import { field } from "@/lib/motion/field";
import { glSceneEnabled } from "@/lib/motion/webgl";
import { DUSK } from "@/lib/design";

const DuskField = dynamic(() => import("@/components/motion/DuskField"), { ssr: false });

// The dusk act — the film's signature full-bleed moment. The page's day dips
// into evening: a pinned dark scene where the shader sun rises over silk
// dunes while two serif lines trade places (the brand promise, spoken at
// hero scale mid-page). Static users get the complete two-line poem over the
// CSS dusk gradient — designed, not degraded.

export default function DuskAct() {
  const ref = useRef<HTMLElement>(null);
  const [gl, setGl] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled && glSceneEnabled()) setGl(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    (_context, contextSafe) => {
      if (!cinemaEnabled() || !ref.current || !contextSafe) return;
      ensureGsap();
      const mm = gsap.matchMedia(ref);

      mm.add("(min-width: 768px)", () => {
        const build = contextSafe(() => {
          const el = ref.current;
          // fonts.ready is async: a stale StrictMode mount can still fire its
          // build after remount — one pin per element, ever.
          if (!el || el.dataset.duskBuilt) return;
          el.dataset.duskBuilt = "1";
          const lineA = el.querySelector<HTMLElement>("[data-dusk-line='a']");
          const lineB = el.querySelector<HTMLElement>("[data-dusk-line='b']");
          const caption = el.querySelector<HTMLElement>("[data-dusk-caption]");
          if (!lineA || !lineB || !caption) return;
          // stack the lines on one center stage for the crossfade
          gsap.set([lineA, lineB], {
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            yPercent: -50,
            margin: 0,
          });
          const splitA = new SplitText(lineA, { type: "words,lines", mask: "lines", aria: "none" });
          const splitB = new SplitText(lineB, { type: "words,lines", mask: "lines", aria: "none" });
          gsap.set(caption, { autoAlpha: 0, y: 26 });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=220%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              onUpdate: (self) => {
                field.duskProgress = self.progress;
              },
            },
          });
          tl.from(splitA.words, { yPercent: 120, rotate: 2, stagger: 0.05, duration: 1, ease: "power4.out" }, 0)
            .to(lineA, { yPercent: -66, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, 1.5)
            .from(splitB.words, { yPercent: 120, rotate: 2, stagger: 0.06, duration: 1, ease: "power4.out" }, 2.1)
            .to(caption, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 3.0)
            .to({}, { duration: 0.7 });
          ScrollTrigger.refresh();
        });
        void document.fonts.ready.then(build);
        return () => {
          delete ref.current?.dataset.duskBuilt;
        };
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      data-dusk
      data-sun-stop="0.5,0.5,1.6,0"
      className="relative flex min-h-[88vh] flex-col justify-center md:min-h-screen"
      style={{
        backgroundColor: DUSK.bg,
        backgroundImage:
          "radial-gradient(120% 55% at 50% 96%, rgba(249,115,22,0.30) 0%, transparent 62%), radial-gradient(90% 40% at 50% 100%, rgba(253,164,175,0.14) 0%, transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.22) 0%, transparent 55%)",
      }}
    >
      {/* the dusk landscape rises over the previous act and recedes into the
          next — the act flows in, it doesn't start at a line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -translate-y-[97%]" aria-hidden>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[64px] w-full md:h-[110px]">
          <path d="M0,120 C220,44 470,92 720,62 C980,30 1200,26 1440,72 L1440,121 L0,121 Z" fill={DUSK.bg} />
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-[97%]" aria-hidden>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[64px] w-full md:h-[110px]">
          <path d="M0,-1 L1440,-1 L1440,48 C1180,96 940,34 700,64 C440,96 210,58 0,88 Z" fill={DUSK.bg} />
        </svg>
      </div>
      <div className="absolute inset-0 overflow-hidden">{gl && <DuskField />}</div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
        <div className="relative flex min-h-[40vh] flex-col justify-center">
          <p
            data-dusk-line="a"
            className="font-serif text-[clamp(2.6rem,1.6rem+4.4vw,5.4rem)] leading-[1.06] tracking-tight [text-wrap:balance]"
            style={{ color: DUSK.text }}
          >
            Evenings should be <em>yours.</em>
          </p>
          <p
            data-dusk-line="b"
            className="mt-8 font-serif text-[clamp(2.6rem,1.6rem+4.4vw,5.4rem)] leading-[1.06] tracking-tight [text-wrap:balance]"
            style={{ color: DUSK.text }}
          >
            The help is already <em>on its way.</em>
          </p>
        </div>
        <p
          data-dusk-caption
          className="mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base"
          style={{ color: DUSK.textSoft }}
        >
          Evening slots fill fast across Hyderabad.{" "}
          <Link
            href="/book"
            className="group inline-flex items-center gap-1.5 font-semibold transition-colors"
            style={{ color: DUSK.link }}
          >
            Book tonight&apos;s help
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </p>
        </Reveal>
      </div>
    </section>
  );
}

// Path data for the nocturne stage's static composition (HeroStage).
//
// Two cuts, because one does not survive both aspects: an SVG that "slices"
// to cover a 375×930 viewport shows only the middle ~26% of a 1440-wide
// artwork — exactly where these ribbons pinch — so the phone would get an
// empty dark box. The portrait cut moves the same language into a tall frame:
// ribbons sweeping the upper half, the lit heart, ripples spreading below.

export interface StageArt {
  viewBox: string;
  /** Broad satin bands — filled lens shapes, soft-blurred. */
  bands: { d: string; o: number; b: number }[];
  /** Fine filaments — the bright hairlines threading the bands. */
  filaments: { d: string; w: number; o: number; b: number }[];
  dust: [number, number, number][];
  /** Ripple set: centre, then the radii that spread from it. */
  ripple: { cx: number; cy: number; rx: number[]; ry: number };
  /** Where the light sits, and how far its bloom reaches. */
  heart: { cx: number; cy: number; r: number };
  /** y of the waterline, for the mirrored reflection and its edge glow. */
  horizon: number;
}

export const WIDE: StageArt = {
  viewBox: "0 0 1440 900",
  bands: [
    { d: "M-120,300 C240,196 520,320 760,286 C520,330 250,412 -120,352 Z", o: 0.75, b: 14 },
    { d: "M1560,250 C1200,150 900,268 690,250 C900,296 1210,362 1560,300 Z", o: 0.7, b: 16 },
    { d: "M-120,470 C260,392 540,470 780,452 C540,486 260,548 -120,516 Z", o: 0.55, b: 20 },
    { d: "M1560,436 C1240,372 940,452 700,440 C940,470 1250,528 1560,486 Z", o: 0.5, b: 18 },
  ],
  filaments: [
    { d: "M-60,330 C280,236 560,340 780,306", w: 2.6, o: 0.95, b: 0.6 },
    { d: "M-60,378 C300,300 580,382 790,352", w: 1.6, o: 0.7, b: 1.2 },
    { d: "M1520,286 C1200,190 920,296 700,272", w: 2.4, o: 0.9, b: 0.6 },
    { d: "M1520,340 C1220,258 940,344 710,318", w: 1.5, o: 0.65, b: 1.2 },
    { d: "M-60,498 C300,424 580,494 800,470", w: 1.8, o: 0.6, b: 1.4 },
    { d: "M1520,470 C1230,404 950,478 720,458", w: 1.7, o: 0.55, b: 1.4 },
  ],
  dust: [
    [232, 262, 2.4], [318, 214, 1.6], [402, 330, 2], [500, 250, 1.4], [598, 306, 2.2],
    [742, 228, 1.8], [880, 292, 2.4], [1010, 236, 1.5], [1128, 318, 2], [1250, 262, 1.7],
    [176, 420, 1.9], [660, 404, 1.5], [1044, 430, 2.1], [1330, 396, 1.6], [430, 470, 1.4],
  ],
  ripple: { cx: 716, cy: 600, rx: [115, 240, 380, 535, 705, 890], ry: 0.42 },
  heart: { cx: 716, cy: 520, r: 300 },
  horizon: 558,
};

export const TALL: StageArt = {
  viewBox: "0 0 620 1040",
  bands: [
    { d: "M-70,330 C110,266 250,352 336,326 C250,352 118,420 -70,382 Z", o: 0.78, b: 12 },
    { d: "M690,286 C500,214 372,306 296,292 C372,330 510,392 690,340 Z", o: 0.72, b: 13 },
    { d: "M-70,486 C120,430 262,494 342,480 C262,506 124,560 -70,532 Z", o: 0.55, b: 16 },
    { d: "M690,452 C520,398 380,470 300,462 C380,488 526,540 690,504 Z", o: 0.5, b: 15 },
  ],
  filaments: [
    { d: "M-40,352 C140,286 268,362 344,338", w: 2.4, o: 0.95, b: 0.5 },
    { d: "M-40,398 C150,342 280,404 350,386", w: 1.5, o: 0.68, b: 1.1 },
    { d: "M660,312 C500,242 372,320 292,306", w: 2.3, o: 0.9, b: 0.5 },
    { d: "M660,362 C512,300 384,368 300,354", w: 1.4, o: 0.62, b: 1.1 },
    { d: "M-40,516 C150,462 282,518 352,504", w: 1.7, o: 0.58, b: 1.3 },
    { d: "M660,486 C516,432 388,494 306,484", w: 1.6, o: 0.54, b: 1.3 },
  ],
  dust: [
    [96, 300, 2.2], [172, 240, 1.5], [244, 372, 1.9], [330, 268, 1.4], [402, 336, 2.1],
    [486, 250, 1.7], [548, 356, 2.2], [128, 452, 1.8], [300, 430, 1.5], [470, 470, 2],
    [212, 190, 1.6], [396, 200, 1.4], [560, 430, 1.6],
  ],
  ripple: { cx: 310, cy: 700, rx: [92, 178, 280, 396, 520, 650], ry: 0.36 },
  heart: { cx: 310, cy: 560, r: 250 },
  horizon: 604,
};

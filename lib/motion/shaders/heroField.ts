// The hero's nocturne field — GLSL for the opening shot: ribbons of liquid
// gold silk flaring out of a warm dark chamber, a still pool below catching
// their reflection in slow concentric rings, gold dust drifting through, and
// the whole stage dawning into ivory as you scroll out of it.
//
// One fullscreen quad. Layout in UV space (y = 0 at the bottom):
//   y 0.00–0.26  dawn — the stage dissolves into --background
//   y 0.26–0.52  pool — mirrored ribbons, ripple-warped, horizon glow at 0.52
//   y 0.52–1.00  sky  — the ribbons themselves, shafts, dust
// The headline band is deliberately held down to NOCTURNE.bgLift so text
// contrast is guaranteed at the source (see lib/design tokens).

export const HERO_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const HERO_FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;    /* hero exit 0..1 — drives the dawn */
  uniform float uEnergy;    /* smoothed |scroll velocity| 0..1 */
  uniform vec2  uPointer;   /* viewport uv, y up */
  uniform float uAspect;
  varying vec2 vUv;

  const float PI = 3.14159265;

  const vec3 DEEP  = vec3(0.141, 0.110, 0.082);  /* NOCTURNE.bg    #241c15 */
  const vec3 LIFT  = vec3(0.361, 0.282, 0.208);  /* NOCTURNE.bgLift #5c4835 */
  const vec3 IVORY = vec3(0.957, 0.937, 0.906);  /* --background   #f4efe7 */
  const vec3 GOLD  = vec3(0.900, 0.600, 0.210);
  const vec3 HOT   = vec3(1.000, 0.845, 0.560);
  const vec3 ROSE  = vec3(0.988, 0.600, 0.470);

  /* Filmic roll-off. Additive light this dense clips to flat white without
     it, and clipped highlights are exactly what kills the satin — the whole
     material reads in the gradient between the specular and the shoulder. */
  vec3 tone(vec3 c) {
    /* the curve saturates R before B, which walks warm highlights toward
       white — so push saturation first and let it come back to gold */
    c = max(c, 0.0);
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    c = mix(vec3(l), c, 1.35);
    return vec3(1.0) - exp(-max(c, 0.0));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  /* ---- one silk strand -------------------------------------------------
     Strands are described in POLAR space around the light heart: each owns a
     base angle and curls as it travels outward, widening as it goes. That is
     what makes the field read as light streaming OUT of a point rather than
     bands crossing a frame. Across the ribbon we ramp dark lip -> hot
     specular -> mid gold, and slide that specular with the local curl: the
     shift is what sells the roll of satin instead of a flat painted band.
     q is the position relative to the heart. */
  vec3 strand(vec2 q, float seed, float t, out float cover) {
    cover = 0.0;
    float r = length(q);
    float a = atan(q.y, q.x);

    float h1 = hash(vec2(seed, 1.7));
    float h2 = hash(vec2(seed, 5.3));
    float h3 = hash(vec2(seed, 9.1));

    /* strands sweep left and right of the heart, not up and down */
    float side = mod(seed, 2.0) < 1.0 ? 0.0 : PI;
    float th0 = side + (h1 - 0.5) * 1.35;
    float sp = 0.34 + h2 * 0.62;
    float ph = seed * 21.3;

    /* centre angle: curling outward, breathing over time */
    float centre = th0
      + sin(r * 2.9 + ph + t * sp) * 0.30
      + sin(r * 1.3 - ph * 0.5 - t * sp * 0.6) * 0.22
      + (h3 - 0.5) * r * 1.05;

    float da = atan(sin(a - centre), cos(a - centre));  /* wrapped */

    /* broad silk sheets and fine filaments together, all widening outward */
    float halfW = mix(0.005, 0.055, h1 * h1) * (0.28 + r * 1.55);
    float d = (da * r) / max(halfW, 1e-4);
    float ad = abs(d);

    cover = (1.0 - smoothstep(0.68, 1.0, ad))
          * smoothstep(0.015, 0.34, r)          /* dissolve into the heart */
          * (1.0 - smoothstep(0.85, 1.95, r));  /* and out at the far edge */
    if (cover <= 0.001) return vec3(0.0);

    float slope = cos(r * 2.9 + ph + t * sp) * 2.9 * 0.30
                + cos(r * 1.3 - ph * 0.5 - t * sp * 0.6) * 1.3 * 0.22;
    float specPos = clamp(slope * 0.38, -0.62, 0.62);

    float spec = exp(-pow((d - specPos) * 2.1, 2.0));
    float rim  = smoothstep(1.0, 0.5, ad) * 0.42;
    float edge = smoothstep(0.3, 1.0, ad);

    /* Values here run well above 1.0 on purpose: the filmic curve turns that
       headroom into a hot specular that still holds its gradient, which is
       what reads as satin. Clamped-at-1 ribbons look like painted tubes. */
    vec3 c = GOLD * (0.60 + rim * 0.85);
    c = mix(c, HOT * 2.3, spec * 0.86);
    c = mix(c, GOLD * 0.10, edge * 0.8);
    c += ROSE * spec * 0.30;

    /* glints travelling out along the filament */
    float glint = noise(vec2(r * 11.0 - t * sp * 2.6, seed * 11.0));
    c += HOT * smoothstep(0.7, 1.0, glint) * spec * 1.4;

    /* strands dim as they run out, so the heart stays the brightest thing */
    return c * (1.0 - smoothstep(0.25, 1.5, r) * 0.55);
  }

  /* the whole ribbon field, front-to-back: nearer strands occlude the ones
     behind so crossings read as depth instead of summing into white */
  vec3 ribbons(vec2 q, float t) {
    vec3 acc = vec3(0.0);
    float rest = 1.0;
    for (int i = 0; i < 9; i++) {
      float seed = float(i) + 1.0;
      float cover;
      vec3 c = strand(q, seed, t, cover);
      float a = cover * rest;
      acc += c * a;
      rest *= 1.0 - a * 0.92;
    }
    return acc;
  }

  /* airborne gold dust: two hashed grids, near and far */
  vec3 dust(vec2 p, float t) {
    vec3 acc = vec3(0.0);
    for (int layer = 0; layer < 2; layer++) {
      float fl = float(layer);
      float scale = 5.0 + fl * 6.0;
      vec2 q = p * scale + vec2(t * (0.10 + fl * 0.12), t * 0.05);
      vec2 cell = floor(q);
      vec2 f = fract(q) - 0.5;
      float r = hash(cell + fl * 31.0);
      if (r < 0.74) continue;
      vec2 off = vec2(hash(cell + 5.0) - 0.5, hash(cell + 9.0) - 0.5) * 0.55;
      float d = length(f - off);
      float tw = 0.5 + 0.5 * sin(t * 2.2 + r * 40.0);
      acc += HOT * exp(-d * d * (120.0 - fl * 70.0)) * tw * (0.85 - fl * 0.35);
    }
    return acc;
  }

  const float HORIZON = 0.50;   /* the waterline, in uv.y */
  const float HEART_Y = 0.53;   /* the light sits just above its reflection */

  /* everything above the water: chamber + ribbons + dust, lit from the heart */
  vec3 sky(vec2 q, vec2 p, float t, float energy) {
    float rr = dot(q, q);
    float core = exp(-rr * 26.0);
    float halo = exp(-rr * 3.2);

    /* the chamber stays genuinely dark — all the light is earned */
    vec3 col = DEEP * (0.55 + 0.45 * halo);

    /* volumetric shafts raking down from the upper left */
    vec2 s = vec2(p.x * 0.82 - p.y * 0.57, p.x * 0.57 + p.y * 0.82);
    float shaft = exp(-pow((s.x + 0.34) * 3.0, 2.0)) * 0.6
                + exp(-pow((s.x - 0.14) * 4.4, 2.0)) * 0.34;
    col += vec3(0.95, 0.80, 0.58) * shaft * smoothstep(-0.8, 0.6, p.y) * 0.14;

    col += ribbons(q, t) * (1.0 + 0.3 * energy);
    col += dust(p, t) * (0.8 + 0.4 * energy);

    /* the heart itself: bloom, then a small blazing centre */
    col += GOLD * halo * 0.45;
    col += HOT * core * 3.0;
    return col;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.16;

    vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.66);
    /* the heart drifts a little with the cursor */
    vec2 heart = vec2((uPointer.x - 0.5) * uAspect * 0.3, HEART_Y - 0.66);

    vec3 col = sky(p - heart, p, t, uEnergy);

    /* ---- pool: the sky again, mirrored and rippled ---- */
    if (uv.y < HORIZON) {
      float depth = (HORIZON - uv.y) / HORIZON;   /* 0 at the waterline, 1 near */

      /* rings spreading from under the light, in a flattened ground plane */
      vec2 rp = vec2((uv.x - 0.5) * uAspect - heart.x, (uv.y - HORIZON) * 2.6);
      float rd = length(rp);
      float ring = sin(rd * 20.0 - t * 3.0) * exp(-rd * 1.5);
      /* a second, slower set so the surface never looks like one clean sine */
      ring += sin(rd * 9.0 - t * 1.7 + 1.4) * exp(-rd * 1.1) * 0.6;

      /* mirror about the waterline, warped by the rings */
      vec2 mp = vec2(p.x, (2.0 * HORIZON - uv.y) - 0.66);
      mp.y += ring * 0.075 * (0.3 + depth);
      mp.x += ring * 0.030;

      vec3 refl = sky(mp - heart, mp, t, uEnergy);

      /* grazing light keeps the far water bright; it deepens toward us */
      vec3 water = mix(LIFT * 0.55, DEEP * 0.8, smoothstep(0.0, 0.7, depth));
      vec3 poolCol = mix(water, water + refl * 0.9, 1.0 - depth * 0.45);
      /* crests catch the light, troughs fall away — this is what reads as water */
      poolCol += HOT * max(ring, 0.0) * 0.30 * (1.0 - depth * 0.45);
      poolCol *= 1.0 + min(ring, 0.0) * 0.30;

      col = mix(col, poolCol, smoothstep(HORIZON + 0.010, HORIZON - 0.010, uv.y));
    }

    /* the water's edge catches the light */
    col += HOT * exp(-pow((uv.y - HORIZON) * 60.0, 2.0)) * 0.16;

    col = tone(col);

    /* Text contrast is NOT defended here. Clamping a band in UV space either
       leaves a visible smudge or fights the composition, and it can't know
       where the copy actually landed at this viewport — the scrim behind
       [data-hero-copy] owns that job and tracks the text exactly. See
       NOCTURNE in lib/design for the worst-case arithmetic. */

    /* ---- dawn: the stage becomes the page ----
       Passing through warm light on the way to ivory — a straight mix to
       ivory over dark water just reads as grey. */
    float dawnY = smoothstep(0.34, 0.02, uv.y);
    float dawn = max(dawnY, smoothstep(0.35, 1.0, uScroll));
    vec3 warm = vec3(0.98, 0.86, 0.68);
    col = mix(col, mix(warm, IVORY, smoothstep(0.35, 1.0, dawn)), dawn);
    col += ROSE * dawnY * (1.0 - dawnY) * 0.45;

    /* grain keeps the wide gradients from banding */
    col += (hash(uv * vec2(913.0, 571.0) + fract(t) * 7.0) - 0.5) * 0.016;

    gl_FragColor = vec4(col, 1.0);
  }
`;

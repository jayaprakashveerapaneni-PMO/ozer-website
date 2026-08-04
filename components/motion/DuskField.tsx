"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { field } from "@/lib/motion/field";

// The dusk field — the page's signature full-bleed shader moment. A deep-ink
// evening over silk dunes: three fbm dune silhouettes stacked in depth, an
// amber sun that rises as the act's pin is scrubbed (field.duskProgress),
// rim light catching each crest, and the cursor gently swaying the light.
// Loaded only for desktop pointers with cinema enabled and WebGL present —
// everyone else keeps the act's CSS dusk gradient, a complete design.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uProgress; /* pin scrub 0..1 — the sun's rise */
  uniform vec2 uPointer;
  uniform float uEnergy;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1., 0.));
    float c = hash(i + vec2(0., 1.));
    float d = hash(i + vec2(1., 1.));
    vec2 u = f * f * (3. - 2. * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1. - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(17.1, 9.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.05;

    vec3 ink   = vec3(0.082, 0.070, 0.058);
    vec3 amber = vec3(1.00, 0.62, 0.18);
    vec3 rose  = vec3(0.99, 0.50, 0.45);

    /* the sun rises with the scrub; the pointer sways the light a little */
    vec2 sunP = vec2(0.5 + (uPointer.x - 0.5) * 0.10, mix(-0.14, 0.40, uProgress));
    float dSun = distance(vec2(uv.x, uv.y * 1.25), vec2(sunP.x, sunP.y * 1.25));
    float disc = smoothstep(0.13, 0.02, dSun);
    float halo = exp(-dSun * dSun * 9.0);

    /* sky: ink warmed by the rising light */
    float band = exp(-pow((uv.y - sunP.y) * 2.1, 2.0));
    vec3 col = ink
      + amber * band * (0.28 + 0.45 * uProgress)
      + rose * halo * 0.30
      + amber * halo * (0.25 + 0.30 * uProgress);
    col += amber * disc * 1.1;

    /* three dune silhouettes, back to front, crests rim-lit by the sun */
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float h = 0.40 - fi * 0.13
        + 0.07 * fbm(vec2(uv.x * (1.8 + fi * 0.9) + t * (0.25 + 0.18 * fi) + fi * 13.7, fi * 5.0));
      float m = smoothstep(h + 0.004, h - 0.004, uv.y);
      vec3 dune = ink * (0.85 - fi * 0.22);
      float rim = smoothstep(h - 0.055, h, uv.y);
      float sparkle = 0.6 + 0.4 * fbm(vec2(uv.x * 14.0 + t * 2.0, fi * 3.1));
      dune += (amber * 0.55 + rose * 0.18) * rim * sparkle
        * (0.30 + 0.70 * uProgress) * (1.0 + 0.6 * uEnergy);
      col = mix(col, dune, m);
    }

    /* fine shimmer + lens vignette */
    col += (hash(uv * vec2(917.0, 533.0) + fract(t) * 7.0) - 0.5) * 0.016;
    float vig = smoothstep(1.25, 0.45, length(uv - vec2(0.5, 0.45)));
    col *= mix(0.80, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function DuskPlane() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uEnergy: { value: 0 },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
      }),
    []
  );
  const ref = useRef(material);

  useFrame((state, dt) => {
    const u = ref.current.uniforms;
    const k = Math.min(1, dt * 5);
    u.uTime.value = state.clock.elapsedTime;
    u.uProgress.value += (field.duskProgress - (u.uProgress.value as number)) * k;
    u.uEnergy.value += (field.energy - (u.uEnergy.value as number)) * k;
    const p = u.uPointer.value as THREE.Vector2;
    p.x += (field.pointerX - p.x) * k;
    p.y += (field.pointerY - p.y) * k;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function DuskField() {
  return (
    <div
      className="pointer-events-none absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full"
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <DuskPlane />
      </Canvas>
    </div>
  );
}

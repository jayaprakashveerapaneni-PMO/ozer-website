"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { field } from "@/lib/motion/field";

// WebGL liquid-light field behind the hero's silk dunes — a living material,
// not a looping texture. One fullscreen quad + fbm fragment shader. It reads
// the shared field state each frame: scroll depth raises the light horizon
// (the glow climbs as the hero hands off to the page), the cursor carries a
// soft halo through the silk, and scroll velocity excites the shimmer.
// The upper canvas stays pure ivory at rest so headline AA contrast is
// untouched. Colors are the design tokens in linear-ish RGB.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;   /* hero exit progress 0..1 */
  uniform vec2 uPointer;   /* viewport uv, y up */
  uniform float uEnergy;   /* smoothed |scroll velocity| 0..1 */
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
    float t = uTime * 0.06;

    /* silk: domain-warped fbm stretched horizontally like wind-drawn dunes */
    vec2 q = vec2(uv.x * 3.0, uv.y * 4.5);
    float warp = fbm(q + vec2(t * 0.8, -t * 0.3));
    float silk = fbm(q + 1.6 * vec2(warp) + vec2(t, 0.0));

    /* scroll raises the light: horizon climbs as the hero hands off */
    float horizon = mix(0.50, 0.95, smoothstep(0.0, 1.0, uScroll));
    float glow = smoothstep(horizon, horizon - 0.45, uv.y);

    vec3 ivory = vec3(0.957, 0.937, 0.906);  /* --background */
    vec3 amber = vec3(1.00, 0.62, 0.18);
    vec3 ember = vec3(0.95, 0.47, 0.05);
    vec3 rose  = vec3(0.99, 0.55, 0.50);

    vec3 col = mix(ivory, amber, glow * 0.9);
    col += ember * silk * glow * (0.22 + 0.25 * uScroll + 0.18 * uEnergy);
    /* dusk approaches with depth: a rose kiss folded into the silk */
    col = mix(col, rose, glow * uScroll * 0.25 * silk);

    /* sun bloom band riding just under the horizon */
    float bloom = exp(-pow((uv.y - (horizon - 0.32)) * 4.2, 2.0));
    col += ember * bloom * (0.35 + 0.2 * uScroll);

    /* cursor halo — light follows the hand through the silk */
    vec2 asp = vec2(1.6, 1.0);
    float d = distance(uv * asp, uPointer * asp);
    col += vec3(1.0, 0.75, 0.45) * exp(-d * d * 9.0) * 0.10 * (0.4 + glow);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function GradientPlane() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
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
    u.uScroll.value += (field.heroScroll - (u.uScroll.value as number)) * k;
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

export default function LiquidGradient() {
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
        <GradientPlane />
      </Canvas>
    </div>
  );
}

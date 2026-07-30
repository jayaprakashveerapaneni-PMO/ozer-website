"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// WebGL liquid-light field behind the hero's silk dunes: ivory canvas melting
// into a drifting amber glow. A single fullscreen quad + fragment shader —
// no drei, no scene graph. Colors are the design tokens in linear-ish RGB:
// top = --background #f4efe7; ambers sit in the dune family. The glow starts
// BELOW the text zone (upper ~55% stays pure background) so AA contrast on
// the headline/subcopy is untouched.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
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

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.08;

    float n = noise(uv * 4.0 + vec2(t, 0.0));
    uv.y += sin(uv.x * 5.0 + t * 4.0) * 0.03;

    vec3 top = vec3(0.957, 0.937, 0.906);      /* --background ivory */
    vec3 amber = vec3(1.00, 0.62, 0.18);
    vec3 ember = vec3(0.95, 0.47, 0.05);

    /* Glow rises only through the dune zone (uv.y 0 = bottom). */
    float glow = smoothstep(.52, .08, uv.y);
    vec3 col = mix(top, amber, glow);
    col += ember * (0.20 * n * glow);

    float bloom = exp(-pow((uv.y - .20) * 4.5, 2.0));
    col += ember * bloom * 0.40;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function GradientPlane() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: VERT,
        fragmentShader: FRAG,
      }),
    []
  );
  const ref = useRef(material);

  useFrame((state) => {
    ref.current.uniforms.uTime.value = state.clock.elapsedTime;
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
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <GradientPlane />
      </Canvas>
    </div>
  );
}

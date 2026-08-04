"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { field } from "@/lib/motion/field";
import { HERO_VERT, HERO_FRAG } from "@/lib/motion/shaders/heroField";

// The hero's nocturne field — gold silk ribbons over a reflecting pool,
// dawning into ivory as the hero exits. One fullscreen quad; all the art is
// in lib/motion/shaders/heroField.ts. Uniforms are eased toward the shared
// field state each frame so scroll and cursor feel like weight, not snapping.

function FieldPlane() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uEnergy: { value: 0 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uAspect: { value: 1.6 },
        },
        vertexShader: HERO_VERT,
        fragmentShader: HERO_FRAG,
      }),
    []
  );
  const ref = useRef(material);
  const { size } = useThree();

  useFrame((state, dt) => {
    const u = ref.current.uniforms;
    const k = Math.min(1, dt * 5);
    u.uTime.value = state.clock.elapsedTime;
    u.uAspect.value = Math.max(0.6, size.width / Math.max(1, size.height));
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

export default function HeroField() {
  return (
    <div
      className="pointer-events-none absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full"
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <FieldPlane />
      </Canvas>
    </div>
  );
}

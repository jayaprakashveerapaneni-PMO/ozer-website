// Shared gate for the WebGL layers: the three.js chunk loads only where it
// earns its keep — desktop pointers, motion allowed, real users, GL present.

import { cinemaEnabled } from "@/lib/motion/cinema";

export function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** True when a WebGL scene should mount: cinema on, ≥768px, GL present. */
export function glSceneEnabled(): boolean {
  return (
    cinemaEnabled() &&
    window.matchMedia("(min-width: 768px)").matches &&
    webglAvailable()
  );
}

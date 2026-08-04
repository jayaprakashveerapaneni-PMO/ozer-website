// Shared light-field state — the bridge between the scroll/pointer director
// (HomeCinema writes) and the WebGL shaders (useFrame reads). A plain mutable
// object, deliberately outside React: values change every frame and must
// never cause re-renders. All values are normalized 0..1 viewport space.

export interface FieldState {
  /** Hero scroll depth: 0 at page top → 1 when the hero has scrolled away. */
  heroScroll: number;
  /** Full-page scroll progress 0..1. */
  pageScroll: number;
  /** Pointer in viewport UV (x right, y UP — GL convention). */
  pointerX: number;
  pointerY: number;
  /** Smoothed |scroll velocity| 0..1 — shaders use it as excitement. */
  energy: number;
  /** Dusk act pin progress 0..1 — drives the shader's rising sun. */
  duskProgress: number;
}

export const field: FieldState = {
  heroScroll: 0,
  pageScroll: 0,
  pointerX: 0.5,
  pointerY: 0.5,
  energy: 0,
  duskProgress: 0,
};

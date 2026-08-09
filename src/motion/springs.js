/* ============================================================
   springs.js — The site's entire motion vocabulary.
   Apple's damping + response, mapped onto Framer Motion's
   bounce + duration. Components import from here; no component
   defines its own ease or spring. See DESIGN.md §2.3.
   ============================================================ */

/* Apple ships damping 1.0 for repositioning, 0.8 for drawers and for
   anything released with momentum. bounce ≈ 1 − damping. */
export const spring = {
  /* damping 1.0, response 0.4 — critically damped. The default. */
  move: { type: 'spring', bounce: 0, duration: 0.4 },

  /* damping 0.8, response 0.3 — drawers and sheets, dragged only. */
  sheet: { type: 'spring', bounce: 0.2, duration: 0.3 },

  /* damping 0.8, response 0.4 — release after a gesture that carried
     momentum. Bounce is earned by a flick, never by a click. */
  flick: { type: 'spring', bounce: 0.2, duration: 0.4 },
};

/* Non-interruptible, discrete transitions. Three durations, three eases —
   the same values tokens.css exposes to CSS. */
export const duration = {
  press: 0.1,
  state: 0.18,
  chrome: 0.32,
};

export const ease = {
  out: [0.22, 1, 0.36, 1],
  in: [0.64, 0, 0.78, 0], // exact inverse of `out`, for mirrored exits
  both: [0.76, 0, 0.24, 1], // symmetric, for the page curtain
};

/* Reduced motion means a gentler equivalent, not nothing (§14). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Apple's momentum projection from Designing Fluid Interfaces.
   Not the v²/(2·decel) textbook form — the exponential decay one. */
export const project = (velocity, decelerationRate = 0.998) =>
  (velocity / 1000) * decelerationRate / (1 - decelerationRate);

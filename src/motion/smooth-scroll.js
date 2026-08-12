import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   smooth-scroll.js — Lenis, driven from GSAP's ticker.

   One rAF loop for the whole site. If Lenis ran its own loop
   the scroll position and the ScrollTriggers reading it would
   be a frame apart, and every scrubbed animation would jitter.

   This smooths the native scroll. It does not replace it: the
   wheel still moves the page the distance the OS says it should,
   the scrollbar still works, and the keyboard still works.
   No scroll-jacking.
   ============================================================ */

let lenis = null;
let tick = null;
let refCount = 0;

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function startSmoothScroll() {
  refCount += 1;
  if (lenis) return lenis;

  /* Reduced motion means the browser's own instant scroll. Lenis
     interpolates every scroll, which is exactly the vestibular
     motion the preference is asking us to stop. */
  if (prefersReduced()) return null;

  lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);

  tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  /* GSAP normally clamps a long frame to keep animations in sync
     after a stall. That correction fights a scroll position that
     is already authoritative. */
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function stopSmoothScroll() {
  refCount = Math.max(0, refCount - 1);
  if (refCount > 0 || !lenis) return;

  if (tick) gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  tick = null;
}

export function getLenis() {
  return lenis;
}

/* Anchor jumps have to go through Lenis, or the native scroll and
   the interpolated one fight and the page lands twice. */
export function scrollToTarget(target, { immediate = false, offset = 0 } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, offset });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  else window.scrollTo(0, 0);
}

/* The preloader holds the page still while it plays; releasing it
   is a separate concern from creating the instance. */
export function lockScroll() {
  lenis?.stop();
  document.documentElement.classList.add('is-locked');
}

export function unlockScroll() {
  lenis?.start();
  document.documentElement.classList.remove('is-locked');
}

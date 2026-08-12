import { useEffect, useRef } from 'react';

const HOVER_SELECTOR = [
  'a', 'button', 'input',
  '.skill-card', '.reveal-row', '.video-card', '.contact-link',
  '.btn-primary', '.btn-ghost',
  '.nav-brand', '.nav-btn', '.nav-menu-link',
  '.about-avatar-wrap', '.exp-item',
  '.tag', '.chip',
  '.design-track', '.design-arrow', '.design-dot',
].join(', ');

export default function Cursor() {
  const dotRef = useRef(null);
  const auraRef = useRef(null);

  useEffect(() => {
    /* Touch pointers have no cursor to replace. Skip the whole loop —
       cursor.css hides the nodes, this stops the work behind them. */
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let pointerX = 0;
    let pointerY = 0;
    let auraX = 0;
    let auraY = 0;
    let hasMoved = false;
    let frameId;

    /* ── Which chapter is under the pointer ──
       Same rule as the nav: chapters overlap in the sticky stack,
       so the visible one is the highest z-index crossing the line,
       not the first in the DOM. Probed at the CURSOR's y, not the
       nav's, because that is the ground it actually sits on. */
    let lastProbeY = NaN;
    let lastScrollY = NaN;
    let lastTheme = '';

    const probeTheme = () => {
      /* Reading layout for every panel is not free, so only re-probe
         when the pointer or the page has actually moved. */
      const scrollY = window.scrollY;
      if (Math.abs(pointerY - lastProbeY) < 4 && scrollY === lastScrollY) return;
      lastProbeY = pointerY;
      lastScrollY = scrollY;

      let winner = null;
      let winnerZ = -Infinity;
      document.querySelectorAll('[data-theme-section]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top > pointerY || rect.bottom < pointerY) return;
        const z = parseInt(window.getComputedStyle(el).zIndex, 10) || 0;
        if (z >= winnerZ) {
          winnerZ = z;
          winner = el;
        }
      });

      const theme = winner?.dataset.themeSection || 'dark';
      if (theme !== lastTheme) {
        lastTheme = theme;
        document.body.dataset.cursorOver = theme;
      }
    };

    const handlePointerMove = (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!hasMoved) {
        // Start the aura on the pointer so it doesn't fly in from 0,0.
        auraX = pointerX;
        auraY = pointerY;
        hasMoved = true;
      }
    };

    const tick = () => {
      const dot = dotRef.current;
      const aura = auraRef.current;
      if (dot && aura) {
        /* Direct write, no transition — the transform IS the position.
           translate3d keeps both on the compositor (§11). */
        dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;

        // The aura trails with a continuous follow; it never re-targets,
        // so a lerp is honest here where a CSS transition would not be.
        auraX += (pointerX - auraX) * 0.14;
        auraY += (pointerY - auraY) * 0.14;
        aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
      }
      probeTheme();
      frameId = requestAnimationFrame(tick);
    };

    const handlePointerOver = (e) => {
      if (e.target.closest(HOVER_SELECTOR)) document.body.classList.add('cursor-hover');
    };

    const handlePointerOut = (e) => {
      if (e.target.closest(HOVER_SELECTOR)) document.body.classList.remove('cursor-hover');
    };

    // Press feedback fires on pointer-down, not on release (§1).
    const handlePointerDown = () => document.body.classList.add('cursor-press');
    const handlePointerUp = () => document.body.classList.remove('cursor-press');

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
    frameId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
      cancelAnimationFrame(frameId);
      document.body.classList.remove('cursor-hover', 'cursor-press');
      delete document.body.dataset.cursorOver;
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} aria-hidden="true"><i /></div>
      <div id="cursor-aura" ref={auraRef} aria-hidden="true"><i /></div>
    </>
  );
}

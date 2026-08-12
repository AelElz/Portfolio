import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   Panel + PanelStack — the alternating chapter stack.

   Panel renders one chapter. PanelStack owns everything that
   has to be measured: the z-index ladder, the sticky offsets,
   and the shade that dims a panel as the next one covers it.
   ============================================================ */

export function Panel({
  theme = 'dark',
  id,
  className = '',
  innerClassName = '',
  wide = false,
  grain,
  panelRef,
  children,
}) {
  /* Grain is a black-chapter texture. On white it reads as dirt,
     so it defaults to on for dark and off for light. */
  const showGrain = grain ?? theme === 'dark';

  return (
    <section
      id={id}
      ref={panelRef}
      data-theme-section={theme}
      className={`panel panel--${theme}${showGrain ? ' grain' : ''} ${className}`.trim()}
    >
      <div
        className={`panel__inner${wide ? ' panel__inner--wide' : ''} ${innerClassName}`.trim()}
      >
        {children}
      </div>
      <div className="panel__shade" aria-hidden="true" />
    </section>
  );
}

export function PanelStack({ children, className = '' }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    /* Direct children only. A panel nested inside another panel
       is not part of this ladder. */
    const sections = Array.from(root.children).filter((el) =>
      el.hasAttribute('data-theme-section')
    );
    if (!sections.length) return;

    /* The ladder. Later panels sit above earlier ones, which is
       what lets them slide over instead of under. Panels claim
       1–99; everything above that is reserved in tokens.css. */
    sections.forEach((el, i) => {
      el.style.zIndex = String(i + 1);
    });

    const stickyPanels = sections.filter((el) => el.classList.contains('panel'));

    const stackApplies = () =>
      window.matchMedia('(min-width: 681px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Deliberately NOT inside the matchMedia block. ScrollTrigger
       re-runs its refreshInit listeners on every resize, and that
       can land after matchMedia has already torn the stack down —
       which would re-apply a sticky offset to a panel that is now
       position:relative. On a relative element an inline `top`
       is a real offset: it shifts the panel and tears visible
       holes between chapters. So the breakpoint is re-checked here,
       every time, and clearing is part of the same function that
       sets. No ordering between the two systems can leave a stale
       offset behind. */
    const layout = () => {
      const desktop = stackApplies();
      const vh = window.innerHeight;

      stickyPanels.forEach((el) => {
        if (!desktop) {
          el.classList.remove('panel--sticky');
          el.style.top = '';
          return;
        }
        el.classList.add('panel--sticky');
        /* Measure the CONTENT box, not the panel. A panel shorter
           than its own min-height would otherwise pin against its
           empty padding. */
        const inner = el.querySelector('.panel__inner');
        const contentH = inner ? inner.offsetHeight : el.offsetHeight;
        /* A panel taller than the viewport pins at its BOTTOM — a
           negative top. With top:0 it sticks the moment it arrives
           and everything below the fold is unreachable. */
        el.style.top = `${Math.min(0, Math.round(vh - contentH))}px`;
      });
    };

    layout();
    ScrollTrigger.addEventListener('refreshInit', layout);
    window.addEventListener('resize', layout);

    /* A second, independent signal for the same reconciliation.
       Crossing the breakpoint is the one moment this MUST run, and
       resize events can be coalesced, throttled, or (in some
       automated viewports) never delivered at all. A media query
       change fires on the crossing itself. */
    const breakpoint = window.matchMedia('(min-width: 681px)');
    const motionPref = window.matchMedia('(prefers-reduced-motion: reduce)');
    breakpoint.addEventListener('change', layout);
    motionPref.addEventListener('change', layout);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 681px) and (prefers-reduced-motion: no-preference)', () => {
        /* Each panel dims as the NEXT one climbs over it: shade 0
           when the next panel's top is at the viewport bottom, 0.45
           when it reaches the top and the cover is complete. */
        sections.forEach((el, i) => {
          const next = sections[i + 1];
          const shade = el.querySelector('.panel__shade');
          if (!next || !shade) return;

          gsap.fromTo(
            shade,
            { opacity: 0 },
            {
              opacity: 0.45,
              ease: 'none',
              scrollTrigger: {
                trigger: next,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        return () => {
          sections.forEach((el) => {
            const shade = el.querySelector('.panel__shade');
            if (shade) shade.style.opacity = '';
          });
        };
      });

      return () => mm.revert();
    }, root);

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', layout);
      window.removeEventListener('resize', layout);
      breakpoint.removeEventListener('change', layout);
      motionPref.removeEventListener('change', layout);
      ctx.revert();
      sections.forEach((el) => {
        el.style.zIndex = '';
        el.style.top = '';
        el.classList.remove('panel--sticky');
      });
    };
  }, []);

  return (
    <div ref={rootRef} className={`panel-stack ${className}`.trim()}>
      {children}
    </div>
  );
}

export default Panel;

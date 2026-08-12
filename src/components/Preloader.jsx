import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { lockScroll, unlockScroll } from '../motion/smooth-scroll';

/* ============================================================
   Preloader — the intro, once per session.

   A portfolio gets opened three times by the same recruiter, so
   this is sessionStorage-gated: the first visit plays it, every
   refresh and in-session return skips straight to content.

   Typographic, not a logo animation: the Beyondex artwork
   belongs to the agency site, so the wordmark here is the name
   itself and the mark is five circles drawn in CSS.
   ============================================================ */

const SEEN_KEY = 'intro-seen';
const WORDMARK = 'Ayoub El Azhari';
const TAGLINE = 'Software Engineer · Creative Director';

export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    /* Private mode: play it. Annoying once beats broken. */
    return true;
  }
}

export default function Preloader({ onDone }) {
  const rootRef = useRef(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = gsap.utils.selector(root);
    lockScroll();

    const finish = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch { /* private mode — it just plays again next tab */ }
      unlockScroll();
      setGone(true);
      onDone?.();
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });

      /* Every .set() carries an explicit position parameter. Without
         one it lands at the timeline's CURRENT END, not at time 0 —
         initial clip states appended after the wipes snap the
         wordmark back to its first state for the rest of the intro. */
      tl.set(root, { autoAlpha: 1 }, 0);
      tl.set(q('.pl-layer--a'), { clipPath: 'inset(0 0 0 0%)' }, 0);
      tl.set(q('.pl-layer--b'), { clipPath: 'inset(0 0 0 0%)' }, 0);
      tl.set(q('.pl-mark i'), { scale: 0.2, opacity: 0 }, 0);
      tl.set(q('.pl-lockup'), { y: 52, opacity: 0, '--g1': '0px', '--g2': '0px', '--gb': 1 }, 0);
      tl.set(q('.pl-tag span'), { opacity: 0, y: 14, scale: 0.7 }, 0);

      /* 0.0s — the mark scales in behind, circles staggered. */
      tl.to(
        q('.pl-mark i'),
        {
          scale: 1,
          opacity: 0.5,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.13,
        },
        0
      );

      /* 0.6s — the wordmark rises and fades in. The glow ramps on
         the SAME curve and duration, so it arrives already lit
         rather than lighting up after it lands. */
      tl.to(
        q('.pl-lockup'),
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' },
        0.6
      );
      tl.to(
        q('.pl-lockup'),
        { '--g1': '9px', '--g2': '30px', '--gb': 1.14, duration: 0.8, ease: 'power4.out' },
        0.6
      );

      /* 1.0s / 1.28s — two quick left-to-right wipes through three
         stacked states: flush → inverted slab → the resolved
         lockup. Each outgoing layer clips away from its left edge. */
      tl.to(
        q('.pl-layer--a'),
        { clipPath: 'inset(0 0 0 100%)', duration: 0.34, ease: 'power2.inOut' },
        1.0
      );
      tl.to(
        q('.pl-lockup'),
        { '--g1': '14px', '--g2': '46px', '--gb': 1.24, duration: 0.34, ease: 'power2.inOut' },
        1.0
      );

      tl.to(
        q('.pl-layer--b'),
        { clipPath: 'inset(0 0 0 100%)', duration: 0.34, ease: 'power2.inOut' },
        1.28
      );
      tl.to(
        q('.pl-lockup'),
        { '--g1': '18px', '--g2': '58px', '--gb': 1.3, duration: 0.34, ease: 'power2.inOut' },
        1.28
      );

      /* 1.5s — the tagline pops in letter by letter. */
      tl.to(
        q('.pl-tag span'),
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: 0.034,
        },
        1.5
      );

      /* Glow settles before the exit, so the rack-focus starts from
         a clean plate rather than smearing a lit edge. */
      tl.to(
        q('.pl-lockup'),
        { '--g1': '0px', '--g2': '0px', '--gb': 1, duration: 0.5, ease: 'power2.out' },
        2.0
      );

      /* ── 2.4s: the glass rack-focus exit ──
         The panel thins and its backdrop blur ramps up, so the page
         is suddenly visible THROUGH it but out of focus; the lockup
         drifts forward and blurs away; then the blur runs back to
         zero and the page racks into focus as the glass dissolves.

         The scale is on .pl-stage, never on .preloader — a
         transformed element resamples its own backdrop every frame
         and the blur crawls. */
      tl.to(
        root,
        { '--pl-tint': 0.52, '--pl-blur': '34px', duration: 0.55, ease: 'power2.inOut' },
        2.4
      );
      tl.to(
        q('.pl-stage'),
        { scale: 1.5, filter: 'blur(16px)', opacity: 0, duration: 0.9, ease: 'power2.in' },
        2.4
      );
      tl.to(
        root,
        { '--pl-blur': '0px', '--pl-tint': 0, autoAlpha: 0, duration: 0.75, ease: 'power2.inOut' },
        2.95
      );
    }, root);

    /* GSAP runs on rAF, which is paused in a background tab. Without
       a wall-clock fallback the site sits behind the preloader
       forever for anyone who opens it in a new tab and comes back. */
    const failsafe = setTimeout(() => {
      const tl = gsap.getTweensOf(rootRef.current)[0]?.timeline;
      if (tl && tl.progress() < 1) tl.progress(1);
      else finish();
    }, 9000);

    return () => {
      clearTimeout(failsafe);
      ctx.revert();
      unlockScroll();
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div className="preloader" ref={rootRef} role="presentation" aria-hidden="true">
      <div className="pl-stage">
        <div className="pl-mark">
          <i /><i /><i /><i /><i />
        </div>

        <div className="pl-lockup">
          {/* Three stacked states; the top two wipe away in turn. */}
          <span className="pl-layer pl-layer--c">{WORDMARK}</span>
          <span className="pl-layer pl-layer--b">{WORDMARK}</span>
          <span className="pl-layer pl-layer--a">{WORDMARK}</span>
        </div>

        <p className="pl-tag">
          {TAGLINE.split('').map((ch, i) => (
            <span key={i}>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </p>
      </div>
    </div>
  );
}

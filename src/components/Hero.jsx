import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   Hero — a tall chapter with a pinned scene, scrubbed.

   The chapter is ~380svh so scroll progress has somewhere to
   run; the scene inside is one viewport and sticks. Progress
   0→1 drives the scene, not a timeline of its own, so the
   motion is always exactly where the user's scroll put it.

   Video-scrub-ready: if /assets/hero.mp4 exists it drives
   video.currentTime from the same progress. Until then the
   fallback is a generative canvas built from the five-circle
   mark, which is the site's own artwork rather than the
   agency's.
   ============================================================ */

const VIDEO_SRC = '/assets/hero.mp4';

export default function Hero() {
  const chapterRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const chapter = chapterRef.current;
    const canvas = canvasRef.current;
    if (!chapter || !canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx2d = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let dpr = 1;

    /* Scroll writes the target; the loop chases it. The damping is
       what keeps a trackpad flick from snapping the scene. */
    let target = 0;
    let current = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerLerpX = 0;
    let pointerLerpY = 0;
    let raf = 0;
    let usingVideo = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ── The generative scene ──
       The site's own mark — the annulus from iconlogo2 — opening
       outward through concentric rings. Progress grows the ring,
       thins its stroke and expands the field around it. Nothing
       here is imported artwork. */
    const draw = (p) => {
      ctx2d.clearRect(0, 0, width, height);

      const cx = width / 2 + pointerLerpX * 26;
      const cy = height / 2 + pointerLerpY * 18;
      const unit = Math.min(width, height);

      ctx2d.save();
      ctx2d.translate(cx, cy);

      // The field: rings expanding outward as the chapter runs.
      for (let i = 0; i < 5; i += 1) {
        const r = unit * (0.2 + i * 0.13) * (1 + p * 0.62);
        ctx2d.beginPath();
        ctx2d.arc(0, 0, r, 0, Math.PI * 2);
        ctx2d.strokeStyle = `rgba(180, 185, 193, ${Math.max(0, 0.16 - i * 0.03 + p * 0.05)})`;
        ctx2d.lineWidth = 1;
        ctx2d.stroke();
      }

      // The mark itself: a thick annulus that opens as you scroll.
      const markR = unit * 0.115 * (1 + p * 0.85);
      const thickness = unit * 0.058 * (1 - p * 0.55);
      ctx2d.beginPath();
      ctx2d.arc(0, 0, markR, 0, Math.PI * 2);
      ctx2d.strokeStyle = `rgba(250, 250, 251, ${0.3 + p * 0.22})`;
      ctx2d.lineWidth = thickness;
      ctx2d.stroke();

      ctx2d.restore();
    };

    const loop = () => {
      current += (target - current) * 0.075;
      pointerLerpX += (pointerX - pointerLerpX) * 0.06;
      pointerLerpY += (pointerY - pointerLerpY) * 0.06;

      if (usingVideo) {
        const video = videoRef.current;
        if (video && video.duration) {
          video.currentTime = Math.min(video.duration - 0.01, current * video.duration);
        }
      } else {
        draw(current);
      }
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    resize();
    window.addEventListener('resize', resize);

    const gctx = gsap.context(() => {
      if (reduced) {
        /* No scrub, no loop: one static frame at rest. */
        draw(0);
        return;
      }

      ScrollTrigger.create({
        trigger: chapter,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          target = self.progress;
        },
        invalidateOnRefresh: true,
      });

      /* The copy recedes as the scene takes over — the same
         progress, so it can never drift out of sync with it. */
      gsap.to(chapter.querySelector('.hero-content'), {
        y: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: chapter,
          start: 'top top',
          end: '55% top',
          scrub: true,
        },
      });

      gsap.to(chapter.querySelector('.scroll-hint'), {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: chapter,
          start: 'top top',
          end: '14% top',
          scrub: true,
        },
      });

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }, chapter);

    /* Probe for the hero clip without downloading it. If it lands,
       the same progress drives currentTime instead of the canvas. */
    let cancelled = false;
    if (!reduced) {
      fetch(VIDEO_SRC, { method: 'HEAD' })
        .then((res) => {
          if (cancelled || !res.ok) return;
          usingVideo = true;
          canvas.style.display = 'none';
          const video = videoRef.current;
          if (video) {
            video.style.display = 'block';
            video.src = VIDEO_SRC;
          }
        })
        .catch(() => { /* no clip yet — the canvas is the design */ });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      gctx.revert();
    };
  }, []);

  return (
    <div
      className="chapter--hero"
      id="hero"
      data-theme-section="dark"
      ref={chapterRef}
    >
      {/* Grain belongs to the SCENE, not the chapter: the chapter is
          ~4 viewports tall and does not clip, so a layer inset by
          -50% of it both overflows the page horizontally and
          repaints several thousand pixels every frame. */}
      <div className="hero__scene grain">
        <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
        <video
          className="hero-video"
          ref={videoRef}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
        />

        <div className="hero-content container">
          <p className="eyebrow">Software Engineer · Creative Director</p>
          <h1 className="hero-title">
            Building systems.<br />
            <span className="hero-title-dim">Crafting experiences.</span>
          </h1>
          <p className="hero-sub">
            1337 coding school student from 42 network, low level systems, DevOps
            infrastructure, and 4+ years in creative direction.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#skills" className="btn-ghost">Explore Skills</a>
            <a href="#contact" className="btn-ghost">Get in touch</a>
          </div>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>

        <div className="panel__shade" aria-hidden="true" />
      </div>
    </div>
  );
}

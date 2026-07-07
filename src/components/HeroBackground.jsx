import { useEffect, useRef } from 'react';

/* ============================================================
   HeroBackground — generative golden flow field
   Fine gold threads drift along an evolving Perlin-noise field,
   swirling around the cursor, with floating embers on top.

   All visual parameters are proportional to the hero's size
   (scale factor S), so the artwork looks identical on a laptop,
   an ultrawide, or a phone — and a ResizeObserver keeps it in
   sync with any layout change, not just window resizes.
   ============================================================ */

const TAU = Math.PI * 2;

/* Classic improved Perlin noise (Ken Perlin, 2002) — 3D so the
   field can evolve smoothly over time. */
function createNoise() {
  const p = new Uint8Array(512);
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (hash, x, y, z) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x, y, z) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    const A = p[X] + Y;
    const AA = p[A] + Z;
    const AB = p[A + 1] + Z;
    const B = p[X + 1] + Y;
    const BA = p[B] + Z;
    const BB = p[B + 1] + Z;
    return lerp(
      lerp(
        lerp(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),
        lerp(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u),
        v
      ),
      lerp(
        lerp(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1), u),
        v
      ),
      w
    );
  };
}

/* Gold palette — [r, g, b, cumulative weight] */
const THREAD_COLORS = [
  [255, 233, 121, 0.45], // pure gold
  [255, 229, 190, 0.7],  // warm cream
  [255, 224, 102, 0.85], // bright highlight
  [184, 134, 11, 1],     // deep gold
];

function pickColor() {
  const r = Math.random();
  for (const [cr, cg, cb, w] of THREAD_COLORS) {
    if (r <= w) return [cr, cg, cb];
  }
  return THREAD_COLORS[0];
}

const NOISE_SCALE = 0.0014; // field zoom at S = 1 — lower = broader curves
const CURL = 2.4;           // how much the field twists
const TIME_DRIFT = 0.00012; // field evolution speed
const FADE_ALPHA = 0.05;    // trail persistence — lower = longer silk
const SWIRL_RADIUS = 200;   // cursor influence radius at S = 1
const REF_SIZE = 820;       // hero min-dimension the base values are tuned for

export default function HeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const noise = createNoise();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let S = 1; // visual scale — everything drawn is multiplied by this
    let raf = 0;
    let running = true;
    let inView = true;
    let last = performance.now();
    let time = Math.random() * 100;
    let resizeTimer = 0;

    const mouse = { x: -9999, y: -9999, strength: 0, target: 0 };
    let threads = [];
    let embers = [];

    /* Pre-rendered radial glow sprite for embers (cheaper than shadowBlur) */
    const glow = document.createElement('canvas');
    glow.width = glow.height = 64;
    const gctx = glow.getContext('2d');
    const grd = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255, 233, 121, 0.9)');
    grd.addColorStop(0.25, 'rgba(255, 224, 102, 0.35)');
    grd.addColorStop(1, 'rgba(255, 224, 102, 0)');
    gctx.fillStyle = grd;
    gctx.fillRect(0, 0, 64, 64);

    /* Base speed/width/size are unitless — multiplied by S when used,
       so threads keep their look at any screen size. */
    const spawnThread = (t, randomLife) => {
      t.x = Math.random() * width;
      t.y = Math.random() * height;
      t.px = t.x;
      t.py = t.y;
      t.maxLife = 240 + Math.random() * 320;
      t.life = randomLife ? Math.random() * t.maxLife : t.maxLife;
      t.speed = 0.5 + Math.random() * 0.9;
      t.width = 0.5 + Math.random() * 1.1;
      t.alpha = 0.05 + Math.random() * 0.08;
      const [r, g, b] = pickColor();
      t.r = r; t.g = g; t.b = b;
      return t;
    };

    const spawnEmber = (e) => {
      e.x = Math.random() * width;
      e.y = height * (0.3 + Math.random() * 0.75);
      e.size = 5 + Math.random() * 13;
      e.rise = 0.1 + Math.random() * 0.3;
      e.phase = Math.random() * TAU;
      e.twinkle = 0.5 + Math.random() * 1.2;
      e.seed = Math.random() * 100;
      return e;
    };

    const threadCount = () =>
      Math.max(80, Math.min(240, Math.round((width * height) / 9500)));

    const setBuffer = () => {
      /* Adaptive resolution: big screens get a lower pixel-ratio cap so
         the per-frame compositing cost stays flat while scrolling. */
      const dpr = Math.min(window.devicePixelRatio || 1, width * height > 2.6e6 ? 1.25 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const prevW = width;
      const prevH = height;
      width = rect.width;
      height = rect.height;
      S = Math.max(0.7, Math.min(2.4, Math.min(width, height) / REF_SIZE));
      setBuffer();

      if (!threads.length) {
        threads = Array.from({ length: threadCount() }, () => spawnThread({}, true));
        embers = Array.from({ length: Math.max(6, Math.round(threadCount() / 26)) }, () =>
          spawnEmber({})
        );
        return;
      }

      /* Remap existing particles into the new bounds instead of
         restarting, so resizing doesn't blank the artwork. */
      const sx = width / prevW;
      const sy = height / prevH;
      for (const t of threads) {
        t.x *= sx;
        t.y *= sy;
        t.px = t.x;
        t.py = t.y;
      }
      for (const e of embers) {
        e.x *= sx;
        e.y *= sy;
      }
      const target = threadCount();
      while (threads.length > target) threads.pop();
      while (threads.length < target) threads.push(spawnThread({}, true));
    };

    const queueResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    };

    const step = (dt) => {
      time += TIME_DRIFT * dt * 16.7;
      mouse.strength += (mouse.target - mouse.strength) * 0.06;

      const noiseScale = NOISE_SCALE / S;
      const swirlRadius = SWIRL_RADIUS * S;

      /* Fade existing trails toward transparent */
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0, 0, 0, ${FADE_ALPHA})`;
      ctx.fillRect(0, 0, width, height);

      /* Threads — additive so crossings glow */
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      for (const t of threads) {
        const angle = noise(t.x * noiseScale, t.y * noiseScale, time) * TAU * CURL;
        let vx = Math.cos(angle) * t.speed * S;
        let vy = Math.sin(angle) * t.speed * S;

        /* Cursor swirl — field bends into a vortex near the mouse */
        if (mouse.strength > 0.01) {
          const dx = t.x - mouse.x;
          const dy = t.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < swirlRadius && d > 0.001) {
            const f = (1 - d / swirlRadius) ** 2 * mouse.strength * S;
            vx += ((-dy / d) * 1.6 + (dx / d) * 0.35) * f;
            vy += ((dx / d) * 1.6 + (dy / d) * 0.35) * f;
          }
        }

        t.px = t.x;
        t.py = t.y;
        t.x += vx * dt;
        t.y += vy * dt;
        t.life -= dt;

        const margin = 24 * S;
        if (t.life <= 0 || t.x < -margin || t.x > width + margin || t.y < -margin || t.y > height + margin) {
          spawnThread(t, false);
          continue;
        }

        /* Fade in and out over the thread's life */
        const phase = 1 - t.life / t.maxLife;
        const envelope = Math.sin(Math.min(Math.max(phase, 0), 1) * Math.PI);
        ctx.strokeStyle = `rgba(${t.r}, ${t.g}, ${t.b}, ${t.alpha * envelope})`;
        ctx.lineWidth = t.width * S;
        ctx.beginPath();
        ctx.moveTo(t.px, t.py);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      }

      /* Embers — slow rising sparks with twinkle */
      for (const e of embers) {
        e.phase += 0.02 * e.twinkle * dt;
        e.y -= e.rise * S * dt;
        e.x += noise(e.seed, e.y * 0.002, time) * 0.6 * S * dt;
        if (e.y < -20 * S) spawnEmber(e), (e.y = height + 10);
        const a = 0.28 + Math.sin(e.phase) * 0.22;
        const size = e.size * S;
        ctx.globalAlpha = Math.max(a, 0);
        ctx.drawImage(glow, e.x - size / 2, e.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const frame = (now) => {
      if (!running) return;
      const dt = Math.min((now - last) / 16.7, 2);
      last = now;
      if (inView) step(dt);
      raf = requestAnimationFrame(frame);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.target = mouse.y >= 0 && mouse.y <= rect.height ? 1 : 0;
    };
    const onMouseLeave = () => (mouse.target = 0);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        last = performance.now();
      },
      { threshold: 0 }
    );

    /* Track the hero element's real size — catches every layout change
       (zoom, font load, orientation, split view), not just window resize. */
    const ro = new ResizeObserver(queueResize);

    resize();
    io.observe(canvas);
    ro.observe(canvas);

    if (reduceMotion) {
      /* No animation — develop the field once into a static artwork */
      for (let i = 0; i < 260; i++) step(1);
    } else {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onMouseLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}

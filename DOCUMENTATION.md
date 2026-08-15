# Ayoub Elazhari — Portfolio

Technical documentation for `ayoubelazhariportfolio.vercel.app`.

This is the **current** source of truth. `DESIGN.md` describes an earlier
monochrome design system with a light/dark toggle that no longer exists in the
code — keep it as history, don't build against it.

---

## 1. Run it

```bash
npm install     # once
npm run dev     # http://localhost:5173
npm run build   # production bundle into dist/
npm run preview # serve dist/ locally to check the real build
```

There is no test suite, no linter config, and no environment variables. The site
is fully static — it talks to no backend of its own.

---

## 2. Stack

| Piece | Version | What it does here | Why this and not something else |
|---|---|---|---|
| **React** | 18 | Component model, the whole UI | Already the ecosystem default; hooks give a clean place to set up and tear down animation |
| **Vite** | 6 | Dev server + bundler | Instant startup, native ES modules, no config needed for this size |
| **react-router-dom** | 7 | 5 client-side routes | The site is an SPA; no server rendering needed for a portfolio |
| **GSAP + ScrollTrigger** | 3.15 | All scroll-driven motion | ScrollTrigger is the only mature tool for "map scroll position onto animation progress" |
| **Lenis** | 1.3 | Smooth scrolling | Small, and it *smooths* the native scroll instead of replacing it |
| **framer-motion** | 11 | Route transitions, reveal-on-scroll, menus | Declarative for discrete UI state; GSAP handles the continuous scroll stuff |
| **@vercel/analytics** | 2 | Page view counts | One component, zero config on Vercel |
| **Plain CSS** | — | Everything visual | See §4 |

**No Tailwind, no CSS-in-JS, no UI library, no webfont.**

### Why two animation libraries

They do different jobs and the split is deliberate:

- **GSAP/ScrollTrigger** owns anything driven by *scroll position* — the hero
  scrub, the panel zoom, the shade dimming. These need a scrub, which means
  reading scroll and writing a progress value every frame.
- **framer-motion** owns anything driven by *state* — a route changed, a menu
  opened, an element entered the viewport. Declarative `variants` are much nicer
  for that than imperative timelines.

Mixing them is fine because they never animate the same property on the same
element.

### Why no webfont

The site uses the system font stack:

```css
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
             "Helvetica Neue", "Segoe UI", Roboto, Inter, Arial, sans-serif;
```

Apple devices resolve real **SF Pro**, Windows gets **Segoe UI**, Android gets
**Roboto**. Every one of those is a professionally hinted face with optical
sizing and proper tracking tables, and it costs **0 bytes** and **0 layout
shift**. A self-hosted webfont would cost 100–300KB and a flash of unstyled
text to end up looking worse.

(Also: Apple does not license SF Pro for embedding on non-Apple sites, so
self-hosting it would not be legal anyway.)

---

## 3. Structure

```
src/
├── main.jsx              entry; imports all CSS in cascade order
├── App.jsx               routes, Lenis lifecycle, global anchor handling
│
├── pages/
│   ├── Home.jsx          the 6-chapter homepage
│   ├── CProjectsPage.jsx      ─┐
│   ├── DockerDevOpsPage.jsx    ├ deep dives, all built on DeepDivePage
│   ├── MotionDesignPage.jsx    │
│   └── VisualDesignPage.jsx   ─┘
│
├── components/
│   ├── Panel.jsx         ★ Panel + PanelStack — the core layout primitive
│   ├── Hero.jsx          tall scrub chapter + generative canvas
│   ├── Nav.jsx           chapter-adaptive glass pill
│   ├── Cursor.jsx        custom cursor that inverts per chapter
│   ├── Preloader.jsx     session-gated intro
│   ├── RevealRow.jsx     circular hover fill
│   ├── Reveal.jsx        scroll-reveal wrapper
│   ├── DeepDivePage.jsx  shared shell for the 4 sub-pages
│   └── ...
│
├── motion/
│   ├── smooth-scroll.js  Lenis singleton wired to GSAP's ticker
│   └── springs.js        shared easing/spring values
│
├── data/                 ★ all content lives here, as plain JS objects
└── css/                  one file per concern, cascade order set in main.jsx
```

### Routes

| Path | Page |
|---|---|
| `/` | Home — 6 chapters |
| `/projects/c-cpp` | C / C++ systems projects |
| `/projects/docker-devops` | Docker & DevOps |
| `/projects/motion-design` | Motion design reel |
| `/projects/visual-design` | UI/UX Projects |

### Content is data, not markup

To add a project, edit a file in `src/data/` — the pages render whatever is in
the array. You should almost never need to touch a component to add content.

| File | Feeds |
|---|---|
| `projects.js` | Home → Projects rows |
| `skills.js` | Home → Skills cards |
| `experience.js` | Home → Experience |
| `c-projects.js`, `docker-devops-projects.js` | the two engineering deep dives |
| `motion-design-videos.js` | video page |
| `visual-design.js` | UI/UX page (clients, shipped versions, carousel) |
| `chatbot-responses.js` | the bot's keyword → reply table |

---

## 4. The design system

### Palette — three colours

```css
--black:  #0B0B0D;   /* dark chapter grounds */
--white:  #FAFAFB;   /* light chapter grounds */
--silver: #B4B9C1;   /* secondary text, hairlines, hover fill */
```

Not pure `#000`/`#FFF`: at full contrast large flat grounds glare and the type
buzzes. These sit still.

Silver also has two derived forms, because pure silver is unreadable on white
and invisible on black:

```css
--silver-dark:  #17181C;   /* silver mixed into black — cards on dark  */
--silver-light: #E8EAEE;   /* silver mixed into white — cards on light */
--silver-ink:   #6E747E;   /* dark enough to read as text on white     */
```

### Semantic tokens — the important idea

Components **never name a colour**. They name a *role*:

```css
color: var(--ink);
border-color: var(--hair);
background: var(--raised);
```

Each panel redefines those roles for itself:

```css
.panel--dark  { --ink: var(--white); --ink-dim: var(--silver); ... }
.panel--light { --ink: var(--black); --ink-dim: var(--silver-ink); ... }
```

**This is why there is no dark-mode toggle.** The page has dark *chapters* and
light *chapters*, so you get both on every scroll. One card component works on
either ground with no conditional logic, because CSS custom properties resolve
in the context of the element using them, not where they were declared.

### Type — two weights, one fluid root

Only **400** and **600**. No 300, no 700, no italics.

The single most important rule in the whole stylesheet:

```css
html {
  font-size: clamp(100%, 0.96rem + 0.18vw, 1.25rem);
}
```

Every size, gap, radius and padding in the site is in `rem`, so all of it scales
from this one line: **~16px body on a phone, ~18px on a 13" laptop, ~20px on a
27"**. Without it the page is drawn at one size and just sits in more or less
empty space on bigger screens.

`rem` inside the root's own `font-size` resolves against the *user's* base size,
so someone who set their browser to large text still gets large text. A pure
`vw` root would ignore that preference — an accessibility failure.

Display type is the exception: it scales with `vw` because a headline's job is
to fill the composition, not to be read at a comfortable distance.

| Token | Value |
|---|---|
| `--ty-hero-size` | `clamp(2.5rem, 8.4vw, 8.6rem)` |
| `--ty-title-size` | `clamp(1.85rem, 3.9vw, 3.5rem)` |
| `--ty-body-size` | `1.0625rem` (rides the root) |
| `--container` | `clamp(20rem, 86vw, 100rem)` |

---

## 5. The chapter stack — the core of the site

Six full-screen sections alternate black and white. Each is `position: sticky`,
so the next one **slides over** the previous instead of pushing it away. The page
gains depth instead of length.

```
scroll ↓
┌─────────────┐
│ Hero (black)│ ← pinned, dimming under a shade overlay
├─────────────┤
│ About (white)  ← slides up over the hero, scales 0.86 → 1
├─────────────┤
│ Skills (black) ← slides over About…
```

`PanelStack` (in `Panel.jsx`) owns everything that must be measured:

1. **z-index ladder** — panel *n* gets `z-index: n`, so later chapters paint on top.
2. **Sticky offsets** — a panel taller than the viewport must pin at its *bottom*
   (`top: viewportH − contentH`, a negative number). With `top: 0` it sticks the
   instant it arrives and everything below the fold becomes unreachable.
3. **Shade** — each panel has a `.panel__shade` overlay scrubbed `0 → 0.45` as the
   next panel covers it, so the buried chapter reads as *behind* rather than gone.

### Measure the content box, not the panel

```js
const inner = el.querySelector('.panel__inner');
const contentH = inner ? inner.offsetHeight : el.offsetHeight;
el.style.top = `${Math.min(0, Math.round(vh - contentH))}px`;
```

A panel has `min-height: 100svh`, so a short chapter's *panel* is taller than its
*content*. Measuring the panel makes it pin against its own empty padding.

### Below 680px the stack turns off

Panels become `position: relative` and simply stack. The JS **must clear the
inline `top`** when it does — a leftover `top: -49px` on a relative element is a
real offset and tears visible holes between chapters. This is reconciled in one
function that both sets and clears, driven by three signals (`resize`,
ScrollTrigger's `refreshInit`, and a `matchMedia` change listener) so no ordering
between GSAP and the browser can leave a stale value behind.

---

## 6. Motion

### Smooth scroll

```js
const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

Lenis runs on **GSAP's ticker**, not its own `requestAnimationFrame`. One rAF
loop for the whole site — if Lenis ran its own, the scroll position and the
ScrollTriggers reading it would be a frame apart and every scrub would jitter.

This *smooths* the native scroll. The wheel still moves the page the distance the
OS says, the scrollbar works, the keyboard works. **No scroll-jacking.**

### The pieces

| Thing | How |
|---|---|
| **Preloader** | Session-gated via `sessionStorage`. Wordmark rises with a glow ramp on the same curve, tagline pops letter by letter, then a "glass rack-focus" exit — backdrop blur ramps up, the lockup drifts forward and blurs out, blur returns to 0 as the page racks into focus |
| **Hero** | A ~140svh chapter with a pinned 100svh scene. Scroll progress drives a generative canvas built from the site's ring mark. Video-ready: it probes `/assets/hero.mp4` and drives `currentTime` from the same progress if found |
| **Reveals** | `framer-motion` `whileInView` — short travel, ≤0.06s stagger, never gates content |
| **Hover rows** | A circle scales from the pointer's entry point; its diameter is `2 × hypot()` to the farthest corner, measured per enter |
| **Grain** | An SVG `feTurbulence` tile, `steps(1, end)` so it re-seeds each frame instead of sliding. Dark chapters only |

### Every animation has a reduced-motion fallback

Guards live in 16 files. Under `prefers-reduced-motion: reduce`: the preloader
never plays, Lenis never initialises, the sticky stack stays off, the hero draws
one static frame, and grain stops flickering.

---

## 7. The adaptive nav and cursor

Both read *which chapter is behind them* and invert.

```js
// Panels overlap in the sticky stack, so more than one can cross the
// probe line at once. The visible one is the HIGHEST z-index — taking
// the first DOM match picks the one underneath.
sections.forEach((el) => {
  const rect = el.getBoundingClientRect();
  if (rect.top > probeY || rect.bottom < probeY) return;
  const z = parseInt(getComputedStyle(el).zIndex, 10) || 0;
  if (z >= winnerZ) { winnerZ = z; winner = el; }
});
```

Measured: across 220 scroll samples, **102 had overlapping panels**, and a naive
first-match was wrong in **every one of them**. The highest-z probe was wrong in
zero.

The nav probes its own centre line; the cursor probes the pointer's own `y`,
because that is the ground it actually sits on.

---

## 8. Gotchas — things that actually bit, with the fix

These all looked completely fine in a screenshot.

| Problem | Cause | Fix |
|---|---|---|
| Site sat behind the preloader forever | GSAP runs on rAF, which browsers **pause in background tabs** | Wall-clock `setTimeout` failsafe that forces the timeline to completion after 9s |
| Logo snapped back to its first state mid-intro | `gsap.set()` with no position parameter lands at the timeline's **current end**, not at time 0 | Always pass an explicit position: `.set(el, {...}, 0)` |
| Backdrop blur crawled and shimmered | A transformed element **resamples its own backdrop every frame** | Never scale the element that owns `backdrop-filter` — put the scale on an inner wrapper |
| Grain swept a visible seam | A parent-sized layer drags its own edge into view when it translates | `inset: -50%`, not `0` |
| Grain slid like a texture | Interpolated easing | `steps(1, end)` re-seeds each frame — that's what reads as film grain |
| Horizontal scrollbar + huge repaints | Grain was on the multi-viewport-tall hero *chapter*, which doesn't clip | Move it to the 100svh pinned *scene* |
| Section headings looked permanently out of focus | Three fixed `backdrop-filter` edge layers sat over the top/bottom band of every chapter, and panel content is vertically centred | Removed entirely. Blurring the content you're trying to read is a defect, not a material |
| Hero eyebrow rendered *behind* the nav | Content was 778px in a 720px scene, centred, so it overflowed and collided with the fixed pill | Explicit nav clearance in `padding-block` + a `vh`-aware cap on the title (`min(var(--ty-hero-size), 16vh)`) |
| Holes between chapters at 375px | Panels went `relative` but kept their inline `top` | `layout()` re-checks the breakpoint and clears as part of the same function that sets |
| **4 of 8 images never loaded** | `loading="lazy"` measures against an element's **layout** position; every chapter pins at a negative offset, so the browser decided fully-visible images were far off-screen | Eager + `fetchPriority` for images; an `IntersectionObserver` (real intersection geometry) for the video embeds |
| Production build failed | `@vercel/analytics/next` imported in a Vite SPA — pulls in `next/navigation`, which doesn't exist | Use `@vercel/analytics/react` |

### Two rules that came out of all this

**Measure layout, not paint.** Use `offsetTop`/`offsetWidth`, not
`getBoundingClientRect()`, when aligning things. Reveal transforms and
scroll-driven zooms move the painted rectangle without moving the layout, so
rect-based measurements drift with scroll state.

**Verify by measuring, not by screenshotting.** Almost every bug above was
invisible in a static screenshot. The checks that caught them walked the entire
scroll asserting `document.elementFromPoint(cx, cy)` always landed inside a
panel — 2340 samples, 0 gaps.

### iOS Safari trap

`position: sticky` is **silently ignored** if *any* ancestor has
`overflow: hidden/clip/auto/scroll`. `html` and `body` therefore carry no
`overflow-x`. It fails with no error and looks perfect in a screenshot.

---

## 9. Responsive

Verified by measurement at each width:

| Device | Viewport | Root | Body | Container | Skill cols |
|---|---|---|---|---|---|
| iPhone | 390×844 | 16.1px | 17.1px | 328px (84%) | 1 |
| iPad | 820×1180 | 16.8px | 17.9px | 705px (88%) | 2 |
| 13" MacBook Air | 1470×860 | 18.0px | 19.1px | 1235px (85%) | 3 |
| 16" MacBook Pro | 1728×1000 | 18.5px | 19.6px | 1452px (85%) | 3 |
| 27" | 2560×1330 | 20.0px | 21.2px | 1997px (78%) | 3 |
| 32" 4K | 3840×2000 | 20.0px | 21.3px | 2000px (52%) | 3 |

Zero horizontal overflow and zero chapter gaps at every one.

**Known gap:** 320×568 (iPhone SE 1st gen) fails — hero content overflows its
scene. Everything from 390px up is clean.

> `rem` in a **media query** always resolves against 16px, never against the
> fluid root. That's what keeps breakpoints stable — otherwise scaling the root
> would move the breakpoints and the layout could oscillate.

---

## 10. Accessibility

- Every interactive element has a `:focus-visible` ring
- `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast` all honoured
- Custom cursor is an *enhancement* — it's disabled on `pointer: coarse` and every affordance it shows is also shown by the element itself
- Menus close on `Escape` and on outside press
- Nav active-state uses a centre-line band (`rootMargin: '-50% 0px -50% 0px'`), **not** `threshold: 0.5` — a chapter taller than the viewport never reaches 50% visible, so it would never fire

---

## 11. Deploy

Pushing to `main` on `github.com/AelElz/Portfolio` triggers Vercel. Build command
`npm run build`, output `dist/`.

The bundle is ~500KB raw / ~172KB gzipped. GSAP and framer-motion are most of
it. If that ever needs to come down, the first move is lazy-loading the four
deep-dive routes with `React.lazy` — they're the only place the diagrams and
carousel are used.

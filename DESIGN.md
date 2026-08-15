# Design Structure — Ayoub Elazhari Portfolio

> ## ⚠️ Historical — superseded by `DOCUMENTATION.md`
>
> This document describes the site's **first** design system: monochrome
> (white-on-black), with a light/dark theme toggle in the nav, fixed-px sizing,
> and no chapter stack.
>
> The site has since been rebuilt around a black / white / silver palette, an
> alternating sticky chapter stack, a fluid root font-size, and **no theme
> toggle** — the chapters themselves carry dark and light. Specific things below
> that are no longer true: the `--accent`/`--mat-*`/`--c-text-*` token names, the
> `:root[data-theme='light']` block, the theme-switching transition, and the
> fixed type scale.
>
> Kept because the *reasoning* is still good — the Apple design principles, the
> four-state interaction contract, the layer model and the accessibility rules
> all still hold and are still followed. Read it for the "why", not the "what".
>
> **For current tokens, architecture and conventions, see `DOCUMENTATION.md`.**

The design system for this site, specified against the **Apple Design** principles
(*Designing Fluid Interfaces*, WWDC 2018; *The Details of UI Typography*, WWDC 2020;
*Principles of Great Design*, WWDC 2026).

This is the contract. Anything in `src/css/` or `src/components/` that contradicts it is a
bug, not a variation. Section references like §4 point at the Apple skill.

---

## 0. What this site is, in design terms

A **scroll-driven document with one floating conversational surface.** There are no drags,
no swipes, no sheets today. That means:

| Apple principle | Applies here |
| --- | --- |
| §1 Response, §7 Spatial consistency, §11 Frames, §12 Materials, §14 A11y, §15 Type, §16 Foundations | **Now — everywhere.** These are the spine of this spec. |
| §2 Direct manipulation, §3 Interruptibility, §5 Velocity handoff, §6 Momentum, §9 Rubber-band, §10 Gestures | **Only on the two surfaces in §7 below** (chat sheet, mobile card rails). Do not invent drag interactions elsewhere to "use" them. |
| §13 Haptics/audio | **Out of scope.** Portfolio, not an app. Restraint (§16.1 Purpose) says skip it. |

The emotion this site commits to (§16.8 Delight): **quiet precision.** Gold on near-black,
nothing bouncing that wasn't thrown. Every rule below serves that.

---

## 1. Layer model

Six layers, tokenized. No new z-index values outside this table.

| Token | Value | Occupants | Material |
| --- | --- | --- | --- |
| `--z-base` | `0` | page background, hero orbits, `.skill-icon-bg` | opaque `--mat-base` |
| `--z-raised` | `1` | card text over its own decoration, `.hero-content` | opaque `--mat-raised` |
| `--z-chrome` | `100` | `nav` | translucent `--mat-chrome` |
| `--z-float` | `1000` | `#chatbot` trigger + panel | translucent `--mat-sheet` |
| `--z-transition` | `2000` | `.page-curtain` | opaque, briefly |
| `--z-pointer` | `9000` / `9001` | `#cursor-aura` / `#cursor-dot` | none |

**Rule (§12):** never stack one translucent surface on another. `nav` (chrome) and the chat
panel (sheet) must never overlap — if the chat panel ever grows to full height on mobile, it
becomes opaque at that breakpoint instead of blurring over the nav.

---

## 2. Token structure

`src/css/tokens.css` is the single source of truth and must actually be one — today the file
promises "edit this file to retheme the entire site" while **67 hardcoded
`rgba(255, 214, 10, …)` values** live in the other twelve files, and that color (`#FFD60A`)
is not in the token set at all. Reconcile onto one ramp.

Six token groups, in this order:

### 2.1 Color

```css
/* Brand ramp — one real gold, everything else derived */
--gold:          #FFD60A;   /* the color actually in use across the site */
--gold-bright:   #FFE066;   /* highlight / hover text */
--gold-warm:     #FFE5BE;   /* gradient tail */
--gold-deep:     #B8860B;   /* pressed / deep accent */

/* Alpha derivatives — semantic, not numeric. Replaces all 67 inline rgba()s. */
--tint-wash:     rgba(255, 214, 10, 0.08);  /* hover fill */
--tint-hairline: rgba(255, 214, 10, 0.20);  /* borders, badge outlines */
--tint-edge:     rgba(255, 214, 10, 0.40);  /* active borders, cursor aura */
--tint-glow:     rgba(255, 214, 10, 0.50);  /* box-shadow bloom */

/* Text — three steps, no more */
--c-text-1: #F5F5F7;   /* primary */
--c-text-2: #A6A6A1;   /* secondary body */
--c-text-3: #7A7556;   /* captions, metadata */
```

Language dots (`.lang-c`, `.lang-cpp`, `.lang-docker`, `.lang-bash`) stay literal hex —
they encode external identity, not brand, and are correctly exempt.

### 2.2 Material (§12)

Today `--c-bg`, `--c-surface`, and `--c-surface-2` are **all `#171717`** — three names, one
value, so depth has no vocabulary. Give each a real step:

```css
--mat-base:    #171717;                    /* page */
--mat-raised:  #1C1C1C;                    /* cards, sits above base */
--mat-chrome:  rgba(23, 23, 23, 0.72);     /* nav — content scrolls under */
--mat-sheet:   rgba(28, 28, 28, 0.78);     /* chat panel */
--blur-chrome: blur(20px) saturate(180%);
--blur-sheet:  blur(24px) saturate(180%);
--c-border:    rgba(255, 255, 255, 0.07);
```

**Weight encodes hierarchy:** bigger surface → stronger blur + deeper shadow. The chat panel
(sheet) is heavier than the nav (chrome) because it's the focused surface. Cards are opaque —
they carry content, not chrome.

### 2.3 Motion (§4, §11)

The site currently has **29 hand-written `transition:` declarations** with eleven different
durations (0.15/0.18/0.2/0.22/0.25/0.28/0.3/0.4/0.65/0.7/0.8s) and **four different eases**
hardcoded across three components. §16.7 Craft: every timing value must be one you can defend.
There are three.

```css
--t-press:  100ms;   /* pointer-down feedback — must be imperceptible */
--t-state:  180ms;   /* hover, color, border, opacity */
--t-chrome: 320ms;   /* material changes: nav going translucent, blur ramps */

--ease-out: cubic-bezier(0.22, 1, 0.36, 1);   /* arriving */
--ease-in:  cubic-bezier(0.64, 0, 0.78, 0);   /* leaving — exact inverse of --ease-out (§7) */
--ease-both: cubic-bezier(0.76, 0, 0.24, 1);  /* symmetric, for the page curtain */
```

Springs live in JS, not CSS. One exported set, `src/motion/springs.js`, mapping Apple's
damping + response onto Framer Motion's `bounce` + `duration`:

```js
export const spring = {
  // damping 1.0, response 0.4 — critically damped, the default for everything
  move:   { type: 'spring', bounce: 0,   duration: 0.4 },
  // damping 0.8, response 0.3 — sheets and drawers only
  sheet:  { type: 'spring', bounce: 0.2, duration: 0.3 },
  // damping 0.8, response 0.4 — reserved for momentum-carrying release (§4)
  flick:  { type: 'spring', bounce: 0.2, duration: 0.4 },
};
```

**When to use which:**

- **CSS transition** — discrete, non-interruptible state on a property nobody can grab:
  color, border-color, opacity, backdrop-filter. Never on `transform` of something draggable.
- **Spring** — anything a pointer can touch, anything that can be reversed mid-flight,
  anything entering or leaving.
- **`@keyframes`** — decoration only, on `pointer-events: none` elements (hero orbits).
  Never on interactive UI (§3: keyframes can't be grabbed and reversed).

**Bounce is earned, not decorative.** `spring.flick` only fires after a gesture that carried
momentum. The chat panel's current `cubic-bezier(0.34, 1.56, 0.64, 1)` overshoot on a *click*
open is exactly the case §4 calls wrong — a click carries no momentum. It becomes
`spring.sheet` with `bounce: 0` on desktop, keeping bounce only for the mobile drag-release.

### 2.4 Typography (§15)

`index.html` loads Inter over the network while `--font` lists `-apple-system` first — so on
macOS the webfont is fetched and never used. Decide: **system font first, no webfont**
(§15: the system face already ships optical sizing and tracking tables). Drop the Google
Fonts `<link>` and the preconnects.

Tracking is **size-specific — never one value.** Seven steps, in `rem` so Dynamic Type and
browser text-size settings scale the layout with the text:

| Token | Size | Line-height | Tracking | Used by |
| --- | --- | --- | --- | --- |
| `--ty-display` | `clamp(3rem, 7vw, 5.5rem)` | `1.04` | `-0.04em` | `.hero-title` |
| `--ty-title` | `clamp(2rem, 4vw, 3.25rem)` | `1.1` | `-0.03em` | `.section-title` |
| `--ty-headline` | `1.25rem` | `1.3` | `-0.02em` | `.project-name`, `.deepdive-name` |
| `--ty-body-lg` | `clamp(1.125rem, 2.5vw, 1.5rem)` | `1.55` | `-0.01em` | `.hero-sub` |
| `--ty-body` | `1.0625rem` | `1.65` | `0` | `.section-body`, `.deepdive-body` |
| `--ty-callout` | `0.9375rem` | `1.6` | `0` | `.project-desc` |
| `--ty-caption` | `0.8125rem` | `1.5` | `+0.01em` | `.skill-desc`, footer, metadata |
| `--ty-label` | `0.75rem` | `1.2` | `+0.14em` uppercase | `.section-label`, `.project-badge` |

Large negative, body zero, small positive — that's the whole rule. Add
`font-optical-sizing: auto` on `:root`.

Hierarchy comes from **weight + size + leading as a set** (§15), not size alone. Weights: 400
body, 500 secondary UI, 600 headline/label, 700 display. No 300 — it fails on dark
backgrounds. Over the translucent chat sheet, bump body to 500 and `+0.01em` for vibrancy.

### 2.5 Space & layout

```css
--nav-h:       64px;
--section-gap: 140px;   /* → 88px below 768px */
--max-w:       980px;
--gutter:      24px;    /* → 48px on nav at ≥768px */
--radius:      18px;    /* cards, panels */
--radius-sm:   10px;    /* inputs, small chips */
--radius-pill: 980px;   /* buttons, tags */
--grid-gap:    20px;
```

### 2.6 Layer

The six `--z-*` tokens from §1.

---

## 3. Interaction contract

### 3.1 Every interactive element has four states

`rest → hover → **press** → focus-visible`. The press state is the one this site is missing
entirely: there is not a single `:active` rule in `src/css/`, only `body.cursor-click` on the
custom cursor. §1 is unambiguous — **feedback fires on pointer-down, not on release.**

```css
/* The house press. Applies to .btn-primary, .btn-ghost, .nav-btn,
   .chip, #chat-send, .skill-link, .project-link, .contact-link. */
.btn-primary:active,
.nav-btn:active,
.chip:active {
  transform: scale(0.97);
  transition: transform var(--t-press) var(--ease-out);
}
```

Hover-only feedback is a desktop luxury; press works on both pointers and is the honest
signal. Hover keeps its role — `--t-state` on color/border/background — but it is never the
*only* acknowledgment.

**Focus:** every interactive element gets a visible `:focus-visible` ring
(`outline: 2px solid var(--tint-edge); outline-offset: 3px`). Non-negotiable — `.nav-links a`,
`.chip`, and `.project-link` currently have none.

### 3.2 The custom cursor is an enhancement, never the mechanism

`body { cursor: none }` plus `#cursor-dot`/`#cursor-aura` is a whole interaction layer that
exists only for mice. It's correctly hidden below 768px, but that means:

- Every affordance the cursor communicates must **also** be communicated by the element
  itself (border, tint, scale). The cursor may amplify; it may not carry.
- The dot must not have `transition: transform 0.08s` while its position is also written every
  frame by `requestAnimationFrame` — that's a transition fighting a per-frame write, and it is
  measurable input lag (§1). Position: direct write, no transition. Scale/opacity state
  changes: `--t-state`. Write both through `transform: translate3d()`, not `left`/`top`, so
  the compositor handles it (§11).
- Hide it entirely under `(pointer: coarse)`, not just `max-width: 768px` — a touch laptop is
  wide and has no cursor.

### 3.3 Scroll reveals must not gate content

`Reveal.jsx` runs 0.7s with staggered delays to 0.2s — content can take 0.9s to become
readable after it enters the viewport. That's §1 latency wearing a costume.

- Duration → `0.45s`, ease `--ease-out`.
- Stagger → max `0.06s` per item, and only within one visual group.
- `viewport={{ once: true, amount: 0.12 }}` stays — re-animating on every pass is noise.
- Never animate `y` more than `24px`. Big travel reads as slow even when it isn't.

---

## 4. Spatial consistency (§7)

**Everything enters and exits along the same path.** Audit, current state:

| Surface | Enter | Exit | Verdict |
| --- | --- | --- | --- |
| `.page-curtain` | lifts to `-100%` | falls to `0%` | ✅ symmetric, same edge |
| Chat panel | `transform-origin: bottom right` from its trigger | same origin | ✅ anchored to source |
| Skill card → deep-dive page | card sits mid-page | page arrives from the top | ❌ disconnected |

**Fix the third:** the deep-dive route is reached by clicking a specific `.skill-card`. The
transition must originate from that card — either a Framer Motion `layoutId` shared element on
the card title, or at minimum a `transform-origin` on the curtain set to the clicked card's
position. §7: "if something disappears one way, we expect it to emerge from where it came."

**Reversible pairs mirror their easing:** `--ease-out` going in, `--ease-in` coming out.
The curtain is the exception — it's symmetric by design and uses `--ease-both`.

---

## 5. Materials & depth (§12)

- **`nav` is a translucent layer content scrolls under** — it already is, and correctly only
  after `scrollY > 20`. Keep that: no blur when there's nothing behind it to blur.
- **Replace the hard divider with a scroll edge effect.** `nav.scrolled` currently draws a 1px
  `border-bottom`. Fade a short gradient mask where content meets the bar instead — a hard
  line asserts a boundary the translucency is trying to dissolve.
- **Materialize, don't fade.** The chat panel should animate `backdrop-filter` blur radius and
  scale *together* on open, so it reads as glass arriving rather than opacity ramping.
- **Shadows are context-aware.** `0 20px 60px rgba(0,0,0,0.4)` on `.project-card:hover` is
  right over the busy grid; the chat panel over quieter background takes less.
- **Dim to focus, separate to keep flow.** The chat panel is *parallel and non-blocking* —
  translucency and offset, **no scrim**, background stays live. That's correct as built. If a
  genuinely modal surface is ever added, it takes a scrim and pushes the page back.

---

## 6. Ambient motion budget (§14)

The hero runs six infinite animations: `glow-pulse` (4s), `orbit-core-pulse` (3.2s), and four
orbit spins (20/32/46/62s). §14 names **slow looping oscillations near 0.2 Hz** as a specific
hazard — `glow-pulse` at 4s is 0.25 Hz, inside that band, on a 600px full-bleed radial that
also scales 12%.

Budget:

- **At most two** simultaneous ambient loops in view.
- No ambient loop may change **opacity by more than 0.2** or **scale by more than 1.06**.
- `glow-pulse` drops its `scale()` entirely and moves to a slower, shallower opacity drift.
- All six carry `pointer-events: none` (already true) and **all six stop under reduced motion.**
- Orbit rings animate `transform: rotate()` only — compositor-safe (already true).

---

## 7. Gesture surfaces

Only two surfaces should ever become gesture-driven. Both are mobile-first.

### 7.1 Chat panel as a draggable sheet (≤768px)

The one place the full fluid-interface stack earns its keep:

- Pointer Events + `setPointerCapture`, respecting the **grab offset** (§2).
- 1:1 tracking the whole way down — never animate only on release (§1).
- ~10px hysteresis before committing to the drag (§10).
- On release: **project the endpoint** from velocity, then pick dismiss-vs-snap-back from the
  projection, not the release position (§6):
  ```js
  const project = (v, d = 0.998) => (v / 1000) * d / (1 - d);
  const endpoint = currentY + project(releaseVelocity);
  ```
- Hand the release velocity to the spring so there's no seam between finger and animation (§5).
- **Rubber-band** upward past the open position rather than hard-stopping (§9).
- **Interruptible:** a sheet mid-dismiss that gets grabbed follows the finger from its
  *current on-screen* position — never finishes closing first (§3).
- Reverse-vs-commit decided by **velocity sign**, not distance (§3).

### 7.2 Card rails on mobile (≤768px)

`.projects-grid`, `.skills-grid`, and `.video-grid` all collapse to a single column on mobile,
turning six cards into six screens of scrolling. Convert to a horizontal snap rail with the
same momentum projection as above, so a flick throws to the card the gesture was *aiming at*.

**Everything else stays scroll + click.** Adding drag to a static portfolio section would be
motion for its own sake — §16.1 Purpose says decide what *not* to build.

---

## 8. Accessibility (§14)

Three independent signals. Only the first exists today, and it's implemented as a blunt
instrument:

```css
/* Current — kills every transition including opacity cross-fades, which §14 says to KEEP */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Reduced motion means a **gentler, non-vestibular equivalent** — not nothing:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }              /* currently still smooth — a real miss */

  /* Stop travel and loops */
  .hero-orbits, #hero::before, .scroll-line { animation: none; }
  .page-curtain { transform: none; }

  /* Keep comprehension cues as cross-fades */
  .project-card:hover, .skill-card:hover { transform: none; }
  [data-reveal] { transform: none; transition: opacity 200ms var(--ease-out); }
}

@media (prefers-reduced-transparency: reduce) {
  nav.scrolled, #chat-panel {
    background: var(--mat-base);
    backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .project-card, .skill-card, .chip { border-color: var(--tint-edge); }
  :root { --c-text-2: #C8C8C4; --c-text-3: #A29B78; }
}
```

`Home.jsx` also calls `scrollIntoView({ behavior: 'smooth' })` in JS — that ignores the CSS
override and must check `matchMedia('(prefers-reduced-motion: reduce)')` itself.

**Wayfinding gap (§16 / responsive.css:12):** `.nav-links { display: none }` below 768px with
no replacement. On a phone, "Where can I go?" has no answer. A mobile nav — sheet or inline
menu — is required, not optional.

---

## 9. File structure

Current CSS is one file per section, imported in a fixed order in `main.jsx`. That's sound.
Formalize the order as three tiers so cascade conflicts stop being accidental:

```
src/css/
  ── tier 1: foundation (no selectors beyond :root and elements)
  tokens.css          color · material · motion · type · space · layer
  reset.css           element defaults, shared utilities
  ── tier 2: layers (one file per z-layer occupant)
  cursor.css          --z-pointer
  nav.css             --z-chrome
  chatbot.css         --z-float
  page-transition.css --z-transition
  ── tier 3: content sections (--z-base / --z-raised)
  hero.css  about.css  skills.css  projects.css
  experience.css  contact.css  sections.css
  project-detail.css  motion-design.css
  ── tier 4: overrides, always last
  animations.css      shared keyframes + reduced-motion
  responsive.css      breakpoints
```

`animations.css` and `responsive.css` currently import **before** `project-detail.css`,
`motion-design.css`, and `page-transition.css` — so the reduced-motion override and the
mobile breakpoints do not reach those three files at equal specificity. Move both to the end
of the import list in `main.jsx`.

New: `src/motion/springs.js` — the exported spring set from §2.3. Components import from it;
no component defines its own ease array. `PageTransition.jsx`, `Reveal.jsx`, and `Chatbot.jsx`
each currently hardcode their own.

**Component rules:**
- A component owns its markup and behavior; all values come from tokens.
- `Reveal.jsx` is the only entrance-animation primitive. Sections don't roll their own.
- Data stays in `src/data/`, already true and correct.

---

## 10. Gap audit

Ranked by how much each costs the "quiet precision" the site is going for.

| # | Gap | Where | Principle |
| --- | --- | --- | --- |
| 1 | No `:active` state anywhere — all feedback waits for hover or release | every button/link | §1 |
| 2 | 67 hardcoded `rgba(255,214,10,…)`; that gold isn't in `tokens.css`, so retheming is impossible | 12 CSS files | §16.7 |
| 3 | No mobile nav — links hidden with no replacement | responsive.css:12 | §16 Wayfinding |
| 4 | 29 ad-hoc transitions, 11 durations, 4 eases | all CSS + 3 components | §16.7 |
| 5 | Reduced motion is `0.01ms !important` on everything; smooth scroll survives it in both CSS and JS | animations.css:13, Home.jsx:30 | §14 |
| 6 | No `prefers-reduced-transparency` / `prefers-contrast` | — | §14 |
| 7 | `--c-bg` = `--c-surface` = `--c-surface-2` = `#171717` — depth has no vocabulary | tokens.css:10-12 | §12 |
| 8 | Type in `px`; user text-size setting is ignored | all CSS | §15 |
| 9 | Inter fetched over the network, never used (`-apple-system` wins) | index.html:10-12 | §15 |
| 10 | Cursor dot has a CSS transition on a per-frame-written property, and animates `left`/`top` | cursor.css:14, Cursor.jsx:33 | §1, §11 |
| 11 | Chat panel overshoots (`0.34, 1.56, …`) on a click that carried no momentum | Chatbot.jsx:87 | §4 |
| 12 | `Reveal` takes up to 0.9s to surface content | Reveal.jsx:18 | §1 |
| 13 | Six infinite ambient loops; `glow-pulse` sits at 0.25 Hz with a 12% scale | hero.css:28-63 | §14 |
| 14 | Card → deep-dive navigation has no shared origin | Skills.jsx → DeepDivePage.jsx | §7 |
| 15 | No `:focus-visible` rings | nav.css, chatbot.css, projects.css | §14 |
| 16 | `animations.css`/`responsive.css` import before three later stylesheets | main.jsx:18-22 | §16.7 |
| 17 | Mobile grids are single-column scroll walls | projects/skills/video grids | §5, §6, §10 |
| 18 | Cursor hidden by width, not by `pointer: coarse` | responsive.css:37 | §16.5 |

**Suggested order:** 1–3 first (they're felt immediately, on every visit, by everyone), then
4 and 7–8 (they unblock everything else), then 5–6 and 15 (correctness), then the rest.
Item 17 is the only one that needs the gesture stack from §7 — do it last, or not at all.


//https://www.instagram.com/reel/DZ3PQxzoUEr/?igsh=NTlzcWdyZHFjemQ4
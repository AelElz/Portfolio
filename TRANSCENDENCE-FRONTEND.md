# ft_transcendence — Frontend Plan (30–45 days)

Built from the actual subject, **version 21.2**. Every requirement quoted below
is from that PDF, not from an older version of the project.

---

## 1. The strategic point — read this first

You are not "just doing the frontend." Under this subject version, **the
frontend can carry 8 of the 14 points on its own** — and you have already built
most of the hard parts once, in your portfolio.

Team needs **14 points**. Major = 2, Minor = 1.

| Module | Pts | Your situation |
|---|---|---|
| **Web Minor** — use a frontend framework (React) | 1 | Free. You've shipped a React SPA already |
| **Web Minor** — custom design system, 10+ reusable components, palette, typography, icons | 1 | **You literally just built this.** `tokens.css` is a design system |
| **Accessibility Major** — WCAG 2.1 AA, screen reader, keyboard nav | 2 | You already did focus-visible, reduced-motion, contrast, reduced-transparency |
| **Accessibility Minor** — i18n, 3+ languages, switcher | 1 | New, but mechanical |
| **Accessibility Minor** — RTL, full layout mirroring | 1 | Arabic. Your portfolio already uses logical properties (`margin-inline`) — that's exactly the groundwork |
| **Accessibility Minor** — 2 additional browsers | 1 | Testing work, low risk |
| **Web Minor** — PWA, offline + installable | 1 | Self-contained, one focused day |
| | **8** | |

Those eight points are **almost entirely frontend**. If your teammates cover
game + auth + backend framework + ORM, the team clears 14 comfortably.

> **Push this in your team's module meeting.** Teams routinely pick modules that
> need backend work when there are cheap, high-value frontend points sitting
> right there — and you're unusually well-placed to take them.

---

## 2. What the subject actually mandates (you can't skip these)

Regardless of modules, the frontend must satisfy:

- **Clear, responsive, accessible across all devices** — you've done this
- **A CSS framework or styling solution of your choice** — Tailwind, Bootstrap, MUI, Styled Components, *or your own*. Free choice
- **Compatible with the latest stable Google Chrome** (not Firefox)
- **Zero JavaScript warnings or errors in the browser console** — they will open DevTools during evaluation
- **Privacy Policy and Terms of Service pages** — accessible (e.g. footer links), real content, not placeholders. *Missing or inadequate = project rejected*
- **All forms validated in frontend AND backend**
- **HTTPS** for anything browser → backend
- **Multi-user** — several people logged in and acting at once, no race conditions
- Runs from **one command** via Docker

Two of those are silent killers. **Privacy Policy / ToS** is a rejection
criterion and takes an afternoon — do it in week one, not the night before. And
a single React key warning in the console is an avoidable stain.

---

## 3. Correcting three things I told you earlier

| I said | The subject actually says |
|---|---|
| React probably isn't allowed | React **is** allowed and is explicitly worth a Minor point. It's even named as "considered a framework in this context" |
| It's a Pong game | "The project content is up to you." Pong is one *example*. It could be a chess site, a social platform, a project-management tool |
| Firefox is the target | **Chrome** is mandatory. Firefox/Safari/Edge are an optional Minor module |

---

## 4. What you actually need to learn

Short list. You know more of this than you think.

### TypeScript — 3–4 days, non-negotiable

Not because the subject demands it (it doesn't in this version), but because
it's what makes a 4-person codebase survivable and it's the single highest-value
thing you can add to your CV this month.

Coming from C, this is the easy version of a type system:

- Annotations on variables, params, returns
- `interface` vs `type` (use `interface` for object shapes, `type` for unions)
- Union types (`'idle' | 'loading' | 'error'`) — this is the killer feature
- Generics, lightly — enough to read `useState<User | null>(null)`
- `unknown` vs `any` — never write `any`
- Typing props and API responses

**Skip:** conditional types, mapped types, decorators, type gymnastics.

### React you don't yet have — 4–5 days

You shipped a React site, but you leaned on it rather than understanding it.
Fill these specific gaps:

- **Why a component re-renders** — state changed, props changed, parent
  re-rendered. Not "React is magic"
- **`useEffect` honestly** — it synchronises with something *outside* React.
  Your portfolio is the perfect reference: every GSAP setup in
  `src/components/Panel.jsx` lives in an effect with a teardown, because a
  leaked ScrollTrigger is a real memory leak
- **Lists and keys** — stable keys, never array index for reorderable lists.
  This is where console warnings come from
- **Forms** — controlled inputs, validation, error state
- **Data fetching** with TanStack Query — caching, loading and error states.
  Don't hand-roll this for 4 people
- **Context** for auth/user/theme — and its limits

### The module-specific skills — learn as you build them

- **i18n**: `react-i18next`. Extract every string to JSON files. Do this *early* — retrofitting hardcoded strings across 40 components is miserable
- **RTL**: `dir="rtl"`, logical properties everywhere (`margin-inline-start`, not `margin-left`), mirrored icons. You've already got the CSS habit
- **A11y**: semantic HTML first, then ARIA only where semantics run out. Keyboard traps, focus management on route change and modal open, contrast ratios. Test with VoiceOver (already on your Mac: ⌘F5)
- **PWA**: `vite-plugin-pwa` handles most of it — manifest, service worker, offline fallback

> **Skip entirely:** Redux, Next.js, SSR (a Minor point but it fights everything else in a 30-day window), animation libraries you don't need, and any "React best practices" article older than 2023.

---

## 5. The schedule

### Days 1–5 · Foundations and decisions

- **Day 1:** Team module meeting. Lock the 14 points. Claim the frontend eight from §1
- **Day 1:** Scaffold — Vite + React + TypeScript + Tailwind + React Router. Get it in Docker on day one, not week four
- **Days 2–4:** TypeScript sprint. Convert something small you already understand — take a component out of your portfolio and type it
- **Day 5:** i18n and RTL wired up *before* any real UI exists. This is the single highest-leverage sequencing decision in the whole plan

### Days 6–14 · The design system (your 2 easy points)

- 10+ reusable, typed, documented components: Button, Input, Select, Modal, Card, Avatar, Badge, Toast, Tabs, Spinner, Table, Nav
- Token layer: colours, spacing, typography, radii. **Reuse the architecture from your portfolio's `tokens.css`** — semantic names, not literal ones
- Every component: keyboard accessible, focus-visible, ARIA where needed, works in RTL
- A `/components` showcase route. Evaluators love this and it proves the module in 30 seconds

Doing accessibility *inside* the component library is how you get the WCAG major
almost free. Bolting it on later costs three times as much.

### Days 15–25 · Application screens

- Auth: register, login, logout, protected routes
- Profile: view, edit, avatar upload
- The main feature UI (whatever your team chose)
- Lists with search, filter, pagination
- Notifications / toasts
- **Privacy Policy + Terms of Service** — real content, footer links
- Wire everything to the real API as your backend people ship endpoints

### Days 26–32 · Modules and hardening

- Accessibility audit: keyboard-only pass, VoiceOver pass, contrast check, focus management on route changes
- i18n: finish all 3 languages, no hardcoded strings left
- RTL: full mirroring pass in Arabic — not just text direction
- PWA: manifest, service worker, offline fallback, installable
- Cross-browser: Firefox + Safari, fix and document

### Days 33–40 · Integration and polish

- Full multi-user testing — two browsers, two accounts, simultaneous actions
- **Console must be completely clean**
- Responsive check at 375 / 768 / 1440 / 2560
- Loading, empty and error states everywhere (this is what separates a student project from a real one)
- README sections you own (see §7)

### Days 41–45 · Buffer

Something will break. Leave the room for it. If nothing breaks, rehearse the
evaluation.

---

## 6. Evaluation traps

**You may be asked to modify the code live.** The subject says a "brief
modification of the project may occasionally be requested… to verify your actual
understanding." If you can't change your own component in front of an evaluator,
the module doesn't count.

**The subject has an explicit AI chapter, and it is blunt.** Its exact failure
example: *"I let Copilot generate my code for a key part of my project. It
compiles, but I can't explain how it handles pipes. During the evaluation, I
fail to justify and I fail my project."*

That applies directly to how you use me. Use me to explain concepts, review
approaches, unblock you and handle tedium — then **type the code yourself and be
able to defend every line**. The subject also requires you to document in the
README *which parts* used AI and for what. Be honest there; it's a required
section, not a confession.

**Non-functional modules score zero.** Six polished points beat ten half-built
ones.

---

## 7. README — it's graded

Mandatory sections, and several are yours to write:

- First line, italic: *This project has been created as part of the 42 curriculum by \<login1\>, \<login2\>…*
- Description, Instructions, Resources (**including how AI was used, for which tasks**)
- Team Information — roles and responsibilities
- Project Management — how you organised, tools, channels
- **Technical Stack — with justification for major choices** ← yours for frontend
- Database Schema
- **Features List — and who built each** ← yours for frontend
- **Modules — point calculation and justification** ← yours for frontend modules
- Individual Contributions — including challenges and how you solved them

Write it **as you go**. Reconstructing it at the end is how teams lose easy marks.

---

## 8. Honest risk assessment

**Realistic in 30–45 days?** Yes — *if* the eight frontend points in §1 are what
you take. Those are additive and independently demonstrable: each one can be
finished and shown without waiting on anyone.

**What would blow the timeline:**

- Taking SSR (fights Vite, fights the SPA, fights Docker)
- Owning the 3D game module *as well as* the frontend
- Backend slipping and leaving you with nothing to integrate against — **mock
  the API from day one** so you're never blocked
- Retrofitting i18n or accessibility at the end instead of building them in

**Your unfair advantages:** you've already shipped a responsive, accessible,
animated React SPA; you know Docker properly from Inception; and you have four
years of design sense, which is exactly what most 42 teams' frontends lack.

The frontend is usually the weakest part of a Transcendence submission. Yours
should be the strongest part of your team's.

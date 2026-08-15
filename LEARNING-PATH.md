# Full-Stack, Without the Detours

> **Doing ft_transcendence right now?** This isn't the document you need today —
> see **`TRANSCENDENCE-FRONTEND.md`** for the 30–45 day plan built from the
> actual subject. Come back here afterwards, for the career rather than the
> deadline.

A learning plan written for **you specifically** — someone who already has
Minishell, Philosophers, Cub3D and Inception behind them, not someone starting
from zero.

Most roadmaps you'll find online are written for people with no systems
background. You have one. That changes the order, and it lets you skip a lot.

---

## 0. What you already have (don't relearn this)

This matters more than you probably think. Most people entering web development
have never seen any of it.

| From 1337 | What it actually gave you |
|---|---|
| **Minishell** | Lexing, parsing, `fork`/`execve`, pipes, file descriptors, signals. You understand *processes* — which is the thing most web devs never learn |
| **Philosophers** | Threads, mutexes, race conditions, deadlock. Concurrency is the hardest part of backend work and you've already done it in the hardest language |
| **Cub3D** | A real-time render loop, frame budgets, coordinate math. This is exactly the mental model behind the scroll animations in your portfolio |
| **Inception** | Docker, Compose, NGINX reverse proxy, internal networks, volumes, TLS. **This is production infrastructure.** Most juniors fake this on a CV |
| **Debian hardening** | SSH, firewalls, least privilege, fail2ban, log monitoring |
| **C/C++** | Memory, pointers, manual lifetimes. Every garbage-collected language will feel easy and you'll understand *why* things are slow |
| **Git, Make, Valgrind, gdb** | Real tooling discipline |

**Translation to web terms:**

- You know what a process is → the Node event loop will make sense immediately
- You know sockets → HTTP is just a text protocol on top of one
- You know mutexes → database transactions and race conditions will click
- You know Docker properly → you are already better at deployment than most
  mid-level developers

**What you're actually missing** is narrower than it looks:

1. JavaScript as a language (not as copy-paste)
2. How the browser runtime works
3. HTTP/API design as a discipline
4. Databases and SQL
5. Auth and web-specific security
6. React beyond "it renders"

That's it. That's the gap. Six things, not sixty.

---

## 1. The one mental model that matters

Before any syntax, get this in your head. Everything in full-stack is one loop:

```
Browser                    Network                Server              Database
   │                          │                      │                    │
   │──── HTTP request ───────►│                      │                    │
   │     GET /api/projects    │─── route match ─────►│                    │
   │                          │                      │─── SQL query ─────►│
   │                          │                      │◄── rows ───────────│
   │                          │◄── JSON response ────│                    │
   │◄──── 200 + body ─────────│                      │                    │
   │                          │                      │                    │
   │ parse → state → render   │                      │                    │
```

Every framework, library and buzzword is a way of making one of those arrows
nicer. When something confuses you, ask: **which arrow is this?** Nine times out
of ten that dissolves the confusion.

You already know the bottom half better than the top half. Start at the top.

---

## 2. The plan

Roughly **6–9 months** alongside 42, at 10–15 focused hours a week. Faster if
you're between projects.

Each phase has: what to learn, what to **build** (non-negotiable — reading
without building is how people spend two years and learn nothing), and what to
skip.

---

### Phase 1 — JavaScript, properly · 3–4 weeks

You've written JS for the portfolio. Now actually learn it, because almost every
bug you'll hit for the next year comes from not knowing these six things.

**Learn:**
- `let`/`const`, scope, closures — closures are the one that unlocks everything
- `this`, and why arrow functions differ (this trips up everyone)
- Prototypes and the prototype chain (you don't need to *use* them, you need to
  recognise them)
- **The event loop**: call stack, task queue, microtasks. Coming from
  Philosophers this will feel familiar — it's cooperative scheduling
- **Async**: callbacks → Promises → `async/await`. Know what a Promise *is*,
  not just how to `await` one
- Array methods until they're reflex: `map`, `filter`, `reduce`, `find`, `some`,
  `every`
- Destructuring, spread, modules (`import`/`export`)

**Build:** a CLI tool in Node — a file organiser, a log parser, something that
uses `fs` and processes arguments. You've done this in C. Do it in JS and feel
the difference.

**Resource:** [javascript.info](https://javascript.info) — read it top to
bottom. It is the single best resource for this and it's free. MDN for
reference, not for learning.

> **Skip:** jQuery. `var`. Class-based inheritance patterns. "10 JS tricks"
> articles. Anything about `prototype` manipulation.

---

### Phase 2 — The browser runtime · 2 weeks

**Learn:**
- The DOM as a tree; query, create, modify, remove
- Events: bubbling, capturing, delegation, `preventDefault`
- **The critical rendering path**: HTML → DOM → CSSOM → layout → paint →
  composite. This is why animating `transform` is cheap and animating `top` is
  expensive — the same reason you care about cache lines in C
- `requestAnimationFrame` and why it exists
- `fetch`, and what CORS actually is (it's a *browser* rule, not a server one)
- DevTools seriously: Network, Performance, Elements, the console

**Build:** something with no framework at all — a drag-and-drop board, a canvas
toy. You'll appreciate React far more once you know exactly what it's saving you
from.

> **Skip:** jQuery (again — you'll be tempted). Browser-compat trivia for IE.
> Memorising DOM API names; look them up.

---

### Phase 3 — HTTP and APIs · 1–2 weeks

Short phase, huge payoff. You have sockets from 42, so this is mostly vocabulary.

**Learn:**
- Request/response anatomy: method, path, headers, body, status
- Status codes that matter: 200, 201, 204, 301, 302, 400, 401, 403, 404, 409, 422, 500
- **401 vs 403** — authentication vs authorisation. Interviewers ask this
- Idempotency: why `GET` and `PUT` are safe to retry and `POST` isn't
- REST conventions — resources as nouns, verbs as methods
- Headers you'll actually use: `Content-Type`, `Authorization`, `Cache-Control`, `Set-Cookie`
- Cookies vs `localStorage` vs `sessionStorage`, and their security differences

**Build:** nothing new — use `curl` and Postman against a public API until the
shapes are boring.

> **Skip:** GraphQL, gRPC, WebSockets. All useful, none foundational. Come back
> when you have a problem REST can't solve.

---

### Phase 4 — Backend · 3–4 weeks

**Learn — Node + Express** (Express because the ecosystem and job postings are
overwhelmingly there; it's boring in a good way):
- Routing, route params, query strings
- Middleware — this is the whole mental model of Express, and it's a pipeline,
  which you already understand from shell pipes
- Body parsing, error-handling middleware
- Env vars and config (`dotenv`); **never commit secrets**
- Structuring a project: routes / controllers / services — thin routes, logic in services
- Logging, and returning useful errors

**Build:** a REST API for something real. Take your portfolio's `src/data/*.js`
files and serve them from an API instead — same content, now dynamic. That's a
genuinely good first backend because you already know exactly what the data
should look like.

> **Alternative:** if you want to lean on your C background, **Go** is a great
> fit — static types, real concurrency, compiles to a single binary, excellent
> standard library. Fewer junior roles than Node, but you'd stand out. Pick one.
> Do not learn both now.

> **Skip:** Nest.js, microservices, message queues, "clean architecture",
> hexagonal architecture, DDD. All of it is solving problems you don't have.

---

### Phase 5 — Databases · 3–4 weeks

**Do not skip this and do not start with MongoDB.** SQL is the skill that lasts,
it's what interviews test, and it's what almost every real product runs on.

**Learn — PostgreSQL:**
- Tables, columns, types, primary keys, foreign keys
- `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, `JOIN` (inner/left — know the difference cold)
- `GROUP BY` + aggregates
- Indexes: what they are, why they make reads fast and writes slower, when to add one
- **Transactions and ACID** — you'll get this instantly from Philosophers; it's
  mutual exclusion for data
- Normalisation to ~3NF, and when to denormalise deliberately
- N+1 queries: what they are and how to spot one (the most common real-world
  performance bug in web apps)

Then **one ORM** — Prisma is the pleasant modern choice. Learn raw SQL *first*
so the ORM is a convenience, not a crutch you can't debug.

**Build:** add Postgres to your API from Phase 4. Real schema, real migrations,
real joins.

> **Skip:** MongoDB (for now), Redis, database theory beyond 3NF, stored
> procedures, "which NoSQL is best" articles.

---

### Phase 6 — Auth and security · 2 weeks

Where most self-taught developers are weakest, and where your Debian hardening
already gives you instincts.

**Learn:**
- **Password hashing** with bcrypt or argon2 — never anything else, never plaintext, never MD5/SHA alone
- Sessions vs JWTs. Understand the tradeoff: sessions are stateful and easy to revoke; JWTs are stateless and hard to revoke. **Default to sessions** unless you have a specific reason
- `httpOnly`, `Secure`, `SameSite` cookies
- The **OWASP Top 10** — read it once properly. Focus on SQL injection, XSS, CSRF
- Why parameterised queries are the *only* answer to SQL injection
- Rate limiting, input validation (`zod`)

**Build:** add register/login/logout to your API. Protected routes. Do it by
hand once before you ever reach for an auth library.

> **Skip:** OAuth provider implementation, SAML, writing your own crypto (never
> do this).

---

### Phase 7 — React, properly · 4 weeks

You've shipped a React site. Now understand what you were doing.

**Learn:**
- JSX → `createElement`; components as functions of props
- State, and why immutability matters for change detection
- **The rendering model**: what triggers a re-render, and what doesn't
- `useEffect` honestly — it is for *synchronising with something outside React*
  (a subscription, a timer, an animation library), **not** "run after render".
  Your portfolio is a good example: every GSAP setup lives in an effect with a
  teardown, because a leaked ScrollTrigger is a real memory leak
- Cleanup functions and why they exist
- `useRef` for values that shouldn't trigger renders
- `useMemo`/`useCallback` — and when *not* to (usually: don't, until you measure)
- Lifting state; prop drilling; Context for genuinely global things
- Data fetching with **TanStack Query** — caching, loading and error states solved properly

**Build:** a frontend for your Phase 4–6 API. Login, list, create, edit, delete.
This is the "full stack" moment — your own UI talking to your own server talking
to your own database.

> **Skip:** Redux (until you feel real pain — you probably never will), class
> components, `useReducer` early, Next.js *until you understand plain React*,
> component libraries before you can build a button.

---

### Phase 8 — TypeScript · 2 weeks

Do this *after* JS is solid, not before. Coming from C's type system this will
feel natural — and honestly better designed.

**Learn:** basic annotations, interfaces vs types, unions, generics (lightly),
typing props and API responses, `unknown` vs `any` (never `any`).

**Build:** convert your Phase 7 app. You'll find real bugs doing it.

> **Skip:** advanced type gymnastics, conditional/mapped types, decorators.

---

### Phase 9 — Testing · 1–2 weeks

Enough to be employable, not enough to become a zealot.

**Learn:** Vitest for units; React Testing Library (test behaviour, not
implementation); Supertest for API endpoints; what to test — business logic and
critical paths, not everything.

> **Skip:** 100% coverage targets, TDD purism, E2E suites early.

---

### Phase 10 — Ship it · 1 week

**You already know this part.** Inception was harder than anything here.

**Learn:** Vercel/Netlify for frontends; Railway/Render/Fly for backends;
managed Postgres; GitHub Actions for CI (lint → test → build → deploy);
environment/secret management.

**Build:** put your full-stack app on the internet with a real domain, CI, and a
staging environment.

---

## 3. Things that will waste your time

Blunt list. Every one of these eats months and returns almost nothing at your
stage.

| Don't | Why |
|---|---|
| **Tutorial hell** | Watching a 12-hour course while nodding is not learning. If you aren't typing and breaking things, close it |
| **Course collecting** | Owning 40 Udemy courses correlates with knowing nothing. Finish one thing |
| **Learning 3 frameworks** | Vue, Svelte, Angular. Pick React, go deep. Depth in one transfers; breadth in four doesn't |
| **CSS frameworks before CSS** | Learn flexbox, grid, custom properties and cascade first. Then Tailwind is a shortcut instead of a dependency |
| **Sass/Less** | CSS has variables and nesting natively now. Skip it |
| **Kubernetes, microservices** | You will not touch these as a junior. Docker + Compose, which you have, is the right level |
| **MERN tutorials** | They teach Mongoose and skip SQL entirely. You'll be unemployable in the half of the market that runs Postgres |
| **Obsessive LeetCode** | For *internships* and web roles, a working deployed project beats 300 solved problems. Do 2–3 easy/medium a week to stay sharp, not 5 hours a day |
| **Rewriting your portfolio every month** | It's done. Ship features, not restarts |
| **Waiting to feel "ready"** | You won't. Apply at 60% |

---

## 4. How to actually learn (the meta part)

1. **Build before you're ready.** Read just enough to start, then get stuck.
   Being stuck is what makes the explanation stick when you go find it.
2. **Type the code.** Never copy-paste while learning.
3. **Break it deliberately.** Delete the cleanup function and watch the leak.
   Remove the `await` and watch it fail. You learned C by segfaulting — same
   method.
4. **Read real source.** You already have a codebase with commented decisions in
   it. `src/components/Panel.jsx` and `src/motion/smooth-scroll.js` are real
   examples of effects, cleanup and third-party integration.
5. **Explain it out loud.** If you can't explain the event loop to a classmate,
   you don't know it yet. This is 42's whole method — keep using it.
6. **One project at a time, finished.** Three finished small things beat one
   abandoned ambitious thing.

---

## 5. What to build (in order)

These are the ones that actually get interviews.

1. **CLI tool in Node** — proves you know the language, not just a framework
2. **REST API + Postgres + auth** — the backbone of every job description
3. **Full-stack app with a React frontend** — the portfolio piece
4. **Something with a real user** — even one. A tool for your 42 cohort, a
   dashboard for a freelance client. "People use this" beats any tutorial clone
5. **One thing that shows your edge** — you have an unusual combination:
   systems programming *and* 4+ years of motion design. Almost nobody has both.
   Build something visual and technically hard. A WebGL piece, a browser-based
   video tool, an animation system. That's the project people remember

> **Do not build:** another to-do app, another weather app, another clone of a
> tutorial everyone else did.

---

## 6. For internships specifically

- **Your Inception project is your strongest card.** Most juniors have never
  configured NGINX or written a Dockerfile from a base image. Lead with it
- **Your GitHub is your CV.** Real READMEs, real commits, no `test123` messages
- **The creative background is a differentiator, not a distraction.** Framing:
  *"I build the system and I can make it look right."* Very few engineers can
  do both — do not hide it
- **Apply before you feel ready.** Internships expect gaps
- **Be able to explain one project deeply** — architecture, tradeoffs, what
  you'd do differently. Depth on one beats a list of ten
- Know cold: *what happens when you type a URL and press enter.* You can answer
  this better than most seniors because you know DNS, TCP, processes and NGINX
  from 42. Practise saying it out loud

---

## 7. Curated resources (short on purpose)

| For | Use |
|---|---|
| JavaScript | [javascript.info](https://javascript.info) — the best, and free |
| Reference | [MDN](https://developer.mozilla.org) — reference, not tutorial |
| React | The [official docs](https://react.dev) — genuinely excellent since the rewrite |
| SQL | [PostgreSQL Tutorial](https://www.postgresqltutorial.com) |
| Security | [OWASP Top 10](https://owasp.org/www-project-top-ten/) — read once, properly |
| HTTP/system design | *High Performance Browser Networking* (free online) |
| Orientation only | Fireship on YouTube — good for "what is X", never for learning X |

If a resource isn't on this list, you probably don't need it yet.

---

## 8. Realistic timeline

| Months | Where you are |
|---|---|
| 1–2 | JS solid, browser understood, small tools built |
| 3–4 | API + Postgres + auth running locally |
| 5–6 | Full-stack app deployed, React understood properly |
| 7–9 | TypeScript, tests, CI, a second real project, applying |

Faster if you're between 42 projects. Slower during exam weeks. Both are fine —
**consistency beats intensity.** Two focused hours a day for six months will
take you further than three 14-hour weekends followed by a month off.

You have the hardest part already. Most people learning web development have
never written a line of C, never forked a process, never configured a reverse
proxy. You've done all three.

The rest is just the top half of the loop.

# Ayoub Elazhari — Portfolio

Personal portfolio site. Apple-inspired dark aesthetic, gold accent system, pure HTML/CSS/JS — no frameworks, no build step.

---

## File structure

```
portfolio/
│
├── index.html              # Entry point — all sections live here
│
├── assets/                 # Images & icons (not tracked in repo)
│   └── iconlogo2.png       # Nav logo
│
├── css/
│   ├── tokens.css          # ★ Design tokens — edit here to retheme everything
│   ├── reset.css           # Base reset, body, shared utilities (buttons, tags, footer)
│   ├── animations.css      # Shared @keyframes + prefers-reduced-motion
│   ├── sections.css        # .reveal scroll-animation utility classes
│   │
│   ├── cursor.css          # Custom cursor (dot + aura)
│   ├── nav.css             # Fixed top navigation bar
│   ├── hero.css            # Full-screen hero section
│   ├── about.css           # About grid + spinning avatar ring
│   ├── skills.css          # Skills card grid
│   ├── projects.css        # Projects card grid (featured + standard)
│   ├── experience.css      # Experience timeline rows
│   ├── contact.css         # Contact links section
│   └── responsive.css      # Mobile breakpoints (≤768px)
│
└── js/
    ├── cursor.js           # Cursor tracking, hover/click state classes
    ├── nav.js              # Scroll-blur effect + active link highlight
    └── reveal.js           # IntersectionObserver scroll-reveal
```

---

## How to edit

### Change colors or fonts
Open `css/tokens.css`. Every color, gradient, spacing value, and font is defined there as a CSS custom property. All other files reference these variables — change a token once, it updates everywhere.

### Add a new project card
In `index.html`, copy any `.project-card` block inside `#projects > .projects-grid` and update the badge, name, description, language dot class, and GitHub link.

### Add a new experience row
In `index.html`, copy any `.exp-item` block inside `#creative > .exp-list` and fill in the date, role, company, body text, and tags.

### Add a new skill card
In `index.html`, copy any `.skill-card` block inside `#skills > .skills-grid` and update the icon emoji, name, and description.

### Make an element animate on scroll
Add the class `reveal` to any HTML element. Optionally add `reveal-delay-1` through `reveal-delay-4` to stagger siblings. The JS in `reveal.js` handles the rest.

---

## Deploy

No build step required. Upload the folder as-is to any static host (Vercel, Netlify, GitHub Pages). Make sure `assets/` contains your logo images.

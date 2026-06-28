/* ============================================================
   cursor.js — Custom cursor: dot + aura with hover/click states
   ============================================================ */

const dot  = document.getElementById('cursor-dot');
const aura = document.getElementById('cursor-aura');

let mouseX = 0, mouseY = 0; // raw mouse position
let auraX  = 0, auraY  = 0; // lagging aura position

// Track mouse
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animate dot (instant) and aura (eased lag)
function animateCursor() {
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';

  auraX += (mouseX - auraX) * 0.14;
  auraY += (mouseY - auraY) * 0.14;

  aura.style.left = auraX + 'px';
  aura.style.top  = auraY + 'px';

  requestAnimationFrame(animateCursor);
}

animateCursor();

// Hover state — enlarge aura over interactive elements
const hoverTargets = document.querySelectorAll([
  'a', 'button',
  '.skill-card', '.project-card', '.contact-link',
  '.btn-primary', '.btn-ghost',
  '.nav-logo-img', '.nav-btn',
  '.about-avatar-wrap', '.exp-item',
  '.contact-title',
].join(', '));

hoverTargets.forEach((el) => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Click state — pulse on mousedown
document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

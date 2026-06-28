/* ============================================================
   nav.js — Scroll-triggered glass blur + active link highlight
   ============================================================ */

const nav      = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

// Add frosted-glass background once user scrolls down
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Highlight the nav link matching the currently visible section
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === '#' + entry.target.id;
      link.style.color = isActive ? 'var(--c-text-1)' : '';
    });
  });
}, { threshold: 0.5 });

sections.forEach((section) => sectionObserver.observe(section));

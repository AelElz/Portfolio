/* ============================================================
   reveal.js — Scroll-triggered fade-up reveal animation
   Add class "reveal" (and optional "reveal-delay-N") to any
   element in the HTML to make it animate in on scroll.
   ============================================================ */

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target); // animate once only
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

revealElements.forEach((el) => revealObserver.observe(el));

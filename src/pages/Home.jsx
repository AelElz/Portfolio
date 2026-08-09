import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';

export default function Home() {
  const { hash } = useLocation();
  const navType = useNavigationType();
  const justMounted = useRef(true);

  useEffect(() => {
    // While the page-transition curtain still covers the screen, jump
    // instantly so the curtain lifts on content already in position.
    const underCurtain = justMounted.current;
    justMounted.current = false;

    if (!hash) {
      // Only reset scroll for in-app navigation; on refresh/back-forward
      // (POP) let the browser restore the previous position.
      if (underCurtain && navType !== 'POP') window.scrollTo(0, 0);
      return;
    }
    const el = document.querySelector(hash);
    if (el) {
      /* Smooth scroll is vestibular motion, and a JS scroll ignores the
         CSS override — so it has to ask for itself (§14). */
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: underCurtain || reduced ? 'auto' : 'smooth' })
      );
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}

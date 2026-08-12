import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { PanelStack } from '../components/Panel';
import { scrollToTarget } from '../motion/smooth-scroll';
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
      if (underCurtain && navType !== 'POP') scrollToTarget(0, { immediate: true });
      return;
    }

    const el = document.querySelector(hash);
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() =>
      scrollToTarget(el, { immediate: underCurtain || reduced })
    );
  }, [hash, navType]);

  return (
    /* Six chapters, alternating, ending light. The 50/50 balance
       between black and white is a property of this list
       — not of tinting anything individually. */
    <PanelStack>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </PanelStack>
  );
}

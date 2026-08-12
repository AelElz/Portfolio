import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Chatbot from './components/Chatbot';
import PageTransition from './components/PageTransition';
import Preloader, { shouldPlayIntro } from './components/Preloader';
import { startSmoothScroll, stopSmoothScroll, scrollToTarget, getLenis } from './motion/smooth-scroll';
import Home from './pages/Home';
import CProjectsPage from './pages/CProjectsPage';
import DockerDevOpsPage from './pages/DockerDevOpsPage';
import MotionDesignPage from './pages/MotionDesignPage';
import VisualDesignPage from './pages/VisualDesignPage';

export default function App() {
  const location = useLocation();
  const [intro, setIntro] = useState(() => shouldPlayIntro());

  /* One Lenis instance for the whole app, torn down with it. */
  useEffect(() => {
    startSmoothScroll();
    return () => stopSmoothScroll();
  }, []);

  /* Dev-only handle. Every scroll effect here is driven by rAF, which
     a browser pauses in a background or hidden tab — so from a test
     harness there is no way to observe a scrub without being able to
     step the ticker by hand. Stripped from the production bundle. */
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    window.__motion = {
      gsap,
      ScrollTrigger,
      step: () => gsap.ticker.tick(),
      /* Must go through Lenis: a bare window.scrollTo leaves Lenis's
         own target where it was, and the next tick drags the page
         back to it mid-measurement. */
      seek: (y) => {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
      },
    };
    return () => { delete window.__motion; };
  }, []);

  /* Anchor jumps go through Lenis. Left to the browser they run a
     native scroll underneath the interpolated one and the page
     arrives twice. */
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        scrollToTarget(0);
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      window.history.replaceState(null, '', href);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  /* Every route has a different measured height and different
     sticky offsets, so the triggers have to be recomputed once the
     new page has laid out. */
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 260);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  return (
    <>
      <Cursor />
      <Nav />

      {/* Keyed on pathname (not full location) so hash-only changes don't retrigger */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/projects/c-cpp" element={<PageTransition><CProjectsPage /></PageTransition>} />
          <Route path="/projects/docker-devops" element={<PageTransition><DockerDevOpsPage /></PageTransition>} />
          <Route path="/projects/motion-design" element={<PageTransition><MotionDesignPage /></PageTransition>} />
          <Route path="/projects/visual-design" element={<PageTransition><VisualDesignPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>

      <Chatbot />

      {intro && <Preloader onDone={() => setIntro(false)} />}
    </>
  );
}

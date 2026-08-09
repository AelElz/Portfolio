import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { spring } from '../motion/springs';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#creative', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

/* The deep-dive pages behind the Skills chevron. Direct, specific labels —
   they name their contents, not a vague umbrella (§16). */
const SKILL_PAGES = [
  { to: '/projects/c-cpp', label: 'C / C++' },
  { to: '/projects/docker-devops', label: 'Docker & DevOps' },
  { to: '/projects/motion-design', label: 'Motion Design' },
  { to: '/projects/visual-design', label: 'Visual Design' },
];

const EXTERNAL = [
  {
    href: 'https://drive.google.com/drive/folders/1Vl_DFiYwikwCEADdW0VSgKDCcGFCmEYV?usp=drive_link',
    label: 'Creative Work ↗',
  },
  { href: 'https://github.com/AelElz', label: 'GitHub ↗' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'dark'
  );
  const navRef = useRef(null);
  const switchTimer = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  /* Theme is a token swap on <html>. The transient class eases the
     brightness jump — §14 warns against abrupt dark↔light cuts. */
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.add('theme-switching');
    root.dataset.theme = next;
    root.style.colorScheme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'light' ? '#F5F5F7' : '#0A0A0A');
    try {
      localStorage.setItem('theme', next);
    } catch { /* private mode — the choice just won't persist */ }
    clearTimeout(switchTimer.current);
    switchTimer.current = setTimeout(
      () => root.classList.remove('theme-switching'),
      400
    );
    setTheme(next);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) {
      setActiveId('');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  // Never trap the user in an open menu (§16 Wayfinding): Escape closes
  // both surfaces, and so does any press outside the nav — no two
  // translucent layers left stacked by accident (§1 layer model).
  useEffect(() => {
    if (!menuOpen && !skillsOpen) return;
    const close = () => {
      setMenuOpen(false);
      setSkillsOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && close();
    const onPress = (e) => {
      if (!navRef.current?.contains(e.target)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPress);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPress);
    };
  }, [menuOpen, skillsOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSkillsOpen(false);
  }, [location.pathname, location.hash]);

  const handleLinkClick = (e, href) => {
    setMenuOpen(false);
    setSkillsOpen(false);
    if (!onHome) {
      e.preventDefault();
      navigate(`/${href}`);
    }
  };

  return (
    <nav id="nav" ref={navRef} className={scrolled ? 'scrolled' : ''}>
      <a href="#" onClick={(e) => handleLinkClick(e, '')} aria-label="Back to top">
        <img src="/iconlogo2.png" alt="Ayoub Elazhari" className="nav-logo-img" />
      </a>

      <ul className="nav-links">
        {LINKS.map(({ href, label }) => {
          const isSkills = href === '#skills';
          return (
            <li key={href} className={isSkills ? 'nav-dd-wrap' : undefined}>
              <a
                href={onHome ? href : `/${href}`}
                onClick={(e) => handleLinkClick(e, href)}
                className={onHome && activeId === href.slice(1) ? 'is-active' : ''}
              >
                {label}
              </a>

              {isSkills && (
                <>
                  {/* The chevron opens the page picker; the text still
                      jumps to the section — two intents, two targets. */}
                  <button
                    className={`nav-dd-toggle${skillsOpen ? ' is-open' : ''}`}
                    aria-label="Choose a skill page"
                    aria-haspopup="menu"
                    aria-expanded={skillsOpen}
                    onClick={() => setSkillsOpen((v) => !v)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  </button>

                  <AnimatePresence>
                    {skillsOpen && (
                      <motion.div
                        className="nav-dd"
                        role="menu"
                        key="skills-dd"
                        initial={{ opacity: 0, y: -6, x: '-50%', scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                        exit={{ opacity: 0, y: -6, x: '-50%', scale: 0.96 }}
                        /* Anchored to its trigger, no bounce on a click (§4, §7) */
                        transition={spring.move}
                        style={{ transformOrigin: 'top center' }}
                      >
                        {SKILL_PAGES.map(({ to, label: pageLabel }) => (
                          <Link
                            key={to}
                            to={to}
                            role="menuitem"
                            className={`nav-menu-link${location.pathname === to ? ' is-active' : ''}`}
                            onClick={() => setSkillsOpen(false)}
                          >
                            {pageLabel}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <div className="nav-right">
        <div className="nav-actions">
          {EXTERNAL.map(({ href, label }) => (
            <a key={href} href={href} target="_blank" rel="noreferrer" className="nav-btn">
              {label}
            </a>
          ))}
        </div>

        {/* Sun in the dark, moon in the light — the glyph names where the
            click takes you. CSS on [data-theme] swaps them (§7: one object
            rotating into its other state, not two unrelated icons). */}
        <button
          className="theme-toggle"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
        >
          <svg className="tt-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg className="tt-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        {/* ── Mobile ── the section links have to live somewhere (§16 Wayfinding) */}
        <button
          id="nav-menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          className={menuOpen ? 'is-open' : ''}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="nav-menu"
            key="nav-menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={spring.move}
            style={{ transformOrigin: 'top right' }}
          >
            <ul>
              {LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={onHome ? href : `/${href}`}
                    onClick={(e) => handleLinkClick(e, href)}
                    className={`nav-menu-link${onHome && activeId === href.slice(1) ? ' is-active' : ''}`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            {/* Same destinations as the desktop chevron — parity across inputs (§16.5) */}
            <div className="nav-menu-group">
              {SKILL_PAGES.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`nav-menu-link${location.pathname === to ? ' is-active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="nav-menu-external">
              {EXTERNAL.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="nav-menu-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

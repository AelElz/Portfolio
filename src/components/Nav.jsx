import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { spring } from '../motion/springs';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#creative', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

const SKILL_PAGES = [
  { to: '/projects/c-cpp', label: 'C / C++' },
  { to: '/projects/docker-devops', label: 'Docker & DevOps' },
  { to: '/projects/motion-design', label: 'Motion Design' },
  { to: '/projects/visual-design', label: 'UI/UX Projects' },
];

const EXTERNAL = [
  {
    href: 'https://drive.google.com/drive/folders/1Vl_DFiYwikwCEADdW0VSgKDCcGFCmEYV?usp=drive_link',
    label: 'Creative Work ↗',
  },
  { href: 'https://github.com/AelElz', label: 'GitHub ↗' },
];

/* The nav's own centre line. Whatever chapter crosses it is what
   the pill is sitting on, and therefore what it has to invert
   against. Measured from the element rather than hard-coded,
   because the pill's height rides the fluid root — it is ~64px
   on a phone and ~80px on a large display, so a fixed probe
   would drift off centre exactly where the page is biggest. */
const FALLBACK_PROBE_Y = 44;

export default function Nav() {
  const [activeId, setActiveId] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [over, setOver] = useState('dark');
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  /* ── Chapter-adaptive colouring ──
     Panels overlap in the sticky stack, so more than one chapter
     can cross the probe line at once. Taking the first match
     picks whichever is earliest in the DOM, which is the one
     UNDERNEATH — the pill then inverts against a chapter the user
     cannot see. The visible one is the highest z-index. */
  useEffect(() => {
    let lastY = -1;
    let lastTheme = '';

    const probe = () => {
      const navRect = navRef.current?.getBoundingClientRect();
      const probeY = navRect ? navRect.top + navRect.height / 2 : FALLBACK_PROBE_Y;

      const sections = document.querySelectorAll('[data-theme-section]');
      let winner = null;
      let winnerZ = -Infinity;

      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top > probeY || rect.bottom < probeY) return;
        const z = parseInt(window.getComputedStyle(el).zIndex, 10) || 0;
        if (z >= winnerZ) {
          winnerZ = z;
          winner = el;
        }
      });

      const theme = winner?.dataset.themeSection || 'dark';
      if (theme !== lastTheme) {
        lastTheme = theme;
        setOver(theme);
      }
    };

    /* Runs on GSAP's ticker, which is already the site's single rAF
       loop — but only re-measures when the page actually moved. */
    const tick = () => {
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      probe();
    };

    probe();
    gsap.ticker.add(tick);
    window.addEventListener('resize', probe);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', probe);
    };
  }, [location.pathname]);

  /* ── Active section ──
     NOT threshold 0.5: a chapter taller than the viewport never
     reaches 50% visible, so it would never fire. A centre-line
     band fires on whatever is crossing the middle of the screen,
     whatever its height. */
  useEffect(() => {
    const sections = document.querySelectorAll('section[id], [data-theme-section][id]');
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
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  // Never trap the user in an open menu: Escape closes both
  // surfaces, and so does any press outside the nav.
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
    /* On Home the global anchor handler in App routes this through
       Lenis — letting the browser jump would fight the smoothing. */
  };

  return (
    <nav id="nav" ref={navRef} data-over={over}>
      <a
        href="#"
        className="nav-brand"
        onClick={(e) => handleLinkClick(e, '')}
        aria-label="Back to top"
      >
        <span className="nav-mark" aria-hidden="true" />
        <span className="nav-wordmark">Ayoub El Azhari</span>
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
            {/* Same destinations as the desktop chevron — parity across inputs */}
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

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { spring } from '../motion/springs';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#creative', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
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
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

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
  // it, and so does any press outside the nav — otherwise the menu sheet
  // ends up stacked over the chat sheet, two translucent layers deep (§1).
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    const onPress = (e) => {
      if (!navRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPress);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPress);
    };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  const handleLinkClick = (e, href) => {
    setMenuOpen(false);
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
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={onHome ? href : `/${href}`}
              onClick={(e) => handleLinkClick(e, href)}
              className={onHome && activeId === href.slice(1) ? 'is-active' : ''}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        {EXTERNAL.map(({ href, label }) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" className="nav-btn">
            {label}
          </a>
        ))}
      </div>

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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="nav-menu"
            key="nav-menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            /* No bounce: a tap carried no momentum into this (§4).
               Origin is the toggle, so it grows from what opened it (§7). */
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

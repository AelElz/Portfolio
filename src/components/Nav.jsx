import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#creative', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
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

  const handleLinkClick = (e, href) => {
    if (!onHome) {
      e.preventDefault();
      navigate(`/${href}`);
    }
  };

  return (
    <nav id="nav" ref={navRef} className={scrolled ? 'scrolled' : ''}>
      <a href="#" onClick={(e) => handleLinkClick(e, '')}>
        <img src="/iconlogo2.png" alt="Ayoub Elazhari" className="nav-logo-img" />
      </a>
      <ul className="nav-links">
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={onHome ? href : `/${href}`}
              onClick={(e) => handleLinkClick(e, href)}
              style={{ color: onHome && activeId === href.slice(1) ? 'var(--c-text-1)' : '' }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        <a
          href="https://drive.google.com/drive/folders/1Vl_DFiYwikwCEADdW0VSgKDCcGFCmEYV?usp=drive_link"
          target="_blank"
          rel="noreferrer"
          className="nav-btn fill-hover"
        >
          Creative Work ↗
        </a>
        <a href="https://github.com/AelElz" target="_blank" rel="noreferrer" className="nav-btn fill-hover">
          GitHub ↗
        </a>
      </div>
    </nav>
  );
}

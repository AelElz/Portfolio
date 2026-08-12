import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Panel } from './Panel';
import Reveal from './Reveal';

gsap.registerPlugin(ScrollTrigger);

const TAGS = ['1337 / 42 Network', 'Morocco', 'Systems Programmer', 'DevOps', 'Creative Director'];

export default function About() {
  const panelRef = useRef(null);

  /* The second chapter is the one that establishes the stack: it
     scales up as it climbs over the hero, so it reads as arriving
     from behind rather than scrolling past. Scrubbed, so it is
     always exactly where the scroll put it. */
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 681px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          panel.querySelector('.panel__inner'),
          { scale: 0.86 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
      return () => mm.revert();
    }, panel);

    return () => ctx.revert();
  }, []);

  return (
    <Panel theme="light" id="about" panelRef={panelRef}>
      <div className="about-grid">
        <Reveal className="about-avatar-wrap">
          <img
            className="about-avatar"
            src="https://avatars.githubusercontent.com/u/155688529?v=4"
            alt="Ayoub Elazhari"
          />
          <div className="about-avatar-ring" />
        </Reveal>

        <div className="about-text">
          <Reveal as="p" className="section-label">About</Reveal>
          <Reveal as="h2" className="section-title" delay={0.06}>Ayoub Elazhari</Reveal>
          <Reveal as="p" className="section-body" delay={0.12}>
            I'm a software engineering student at <strong>1337 Coding School</strong> (42 Network, Morocco),
            building low level systems and DevOps infrastructure the hard way, with no hand-holding and no limits.
          </Reveal>
          <Reveal as="p" className="section-body" delay={0.18}>
            Alongside code, I bring 4+ years of creative industry experience, video editing, motion graphics, and
            creative direction for clients including <strong>OCP Group, Hilton Hotels,</strong> and{' '}
            <strong>Cleverlytics</strong>. Two worlds, one mindset.
          </Reveal>
          <Reveal className="about-tags" delay={0.24}>
            {TAGS.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </Reveal>
        </div>
      </div>
    </Panel>
  );
}

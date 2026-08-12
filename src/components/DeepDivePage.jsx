import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelStack } from './Panel';
import Reveal from './Reveal';
import Footer from './Footer';
import { scrollToTarget } from '../motion/smooth-scroll';

/* ============================================================
   DeepDivePage — the same chapter rhythm as Home, one chapter
   per project.

   The hero is dark, items alternate from light, and the closing
   chapter takes whichever ground keeps the alternation intact —
   so a two-item page and a three-item page both end correctly
   instead of doubling a ground at the bottom.
   ============================================================ */

/* Two grounds, alternating from the hero's black. The closing
   chapter takes the next slot, so it can never double up on
   whatever ground the last item used. */
const CYCLE = ['light', 'dark'];
export const itemTheme = (i) => CYCLE[i % CYCLE.length];
export const closingTheme = (count) => CYCLE[count % CYCLE.length];

export function DeepDiveHero({ eyebrow, title, intro, backTo = '/#skills' }) {
  return (
    <Panel theme="dark" className="deepdive-hero">
      <Link to={backTo} className="back-link">← Back to Portfolio</Link>
      <Reveal as="p" className="section-label">{eyebrow}</Reveal>
      <Reveal as="h1" className="hero-title deepdive-title" delay={0.06}>{title}</Reveal>
      <Reveal as="p" className="section-body deepdive-intro" delay={0.12}>{intro}</Reveal>
    </Panel>
  );
}

export function DeepDiveClosing({ theme, backTo = '/#skills' }) {
  return (
    <Panel theme={theme} className="deepdive-closing" innerClassName="closing-inner">
      <div className="closing-body">
        <Reveal as="p" className="section-label">Next</Reveal>
        <Reveal as="h2" className="section-title" delay={0.06}>That's the work.</Reveal>
        <Reveal className="closing-actions" delay={0.12}>
          <Link to={backTo} className="btn-primary">Back to Portfolio</Link>
          <a href="mailto:ayoub2elazhari@gmail.com" className="btn-ghost">Get in touch</a>
        </Reveal>
      </div>
      <Footer />
    </Panel>
  );
}

export default function DeepDivePage({ eyebrow, title, intro, backTo = '/#skills', items, diagrams }) {
  useEffect(() => {
    scrollToTarget(0, { immediate: true });
  }, []);

  return (
    <PanelStack>
      <DeepDiveHero eyebrow={eyebrow} title={title} intro={intro} backTo={backTo} />

      {items.map((item, i) => {
        const Diagram = diagrams[item.diagram];
        return (
          <Panel theme={itemTheme(i)} id={item.id} key={item.id} className="deepdive-panel">
            <Reveal as="div" className="deepdive-header">
              <span className="deepdive-index">{item.index}</span>
              <div>
                <h2 className="deepdive-name">{item.name}</h2>
                <p className="deepdive-tagline">{item.tagline}</p>
              </div>
            </Reveal>

            <div className="deepdive-grid">
              <Reveal as="div" delay={0.06}>
                <h3 className="deepdive-subhead">What it is</h3>
                <p className="deepdive-body">{item.what}</p>

                <h3 className="deepdive-subhead">How it works</h3>
                <ul className="deepdive-list">
                  {item.how.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>

                <div className="deepdive-tags">
                  {item.concepts.map((concept) => (
                    <span className="tag" key={concept}>{concept}</span>
                  ))}
                </div>

                <a href={item.href} target="_blank" rel="noreferrer" className="project-link deepdive-github">
                  View on GitHub
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </Reveal>

              <Reveal as="div" className="deepdive-visual" delay={0.12}>
                {Diagram ? <Diagram /> : null}
              </Reveal>
            </div>
          </Panel>
        );
      })}

      <DeepDiveClosing theme={closingTheme(items.length)} backTo={backTo} />
    </PanelStack>
  );
}

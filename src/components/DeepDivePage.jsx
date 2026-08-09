import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

export default function DeepDivePage({ eyebrow, title, intro, backTo = '/#skills', items, diagrams }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="deepdive-page">
      <section className="deepdive-hero">
        <div className="container">
          <Link to={backTo} className="back-link">← Back to Portfolio</Link>
          <Reveal as="p" className="section-label">{eyebrow}</Reveal>
          <Reveal as="h1" className="section-title" delay={0.06}>{title}</Reveal>
          <Reveal as="p" className="section-body" delay={0.12}>{intro}</Reveal>
        </div>
      </section>

      {items.map((item) => {
        const Diagram = diagrams[item.diagram];
        return (
          <section className="deepdive-section" key={item.id} id={item.id}>
            <div className="container">
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
                    {item.how.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>

                  <div className="deepdive-tags">
                    {item.concepts.map((concept) => (
                      <span className="tag" key={concept}>{concept}</span>
                    ))}
                  </div>

                  <a href={item.href} target="_blank" rel="noreferrer" className="project-link deepdive-github">
                    View on GitHub
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </Reveal>

                <Reveal as="div" className="deepdive-visual" delay={0.12}>
                  <Diagram />
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}

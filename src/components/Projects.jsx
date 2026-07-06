import Reveal from './Reveal';
import { PROJECTS } from '../data/projects';

const DELAYS = [0, 0.1, 0.2, 0.1, 0.2];

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <div className="projects-header">
          <Reveal as="p" className="section-label">Projects</Reveal>
          <Reveal as="h2" className="section-title" delay={0.1}>What I've built</Reveal>
          <Reveal as="p" className="section-body" delay={0.2}>
            Every project from the 1337 curriculum is built from scratch, no frameworks, no shortcuts.
          </Reveal>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((project, i) => (
            <Reveal
              as="div"
              key={project.name}
              className={`project-card${project.featured ? ' featured' : ''}`}
              delay={DELAYS[i % DELAYS.length]}
            >
              <span className="project-badge">{project.badge}</span>
              <div className="project-name">{project.name}</div>
              <div className="project-desc">{project.desc}</div>
              <div className="project-footer">
                <div className="project-lang">
                  <span className={`lang-dot ${project.langClass}`} />
                  {project.lang}
                </div>
                <a href={project.href} target="_blank" rel="noreferrer" className="project-link">
                  View on GitHub
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

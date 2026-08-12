import { Panel } from './Panel';
import Reveal from './Reveal';
import RevealRow from './RevealRow';
import { PROJECTS } from '../data/projects';

export default function Projects() {
  return (
    <Panel theme="light" id="projects">
      <div className="projects-header">
        <Reveal as="p" className="section-label">Projects</Reveal>
        <Reveal as="h2" className="section-title" delay={0.06}>What I've built</Reveal>
        <Reveal as="p" className="section-body" delay={0.12}>
          Every project from the 1337 curriculum is built from scratch, no frameworks, no shortcuts.
        </Reveal>
      </div>

      <div className="projects-list">
        {PROJECTS.map((project, i) => (
          <Reveal as="div" key={project.name} delay={Math.min(0.06 * i, 0.18)}>
            <RevealRow href={project.href} external label={project.name}>
              <span className="reveal-row__meta">
                <span className="project-lang">
                  <span className={`lang-dot ${project.langClass}`} />
                  {project.lang}
                </span>
                <span className="project-badge">{project.badge}</span>
                <svg className="reveal-row__arrow" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <span className="reveal-row__desc">{project.desc}</span>
            </RevealRow>
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}

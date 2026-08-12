import { Link } from 'react-router-dom';
import { Panel } from './Panel';
import Reveal from './Reveal';
import { SKILLS } from '../data/skills';

/* Stagger caps at 0.06s per item — enough to read as a sequence,
   not enough to make anyone wait for it. */
const DELAYS = [0, 0.06, 0.12, 0.18, 0, 0.06];

export default function Skills() {
  return (
    <Panel theme="dark" id="skills">
      <div className="skills-header">
        <Reveal as="p" className="section-label">Skills</Reveal>
        <Reveal as="h2" className="section-title" delay={0.06}>What I work with</Reveal>
      </div>

      <div className="skills-grid">
        {SKILLS.map((skill, i) => (
          <Reveal as="div" key={skill.name} className="skill-card" delay={DELAYS[i % DELAYS.length]}>
            {/* The icon is masked, not drawn: the PNGs are a flat pale
                yellow, so painting through their alpha is what keeps
                them inside the three-colour palette and lets them
                take the chapter's ink. */}
            <span
              className="skill-icon"
              aria-hidden="true"
              style={{ '--icon': `url(${skill.iconImg})` }}
            />
            <div className="skill-name">{skill.name}</div>
            {skill.link ? (
              <Link to={skill.link} className="skill-link">
                <span>{skill.linkLabel}</span>
                <span className="skill-link-circle">↗</span>
              </Link>
            ) : (
              <div className="skill-desc">{skill.desc}</div>
            )}
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}

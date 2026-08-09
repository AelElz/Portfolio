import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { SKILLS } from '../data/skills';

/* Stagger caps at 0.06s per item (§3.3). */
const DELAYS = [0, 0.06, 0.12, 0.18, 0, 0.06];

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <div className="skills-header">
          <Reveal as="p" className="section-label">Skills</Reveal>
          <Reveal as="h2" className="section-title" delay={0.06}>What I work with</Reveal>
        </div>
        <div className="skills-grid">
          {SKILLS.map((skill, i) => (
            <Reveal as="div" key={skill.name} className="skill-card" delay={DELAYS[i % DELAYS.length]}>
              <img
                src={skill.iconImg}
                alt=""
                aria-hidden="true"
                className="skill-icon-bg"
                style={{ '--icon-scale': skill.iconScale || 1 }}
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
      </div>
    </section>
  );
}

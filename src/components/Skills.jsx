import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { SKILLS } from '../data/skills';

const DELAYS = [0.1, 0.2, 0.3, 0.4, 0.1, 0.2];

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <div className="skills-header">
          <Reveal as="p" className="section-label">Skills</Reveal>
          <Reveal as="h2" className="section-title" delay={0.1}>What I work with</Reveal>
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

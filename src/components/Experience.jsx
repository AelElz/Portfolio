import Reveal from './Reveal';
import { EXPERIENCE } from '../data/experience';

const DELAYS = [0, 0.1, 0.2];

export default function Experience() {
  return (
    <section id="creative">
      <div className="container">
        <div className="creative-header">
          <Reveal as="p" className="section-label">Experience</Reveal>
          <Reveal as="h2" className="section-title" delay={0.1}>Two tracks, one mind</Reveal>
          <Reveal as="p" className="section-body" delay={0.2}>
            Engineering and creative work aren't separate careers, they're the same obsession with craft.
          </Reveal>
        </div>
        <div className="exp-list">
          {EXPERIENCE.map((item, i) => (
            <Reveal as="div" key={item.role} className="exp-item" delay={DELAYS[i % DELAYS.length]}>
              <div className="exp-date">{item.date}</div>
              <div>
                <div className="exp-role">{item.role}</div>
                <div className="exp-company">{item.company}</div>
                <div className="exp-body">{item.body}</div>
                <div className="exp-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="exp-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

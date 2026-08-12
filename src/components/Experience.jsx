import { Panel } from './Panel';
import Reveal from './Reveal';
import { EXPERIENCE } from '../data/experience';

const DELAYS = [0, 0.06, 0.12];

export default function Experience() {
  return (
    <Panel theme="dark" id="creative">
      <div className="creative-header">
        <Reveal as="p" className="section-label">Experience</Reveal>
        <Reveal as="h2" className="section-title" delay={0.06}>Two tracks, one mind</Reveal>
        <Reveal as="p" className="section-body" delay={0.12}>
          Engineering and creative work aren't separate careers, they're the same obsession with craft.
        </Reveal>
      </div>

      <div className="exp-list">
        {EXPERIENCE.map((item, i) => (
          <Reveal as="div" key={item.role} className="exp-item" delay={DELAYS[i % DELAYS.length]}>
            <div className="exp-date">{item.date}</div>
            <div className="exp-body-col">
              <div className="exp-role">{item.role}</div>
              <div className="exp-company">{item.company}</div>
              <div className="exp-body">{item.body}</div>
              <div className="exp-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}

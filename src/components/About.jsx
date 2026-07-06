import Reveal from './Reveal';

const TAGS = ['1337 / 42 Network', 'Morocco', 'Systems Programmer', 'DevOps', 'Creative Director'];

export default function About() {
  return (
    <section id="about">
      <div className="container">
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
            <Reveal as="h2" className="section-title" delay={0.1}>Ayoub Elazhari</Reveal>
            <Reveal as="p" className="section-body" delay={0.2}>
              I'm a software engineering student at <strong>1337 Coding School</strong> (42 Network, Morocco),
              building low level systems and DevOps infrastructure the hard way, with no hand-holding and no limits.
            </Reveal>
            <Reveal as="p" className="section-body" delay={0.3}>
              Alongside code, I bring 4+ years of creative industry experience, video editing, motion graphics, and
              creative direction for clients including <strong>OCP Group, Hilton Hotels,</strong> and{' '}
              <strong>Cleverlytics</strong>. Two worlds, one mindset.
            </Reveal>
            <Reveal className="about-tags" delay={0.4}>
              {TAGS.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

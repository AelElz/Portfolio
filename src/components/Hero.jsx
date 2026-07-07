export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-orbits" aria-hidden="true">
        <div className="orbit-core" />
        <div className="orbit-ring orbit-ring-1" />
        <div className="orbit-ring orbit-ring-2" />
        <div className="orbit-ring orbit-ring-3" />
        <div className="orbit-ring orbit-ring-4" />
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">Software Engineer · Creative Director</p>
        <h1 className="hero-title">
          Building systems.<br />
          <span className="gold">Crafting experiences.</span>
        </h1>
        <p className="hero-sub">
          1337 coding school student from 42 network, low level systems, DevOps infrastructure, and 4+ years in
          creative direction.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary">View Projects</a>
          <a href="#skills" className="btn-ghost">Explore Skills</a>
          <a href="#contact" className="btn-ghost">Get in touch</a>
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

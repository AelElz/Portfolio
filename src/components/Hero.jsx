import { motion } from 'framer-motion';
import { duration, ease } from '../motion/springs';

/* Entrance is staggered, but tightly — content must not be gated
   behind its own animation (§1). Total settle is under 0.5s. */
const rise = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.state * 2, ease: ease.out, delay },
});

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
        <motion.p className="hero-eyebrow" {...rise(0)}>
          Software Engineer · Creative Director
        </motion.p>
        <motion.h1 className="hero-title" {...rise(0.06)}>
          Building systems.<br />
          <span className="hero-title-accent">Crafting experiences.</span>
        </motion.h1>
        <motion.p className="hero-sub" {...rise(0.12)}>
          1337 coding school student from 42 network, low level systems, DevOps infrastructure, and 4+ years in
          creative direction.
        </motion.p>
        <motion.div className="hero-actions" {...rise(0.18)}>
          <a href="#projects" className="btn-primary">View Projects</a>
          <a href="#skills" className="btn-ghost">Explore Skills</a>
          <a href="#contact" className="btn-ghost">Get in touch</a>
        </motion.div>
      </div>

      <motion.div className="scroll-hint" {...rise(0.3)}>
        <span>Scroll</span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  );
}

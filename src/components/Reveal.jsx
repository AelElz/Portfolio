import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '../motion/springs';

/* Scroll reveals must never gate content. 0.45s, ≤24px of travel, and
   stagger capped at 0.06s per item — a reveal that takes most of a
   second to finish is latency wearing a costume (§3.3). */
const MOTION = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const FADE = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Reveal({ as = 'div', delay = 0, className, children, ...props }) {
  const Component = motion[as];
  const reduced = useReducedMotion();

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
      variants={reduced ? FADE : MOTION}
      transition={
        reduced
          ? { duration: 0.2, ease: ease.out }
          : { duration: 0.45, ease: ease.out, delay }
      }
      {...props}
    >
      {children}
    </Component>
  );
}

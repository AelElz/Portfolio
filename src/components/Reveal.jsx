import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '../motion/springs';

/* Scroll reveals must never gate content. Short travel, ≤0.06s stagger,
   and everything falls back to a cross-fade under reduced motion (§3.3, §14).

   `from` sets the entrance direction. 'up' is the house default; 'left' /
   'right' are for showcase media that should read as sliding into place. */
const OFFSETS = {
  up: { x: 0, y: 24 },
  left: { x: -48, y: 0 },
  right: { x: 48, y: 0 },
};

const FADE = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Reveal({ as = 'div', delay = 0, from = 'up', className, children, ...props }) {
  const Component = motion[as];
  const reduced = useReducedMotion();
  const offset = OFFSETS[from] ?? OFFSETS.up;

  const variants = reduced
    ? FADE
    : {
        hidden: { opacity: 0, x: offset.x, y: offset.y },
        visible: { opacity: 1, x: 0, y: 0 },
      };

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
      variants={variants}
      transition={
        reduced
          ? { duration: 0.2, ease: ease.out }
          : { duration: from === 'up' ? 0.45 : 0.55, ease: ease.out, delay }
      }
      {...props}
    >
      {children}
    </Component>
  );
}

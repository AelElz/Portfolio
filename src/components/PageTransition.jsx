import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '../motion/springs';

/* The curtain lifts up to reveal the page and falls back down the same
   way to cover it — one path, travelled in both directions (§7). Its
   ease is symmetric, so the return genuinely mirrors the outbound. */
const curtainVariants = {
  initial: { y: '0%' },
  enter: { y: '-100%', transition: { duration: 0.55, ease: ease.both, delay: 0.05 } },
  exit: { y: '0%', transition: { duration: 0.4, ease: ease.both } },
};

const contentVariants = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out, delay: 0.2 } },
  exit: { opacity: 0.4, y: -16, transition: { duration: 0.4, ease: ease.in } },
};

/* Reduced motion keeps the comprehension cue — you still see that the
   page changed — but drops the vestibular part entirely (§14). */
const fadeVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: ease.out } },
};

export default function PageTransition({ children }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div initial="initial" animate="enter" exit="exit" variants={fadeVariants}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="enter" exit="exit">
      <motion.div variants={contentVariants}>{children}</motion.div>
      <motion.div className="page-curtain" variants={curtainVariants} aria-hidden="true" />
    </motion.div>
  );
}

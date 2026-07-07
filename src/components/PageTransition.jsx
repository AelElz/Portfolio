import { motion } from 'framer-motion';

const EASE = [0.76, 0, 0.24, 1];

const contentVariants = {
  initial: { opacity: 0, y: 28 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
  exit: {
    opacity: 0.4,
    y: -20,
    transition: { duration: 0.45, ease: EASE },
  },
};

/* The curtain lifts up to reveal the page, and falls back down to cover it
   when navigating away. It rests offscreen above the viewport in between. */
const curtainVariants = {
  initial: { y: '0%' },
  enter: {
    y: '-100%',
    transition: { duration: 0.65, ease: EASE, delay: 0.08 },
  },
  exit: {
    y: '0%',
    transition: { duration: 0.45, ease: EASE },
  },
};

export default function PageTransition({ children }) {
  return (
    <motion.div initial="initial" animate="enter" exit="exit">
      <motion.div variants={contentVariants}>{children}</motion.div>
      <motion.div className="page-curtain" variants={curtainVariants} aria-hidden="true" />
    </motion.div>
  );
}

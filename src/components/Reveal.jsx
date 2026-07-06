import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function Reveal({ as = 'div', delay = 0, className, children, ...props }) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
      variants={variants}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      {...props}
    >
      {children}
    </Component>
  );
}

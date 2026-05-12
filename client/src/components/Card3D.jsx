import { motion } from 'framer-motion';

export default function Card3D({ children, className = '' }) {
  return (
    <motion.div
      className={`bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-primary/10 backdrop-blur-sm ${className}`}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

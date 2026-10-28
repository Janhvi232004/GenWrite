import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIOrb from '@/components/AIOrb';

/** Small orb pinned to the corner of app pages. Click to start a new generation. */
export default function FloatingOrb() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 16 }}
      className="fixed bottom-5 right-5 z-40 hidden sm:block"
    >
      <Link to="/app" aria-label="New generation" title="New generation" className="group block">
        <AIOrb size={56} />
        <span className="glass pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
          New generation
        </span>
      </Link>
    </motion.div>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

/** Sun / moon button that switches between light and dark mode. */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="neon-border relative flex h-10 w-10 items-center justify-center overflow-visible rounded-xl border border-fg/10 bg-fg/5 transition-colors hover:bg-fg/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex"
        >
          {isDark ? <Sun className="h-[18px] w-[18px] text-amber-300" /> : <Moon className="h-[18px] w-[18px] text-primary" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

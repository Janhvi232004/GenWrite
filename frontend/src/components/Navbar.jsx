import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/app', label: 'Workspace' },
  { to: '/history', label: 'History' },
];

/** Floating glass navigation bar with a scroll-progress line. */
export default function Navbar({ theme, onToggleTheme }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Scroll progress bar (top of the screen)
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });

  // Close the mobile menu when the page changes
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary via-accent to-secondary"
      />

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl px-3 sm:px-4"
        >
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.to;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(
                      'relative rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                      active ? 'text-fg' : 'text-fg/60 hover:text-fg'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl border border-fg/10 bg-fg/10"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <Link to="/app" className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')}>
              Start Generating <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-fg/10 bg-fg/5 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="glass-strong mx-auto mt-2 max-w-6xl rounded-2xl p-2 md:hidden"
            >
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    pathname === link.to ? 'bg-fg/10 text-fg' : 'text-fg/70 hover:bg-fg/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/app" className={cn(buttonVariants({ size: 'md' }), 'mt-2 w-full')}>
                Start Generating <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

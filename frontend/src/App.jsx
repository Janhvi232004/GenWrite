import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Background from '@/components/Background';
import Footer from '@/components/Footer';
import FloatingOrb from '@/components/FloatingOrb';
import MouseGlow from '@/components/MouseGlow';
import Navbar from '@/components/Navbar';
import useTheme from '@/hooks/useTheme';
import History from '@/pages/History';
import Landing from '@/pages/Landing';
import Workspace from '@/pages/Workspace';

/** Wraps every page so route changes fade/slide smoothly. */
function PageTransition({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  // Start every page at the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <Background />
      <MouseGlow />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar theme={theme} onToggleTheme={toggle} />

        <div className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
              <Route path="/app" element={<PageTransition><Workspace /></PageTransition>} />
              <Route path="/history" element={<PageTransition><History /></PageTransition>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>

        <Footer />
      </div>

      {location.pathname !== '/' && <FloatingOrb />}
    </>
  );
}

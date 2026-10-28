import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SIZE = 420;

/** A soft glow that trails the mouse cursor (hidden on touch devices). */
export default function MouseGlow() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springX = useSpring(x, { stiffness: 110, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 110, damping: 22, mass: 0.6 });

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX - SIZE / 2);
      y.set(e.clientY - SIZE / 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: springX,
        y: springY,
        width: SIZE,
        height: SIZE,
        background:
          'radial-gradient(circle, rgba(124,58,237,0.20) 0%, rgba(6,182,212,0.09) 40%, transparent 70%)',
      }}
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden rounded-full md:block"
    />
  );
}

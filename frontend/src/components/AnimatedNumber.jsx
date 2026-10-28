import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

/** Counts smoothly from its previous value to `value`. */
export default function AnimatedNumber({ value, duration = 1.3 }) {
  const [display, setDisplay] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return <span className="tabular-nums">{display.toLocaleString()}</span>;
}

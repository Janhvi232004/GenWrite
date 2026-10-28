import { useCallback, useEffect, useState } from 'react';

/**
 * Reveals `text` progressively, like an AI typing.
 * Longer texts type faster so the animation always lasts a few seconds.
 * Returns { shown, done, skip }.
 */
export default function useTypewriter(text) {
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const [count, setCount] = useState(reduceMotion ? text.length : 0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    setCount(0);
    const step = Math.max(2, Math.ceil(text.length / 320));
    const timer = window.setInterval(() => {
      setCount((c) => {
        const next = Math.min(text.length, c + step);
        if (next >= text.length) window.clearInterval(timer);
        return next;
      });
    }, 14);
    return () => window.clearInterval(timer);
  }, [text, reduceMotion]);

  const skip = useCallback(() => setCount(text.length), [text]);

  return { shown: text.slice(0, count), done: count >= text.length, skip };
}

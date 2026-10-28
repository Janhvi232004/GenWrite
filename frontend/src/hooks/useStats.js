import { useCallback, useEffect, useMemo, useState } from 'react';
import { countWords } from '@/lib/utils';

const STORAGE_KEY = 'genwrite-lifetime-generations';
const DAY_MS = 24 * 60 * 60 * 1000;

function readLifetime() {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

/**
 * Dashboard numbers calculated from the history list.
 *  - total:  every generation ever made (survives deleting history items)
 *  - saved:  items currently stored in the library
 *  - words:  total words across saved items
 *  - recent: generations in the last 24 hours
 */
export default function useStats(items, loading) {
  const [lifetime, setLifetime] = useState(readLifetime);

  const save = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  };

  // Make sure the lifetime counter is never lower than what is in the library.
  useEffect(() => {
    if (!loading && items.length > lifetime) {
      setLifetime(items.length);
      save(items.length);
    }
  }, [items.length, loading, lifetime]);

  /** Call once after each successful generation. */
  const bumpGeneration = useCallback(() => {
    setLifetime((n) => {
      save(n + 1);
      return n + 1;
    });
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    const words = items.reduce((sum, item) => sum + countWords(item.generated_content), 0);
    const recent = items.filter((item) => now - new Date(item.created_at).getTime() < DAY_MS).length;
    return {
      total: Math.max(lifetime, items.length),
      saved: items.length,
      words,
      recent,
      latest: items[0] || null,
    };
  }, [items, lifetime]);

  return { stats, bumpGeneration };
}

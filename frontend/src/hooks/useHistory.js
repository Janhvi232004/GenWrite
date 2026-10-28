import { useCallback, useEffect, useState } from 'react';
import { api } from '@/services/api';

/** Loads the saved content list and exposes add / remove helpers. */
export default function useHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await api.getHistory());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Put a freshly generated item at the top without refetching. */
  const add = useCallback((item) => {
    setItems((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);
  }, []);

  /** Delete on the server, then remove from the list. Throws on failure. */
  const remove = useCallback(async (id) => {
    await api.deleteItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { items, loading, error, refresh, add, remove };
}

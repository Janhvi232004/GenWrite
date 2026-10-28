import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { ToastContext } from '@/hooks/useToast';

const STYLES = {
  success: { icon: CheckCircle2, color: 'text-emerald-500' },
  error: { icon: AlertCircle, color: 'text-rose-500' },
  info: { icon: Info, color: 'text-secondary' },
};

let nextId = 1;

/** Wrap the app with <Toaster> to enable useToast(). */
export default function Toaster({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, message) => {
    const id = nextId++;
    setToasts((list) => [...list.slice(-3), { id, type, message }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3200);
  }, []);

  const api = useMemo(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const { icon: Icon, color } = STYLES[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="glass-strong pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-sm"
              >
                <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                <span>{t.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

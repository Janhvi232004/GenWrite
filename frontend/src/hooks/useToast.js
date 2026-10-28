import { createContext, useContext } from 'react';

/** Context filled by <Toaster /> (see components/Toaster.jsx). */
export const ToastContext = createContext(null);

/**
 * Usage:
 *   const toast = useToast();
 *   toast.success('Copied!');   toast.error('Oops');   toast.info('Hi');
 */
export default function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <Toaster>');
  return ctx;
}

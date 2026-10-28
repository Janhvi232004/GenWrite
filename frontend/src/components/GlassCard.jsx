import { cn } from '@/lib/utils';

/**
 * Glassmorphism card with an optional neon border and a spotlight that
 * follows the mouse. Extra props (onClick, id, ...) are passed to the div.
 */
export default function GlassCard({ children, className, neon = true, lift = false, ...props }) {
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={handleMove}
      className={cn(
        'glass spotlight rounded-3xl transition-all duration-300',
        neon && 'neon-border',
        lift && 'hover:-translate-y-1.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

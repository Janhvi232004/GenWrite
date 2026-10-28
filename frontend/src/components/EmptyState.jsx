import { motion } from 'framer-motion';

/** Animated SVG illustration used by EmptyState. `variant`: "document" | "search" */
function Illustration({ variant }) {
  return (
    <motion.svg
      viewBox="0 0 220 180"
      className="h-40 w-48 sm:h-44 sm:w-56"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="es-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="0.55" stopColor="#EC4899" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
        <radialGradient id="es-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7C3AED" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft glow */}
      <circle cx="110" cy="92" r="82" fill="url(#es-glow)" />

      {/* back card */}
      <rect x="52" y="34" width="104" height="116" rx="16" fill="rgb(var(--fg) / 0.05)" stroke="rgb(var(--fg) / 0.14)" transform="rotate(-8 104 92)" />
      {/* front card */}
      <rect x="64" y="28" width="104" height="122" rx="16" fill="rgb(var(--fg) / 0.08)" stroke="url(#es-grad)" strokeWidth="1.6" />

      {variant === 'search' ? (
        <>
          <circle cx="108" cy="82" r="22" fill="none" stroke="url(#es-grad)" strokeWidth="5" />
          <path d="M124 98l20 20" stroke="url(#es-grad)" strokeWidth="6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="80" y="46" width="48" height="8" rx="4" fill="url(#es-grad)" />
          <rect x="80" y="66" width="72" height="6" rx="3" fill="rgb(var(--fg) / 0.22)" />
          <rect x="80" y="82" width="64" height="6" rx="3" fill="rgb(var(--fg) / 0.16)" />
          <rect x="80" y="98" width="70" height="6" rx="3" fill="rgb(var(--fg) / 0.16)" />
          <rect x="80" y="114" width="40" height="6" rx="3" fill="rgb(var(--fg) / 0.12)" />
        </>
      )}

      {/* sparkles */}
      <motion.path
        d="M176 40l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"
        fill="url(#es-grad)"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        style={{ transformOrigin: '176px 54px' }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <motion.path
        d="M42 120l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"
        fill="#06B6D4"
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
        style={{ transformOrigin: '42px 130px' }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
      />
      <circle cx="184" cy="132" r="4" fill="#EC4899" opacity="0.8" />
    </motion.svg>
  );
}

/** Friendly placeholder shown when there is nothing to display yet. */
export default function EmptyState({ title, description, action, variant = 'document', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center px-6 py-10 text-center ${className}`}
    >
      <Illustration variant={variant} />
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-fg/55">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

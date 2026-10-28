import { motion } from 'framer-motion';

/**
 * The glowing AI orb. Built from layered gradients + rotating rings.
 *  size   - width/height in px
 *  active - spins faster and pulses harder (used while the AI is "thinking")
 */
export default function AIOrb({ size = 220, active = false, float = true, className = '' }) {
  return (
    <motion.div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      animate={float ? { y: [0, -14, 0] } : undefined}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Outer glow */}
      <div
        className="animate-pulse-glow absolute rounded-full bg-gradient-to-tr from-primary/60 via-accent/40 to-secondary/60 blur-3xl"
        style={{ inset: '-28%', animationDuration: active ? '1.6s' : '4.5s' }}
      />

      {/* Spinning conic ring */}
      <div
        className={`${active ? 'animate-spin-fast' : 'animate-spin-slow'} absolute inset-0 rounded-full`}
        style={{
          background: 'conic-gradient(from 0deg, #7C3AED, #EC4899, #06B6D4, #7C3AED)',
          filter: 'blur(2px)',
          opacity: 0.9,
        }}
      />

      {/* Core sphere */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '5%',
          background:
            'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.95), rgba(196,181,253,0.9) 14%, #7C3AED 42%, #1E1B4B 82%)',
          boxShadow:
            'inset -22px -32px 60px rgba(6,182,212,0.5), inset 22px 22px 50px rgba(236,72,153,0.4), 0 0 60px rgba(124,58,237,0.5)',
        }}
      />

      {/* Glass highlight */}
      <div
        className="absolute rounded-full"
        style={{
          left: '18%',
          top: '12%',
          width: '38%',
          height: '24%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.65), transparent)',
          filter: 'blur(6px)',
          transform: 'rotate(-24deg)',
        }}
      />

      {/* Orbiting rings with little satellites */}
      <div className="animate-spin-medium absolute rounded-full border border-white/25" style={{ inset: '-10%' }}>
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow-[0_0_14px_3px_rgba(6,182,212,0.9)]" />
      </div>
      <div
        className="animate-spin-slow absolute rounded-full border border-dashed border-white/15"
        style={{ inset: '-22%', animationDirection: 'reverse' }}
      >
        <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_3px_rgba(236,72,153,0.9)]" />
      </div>
    </motion.div>
  );
}

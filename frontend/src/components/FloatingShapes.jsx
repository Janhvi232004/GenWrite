import { motion } from 'framer-motion';

/** Decorative shapes that gently float in the background. */
const SHAPES = [
  { type: 'ring', className: 'left-[6%] top-[22%] h-20 w-20 border-primary/40', y: 26, rotate: 40, duration: 9 },
  { type: 'square', className: 'right-[9%] top-[18%] h-14 w-14 border-secondary/45', y: -30, rotate: 90, duration: 11 },
  { type: 'ring', className: 'right-[16%] top-[58%] hidden h-24 w-24 border-accent/35 sm:block', y: 34, rotate: -50, duration: 13 },
  { type: 'square', className: 'left-[12%] top-[68%] h-10 w-10 border-accent/40', y: -24, rotate: -80, duration: 10 },
  { type: 'dot', className: 'left-[42%] top-[12%] h-3 w-3 bg-secondary/70', y: 22, rotate: 0, duration: 7 },
  { type: 'dot', className: 'right-[34%] top-[80%] h-4 w-4 bg-primary/70', y: -26, rotate: 0, duration: 8 },
  { type: 'plus', className: 'left-[28%] top-[84%] hidden sm:block', y: 20, rotate: 180, duration: 12 },
  { type: 'plus', className: 'right-[5%] top-[40%]', y: -22, rotate: -180, duration: 14 },
];

function Plus() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="text-secondary/60">
      <path d="M13 3v20M3 13h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function FloatingShapes() {
  return (
    <>
      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className={`absolute ${s.className} ${
            s.type === 'ring' ? 'rounded-full border-2' : s.type === 'square' ? 'rounded-xl border-2' : s.type === 'dot' ? 'rounded-full blur-[1px]' : ''
          }`}
          animate={{ y: [0, s.y, 0], rotate: [0, s.rotate, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: 'easeInOut' }}
        >
          {s.type === 'plus' && <Plus />}
        </motion.div>
      ))}
    </>
  );
}

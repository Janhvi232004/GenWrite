import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import AIOrb from '@/components/AIOrb';
import GlassCard from '@/components/GlassCard';

const STEPS = ['Analyzing topic...', 'Creating content...', 'Finalizing output...'];
const SKELETON_WIDTHS = ['92%', '100%', '84%', '96%', '70%', '88%', '55%'];

/**
 * Premium "AI is thinking" experience:
 * orb + spinner rings, rotating status text, typing dots,
 * a progress bar and shimmering skeleton lines.
 * The progress eases toward 92% and waits there until the response arrives.
 */
export default function LoadingState() {
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + Math.max(0.25, (92 - p) * 0.045)));
    }, 120);
    return () => window.clearInterval(timer);
  }, []);

  const stepIndex = progress < 28 ? 0 : progress < 68 ? 1 : 2;

  return (
    <GlassCard neon className="p-6 sm:p-8" aria-busy="true" aria-live="polite">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center">
          <AIOrb size={72} active />
        </div>

        <div className="w-full min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary">AI is thinking</p>

          <div className="mt-1 flex h-9 items-center justify-center gap-3 sm:justify-start">
            <AnimatePresence mode="wait">
              <motion.h3
                key={stepIndex}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold sm:text-2xl"
              >
                {STEPS[stepIndex]}
              </motion.h3>
            </AnimatePresence>

            {/* Typing indicator */}
            <span className="flex items-center gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="animate-bounce-dot h-1.5 w-1.5 rounded-full bg-gradient-to-br from-accent to-secondary"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-fg/10">
              <motion.div
                className="relative h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              >
                <span className="absolute inset-y-0 right-0 w-10 rounded-full bg-white/60 blur-md" />
              </motion.div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-fg/50">
              <span>Nemotron is writing for you</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
        {STEPS.map((label, i) => {
          const done = i < stepIndex;
          const current = i === stepIndex;
          return (
            <span
              key={label}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all duration-300 ${
                current
                  ? 'border-primary/60 bg-primary/15 text-fg'
                  : done
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                    : 'border-fg/10 text-fg/40'
              }`}
            >
              {done ? <Check className="h-3 w-3" /> : <span className={`h-1.5 w-1.5 rounded-full ${current ? 'animate-pulse bg-accent' : 'bg-fg/30'}`} />}
              {label.replace('...', '')}
            </span>
          );
        })}
      </div>

      {/* Skeleton loader */}
      <div className="mt-7 space-y-3" aria-hidden="true">
        <div className="skeleton h-6 w-2/5" />
        {SKELETON_WIDTHS.map((width, i) => (
          <div key={i} className="skeleton h-3.5" style={{ width, animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
    </GlassCard>
  );
}

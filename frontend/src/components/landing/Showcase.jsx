import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import MarkdownText from '@/components/MarkdownText';
import Reveal from '@/components/Reveal';
import { CONTENT_TYPES } from '@/lib/constants';
import { cn, countChars, countWords } from '@/lib/utils';

/** Hand-written sample outputs (static demo - no API call on the landing page). */
const SAMPLES = {
  Blog: `# 5 Habits That Make Remote Teams Unstoppable

Remote work isn't about working from home. It's about working **on purpose**.

## 1. Write things down
Clear written updates replace endless meetings and keep everyone aligned across time zones.

## 2. Protect deep-work hours
Block focus time on the calendar and treat it like a meeting with your most important client.

## 3. Celebrate small wins
A quick shout-out in chat keeps morale high when you can't share a coffee break.`,
  'LinkedIn Post': `Remote teams don't win on hours. They win on **clarity**.

After two years of building a distributed startup, here's what actually moved the needle:

- Write decisions down, always
- Default to async, meet only when needed
- Celebrate progress loudly

The best part? Our team ships faster, and nobody misses a commute.

What's the one habit that changed how your team works?

#RemoteWork #Startups #Leadership`,
  'Instagram Caption': `Monday motivation, served fresh. ☕✨

Big dreams start with small, consistent steps. Today's step? Showing up, even when it's hard.

Tag someone who needs this reminder 💜

#MondayMotivation #GrowthMindset #DailyHabits #StartupLife #KeepGoing`,
  'Product Description': `# AuraBottle: Hydration, Reimagined

Meet the stainless-steel bottle that keeps drinks ice-cold for 24 hours and piping hot for 12.

- **Eco-first:** made from 100% recycled steel
- **Leak-proof:** lock-tight lid, safe for any bag
- **Effortless:** fits every cup holder
- **Built to last:** lifetime warranty

Stay refreshed. Save the planet. Order yours today.`,
  Email: `**Subject:** Your free workshop seat is waiting

Hi Priya,

Thanks for signing up! We've saved your spot at **Content Writing with AI** this Friday at 4 PM.

Here's what you'll learn:
- Turn one idea into five content formats
- Match your brand's tone every time

Reserve your seat with one click and we'll send you the joining link.

Warm regards,
The GenWrite Team`,
};

/** Interactive preview of what the generator produces for each content type. */
export default function Showcase() {
  const [active, setActive] = useState(CONTENT_TYPES[0].value);
  const sample = SAMPLES[active];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary dark:text-violet-300">Live preview</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            See what <span className="gradient-text">GenWrite</span> creates
          </h2>
          <p className="mt-4 text-fg/60">Pick a format to preview an example of the output.</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          {/* Tabs */}
          <div className="mb-5 flex flex-wrap justify-center gap-2">
            {CONTENT_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = type.value === active;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setActive(type.value)}
                  className={cn(
                    'relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    isActive ? 'border-transparent text-white' : 'border-fg/10 bg-fg/5 text-fg/65 hover:text-fg'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="showcase-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-secondary shadow-glow"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Faux app window */}
          <GlassCard className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fg/10 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-rose-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-3 text-xs text-fg/45">genwrite.ai / {active.toLowerCase().replace(/\s+/g, '-')}</span>
            </div>
            <div className="min-h-[22rem] px-5 py-6 sm:px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                  transition={{ duration: 0.3 }}
                >
                  <MarkdownText text={sample} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 border-t border-fg/10 bg-fg/[0.03] px-5 py-3 text-xs tabular-nums text-fg/55">
              <span>{countWords(sample)} words</span>
              <span>·</span>
              <span>{countChars(sample)} characters</span>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

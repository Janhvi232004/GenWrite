import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, ChevronDown, Compass, Sparkles, TrendingUp } from 'lucide-react';
import AIOrb from '@/components/AIOrb';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HEADLINE = ['Create', 'Amazing', 'Content', 'With'];
const EASE = [0.22, 1, 0.36, 1];

/** Full-screen animated hero with the AI orb and floating glass cards. */
export default function Hero() {
  const scrollToFeatures = () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative flex min-h-screen items-center pb-20 pt-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ---------- Left: text ---------- */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="glass neon-border inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium sm:text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Powered by NVIDIA Nemotron
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </motion.div>

          <h1 className="mt-7 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:justify-start lg:text-7xl">
            {HEADLINE.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 36, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: EASE }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.15 + HEADLINE.length * 0.12, duration: 0.9, ease: EASE }}
              className="gradient-text inline-block"
            >
              AI
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: EASE }}
            className="mx-auto mt-6 max-w-xl text-base leading-7 text-fg/65 sm:text-lg lg:mx-0"
          >
            Generate blogs, social posts, emails and marketing content in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7, ease: EASE }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link to="/app" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
              <Sparkles className="h-5 w-5" /> Start Generating <ArrowRight className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={scrollToFeatures}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
            >
              <Compass className="h-5 w-5" /> Explore Features
            </button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mx-auto mt-12 flex max-w-md items-center justify-center gap-8 lg:mx-0 lg:justify-start"
          >
            {[
              ['5', 'Content formats'],
              ['5', 'Writing tones'],
              ['1', 'Click to generate'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="gradient-text font-display text-3xl font-extrabold">{value}</dt>
                <dd className="mt-0.5 text-xs text-fg/50">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------- Right: orb + floating glass cards ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.1, ease: EASE }}
          className="relative mx-auto flex h-[340px] w-[300px] items-center justify-center sm:h-[470px] sm:w-[440px]"
        >
          <AIOrb size={230} className="sm:scale-[1.25]" />

          {/* LinkedIn-style preview card */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="glass neon-border absolute -left-2 top-2 w-52 rounded-2xl p-3.5 sm:-left-8 sm:top-6 sm:w-60 sm:p-4"
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-500">
                <Briefcase className="h-3.5 w-3.5" />
              </span>
              LinkedIn Post
              <span className="ml-auto rounded-full bg-fg/10 px-2 py-0.5 text-[10px] font-medium text-fg/60">Professional</span>
            </div>
            <p className="mt-2.5 text-xs leading-5 text-fg/70">
              Remote teams win on clarity, not hours. Here are 3 habits that changed how we ship...
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-primary/60 to-transparent" />
              <div className="h-1.5 w-4/5 rounded-full bg-gradient-to-r from-accent/50 to-transparent" />
            </div>
          </motion.div>

          {/* Stats card */}
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="glass neon-border absolute -right-2 bottom-4 w-48 rounded-2xl p-3.5 sm:-right-6 sm:bottom-10 sm:w-52 sm:p-4"
          >
            <div className="flex items-center justify-between text-xs text-fg/60">
              Words generated
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <p className="mt-1 font-display text-2xl font-extrabold">12,480</p>
            <div className="mt-3 flex h-8 items-end gap-1">
              {[35, 55, 40, 70, 50, 85, 65, 95].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1.2 + i * 0.07, duration: 0.6 }}
                  className="flex-1 rounded-sm bg-gradient-to-t from-primary to-secondary"
                />
              ))}
            </div>
          </motion.div>

          {/* Status chip */}
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="glass absolute -right-1 top-6 hidden items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium sm:flex"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary shadow-[0_0_10px_2px_rgba(6,182,212,0.8)]" />
            Nemotron online
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.button
        type="button"
        onClick={scrollToFeatures}
        aria-label="Scroll to features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.6 }, y: { duration: 2, repeat: Infinity } }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-fg/40 transition-colors hover:text-fg sm:block"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.button>
    </section>
  );
}

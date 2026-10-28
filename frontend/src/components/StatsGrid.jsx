import { motion } from 'framer-motion';
import { Activity, Bookmark, FileText, Zap } from 'lucide-react';
import AnimatedNumber from '@/components/AnimatedNumber';
import GlassCard from '@/components/GlassCard';
import { timeAgo } from '@/lib/utils';

/**
 * Dashboard stat cards with animated counters.
 * `stats` comes from the useStats() hook.
 */
export default function StatsGrid({ stats }) {
  const cards = [
    {
      label: 'Total Generations',
      value: stats.total,
      hint: 'All-time AI generations',
      icon: Zap,
      gradient: 'from-primary to-violet-400',
      glow: 'shadow-glow',
    },
    {
      label: 'Words Generated',
      value: stats.words,
      hint: 'Across your saved content',
      icon: FileText,
      gradient: 'from-secondary to-sky-400',
      glow: 'shadow-glow-cyan',
    },
    {
      label: 'Saved Content',
      value: stats.saved,
      hint: 'Stored in your library',
      icon: Bookmark,
      gradient: 'from-accent to-rose-400',
      glow: 'shadow-glow-pink',
    },
    {
      label: 'Recent Activity',
      value: stats.recent,
      hint: stats.latest ? `Latest: ${stats.latest.topic}` : 'Nothing generated yet',
      sub: stats.latest ? timeAgo(stats.latest.created_at) : 'Last 24 hours',
      icon: Activity,
      gradient: 'from-emerald-400 to-secondary',
      glow: 'shadow-glow-cyan',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard lift className="group h-full p-5">
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} ${card.glow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </span>
                {card.sub && (
                  <span className="rounded-full border border-fg/10 bg-fg/5 px-2.5 py-1 text-[11px] text-fg/55">
                    {card.sub}
                  </span>
                )}
              </div>
              <p className="mt-5 font-display text-4xl font-extrabold tracking-tight">
                <AnimatedNumber value={card.value} />
              </p>
              <p className="mt-1 text-sm font-medium">{card.label}</p>
              <p className="mt-0.5 truncate text-xs text-fg/45" title={card.hint}>
                {card.hint}
              </p>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}

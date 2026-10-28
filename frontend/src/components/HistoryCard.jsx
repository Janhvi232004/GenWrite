import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Eye, Sparkles, Trash2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { TONE_BY_VALUE, TYPE_BY_VALUE } from '@/lib/constants';
import { cn, countWords, formatDate, stripMarkdown } from '@/lib/utils';

/** One saved item in the History grid. Delete needs a second click to confirm. */
export default function HistoryCard({ item, onView, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const typeMeta = TYPE_BY_VALUE[item.content_type];
  const toneMeta = TONE_BY_VALUE[item.tone];
  const TypeIcon = typeMeta?.icon || Sparkles;

  // Cancel the confirmation if the user does nothing for 3 seconds
  useEffect(() => {
    if (!confirming) return undefined;
    const timer = window.setTimeout(() => setConfirming(false), 3000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setBusy(true);
    await onDelete(item);
    setBusy(false);
    setConfirming(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard lift className="flex h-full flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', typeMeta?.badge)}>
            <TypeIcon className="h-3 w-3" />
            {item.content_type}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fg/10 bg-fg/5 px-2.5 py-1 text-xs font-medium text-fg/75">
            {toneMeta?.icon && <toneMeta.icon className="h-3 w-3" />}
            {item.tone}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-snug">{item.topic}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-fg/55">{stripMarkdown(item.generated_content)}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-fg/45">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(item.created_at)}
          </span>
          <span>·</span>
          <span className="tabular-nums">{countWords(item.generated_content)} words</span>
        </div>

        <div className="mt-4 flex gap-2 border-t border-fg/10 pt-4">
          <Button variant="subtle" size="sm" className="flex-1" onClick={() => onView(item)}>
            <Eye className="h-4 w-4" /> View
          </Button>
          <Button
            variant={confirming ? 'danger' : 'ghost'}
            size="sm"
            disabled={busy}
            onClick={handleDelete}
            aria-label={confirming ? 'Confirm delete' : 'Delete'}
            className={confirming ? '' : 'hover:text-rose-500'}
          >
            <Trash2 className="h-4 w-4" />
            {confirming ? 'Confirm?' : 'Delete'}
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Search, Sparkles, X } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import GlassCard from '@/components/GlassCard';
import HistoryCard from '@/components/HistoryCard';
import ViewModal from '@/components/ViewModal';
import { Button, buttonVariants } from '@/components/ui/button';
import useHistory from '@/hooks/useHistory';
import useToast from '@/hooks/useToast';
import { CONTENT_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

/** History page: search, filter, view and delete saved content. */
export default function History() {
  const toast = useToast();
  const { items, loading, error, refresh, remove } = useHistory();

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [viewing, setViewing] = useState(null);

  // Filter by search text (topic, type, tone, content) and by content type
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (typeFilter !== 'All' && item.content_type !== typeFilter) return false;
      if (!q) return true;
      return [item.topic, item.content_type, item.tone, item.generated_content].some((field) =>
        field.toLowerCase().includes(q)
      );
    });
  }, [items, query, typeFilter]);

  const handleDelete = async (item) => {
    try {
      await remove(item.id);
      toast.success('Deleted from history');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const hasFilters = query.trim() !== '' || typeFilter !== 'All';

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">History</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your <span className="gradient-text">content library</span>
        </h1>
        <p className="mt-2 text-fg/60">Everything you generate is saved here automatically.</p>
      </motion.div>

      {/* Search + filters */}
      <div className="relative z-10 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, type, tone or content..."
            aria-label="Search history"
            className="field h-14 pl-12 pr-12 text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-fg/50 transition-colors hover:bg-fg/10 hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', ...CONTENT_TYPES.map((t) => t.value)].map((type) => {
            const isActive = typeFilter === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={cn(
                  'relative rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  isActive ? 'border-transparent text-white' : 'border-fg/10 bg-fg/5 text-fg/65 hover:text-fg'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="history-filter"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent shadow-glow"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{type}</span>
              </button>
            );
          })}
        </div>

        {!loading && !error && items.length > 0 && (
          <p className="text-sm text-fg/50">
            Showing <span className="font-semibold text-fg">{filtered.length}</span> of {items.length} item
            {items.length === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <GlassCard key={i} neon={false} className="space-y-4 p-5">
                <div className="skeleton h-6 w-32" />
                <div className="skeleton h-6 w-4/5" />
                <div className="space-y-2">
                  <div className="skeleton h-3.5 w-full" />
                  <div className="skeleton h-3.5 w-11/12" />
                  <div className="skeleton h-3.5 w-2/3" />
                </div>
                <div className="skeleton h-9 w-full" />
              </GlassCard>
            ))}
          </div>
        ) : error ? (
          <GlassCard neon={false} className="border-rose-500/30 p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
              <AlertTriangle className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-xl font-bold">Could not load your history</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-fg/60">{error}</p>
            <Button className="mt-6" onClick={refresh}>
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          </GlassCard>
        ) : items.length === 0 ? (
          <GlassCard neon={false} className="border-dashed">
            <EmptyState
              title="No content yet"
              description="Your generated content will be saved here automatically. Create your first piece to get started."
              action={
                <Link to="/app" className={buttonVariants({ size: 'md' })}>
                  <Sparkles className="h-4 w-4" /> Generate content
                </Link>
              }
            />
          </GlassCard>
        ) : filtered.length === 0 ? (
          <GlassCard neon={false} className="border-dashed">
            <EmptyState
              variant="search"
              title="No matches found"
              description="We couldn't find anything for that search. Try different keywords or clear the filters."
              action={
                hasFilters && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery('');
                      setTypeFilter('All');
                    }}
                  >
                    Clear filters
                  </Button>
                )
              }
            />
          </GlassCard>
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <HistoryCard key={item.id} item={item} onView={setViewing} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <ViewModal item={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

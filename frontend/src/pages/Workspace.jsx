import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, History as HistoryIcon, RefreshCw, Wand2 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import GeneratorCard from '@/components/GeneratorCard';
import GlassCard from '@/components/GlassCard';
import LoadingState from '@/components/LoadingState';
import OutputCard from '@/components/OutputCard';
import StatsGrid from '@/components/StatsGrid';
import { Button, buttonVariants } from '@/components/ui/button';
import useHistory from '@/hooks/useHistory';
import useStats from '@/hooks/useStats';
import useToast from '@/hooks/useToast';
import { DEFAULT_FORM } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';

/** Workspace = dashboard stats + AI generator + live output panel. */
export default function Workspace() {
  const location = useLocation();
  const toast = useToast();
  const outputRef = useRef(null);

  // The form can be pre-filled from the History page ("Use again")
  const [form, setForm] = useState(() => location.state?.prefill ?? DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const { items, loading: historyLoading, add } = useHistory();
  const { stats, bumpGeneration } = useStats(items, historyLoading);

  /** Call the backend, then show + store the result. */
  const generate = async (values) => {
    setLoading(true);
    setError('');

    // On small screens the output sits below the form, so scroll to it
    if (window.innerWidth < 1024) {
      window.setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

    try {
      const record = await api.generate(values);
      setResult(record);
      add(record);
      bumpGeneration();
      toast.success('Content generated and saved to history');
    } catch (err) {
      setResult(null);
      setError(err.message);
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  /** Regenerate = same topic, type and tone, new output. */
  const regenerate = () => {
    if (!result) return;
    const values = { topic: result.topic, contentType: result.content_type, tone: result.tone };
    setForm(values);
    generate(values);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Workspace</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Craft something <span className="gradient-text">brilliant</span>
          </h1>
          <p className="mt-2 text-fg/60">Your dashboard and AI studio, all in one place.</p>
        </div>
        <Link to="/history" className={cn(buttonVariants({ variant: 'outline', size: 'md' }))}>
          <HistoryIcon className="h-4 w-4" /> View history
        </Link>
      </motion.div>

      {/* Dashboard */}
      <StatsGrid stats={stats} />

      {/* Generator + output */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="lg:sticky lg:top-24">
          <GeneratorCard values={form} onChange={setForm} onSubmit={generate} loading={loading} />
        </div>

        <div ref={outputRef} className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <LoadingState />
              </motion.div>
            ) : error ? (
              <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <GlassCard neon={false} className="border-rose-500/30 p-8 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
                    <AlertTriangle className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">Something went wrong</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-fg/60">{error}</p>
                  <Button className="mt-6" onClick={() => generate(form)}>
                    <RefreshCw className="h-4 w-4" /> Try again
                  </Button>
                </GlassCard>
              </motion.div>
            ) : result ? (
              <OutputCard key={result.id} result={result} onRegenerate={regenerate} />
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard neon={false} className="border-dashed">
                  <EmptyState
                    title="Your content will appear here"
                    description="Enter a topic, choose a content type and tone, then hit Generate. Your AI-written content shows up live in this panel."
                    action={
                      <span className="inline-flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-4 py-2 text-xs text-fg/60">
                        <Wand2 className="h-3.5 w-3.5 text-accent" /> Tip: try one of the quick ideas
                      </span>
                    }
                  />
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

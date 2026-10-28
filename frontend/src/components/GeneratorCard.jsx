import { motion } from 'framer-motion';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import CustomSelect from '@/components/CustomSelect';
import { Button } from '@/components/ui/button';
import { CONTENT_TYPES, MAX_TOPIC_LENGTH, SAMPLE_TOPICS, TONES } from '@/lib/constants';

/**
 * The input panel: topic + content type + tone + Generate button.
 * It is a "controlled" component - the parent (Workspace) owns the values.
 */
export default function GeneratorCard({ values, onChange, onSubmit, loading }) {
  const topicTooShort = values.topic.trim().length < 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topicTooShort && !loading) onSubmit(values);
  };

  // Ctrl/Cmd + Enter inside the textarea submits the form
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit(e);
  };

  return (
    // relative + z-20 keeps open dropdowns above the output panel on mobile
    <GlassCard className="relative z-20 p-5 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow">
          <Wand2 className="h-5 w-5 text-white" />
        </span>
        <div>
          <h2 className="text-lg font-bold leading-tight">AI Content Studio</h2>
          <p className="text-sm text-fg/55">Describe it. We&apos;ll write it.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Topic */}
        <div>
          <label htmlFor="topic" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fg/55">
            Topic
          </label>
          <textarea
            id="topic"
            rows={4}
            value={values.topic}
            maxLength={MAX_TOPIC_LENGTH}
            disabled={loading}
            onChange={(e) => onChange({ ...values, topic: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Benefits of remote work for startups"
            className="field resize-none text-sm leading-6 disabled:opacity-60"
          />
          <div className="mt-1.5 flex items-center justify-between text-xs text-fg/40">
            <span>Press Ctrl + Enter to generate</span>
            <span>
              {values.topic.length}/{MAX_TOPIC_LENGTH}
            </span>
          </div>

          {/* Quick ideas */}
          <div className="mt-3 flex flex-wrap gap-2">
            {SAMPLE_TOPICS.map((idea) => (
              <button
                key={idea}
                type="button"
                disabled={loading}
                onClick={() => onChange({ ...values, topic: idea })}
                className="rounded-full border border-fg/10 bg-fg/5 px-3 py-1.5 text-xs text-fg/65 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 hover:text-fg disabled:opacity-50"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid gap-4 sm:grid-cols-2">
          <CustomSelect
            label="Content Type"
            value={values.contentType}
            options={CONTENT_TYPES}
            disabled={loading}
            onChange={(contentType) => onChange({ ...values, contentType })}
          />
          <CustomSelect
            label="Tone"
            value={values.tone}
            options={TONES}
            disabled={loading}
            onChange={(tone) => onChange({ ...values, tone })}
          />
        </div>

        {/* Generate button */}
        <motion.div whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" size="lg" disabled={topicTooShort || loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Content
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </GlassCard>
  );
}

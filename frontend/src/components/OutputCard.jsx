import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Copy, Download, FastForward, RefreshCw, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import MarkdownText from '@/components/MarkdownText';
import { Button } from '@/components/ui/button';
import useTypewriter from '@/hooks/useTypewriter';
import useToast from '@/hooks/useToast';
import { TONE_BY_VALUE, TYPE_BY_VALUE } from '@/lib/constants';
import { cn, copyText, countChars, countWords, downloadTxt, slugify, timeAgo } from '@/lib/utils';

/**
 * The AI response card: typewriter text + word/character counts +
 * Copy / Download TXT / Regenerate actions.
 * Render it with key={result.id} so the typewriter restarts for new content.
 */
export default function OutputCard({ result, onRegenerate }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const text = result.generated_content;
  const { shown, done, skip } = useTypewriter(text);

  const typeMeta = TYPE_BY_VALUE[result.content_type];
  const toneMeta = TONE_BY_VALUE[result.tone];
  const TypeIcon = typeMeta?.icon || Sparkles;

  const handleCopy = async () => {
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      toast.success('Copied to clipboard');
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Could not copy - please select the text manually');
    }
  };

  const handleDownload = () => {
    downloadTxt(`genwrite-${slugify(result.content_type)}-${slugify(result.topic)}.txt`, text);
    toast.success('Download started');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 border-b border-fg/10 px-5 py-4 sm:px-7">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="mr-1 text-sm font-semibold">AI Response</span>

          <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', typeMeta?.badge)}>
            <TypeIcon className="h-3 w-3" />
            {result.content_type}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fg/10 bg-fg/5 px-2.5 py-1 text-xs font-medium text-fg/75">
            {toneMeta?.icon && <toneMeta.icon className="h-3 w-3" />}
            {result.tone}
          </span>

          <span className="ml-auto flex items-center gap-1 text-xs text-fg/45">
            <Clock className="h-3 w-3" />
            {timeAgo(result.created_at)}
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-6 sm:px-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-fg/45">Topic · {result.topic}</p>

          <div className="relative min-h-[8rem]">
            <MarkdownText text={shown} />
            {!done && <span className="caret" aria-hidden="true" />}
          </div>

          {!done && (
            <button
              type="button"
              onClick={skip}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-fg/50 transition-colors hover:text-fg"
            >
              <FastForward className="h-3.5 w-3.5" /> Skip animation
            </button>
          )}
        </div>

        {/* Footer: counts + actions */}
        <div className="flex flex-col gap-4 border-t border-fg/10 bg-fg/[0.03] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-lg border border-fg/10 bg-fg/5 px-2.5 py-1.5 font-medium tabular-nums text-fg/75">
              {countWords(text).toLocaleString()} words
            </span>
            <span className="rounded-lg border border-fg/10 bg-fg/5 px-2.5 py-1.5 font-medium tabular-nums text-fg/75">
              {countChars(text).toLocaleString()} characters
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="subtle" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="subtle" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" /> Download TXT
            </Button>
            <Button size="sm" onClick={onRegenerate}>
              <RefreshCw className="h-4 w-4" /> Regenerate
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

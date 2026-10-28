import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Download, RotateCcw, Sparkles, X } from 'lucide-react';
import MarkdownText from '@/components/MarkdownText';
import { Button } from '@/components/ui/button';
import useToast from '@/hooks/useToast';
import { TONE_BY_VALUE, TYPE_BY_VALUE } from '@/lib/constants';
import { cn, copyText, countChars, countWords, downloadTxt, formatDate, slugify } from '@/lib/utils';

/** Full-screen dialog to read a saved item. Pass item={null} to close it. */
export default function ViewModal({ item, onClose }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  // Close on Escape + stop the page behind from scrolling
  useEffect(() => {
    if (!item) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  const typeMeta = item && TYPE_BY_VALUE[item.content_type];
  const toneMeta = item && TONE_BY_VALUE[item.tone];
  const TypeIcon = typeMeta?.icon || Sparkles;

  const handleCopy = async () => {
    const ok = await copyText(item.generated_content);
    if (ok) {
      setCopied(true);
      toast.success('Copied to clipboard');
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Could not copy');
    }
  };

  const handleDownload = () => {
    downloadTxt(`genwrite-${slugify(item.content_type)}-${slugify(item.topic)}.txt`, item.generated_content);
    toast.success('Download started');
  };

  const handleUseAgain = () => {
    navigate('/app', {
      state: { prefill: { topic: item.topic, contentType: item.content_type, tone: item.tone } },
    });
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Saved content: ${item.topic}`}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong neon-border flex max-h-[92vh] w-full max-w-3xl flex-col rounded-t-3xl sm:max-h-[86vh] sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-fg/10 px-5 py-4 sm:px-7">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', typeMeta?.badge)}>
                    <TypeIcon className="h-3 w-3" />
                    {item.content_type}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-fg/10 bg-fg/5 px-2.5 py-1 text-xs font-medium text-fg/75">
                    {toneMeta?.icon && <toneMeta.icon className="h-3 w-3" />}
                    {item.tone}
                  </span>
                  <span className="text-xs text-fg/45">{formatDate(item.created_at)}</span>
                </div>
                <h2 className="mt-2.5 text-xl font-bold leading-snug">{item.topic}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-fg/10 bg-fg/5 transition-colors hover:bg-fg/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              <MarkdownText text={item.generated_content} />
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-fg/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex items-center gap-2 text-xs tabular-nums text-fg/60">
                <span className="rounded-lg border border-fg/10 bg-fg/5 px-2.5 py-1.5">
                  {countWords(item.generated_content).toLocaleString()} words
                </span>
                <span className="rounded-lg border border-fg/10 bg-fg/5 px-2.5 py-1.5">
                  {countChars(item.generated_content).toLocaleString()} characters
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="subtle" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="subtle" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4" /> TXT
                </Button>
                <Button size="sm" onClick={handleUseAgain}>
                  <RotateCcw className="h-4 w-4" /> Use again
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

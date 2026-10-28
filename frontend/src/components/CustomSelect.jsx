import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Fully custom dropdown (no native <select>) with glow, animation and
 * keyboard support: Arrow keys, Home/End, Enter/Space, Escape.
 *
 * options: [{ value, label, icon?, desc? }]
 */
export default function CustomSelect({ label, value, onChange, options, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const listId = useId();

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];
  const SelectedIcon = selected?.icon;

  // Close when clicking outside
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const openMenu = () => {
    if (disabled) return;
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (index) => {
    onChange(options[index].value);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (disabled) return;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => (i + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => (i - 1 + options.length) % options.length);
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fg/55">{label}</span>

      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${selected?.label}`}
        data-open={open}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className="field flex items-center gap-3 text-left disabled:cursor-not-allowed disabled:opacity-60"
      >
        {SelectedIcon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 text-primary dark:text-white">
            <SelectedIcon className="h-4 w-4" />
          </span>
        )}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{selected?.label}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-fg/50 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="glass-strong absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-72 origin-top overflow-y-auto rounded-2xl p-1.5 shadow-glow"
          >
            {options.map((option, index) => {
              const Icon = option.icon;
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(index)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                    active === index ? 'bg-primary/15' : 'bg-transparent'
                  )}
                >
                  {Icon && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fg/5 text-fg/80">
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{option.label}</span>
                    {option.desc && <span className="block truncate text-xs text-fg/50">{option.desc}</span>}
                  </span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-secondary" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

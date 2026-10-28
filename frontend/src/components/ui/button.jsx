import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** ShadCN-style button variants. Also exported so <Link> can reuse the look. */
export const buttonVariants = cva(
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'btn-glow text-white',
        outline: 'glass text-fg hover:-translate-y-0.5 hover:border-primary/50 hover:bg-fg/10',
        ghost: 'text-fg/70 hover:bg-fg/10 hover:text-fg',
        subtle: 'border border-fg/10 bg-fg/5 text-fg/80 hover:bg-fg/10 hover:text-fg',
        danger:
          'border border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-300',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

const Button = forwardRef(function Button({ className, variant, size, ...props }, ref) {
  return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});

export { Button };

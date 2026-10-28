import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

/** GenWrite AI logo mark + wordmark. */
export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`} aria-label="GenWrite AI home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-secondary shadow-glow transition-transform duration-500 group-hover:rotate-12">
        <Sparkles className="h-[18px] w-[18px] text-white" strokeWidth={2.4} />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        GenWrite <span className="gradient-text">AI</span>
      </span>
    </Link>
  );
}

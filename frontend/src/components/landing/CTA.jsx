import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Reveal from '@/components/Reveal';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <Reveal>
          <GlassCard className="relative p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/50 via-accent/40 to-secondary/50 blur-3xl" />
            <div className="relative">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary shadow-glow">
                <Sparkles className="h-7 w-7 text-white" />
              </span>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Ready to write your next <span className="gradient-text">masterpiece?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-fg/60">
                Generate exceptional content with AI in seconds. No sign-up, no setup, just start writing.
              </p>
              <Link to="/app" className={cn(buttonVariants({ size: 'lg' }), 'mt-8')}>
                Start Generating <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

import { Pencil, SlidersHorizontal, Sparkles } from 'lucide-react';
import Reveal from '@/components/Reveal';

const STEPS = [
  {
    icon: Pencil,
    title: 'Describe your topic',
    text: 'Type what you want to write about. A single sentence is enough.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Pick format & tone',
    text: 'Choose a content type and a tone that fits your audience.',
  },
  {
    icon: Sparkles,
    title: 'Get your content',
    text: 'Watch it appear live, then copy, download or regenerate.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">How it works</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            From idea to content in <span className="gradient-text">3 steps</span>
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* connecting line (desktop) */}
          <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-primary/60 via-accent/60 to-secondary/60 md:block" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={i * 0.15} className="relative text-center">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary shadow-glow">
                  <Icon className="h-7 w-7 text-white" />
                  <span className="glass-strong absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-fg/60">{step.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

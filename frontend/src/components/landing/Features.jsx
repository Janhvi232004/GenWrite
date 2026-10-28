import { History, Layers, MousePointerClick, Moon, Palette, Zap } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Reveal from '@/components/Reveal';

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning-fast generation',
    text: 'Enter a topic and get polished, ready-to-publish content in seconds, powered by NVIDIA Nemotron.',
    gradient: 'from-primary to-violet-400',
  },
  {
    icon: Layers,
    title: '5 content formats',
    text: 'Blogs, LinkedIn posts, Instagram captions, product descriptions and emails, each with the right structure.',
    gradient: 'from-secondary to-sky-400',
  },
  {
    icon: Palette,
    title: '5 expressive tones',
    text: 'Professional, casual, friendly, creative or marketing. Match your brand voice with one click.',
    gradient: 'from-accent to-rose-400',
  },
  {
    icon: History,
    title: 'Searchable history',
    text: 'Every generation is saved automatically. Search, reopen, reuse or delete whenever you like.',
    gradient: 'from-emerald-400 to-secondary',
  },
  {
    icon: MousePointerClick,
    title: 'Copy, download, regenerate',
    text: 'Copy to clipboard, export as TXT, or regenerate for a fresh take. Live word and character counts included.',
    gradient: 'from-amber-400 to-accent',
  },
  {
    icon: Moon,
    title: 'Dark & light themes',
    text: 'A futuristic dark interface by default, with a smooth switch to a clean light theme.',
    gradient: 'from-primary to-secondary',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Features</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Everything you need to <span className="gradient-text">write faster</span>
          </h2>
          <p className="mt-4 text-fg/60">
            A focused AI workspace that turns a single idea into content you can publish right away.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={(i % 3) * 0.1}>
                <GlassCard lift className="group h-full p-6">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-glow transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-fg/60">{feature.text}</p>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

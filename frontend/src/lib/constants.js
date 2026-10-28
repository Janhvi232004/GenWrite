import {
  BookOpen,
  Briefcase,
  Camera,
  ShoppingBag,
  Mail,
  Coffee,
  Smile,
  Palette,
  Megaphone,
  Building2,
} from 'lucide-react';

/**
 * Content types. `value` MUST match the list in backend/ai_service.py.
 * `badge` holds full Tailwind class strings (so the JIT compiler can see them).
 */
export const CONTENT_TYPES = [
  {
    value: 'Blog',
    label: 'Blog',
    icon: BookOpen,
    desc: 'Long-form article with headings',
    badge: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
  },
  {
    value: 'LinkedIn Post',
    label: 'LinkedIn Post',
    icon: Briefcase,
    desc: 'Hook, insight and hashtags',
    badge: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
  },
  {
    value: 'Instagram Caption',
    label: 'Instagram Caption',
    icon: Camera,
    desc: 'Short, catchy and emoji-ready',
    badge: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30',
  },
  {
    value: 'Product Description',
    label: 'Product Description',
    icon: ShoppingBag,
    desc: 'Benefit-focused sales copy',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  {
    value: 'Email',
    label: 'Email',
    icon: Mail,
    desc: 'Subject line and clear call to action',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
];

/** Tone options. `value` MUST match the list in backend/ai_service.py. */
export const TONES = [
  { value: 'Professional', label: 'Professional', icon: Building2, desc: 'Polished and credible' },
  { value: 'Casual', label: 'Casual', icon: Coffee, desc: 'Relaxed and conversational' },
  { value: 'Friendly', label: 'Friendly', icon: Smile, desc: 'Warm and approachable' },
  { value: 'Creative', label: 'Creative', icon: Palette, desc: 'Imaginative and original' },
  { value: 'Marketing', label: 'Marketing', icon: Megaphone, desc: 'Persuasive and punchy' },
];

export const TYPE_BY_VALUE = Object.fromEntries(CONTENT_TYPES.map((t) => [t.value, t]));
export const TONE_BY_VALUE = Object.fromEntries(TONES.map((t) => [t.value, t]));

export const DEFAULT_FORM = {
  topic: '',
  contentType: 'Blog',
  tone: 'Professional',
};

/** One-click topic ideas shown under the topic box. */
export const SAMPLE_TOPICS = [
  'Benefits of remote work for startups',
  'Launch of an eco-friendly water bottle',
  '5 study habits that actually work',
  'Why every small business needs a website',
];

export const MAX_TOPIC_LENGTH = 500;

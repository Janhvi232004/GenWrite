import { CONTENT_TYPES, TONES } from '@/lib/constants';

const ITEMS = [...CONTENT_TYPES, ...TONES];

/** Endless scrolling strip of content types and tones. */
export default function Marquee() {
  // Duplicate the list so the loop looks seamless (animation moves by -50%)
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div
      className="marquee relative overflow-hidden py-4"
      style={{
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
      }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {loop.map((item, i) => {
          const Icon = item.icon;
          return (
            <span
              key={`${item.value}-${i}`}
              className="glass flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium"
            >
              <Icon className="h-4 w-4 text-secondary" />
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
